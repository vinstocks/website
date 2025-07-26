
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center space-x-3">

<img 

  src="/logo.png" 

  alt="VINSTOCKS Logo" 

  className="w-14 h-14 object-contain"

  onError={(e) => {

    // Fallback to placeholder if logo doesn't exist

    e.currentTarget.src = "/placeholder.svg";

  }}

/>

<div className="flex flex-col items-end leading-tight">
    <span className="text-xl font-bold text-white">VINSTOCKS</span>
    <span className="text-sm font-semibold text-orange-400 font-serif tracking-wide">WEALTH</span>
  </div>





</div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">
            About Us
          </a>
          <a href="#services" className="text-gray-300 hover:text-white transition-colors duration-300">
            Services
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
            Pricing
          </a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          {/* <Button variant="ghost" onClick={handleAuthAction} className="text-white hover:bg-white/10">
            {user ? 'Sign Out' : 'Login'}
          </Button> */}
          <Button onClick={handleGetStarted} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
            {user ? 'Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
