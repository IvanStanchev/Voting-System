import React, { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [refetchFlag, setRefetchFlag] = useState(false);
  
  const storedSessionData = localStorage.getItem('sessionData');
  let parsedSessionData;
  
  try {
    parsedSessionData = storedSessionData ? JSON.parse(storedSessionData) : null;
  } catch (error) {
    parsedSessionData = null;
  }
  
  const [sessionData, setSessionData] = useState(parsedSessionData);

  useEffect(() => {
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const toggleRefetchFlag = () => {
    setRefetchFlag((prevFlag) => !prevFlag);
  };

  const value = {
    refetchFlag,
    toggleRefetchFlag,
    sessionData,
    setSessionData
  };


  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}

export default DataContext;
