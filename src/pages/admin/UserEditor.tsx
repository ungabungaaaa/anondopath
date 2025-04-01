
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, UserCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogUser } from '@/types/blog';
import bcrypt from 'bcryptjs';

const UserEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAdminAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [user, setUser] = useState<Partial<BlogUser>>({
    username: '',
    password: '',
    email: '',
    full_name: '',
    is_admin: true, // Default to admin for new users
  });
  
  // Additional state for password change
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // If editing, fetch the user
        if (isEditMode && id) {
          const { data, error } = await supabase
            .from('blog_users')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error || !data) {
            toast({
              variant: "destructive",
              title: "User not found",
              description: "The user you're trying to edit doesn't exist.",
            });
            navigate('/admin/users');
            return;
          }
          
          // Remove password from state for security
          const { password, ...userWithoutPassword } = data;
          setUser(userWithoutPassword);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleAdmin = (checked: boolean) => {
    setUser(prev => ({ ...prev, is_admin: checked }));
  };
  
  const validateForm = () => {
    if (!user.username) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Username is required.",
      });
      return false;
    }
    
    // For new users, password is required
    if (!isEditMode && !user.password) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Password is required for new users.",
      });
      return false;
    }
    
    // For password change
    if (isEditMode && changePassword) {
      if (!newPassword) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "New password is required.",
        });
        return false;
      }
      
      if (newPassword !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Passwords do not match.",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      // For new user or password change, hash the password
      let hashedPassword;
      if (!isEditMode || (isEditMode && changePassword && newPassword)) {
        const passwordToHash = isEditMode ? newPassword : user.password;
        hashedPassword = await bcrypt.hash(passwordToHash, 6);
      }
      
      if (isEditMode && id) {
        // Update existing user
        const updates: Partial<BlogUser> = {
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          is_admin: user.is_admin,
          updated_at: new Date().toISOString(),
        };
        
        // Only include password if it's being changed
        if (changePassword && hashedPassword) {
          updates.password = hashedPassword;
        }
        
        const { error } = await supabase
          .from('blog_users')
          .update(updates)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "User updated",
          description: "User information has been updated successfully.",
        });
      } else {
        // Create new user
        const { error } = await supabase
          .from('blog_users')
          .insert([{ 
            ...user,
            password: hashedPassword,
          }]);
        
        if (error) throw error;
        
        toast({
          title: "User created",
          description: "New admin user has been created successfully.",
        });
      }
      
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Save error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        toast({
          variant: "destructive",
          title: "Error",
          description: "Username already exists. Please choose a different username.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: error.message || "There was an error saving the user.",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  const isCurrentUser = isEditMode && currentUser && id === currentUser.id;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/admin/users" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit User' : 'Create New Admin User'}
          </h1>
          {isCurrentUser && <span className="ml-2 text-blue-600 text-sm">(Your Account)</span>}
        </div>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username*</Label>
                <Input
                  id="username"
                  name="username"
                  value={user.username || ''}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="mt-1"
                  required
                />
              </div>
              
              {!isEditMode ? (
                <div>
                  <Label htmlFor="password">Password*</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password || ''}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="mt-1"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Switch
                      id="change-password"
                      checked={changePassword}
                      onCheckedChange={setChangePassword}
                    />
                    <Label htmlFor="change-password" className="ml-2">
                      Change Password
                    </Label>
                  </div>
                  
                  {changePassword && (
                    <>
                      <div>
                        <Label htmlFor="new-password">New Password*</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password*</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="mt-1"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email || ''}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={user.full_name || ''}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center">
                <Switch
                  id="is_admin"
                  checked={!!user.is_admin}
                  onCheckedChange={handleToggleAdmin}
                  disabled={isCurrentUser} // Don't allow removing admin from yourself
                />
                <Label htmlFor="is_admin" className="ml-2">
                  Admin Access
                </Label>
                {isCurrentUser && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Cannot change your own admin status)
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserEditor;
