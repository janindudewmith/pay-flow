import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({ title: '' });
  const [isSearched, setIsSearched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
