// Landing page component
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold text-gray-900">Menantikan</span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">
            Templates
          </Link>
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Create Beautiful
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {' '}Digital Invitations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Design, customize, and share meaningful digital invitations with dynamic templates, 
            real-time RSVP tracking, and interactive guestbooks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/templates">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for perfect invitations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From design to guest management, we&apos;ve got you covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Templates</h3>
            <p className="text-gray-600">
              Choose from professionally designed templates or create your own unique style
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time RSVP</h3>
            <p className="text-gray-600">
              Track responses instantly with our built-in RSVP system and guest management
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Features</h3>
            <p className="text-gray-600">
              Add guestbooks, photo galleries, and countdown timers to engage your guests
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to create your invitation?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have created memorable experiences with Menantikan
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">Menantikan</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 Menantikan. Creating meaningful connections through beautiful invitations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;