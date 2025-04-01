
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminAuthState, AdminLoginCredentials, BlogUser } from '@/types/blog';
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '@/services/blogService';
import { toast } from '@/components/ui/use-toast';

interface AdminAuthContextType extends AdminAuthState {
  login: (credentials: AdminLoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const defaultState: AdminAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  ...defaultState,
  login: async () => false,
  logout: () => {}
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AdminAuthState>(defaultState);

  useEffect(() => {
    const initAuth = () => {
      try {
        const user = getCurrentAdmin();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: AdminLoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await loginAdmin(credentials);
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        });
        return true;
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error("Login error in context:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || "Authentication failed"
      });
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
      return false;
    }
  };

  const logout = () => {
    logoutAdmin();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
