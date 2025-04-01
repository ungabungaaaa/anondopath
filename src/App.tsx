
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminPostsList from "./pages/admin/PostsList";
import PostEditor from "./pages/admin/PostEditor";
import AdminCategoriesList from "./pages/admin/CategoriesList"; 
import CategoryEditor from "./pages/admin/CategoryEditor";
import AdminTagsList from "./pages/admin/TagsList";
import TagEditor from "./pages/admin/TagEditor";
import AdminCommentsList from "./pages/admin/CommentsList";
import AdminUsersList from "./pages/admin/UsersList";
import UserEditor from "./pages/admin/UserEditor";

// ScrollToTop component to scroll to top when navigating between pages
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPostsList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id" element={<PostEditor />} />
          <Route path="categories" element={<AdminCategoriesList />} />
          <Route path="categories/new" element={<CategoryEditor />} />
          <Route path="categories/:id" element={<CategoryEditor />} />
          <Route path="tags" element={<AdminTagsList />} />
          <Route path="tags/new" element={<TagEditor />} />
          <Route path="tags/:id" element={<TagEditor />} />
          <Route path="comments" element={<AdminCommentsList />} />
          <Route path="users" element={<AdminUsersList />} />
          <Route path="users/new" element={<UserEditor />} />
          <Route path="users/:id" element={<UserEditor />} />
        </Route>
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  // Create QueryClient inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
