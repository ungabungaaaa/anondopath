
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Clock, ArrowRight, Tag, User } from 'lucide-react';
import Button from '@/components/Button';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Add intersection observer for scroll animations
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

  const categories = ['All', 'EdTech', 'Teaching Tips', 'Case Studies', 'Product Updates', 'Digital Learning'];

  const featuredPosts = [
    {
      id: 1,
      title: "5 Ways Virtual Labs Are Changing Science Education",
      excerpt: "Discover how virtual laboratories are transforming the way students learn and understand scientific concepts in today's digital classrooms.",
      image: "/placeholder.svg",
      category: "EdTech",
      author: "Emily Chen",
      date: "May 15, 2023",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "The Future of Collaborative Learning in Virtual Environments",
      excerpt: "Explore how digital collaboration tools are breaking down classroom walls and creating new opportunities for student engagement and peer learning.",
      image: "/placeholder.svg",
      category: "Digital Learning",
      author: "Michael Rodriguez",
      date: "June 3, 2023",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "How One School District Improved STEM Scores with Anondopath",
      excerpt: "A detailed case study on how Westridge School District implemented our platform and saw a 35% improvement in science test scores within one semester.",
      image: "/placeholder.svg",
      category: "Case Studies",
      author: "Sarah Johnson",
      date: "April 22, 2023",
      readTime: "10 min read"
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "10 Interactive Activities to Engage Middle School Science Students",
      excerpt: "Practical activities and lesson plans to get your middle school students excited about science using Anondopath's interactive simulations.",
      image: "/placeholder.svg",
      category: "Teaching Tips",
      author: "David Wilson",
      date: "July 10, 2023",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Understanding the Impact of Visual Learning on Knowledge Retention",
      excerpt: "Research-backed insights into how visual and interactive learning experiences help students better understand and remember complex concepts.",
      image: "/placeholder.svg",
      category: "EdTech",
      author: "Lisa Patel",
      date: "July 5, 2023",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "New Feature Release: Collaborative Whiteboarding Tools",
      excerpt: "Introducing our newest feature that allows teachers and students to collaborate in real-time on virtual whiteboards within simulations.",
      image: "/placeholder.svg",
      category: "Product Updates",
      author: "Anondopath Team",
      date: "June 28, 2023",
      readTime: "4 min read"
    },
    {
      id: 7,
      title: "Bridging the Digital Divide: Making EdTech Accessible to All",
      excerpt: "How Anondopath is working with underserved communities to ensure all students have access to quality digital learning experiences.",
      image: "/placeholder.svg",
      category: "Digital Learning",
      author: "James Carter",
      date: "June 22, 2023",
      readTime: "8 min read"
    },
    {
      id: 8,
      title: "Tips for Remote Teaching with Digital Simulations",
      excerpt: "Practical advice for educators on how to effectively implement virtual labs and simulations in remote and hybrid learning environments.",
      image: "/placeholder.svg",
      category: "Teaching Tips",
      author: "Emma Baker",
      date: "June 15, 2023",
      readTime: "6 min read"
    },
    {
      id: 9,
      title: "How Anondopath Helped This University Revolutionize Engineering Education",
      excerpt: "Case study on how a leading engineering program implemented virtual simulations to prepare students for real-world challenges.",
      image: "/placeholder.svg",
      category: "Case Studies",
      author: "Robert Chen",
      date: "June 8, 2023",
      readTime: "11 min read"
    }
  ];

  // Filter posts based on search query and active category
  const filterPosts = (posts) => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredFeaturedPosts = filterPosts(featuredPosts);
  const filteredRecentPosts = filterPosts(recentPosts);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-4xl mx-auto slide-up">
              <span className="bg-anondopath-teal/10 text-anondopath-teal px-4 py-1 rounded-full text-sm font-medium">
                Our Blog
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Insights & Resources</span> for
                <br className="hidden md:block" /> Modern Educators
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the latest trends, tips, and stories from the world of digital education and interactive learning.
              </p>
              
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-anondopath-teal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {filteredFeaturedPosts.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Featured Articles</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredFeaturedPosts.map((post, index) => (
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
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      
                      <a 
                        href={`#blog/${post.id}`} 
                        className="mt-4 text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {filteredRecentPosts.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-anondopath-blue/5 to-anondopath-teal/5">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Recent Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecentPosts.map((post, index) => (
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
                      
                      <a 
                        href={`#blog/${post.id}`} 
                        className="mt-4 text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button variant="outline">Load More Articles</Button>
              </div>
            </div>
          </section>
        )}

        {/* Empty State (No results) */}
        {filteredFeaturedPosts.length === 0 && filteredRecentPosts.length === 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <div className="max-w-md mx-auto">
                <Search className="mx-auto h-16 w-16 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold mb-4">No articles found</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't find any articles matching your search criteria. Try adjusting your search terms or browse all categories.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                >
                  View All Articles
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 slide-up">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                  <p className="text-gray-600 mb-6">
                    Stay up-to-date with the latest educational insights, teaching resources, and product updates.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                        required
                      />
                    </div>
                    <div>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal bg-white">
                        <option value="">Preferred Content Topics</option>
                        <option value="teaching-tips">Teaching Tips</option>
                        <option value="edtech-trends">EdTech Trends</option>
                        <option value="product-updates">Product Updates</option>
                        <option value="all">All Topics</option>
                      </select>
                    </div>
                    <Button variant="primary" className="w-full" animate>
                      Subscribe
                    </Button>
                  </form>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    By subscribing, you agree to our privacy policy and consent to receive updates from our company.
                  </p>
                </div>
                
                <div className="hidden md:block bg-gradient-to-br from-anondopath-blue to-anondopath-teal relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pattern-dots pattern-white pattern-size-4 pattern-diagonal-lines"></div>
                  <div className="relative p-12 text-white flex items-center h-full">
                    <div className="slide-up">
                      <h3 className="text-xl font-bold mb-4">Why Subscribe?</h3>
                      <ul className="space-y-4">
                        {[
                          "Weekly teaching tips and lesson ideas",
                          "Early access to new features",
                          "Exclusive educational resources",
                          "Stories from successful classrooms",
                          "Industry insights and trends"
                        ].map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <Tag className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
