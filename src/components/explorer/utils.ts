import { TFolderTree } from '../../shared/types';

export const markGitIgnoredFiles = (
  items: TFolderTree[],
  checker: any,
): TFolderTree[] => {
  return items.map(item => {
    const isGitIgnored = checker ? checker.isIgnored(item.path) : false;
    if (isGitIgnored) {
      console.log(`Git ignored: ${item.name} (${item.path})`);
    }
    return {
      ...item,
      isGitIgnored,
      children: item.children
        ? markGitIgnoredFiles(item.children, checker)
        : undefined,
    };
  });
};
