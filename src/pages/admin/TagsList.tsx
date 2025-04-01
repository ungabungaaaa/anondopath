
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
import { toast } from '@/components/ui/use-toast';
import { 
  TagPlus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Loader2,
  Tag
} from 'lucide-react';
import { getTags, deleteTag } from '@/services/blogService';
import { BlogTag } from '@/types/blog';

const AdminTagsList = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<BlogTag[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchTags();
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredTags(
        tags.filter(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredTags(tags);
    }
  }, [searchQuery, tags]);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const fetchedTags = await getTags();
      setTags(fetchedTags);
      setFilteredTags(fetchedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tags. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };
  
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also affect any posts using this tag.`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const success = await deleteTag(id);
      
      if (success) {
        toast({
          title: "Tag deleted",
          description: "The tag has been successfully deleted.",
        });
        fetchTags();
      } else {
        throw new Error('Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tag. Please try again.",
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
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button asChild>
          <Link to="/admin/tags/new" className="flex items-center">
            <TagPlus className="mr-2 h-4 w-4" /> New Tag
          </Link>
        </Button>
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
        <Input
          placeholder="Search tags..."
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
              <TableHead className="w-[60%]">Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Tag className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No tags found.</p>
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
                      <Link to="/admin/tags/new">
                        Create a new tag
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Badge className="mr-2">{tag.name}</Badge>
                      <span className="text-gray-500 text-sm truncate">
                        {tag.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(tag.created_at)}</TableCell>
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
                            <Link to={`/admin/tags/${tag.id}`} className="flex items-center cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(tag.id, tag.name)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTagsList;
