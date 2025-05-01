// src/context/UserContext.tsx
import React, { createContext, useState, useContext } from 'react';

export type Role = 'PROJECT_MANAGER' | 'DEVELOPER' | 'GUEST';

interface UserContextType {
  role: Role;
  setRole: (r: Role) => void;
}

const UserContext = createContext<UserContextType>({
  role: 'GUEST',
  setRole: () => {},
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [role, _setRole] = useState<Role>(
    (localStorage.getItem('user_role') as Role) || 'GUEST'
  );

  const setRole = (r: Role) => {
    localStorage.setItem('user_role', r);
    _setRole(r);
  };

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => useContext(UserContext);
