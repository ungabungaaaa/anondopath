
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Sample blog posts data (in a real app, you would fetch this from an API)
  const blogPosts = [
    {
      id: "1",
      title: "5 Ways Virtual Labs Are Changing Science Education",
      content: `
        <p class="mb-4">Science education has traditionally been limited by physical resources, lab equipment, and safety concerns. However, virtual labs are revolutionizing how students learn scientific concepts by providing immersive, interactive experiences that overcome these limitations.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">1. Enabling Access to Advanced Equipment</h2>
        <p class="mb-4">Not every school can afford expensive lab equipment or have the space to store it. Virtual labs democratize access to advanced scientific tools, allowing students from any school to conduct experiments that would otherwise be out of reach.</p>
        <p class="mb-6">Students can manipulate sophisticated equipment, observe reactions at molecular levels, and explore phenomena that would be impossible to witness in a traditional classroom setting.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">2. Eliminating Safety Concerns</h2>
        <p class="mb-4">Safety is a primary concern in physical labs, especially when working with chemicals, high voltages, or biological materials. Virtual labs remove these risks entirely while still allowing students to learn about potentially dangerous procedures.</p>
        <p class="mb-6">This safety net encourages experimentation and learning from mistakes without fear of harmful consequences, creating a more open and exploratory learning environment.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">3. Personalizing the Learning Experience</h2>
        <p class="mb-4">Every student learns at their own pace and has unique interests. Virtual labs can adapt to individual learning styles, allowing students to repeat experiments, explore tangential concepts, or advance to more complex materials based on their progress.</p>
        <p class="mb-6">Teachers can also customize lab experiences to align with specific curriculum goals or to address areas where certain students might need additional support.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">4. Visualizing the Abstract</h2>
        <p class="mb-4">Many scientific concepts are abstract and difficult to visualize. Virtual labs excel at making the invisible visible – from the movement of electrons to the formation of geological features over millions of years.</p>
        <p class="mb-6">By providing visual representations of complex processes, virtual labs help students build mental models that enhance their understanding and retention of difficult concepts.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">5. Collecting and Analyzing Real Data</h2>
        <p class="mb-4">Modern virtual labs aren't just simulations – they can incorporate real-world data and authentic scientific methodologies. Students learn to collect, process, and interpret data just as professional scientists do.</p>
        <p class="mb-6">This experience with data analysis develops critical thinking skills and prepares students for careers in STEM fields where data literacy is increasingly important.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
        <p class="mb-4">As virtual lab technology continues to advance, we're seeing a transformation in science education that makes learning more accessible, engaging, and effective. These tools aren't replacing physical labs entirely – rather, they're complementing traditional approaches and expanding what's possible in the science classroom.</p>
        <p class="mb-6">The future of science education will likely involve a balanced approach that leverages the strengths of both virtual and physical labs, providing students with the best possible preparation for scientific literacy and careers.</p>
      `,
      image: "/placeholder.svg",
      category: "EdTech",
      author: "Emily Chen",
      date: "May 15, 2023",
      readTime: "8 min read",
      relatedPosts: ["2", "3", "5"]
    },
    {
      id: "2",
      title: "The Future of Collaborative Learning in Virtual Environments",
      excerpt: "Explore how digital collaboration tools are breaking down classroom walls and creating new opportunities for student engagement and peer learning.",
      image: "/placeholder.svg",
      category: "Digital Learning",
      author: "Michael Rodriguez",
      date: "June 3, 2023",
      readTime: "6 min read"
    },
    {
      id: "3",
      title: "How One School District Improved STEM Scores with Anondopath",
      excerpt: "A detailed case study on how Westridge School District implemented our platform and saw a 35% improvement in science test scores within one semester.",
      image: "/placeholder.svg",
      category: "Case Studies",
      author: "Sarah Johnson",
      date: "April 22, 2023",
      readTime: "10 min read"
    },
    {
      id: "5",
      title: "Understanding the Impact of Visual Learning on Knowledge Retention",
      excerpt: "Research-backed insights into how visual and interactive learning experiences help students better understand and remember complex concepts.",
      image: "/placeholder.svg",
      category: "EdTech",
      author: "Lisa Patel",
      date: "July 5, 2023",
      readTime: "9 min read"
    }
  ];
  
  const post = blogPosts.find(post => post.id === id);
  
  // Add scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.slide-up');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Get related posts
  const relatedPosts = post.relatedPosts
    ? blogPosts.filter(relatedPost => post.relatedPosts?.includes(relatedPost.id))
    : [];
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 md:px-8 mb-8">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Link to="/" className="hover:text-anondopath-blue transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-anondopath-blue transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-700 truncate">{post.title}</span>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="container mx-auto px-4 md:px-8 mb-6">
          <Link to="/blog" className="inline-flex items-center text-anondopath-blue hover:text-anondopath-teal transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Link>
        </div>
        
        {/* Header */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4 slide-up">
              <span className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full">
                {post.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Image */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg slide-up" style={{ animationDelay: '0.3s' }}>
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        </section>
        
        {/* Content */}
        <section className="container mx-auto px-4 md:px-8 mb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="md:col-span-9 slide-up" style={{ animationDelay: '0.4s' }}>
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
              
              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center text-gray-600 mr-2">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="font-medium">Tags:</span>
                  </div>
                  {["Education", "VirtualLabs", "EdTech", "STEM"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-gray-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">Share this article:</span>
                  </div>
                  <div className="flex space-x-3">
                    <a href="#facebook" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 flex items-center justify-center transition-colors" aria-label="Share on Facebook">
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a href="#twitter" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-600 flex items-center justify-center transition-colors" aria-label="Share on Twitter">
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a href="#linkedin" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600 flex items-center justify-center transition-colors" aria-label="Share on LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href="#email" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center transition-colors" aria-label="Share via Email">
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:col-span-3">
              <div className="sticky top-24 space-y-8">
                {/* Author Bio */}
                <div className="bg-gray-50 rounded-xl p-6 slide-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="font-bold text-lg mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p className="text-sm text-gray-500">Education Specialist</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Specializing in digital education trends and educational technology integration in K-12 classrooms.
                  </p>
                  <a href="#author-profile" className="text-anondopath-blue hover:text-anondopath-teal text-sm font-medium transition-colors">
                    View Profile
                  </a>
                </div>
                
                {/* Popular Articles */}
                <div className="bg-gray-50 rounded-xl p-6 slide-up" style={{ animationDelay: '0.6s' }}>
                  <h3 className="font-bold text-lg mb-4">Popular Articles</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((relatedPost) => (
                      <div key={relatedPost.id} className="flex items-start space-x-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                          <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link to={`/blog/${relatedPost.id}`} className="text-sm font-medium hover:text-anondopath-blue transition-colors leading-tight block">
                            {relatedPost.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="mt-4 text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;
