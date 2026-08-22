import { createContext, useContext } from 'react';
import type { ClassLevel } from '../types/content';

const ActiveClassLevelContext = createContext<ClassLevel | null>(null);

export function ActiveClassLevelProvider({
  classLevel,
  children,
}: {
  classLevel: ClassLevel | null;
  children: React.ReactNode;
}) {
  return (
    <ActiveClassLevelContext.Provider value={classLevel}>{children}</ActiveClassLevelContext.Provider>
  );
}

export function useActiveClassLevel(): ClassLevel | null {
  return useContext(ActiveClassLevelContext);
}
