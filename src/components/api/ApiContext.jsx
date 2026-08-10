import React, { useContext, createContext } from "react";
import useApi from "./useApi";
import useEnv from "../hooks/useEnv";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const {
    assets,
    pages,
    colors,
    fonts,
    settings,
    directApi,
    isLoading,
    hasError,
  } = useApi();
  const { environment } = useEnv();
  if (environment == "development" || environment == "staging")
    // Dev or Staging => log
    console.log(
      { Environment: environment },
      { Assets: assets },
      { Pages: pages },
      { Colors: colors },
      { Fonts: fonts },
      { Settings: settings },
      { directApi: directApi },
      { isLoading: isLoading },
    );
  return (
    <ApiContext.Provider
      value={{
        environment,
        assets,
        pages,
        colors,
        fonts,
        settings,
        directApi,
        isLoading,
        hasError,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useData = () => useContext(ApiContext);
