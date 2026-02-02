import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, MessageCircle, User, ChevronDown, Star, Home, Building, Key, Wallet, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from "react-router-dom";

    const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    type: 'RFO',
    minPrice: 10000,
    maxPrice: 40000
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);

  // Properties data
  const topPicks = [
    { id: 1, image: '/api/placeholder/600/400', title: 'Modern Condo in BGC', price: '₱25,000', location: 'Taguig City' },
    { id: 2, image: '/api/placeholder/600/400', title: 'Cozy Studio in QC', price: '₱15,000', location: 'Quezon City' },
    { id: 3, image: '/api/placeholder/600/400', title: 'Shared Room Near UP', price: '₱8,000', location: 'Diliman' },
    { id: 4, image: '/api/placeholder/600/400', title: 'Student Dorm in Manila', price: '₱12,000', location: 'Manila' },
    { id: 5, image: '/api/placeholder/600/400', title: 'Apartment in Makati', price: '₱20,000', location: 'Makati City' },
    { id: 6, image: '/api/placeholder/600/400', title: 'Boarding House in Pasig', price: '₱10,000', location: 'Pasig City' }
  ];

  const categories = [
    { id: 'condos', title: 'Condominiums', image: '/api/placeholder/800/600', description: 'Modern living spaces with amenities' },
    { id: 'houses', title: 'Houses', image: '/api/placeholder/800/600', description: 'Complete houses for families or groups' },
    { id: 'apartments', title: 'Apartments', image: '/api/placeholder/800/600', description: 'Affordable apartments for students' }
  ];

  const cities = ['Quezon City', 'Manila', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'San Juan', 'Caloocan'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Claude API integration for intelligent responses
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [
            {
              role: "system", 
              content: "You are a helpful assistant for AOS, a rental platform for Filipino students. Help users find boarding houses, apartments, and condos. Be friendly, concise, and focus on rental-related queries. Always ask follow-up questions to better assist them."
            },
            ...chatMessages,
            userMessage
          ]
        })
      });

      const data = await response.json();
      const assistantResponse = {
        role: 'assistant',
        content: data.content[0].text
      };

      setChatMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      const errorResponse = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. But I'm here to help you find the perfect place to stay! What type of accommodation are you looking for?"
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userDropdown = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdown.current && !userDropdown.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      
      {/* Header */}
      <header className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-96 bg-white/95' : 'w-[72rem] bg-white/90'
      } backdrop-blur-md rounded-b-3xl shadow-lg`}>
        <nav className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            
              <a href="#home" className="w-full h-full flex items-center justify-center">
                {isScrolled ? (
                <img src="images/AOSlogo(sub).svg" alt="AOS Logo" className="object-contain w-16 h-12 rounded-xl overflow-hidden flex items-center justify-center" />
              ):(
                <div className=" w-24 h-12 rounded-xl overflow-hidden flex items-center justify-center ">
                  <img src="images/AOSlogo(main).svg" alt="AOS Logo" className="object-contain " />
                </div>
                )}
                </a>
                </div>
         

          {!isScrolled && (
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#categories" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</a>
              <a href="#search" className="text-gray-700 hover:text-blue-600 transition-colors">Search</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          )}  
          
          <div ref={userDropdown} className="relative inline-block">
          {/* Button login and register */}
           <button className="flex items-center space-x-1 focus:outline-none"
           onClick={() => setDropdownOpen(!dropdownOpen)}>
           <User className="w-8 h-8 text-gray-700" />
           <ChevronDown className="w-4 h-4 text-gray-700" />
        </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
              
            <Link to="/login" className="block w-full px-4 py-2 text-left hover:bg-gray-100">Login</Link>
            <Link to="/register" className="block w-full px-4 py-2 text-left hover:bg-gray-100">Register</Link>
            </div>
            )}
        </div>
       </nav>
     </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 min-h-screen flex items-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Innovation For Effortless Apartment Management
              </h1>
              <p className="text-xl opacity-90 max-w-lg">
                AOS Is A Reliable Software Platform Designed To Simplify 
                Apartment Management. We Help Property Managers Streamline Communication, 
                Payment Tracking, And Maintenance, Making Day-To-Day Tasks More Manageable 
                And Efficient.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
            <div className="flex justify-center">
              <div className="w-96 h-96 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center">
                  <Building className="w-32 h-32 text-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Key className="w-12 h-12" />, title: 'Simplify', desc: 'AOS simplifies property management by keeping all tenant and lease details accessible in one central location.' },
              { icon: <Search className="w-12 h-12" />, title: 'Tours & Reservations', desc: 'Allowing prospective tenants to view available units and book appointments easily.' },
              { icon: <Wallet className="w-12 h-12" />, title: 'Transaction', desc: 'Manage payments, track transactions, and handle tenant communication effortlessly with AOS.' },
              { icon: <Home className="w-12 h-12" />, title: 'Organize', desc: 'Keep all essential documents, tenant information, and lease details organized and easily accessible.' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks Carousel */}
      <section id="categories" className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">TOP PICKS</h2>
          <div className="overflow-hidden">
            <div className="flex space-x-6 animate-pulse hover:animate-none transition-all">
              {[...topPicks, ...topPicks].map((property, index) => (
                <div key={index} className="flex-none w-96 bg-white rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="h-48 bg-gray-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-75">{property.location}</p>
                      <p className="font-bold text-lg">{property.price}/month</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{property.title}</h3>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5 (23 reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Selection */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-1 h-96 overflow-hidden rounded-2xl">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative cursor-pointer transition-all duration-700 ${
                  activeCategory === category.id ? 'md:w-full flex-grow' : 'md:w-1/3'
                }`}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-blue-300"></div>
                <div className="absolute bottom-8 left-8 text-white z-20">
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  {activeCategory === category.id && (
                    <p className="mt-2 opacity-90">{category.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Map */}
            <div className="w-full lg:w-1/2 h-96 bg-gray-300 rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            {/* Search Form */}
            <div className="w-full lg:w-1/2 bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Place</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchFilters.city}
                      onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchFilters.type}
                      onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
                    >
                      <option value="RFO">Ready For Occupancy</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Shared">Shared Room</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Min: ₱{searchFilters.minPrice.toLocaleString()}</span>
                        <span>₱{searchFilters.maxPrice.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="50000"
                        step="1000"
                        value={searchFilters.minPrice}
                        onChange={(e) => setSearchFilters({...searchFilters, minPrice: parseInt(e.target.value)})}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Max: ₱{searchFilters.maxPrice.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="50000"
                        step="1000"
                        value={searchFilters.maxPrice}
                        onChange={(e) => setSearchFilters({...searchFilters, maxPrice: parseInt(e.target.value)})}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Student Reviews</h3>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">"AOS helped me find a safe and affordable place near my university. Highly recommend!"</p>
              <p className="text-sm text-gray-500 mt-2">- Maria, UP Student</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AOS</span>
                </div>
                About AOS
              </h3>
              <p className="text-gray-600">Arrange, Organize, and simplify Apartment life for Filipino students.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trending</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div>
                    <p className="font-medium">3 Bedrooms / 2 bathroom Condo</p>
                    <p className="text-sm text-gray-600">Quezon City</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div>
                    <p className="font-medium">2 Bedroom / 1 Bathroom apartment</p>
                    <p className="text-sm text-gray-600">Alabang</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span>aosapartment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span>@aosapartment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span>09212044720</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600" />
                  <span>aoscontact@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-6">
          <p className="text-gray-600 text-center">&copy; 2024 AOS. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border overflow-hidden absolute bottom-20 right-0">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">AOS AI Assistant</span>
              </div>
              <button
              onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white text-2xl hover:text-gray-200"
            aria-label="Close chat">
              ×
              </button>
              </div>
            
            <div ref={chatBoxRef} className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Hi! I'm here to help you find the perfect place to stay. What are you looking for?
                </div>
              )}
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
export default LandingPage;           
