
const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-white/10" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="VINSTOCKS Logo" 
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  // Fallback to placeholder if logo doesn't exist
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <span className="text-xl font-bold text-white">VINSTOCKS</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
                <span className="text-cyan-400">An investment advisory product for</span>
                <br />
                <span className="gradient-text">the millennials and gen-zers of our</span>
                <br />
                <span className="text-orange-400">country.</span>
              </h3>
              
              <p className="text-gray-400 max-w-lg">
                Vinstocks aims to simplify the trading and investment journey for 
                new generations of investors in Indian equity market using 
                technology.
              </p>
              
              <p className="text-gray-500 text-sm">
                SEBI Registered Research Analyst - INH000010876
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQs
              </a>
              <a href="#charter" className="block text-gray-300 hover:text-white transition-colors">
                Investor Charter
              </a>
              <a href="#grievance" className="block text-gray-300 hover:text-white transition-colors">
                Grievance Redressal
              </a>
              <a href="#disclaimer" className="block text-gray-300 hover:text-white transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
          
          {/* Contact & App Download */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@waya.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Mumbai, Maharashtra</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Download the app</h4>
              <div className="flex space-x-3">
                <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-white text-sm">Google Play</span>
                </div>
                <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-white text-sm">App Store</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm mb-2">Follow us on</p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                  <span className="text-white text-sm">IG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              Data Powered by CMOTS INFOTECH - ISO Certified<br />
              9001:2015 www.cmots.com
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Waya. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
