import fs from 'fs';
import path from 'path';
import { FileTreeNode, BackgroundLoadProgress } from '../types/fileTree';

export const buildSingleLevelTreeAsync = async (
  dirPath: string,
): Promise<FileTreeNode[]> => {
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const directories = items
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));
    const files = items
      .filter(item => !item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    return [...directories, ...files].map(item => {
      const itemPath = path.join(dirPath, item.name);
      const node: FileTreeNode = {
        id: itemPath,
        name: item.name,
        parentPath: dirPath,
        path: itemPath,
        isDirectory: item.isDirectory(),
        children: [],
        childrenLoaded: false,
        isLoading: false,
        isExpanded: false,
        level: 0,
      };
      return node;
    });
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
};

export const buildInitialFileTreeAsync = async (
  dirPath: string,
  maxDepth: number = 2,
  currentDepth: number = 0,
): Promise<FileTreeNode[]> => {
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const directories: fs.Dirent[] = [];
    const files: fs.Dirent[] = [];

    for (const item of items) {
      if (item.isDirectory()) {
        directories.push(item);
      } else {
        files.push(item);
      }
    }

    directories.sort((a, b) => (a.name < b.name ? -1 : 1));
    files.sort((a, b) => (a.name < b.name ? -1 : 1));

    const allItems = [...directories, ...files];
    const nodes: FileTreeNode[] = [];

    const batchSize = 20;
    for (let i = 0; i < allItems.length; i += batchSize) {
      const batch = allItems.slice(i, i + batchSize);

      for (const item of batch) {
        const itemPath = path.join(dirPath, item.name);
        const node: FileTreeNode = {
          id: itemPath,
          name: item.name,
          parentPath: dirPath,
          path: itemPath,
          isDirectory: item.isDirectory(),
          children: [],
          childrenLoaded: currentDepth < maxDepth,
          isLoading: false,
          isExpanded: false,
          level: currentDepth,
        };

        if (item.isDirectory() && currentDepth < maxDepth) {
          try {
            node.children = await buildInitialFileTreeAsync(
              itemPath,
              maxDepth,
              currentDepth + 1,
            );
            node.childrenLoaded = true;
          } catch (error) {
            console.warn(`Cannot read directory: ${itemPath}`, error);
            node.children = [];
            node.childrenLoaded = true;
          }
        }

        nodes.push(node);
      }

      if (i + batchSize < allItems.length) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }

    return nodes;
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
};

export const loadDirectoryChildren = (dirPath: string): FileTreeNode[] => {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    return items
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      })
      .map(item => {
        const itemPath = path.join(dirPath, item.name);
        const node: FileTreeNode = {
          id: itemPath,
          name: item.name,
          parentPath: dirPath,
          path: itemPath,
          isDirectory: item.isDirectory(),
          children: [],
          childrenLoaded: false,
          isLoading: false,
          isExpanded: false,
          level: 0,
        };
        return node;
      });
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
};

export const loadCompleteTreeBackground = async (
  rootPath: string,
  onProgress?: (progress: BackgroundLoadProgress) => void,
): Promise<FileTreeNode[]> => {
  const startTime = Date.now();
  let totalDirectories = 0;
  let loadedDirectories = 0;

  const countDirectories = (dirPath: string): number => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      let count = 0;

      for (const item of items) {
        if (item.isDirectory()) {
          if (
            item.name.startsWith('.') ||
            item.name === 'node_modules' ||
            item.name === 'dist' ||
            item.name === 'build' ||
            item.name === 'coverage' ||
            item.name === 'target' ||
            item.name === 'bin' ||
            item.name === 'obj' ||
            item.name === '__pycache__'
          ) {
            continue;
          }

          count += 1;
          const itemPath = path.join(dirPath, item.name);
          count += countDirectories(itemPath);
        }
      }
      return count;
    } catch (error) {
      return 0;
    }
  };

  console.log('🔄 Starting background tree loading...');
  totalDirectories = countDirectories(rootPath);
  console.log(`📊 Total directories to load: ${totalDirectories}`);

  const loadTreeRecursive = async (
    dirPath: string,
    currentLevel: number = 0,
  ): Promise<FileTreeNode[]> => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      const nodes: FileTreeNode[] = [];

      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);

        if (
          item.name.startsWith('.') ||
          item.name === 'node_modules' ||
          item.name === 'dist' ||
          item.name === 'build' ||
          item.name === 'coverage' ||
          item.name === 'target' ||
          item.name === 'bin' ||
          item.name === 'obj' ||
          item.name === '__pycache__'
        ) {
          continue;
        }

        const node: FileTreeNode = {
          id: itemPath,
          name: item.name,
          parentPath: dirPath,
          path: itemPath,
          isDirectory: item.isDirectory(),
          children: [],
          childrenLoaded: false,
          isLoading: false,
          isExpanded: false,
          level: currentLevel,
        };

        if (item.isDirectory()) {
          try {
            loadedDirectories++;

            if (
              loadedDirectories % 10 === 0 ||
              loadedDirectories === totalDirectories
            ) {
              onProgress?.({
                totalDirectories,
                loadedDirectories,
                currentPath: itemPath,
                isComplete: loadedDirectories === totalDirectories,
              });
            }

            if (loadedDirectories % 50 === 0) {
              await new Promise(resolve => setImmediate(resolve));
            }

            node.children = await loadTreeRecursive(itemPath, currentLevel + 1);
            node.childrenLoaded = true;
          } catch (error) {
            console.warn(`Cannot read directory: ${itemPath}`, error);
            node.children = [];
            node.childrenLoaded = true;
          }
        }

        nodes.push(node);
      }

      return nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error(`Error reading directory: ${dirPath}`, error);
      return [];
    }
  };

  const result = await loadTreeRecursive(rootPath);
  const duration = Date.now() - startTime;

  console.log(
    `✅ Background tree loading completed: ${loadedDirectories} directories in ${duration}ms`,
  );

  onProgress?.({
    totalDirectories,
    loadedDirectories,
    currentPath: rootPath,
    isComplete: true,
  });

  return result;
};

export const extractAllFilesFromTree = (
  nodes: FileTreeNode[],
  rootPath: string,
  allFiles: Array<{ name: string; path: string; relativePath: string }> = [],
): Array<{ name: string; path: string; relativePath: string }> => {
  for (const node of nodes) {
    if (node.isDirectory) {
      if (node.children && node.children.length > 0) {
        extractAllFilesFromTree(node.children, rootPath, allFiles);
      }
    } else {
      const relativePath = node.path.startsWith(rootPath)
        ? node.path.slice(rootPath.length + 1)
        : node.path;

      allFiles.push({
        name: node.name,
        path: node.path,
        relativePath: relativePath,
      });
    }
  }
  return allFiles;
};
