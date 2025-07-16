
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Badge,
} from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  MoreHorizontal, 
  Trash2,
  CheckCircle,
  MessageSquare,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getAdminComments, approveComment, deleteComment, getPostById } from '@/services/blogService';
import { BlogComment } from '@/types/blog';
import { Link } from 'react-router-dom';

interface CommentWithPostTitle extends BlogComment {
  postTitle?: string;
  postSlug?: string;
}

const AdminCommentsList = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const [comments, setComments] = useState<CommentWithPostTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [totalComments, setTotalComments] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchComments();
    }
  }, [isAuthenticated, navigate, currentPage, pageSize, filter]);
  
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      
      // Get status filter
      const isApproved = filter === 'all' ? undefined : filter === 'approved';
      
      // Fetch comments with pagination and filtering
      const { comments: fetchedComments, count } = await getAdminComments(
        currentPage, 
        pageSize,
        isApproved
      );
      
      // Enhance comments with post information
      const enhancedComments = await Promise.all(
        fetchedComments.map(async (comment) => {
          if (comment.post_id) {
            try {
              const post = await getPostById(comment.post_id);
              return {
                ...comment,
                postTitle: post?.title || 'Unknown Post',
                postSlug: post?.slug
              };
            } catch {
              return {
                ...comment,
                postTitle: 'Unknown Post'
              };
            }
          }
          return comment;
        })
      );
      
      setComments(enhancedComments);
      setTotalComments(count);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load comments. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComments();
  };
  
  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };
  
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  
  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(true);
      const success = await approveComment(id);
      
      if (success) {
        toast({
          title: "Comment approved",
          description: "The comment has been approved and published.",
        });
        fetchComments();
      } else {
        throw new Error('Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve comment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this comment? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const success = await deleteComment(id);
      
      if (success) {
        toast({
          title: "Comment deleted",
          description: "The comment has been deleted.",
        });
        fetchComments();
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const totalPages = Math.ceil(totalComments / pageSize);
  
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
        <h1 className="text-2xl font-bold">Comments</h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Tabs 
          defaultValue={filter} 
          className="w-full md:w-auto"
          onValueChange={handleFilterChange}
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button type="submit" variant="secondary" className="rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Author</TableHead>
              <TableHead className="w-[40%]">Comment</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No comments found.</p>
                    {filter !== 'all' && (
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your filter.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="font-medium">{comment.author_name}</div>
                    <div className="text-gray-500 text-sm truncate">{comment.author_email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-3 text-sm">
                      {comment.content}
                    </div>
                  </TableCell>
                  <TableCell>
                    {comment.postSlug ? (
                      <Link to={`/blog/${comment.postSlug}`} target="_blank" className="text-blue-600 hover:underline flex items-center">
                        <span className="truncate mr-1">{comment.postTitle}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span>{comment.postTitle}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-nowrap">
                      {formatDate(comment.created_at)}
                    </div>
                    <div className="mt-1">
                      <Badge variant={comment.is_approved ? "default" : "outline"}>
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </TableCell>
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
                          {!comment.is_approved && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(comment.id)}
                              className="text-green-600 focus:text-green-600 cursor-pointer"
                              disabled={isProcessing}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            disabled={isProcessing}
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
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {!isLoading && (
            <>
              Showing {comments.length} of {totalComments} comments
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page:</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            
            <div className="text-sm">
              Page {currentPage} of {Math.max(1, totalPages)}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommentsList;
