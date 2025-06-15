import { memo, useEffect, useCallback, useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  useProjectOperations,
} from '../../shared/hooks';
import {
  setFolderStructure,
  updateTreeItem,
  setExplorerExpanded,
  addTreeItem,
  collapseAllFolders,
} from '../../shared/rdx-slice';
import { FileTree } from '../file-tree';
import { IFolderStructure, TFolderTree } from '../../shared/types';
import {
  initializeGitIgnore,
  getGitIgnoreChecker,
} from '../../shared/gitignore-utils';
import { DefaultButton } from '../buttons';
import {
  ExplorerContainer,
  OpenFolderButton,
  ExplorerContent,
  EmptyState,
} from './styles';
import { RootFolderHeader } from './RootFolderHeader';
import { InputModal } from './InputModal';
import { markGitIgnoredFiles } from './utils';
import { ModalState } from './types';

export const ExplorerSection = memo(() => {
  const dispatch = useAppDispatch();
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const isRootExpanded = useAppSelector(
    state => state.main.sidebarState.explorerExpanded,
  );
  const lastClickedItem = useAppSelector(
    state => state.main.sidebarState.lastClickedItem,
  );
  const [isRootHovered, setIsRootHovered] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    value: '',
  });

  const { openFolderOnly } = useProjectOperations();

  const openFolder = useCallback(async () => {
    try {
      await openFolderOnly();
      dispatch(setExplorerExpanded(true));
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }, [openFolderOnly, dispatch]);

  useEffect(() => {
    const unsubscribeOpen = window.electron?.onMenuOpenFile?.(openFolder);
    return () => {
      unsubscribeOpen?.();
    };
  }, [openFolder]);

  const handleUpdateTreeItem = useCallback(
    (path: string, updates: Partial<TFolderTree>) => {
      if (updates.children) {
        const checker = getGitIgnoreChecker();
        if (checker) {
          updates.children = markGitIgnoredFiles(updates.children, checker);
        }
      }
      dispatch(updateTreeItem({ path, updates }));
    },
    [dispatch],
  );

  const handleNewFile = useCallback(() => {
    setModalState({ isOpen: true, type: 'file', value: '' });
  }, []);

  const handleNewFolder = useCallback(() => {
    setModalState({ isOpen: true, type: 'folder', value: '' });
  }, []);

  const handleModalConfirm = useCallback(() => {
    const name = modalState.value.trim();
    if (!name) return;

    let targetDirectory: string;
    if (!lastClickedItem) {
      targetDirectory = folderStructure.root;
    } else if (lastClickedItem.isDirectory) {
      targetDirectory = lastClickedItem.path;
    } else {
      targetDirectory = lastClickedItem.parentPath;
    }

    const itemPath =
      targetDirectory.endsWith('/') || targetDirectory.endsWith('\\')
        ? targetDirectory + name
        : targetDirectory + '/' + name;

    if (modalState.type === 'file') {
      window.electron
        ?.createFile?.(itemPath, '')
        .then(() => {
          const newItem: TFolderTree = {
            name,
            parentPath: targetDirectory,
            path: itemPath,
            isDirectory: false,
            children: undefined,
            childrenLoaded: undefined,
            isGitIgnored: false,
          };
          dispatch(addTreeItem({ parentPath: targetDirectory, newItem }));
        })
        .catch(error => {
          console.error('Error creating file:', error);
          alert(`Error creating file: ${error.message || error}`);
        });
    } else if (modalState.type === 'folder') {
      window.electron
        ?.createFolder?.(itemPath)
        .then(() => {
          const newItem: TFolderTree = {
            name,
            parentPath: targetDirectory,
            path: itemPath,
            isDirectory: true,
            children: [],
            childrenLoaded: true,
            isGitIgnored: false,
          };
          dispatch(addTreeItem({ parentPath: targetDirectory, newItem }));
        })
        .catch(error => {
          console.error('Error creating folder:', error);
          alert(`Error creating folder: ${error.message || error}`);
        });
    }

    setModalState({ isOpen: false, type: null, value: '' });
  }, [modalState, lastClickedItem, folderStructure.root, dispatch]);

  const handleModalCancel = useCallback(() => {
    setModalState({ isOpen: false, type: null, value: '' });
  }, []);

  const handleRefresh = useCallback(() => {
    if (!folderStructure.root) {
      console.warn('No folder structure to refresh');
      return;
    }

    window.electron
      ?.refreshFolder?.()
      .then(async (folder: IFolderStructure) => {
        if (folder && Object.keys(folder).length > 0) {
          try {
            const gitIgnoreChecker = await initializeGitIgnore(folder.root);
            console.log(
              'GitIgnore patterns loaded:',
              gitIgnoreChecker.getPatterns(),
            );
            const updatedTree = markGitIgnoredFiles(
              folder.tree,
              gitIgnoreChecker,
            );
            dispatch(setFolderStructure({ ...folder, tree: updatedTree }));
          } catch (error) {
            console.warn('Failed to initialize gitignore:', error);
            dispatch(setFolderStructure(folder));
          }
        }
      })
      .catch(error => {
        console.error('Error refreshing folder:', error);
        alert(`Error refreshing folder: ${error.message || error}`);
      });
  }, [folderStructure.root, dispatch]);

  const handleCollapseAll = useCallback(() => {
    dispatch(collapseAllFolders());
  }, [dispatch]);

  const hasFolder = folderStructure && Object.keys(folderStructure).length > 0;

  return (
    <ExplorerContainer>
      {hasFolder && (
        <OpenFolderButton onClick={openFolder}>Change Folder</OpenFolderButton>
      )}

      {hasFolder ? (
        <>
          <RootFolderHeader
            folderName={folderStructure.name}
            isExpanded={isRootExpanded}
            isHovered={isRootHovered}
            setIsHovered={setIsRootHovered}
            onToggleExpand={() =>
              dispatch(setExplorerExpanded(!isRootExpanded))
            }
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            onRefresh={handleRefresh}
            onCollapseAll={handleCollapseAll}
          />

          {isRootExpanded && (
            <ExplorerContent>
              <FileTree
                items={folderStructure.tree}
                onUpdateItem={handleUpdateTreeItem}
              />
            </ExplorerContent>
          )}
        </>
      ) : (
        <EmptyState>
          No folder selected.
          <br />
          <DefaultButton onClick={openFolder}>Open Folder</DefaultButton>
        </EmptyState>
      )}

      <InputModal
        modalState={modalState}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        onValueChange={value => setModalState(prev => ({ ...prev, value }))}
      />
    </ExplorerContainer>
  );
});

export default ExplorerSection;
