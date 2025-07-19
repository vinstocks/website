
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-white">Waya</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.email}</span>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="gradient-text">Coming Soon</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              We're working on something amazing. Your trading insights and AI-powered predictions will be available here soon.
            </p>
          </div>
          
          <div className="neomorphic-card p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">What's Next?</h2>
            <ul className="text-gray-300 space-y-2 text-left">
              <li>• AI-powered market predictions</li>
              <li>• Real-time trading signals</li>
              <li>• Portfolio analytics</li>
              <li>• Risk assessment tools</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
