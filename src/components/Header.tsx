
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
    <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-2 mt-4 px-2 py-2 sm:mx-4 sm:px-6 sm:py-3">
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <img
            src="/logo.png"
            alt="VINSTOCKS Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
            onError={(e) => {
              // Fallback to placeholder if logo doesn't exist
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="flex flex-col items-end leading-tight">
            <span className="text-lg sm:text-xl font-bold text-white">VINSTOCKS</span>
            <span className="text-xs sm:text-sm font-semibold text-orange-400 font-serif tracking-wide">WEALTH</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {/* <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">
            About Us
          </a> */}
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

        <div className="flex items-center space-x-2 sm:mt-0">
          {/* <Button variant="ghost" onClick={handleAuthAction} className="text-white hover:bg-white/10">
            {user ? 'Sign Out' : 'Login'}
          </Button> */}
          <Button onClick={handleGetStarted} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
            {user ? 'Dashboard' : 'Get Started'}
          </Button>
          <a
            href="https://wa.me/917977524553"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 rounded-md bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold transition-colors duration-200 shadow-sm min-w-[44px] justify-center"
            style={{ gap: '0.5rem', border: "1px solid rgb(37 211 102)" }}
            aria-label="Contact on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
              className=""
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.111 6.479 6.58 2.007 12.149 2c2.637.003 5.112 1.027 6.988 2.901A9.822 9.822 0 0122.3 12.07c-.003 5.568-4.474 10.039-10.249 9.929zm8.413-18.342A11.815 11.815 0 0012.145 0C5.453.007.007 5.459 0 12.153a11.82 11.82 0 001.624 6.021L0 24l6.313-1.684a11.87 11.87 0 005.822 1.479h.005c6.691 0 12.139-5.453 12.149-12.146a11.82 11.82 0 00-3.404-8.293z" />
            </svg>
            <span className="hidden sm:inline text-sm">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
