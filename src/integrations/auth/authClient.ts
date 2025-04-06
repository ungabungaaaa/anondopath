
// This file replaces the Supabase client with a simple front-end authentication
// for development purposes

// Admin user credentials - in a real app, these would never be stored here
const ADMIN_CREDENTIALS = {
  username: 'Ungabunga',
  password: 'anondopath.2121'
};

export interface AuthUser {
  id: string;
  username: string;
  full_name?: string;
  role: 'admin';
}

export const getAuthHeaders = () => {
  try {
    const admin = JSON.parse(localStorage.getItem('blogAdminUser') || '{}');
    return admin?.id ? {
      headers: {
        'Authorization': `Bearer ${admin.id}`,
        'x-admin-access': 'true'
      }
    } : {};
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
};

export const authenticateAdmin = async (username: string, password: string): Promise<AuthUser | null> => {
  console.log(`Attempting to authenticate with username: ${username}`);
  
  // Simple credential check
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const user: AuthUser = {
      id: '123e4567-e89b-12d3-a456-426614174000', // Simulated UUID
      username: username,
      full_name: 'Admin User',
      role: 'admin'
    };
    
    // Store admin session
    localStorage.setItem('blogAdminUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const getCurrentAdmin = (): AuthUser | null => {
  try {
    const userJson = localStorage.getItem('blogAdminUser');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving admin session:", error);
    return null;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('blogAdminUser');
};
