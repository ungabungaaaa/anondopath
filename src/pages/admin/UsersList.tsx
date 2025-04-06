
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Badge,
} from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  UserCircle,
  Loader2,
  Users
} from 'lucide-react';

import { BlogUser } from '@/types/blog';

// Get users from localStorage
const getUsers = (): BlogUser[] => {
  try {
    // Initialize with the admin user if empty
    const users = JSON.parse(localStorage.getItem('blogUsers') || '[]');
    if (users.length === 0) {
      const adminUser = JSON.parse(localStorage.getItem('blogAdminUser') || 'null');
      if (adminUser) {
        users.push(adminUser);
        localStorage.setItem('blogUsers', JSON.stringify(users));
      }
    }
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: BlogUser[]): void => {
  localStorage.setItem('blogUsers', JSON.stringify(users));
};

const AdminUsersList = () => {
  const { isAuthenticated, user: currentUser } = useAdminAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<BlogUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<BlogUser[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(user => 
          (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = getUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };
  
  const handleDelete = async (id: string, username: string) => {
    // Don't allow deleting the current user
    if (id === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot delete your own account while logged in.",
      });
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const users = getUsers();
      const updatedUsers = users.filter(user => user.id !== id);
      saveUsers(updatedUsers);
      
      toast({
        title: "User deleted",
        description: "The user account has been deleted successfully.",
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <Button asChild>
          <Link to="/admin/users/new" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" /> Add Admin
          </Link>
        </Button>
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none"
        />
        <Button type="submit" variant="secondary" className="rounded-l-none">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Users className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No users found.</p>
                    {searchQuery && (
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your search query.
                      </p>
                    )}
                    <Button 
                      variant="link" 
                      asChild 
                      className="mt-2"
                    >
                      <Link to="/admin/users/new">
                        Create a new admin user
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const initials = user.full_name 
                  ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : user.username.slice(0, 2).toUpperCase();
                
                const isCurrentUser = user.id === currentUser?.id;
                
                return (
                  <TableRow key={user.id} className={isCurrentUser ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.full_name || user.username}
                            {isCurrentUser && <span className="ml-2 text-blue-600 text-xs">(You)</span>}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_admin ? "default" : "outline"}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user.id, user.username)}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                              disabled={isDeleting || isCurrentUser}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersList;
