import React from 'react';
import { useProjectOperations } from '../shared/hooks';
import { Search } from '../components/search/Search';

export const SearchSection: React.FC = () => {
  const { hasFolder, folderName, searchInFolder, openFileAtLine } =
    useProjectOperations();

  return (
    <Search
      hasFolder={hasFolder}
      folderName={folderName}
      searchInFolder={searchInFolder}
      openFileAtLine={openFileAtLine}
    />
  );
};
