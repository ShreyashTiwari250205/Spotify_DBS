import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getCurrentUser();
        if (u) setUser(u);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        if (result.success) setUser(result.user);
        return result;
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
