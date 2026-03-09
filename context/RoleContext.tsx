import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MOCK_USER_ROLE_STORAGE_KEY } from '../constants/mockUser';

type Role = 'client' | 'creator';

type RoleContextType = {
    role: Role;
    setRole: (role: Role) => Promise<void>;
    loading: boolean;
};

const RoleContext = createContext<RoleContextType>({
    role: 'client',
    setRole: async () => { },
    loading: true,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>('client');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem(MOCK_USER_ROLE_STORAGE_KEY);
            setRoleState(stored === 'creator' ? 'creator' : 'client');
            setLoading(false);
        };
        load();
    }, []);

    const setRole = useCallback(async (newRole: Role) => {
        await AsyncStorage.setItem(MOCK_USER_ROLE_STORAGE_KEY, newRole);
        setRoleState(newRole);
    }, []);

    return (
        <RoleContext.Provider value={{ role, setRole, loading }}>
            {children}
        </RoleContext.Provider>
    );
}

export const useRole = () => useContext(RoleContext);
