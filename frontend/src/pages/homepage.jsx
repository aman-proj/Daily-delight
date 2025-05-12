import React from 'react';
import { Camera, Users, Globe, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LandingPage = () => {

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-500 min-h-screen text-white">
      {/* Navigation */}
      <nav className="bg-transparent p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold">DailyDelight</div>
          <div className="space-x-4">
            <Link to={"/login"}><button className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-opacity-90 transition">Log In</button></Link>
            <Link to={"/signup"} ><button className="bg-transparent border-2 border-white px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition">Sign Up</button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Share Your Moments with the World</h1>
        <p className="text-xl mb-10">Join millions of users and start sharing your photos and stories today!</p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition">Get Started for Free</button>
      </header>

      {/* Features Section */}
      <section className=" text-gray-800 text-white bg-slate-700 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose DailyDelight?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Camera />}
              title="Share Photos"
              description="Upload and share your best moments with friends and followers."
            />
            <FeatureCard 
              icon={<Users />}
              title="Connect"
              description="Follow friends, family, and interesting people from around the world."
            />
            <FeatureCard 
              icon={<Globe />}
              title="Explore"
              description="Discover new content and trending topics tailored to your interests."
            />
            <FeatureCard 
              icon={<MessageCircle />}
              title="Engage"
              description="Like, comment, and share posts to interact with your community."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl mb-10">Sign up now and start sharing your world with others!</p>
          <Link to={"/signup"}><button className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition">Create Your Account</button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DailyDelight. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="hover:underline mx-2">About</a>
            <a href="#" className="hover:underline mx-2">Privacy</a>
            <a href="#" className="hover:underline mx-2">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-slate-500 text-white p-6 rounded-lg text-center">
    <div className="text-purple-600 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default LandingPage;