import React, { useContext, createContext } from 'react'

export function createMetaStore <T> (hook: () => T, defaultVals: Partial<ReturnType<typeof hook>> = {}) {
  const Context = createContext<typeof defaultVals>(defaultVals)

  const Provider: React.FC = ({ children }) => {
    const res = hook()

    return (
      <Context.Provider value={res}>
        {children}
      </Context.Provider>
    )
  }

  const useHook = () => {
    return useContext(Context)
  }

  return {
    Provider,
    useHook,
  }
}
