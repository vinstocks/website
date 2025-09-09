
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
              
              {/* <p className="text-gray-500 text-sm">
                SEBI Registered Research Analyst - INH000010876
              </p> */}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            {/* <div className="space-y-4">
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
            </div> */}
          </div>
          
          {/* Contact & App Download */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: vinstocks.help@gmail.com</p>
                <p>Phone: +91 7977524553</p>
                <p>Address: Mumbai, Maharashtra</p>
                <a
            href="https://wa.me/917977524553"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold transition-colors duration-200 shadow-sm"
            style={{ gap: '0.5rem' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="mr-1"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.111 6.479 6.58 2.007 12.149 2c2.637.003 5.112 1.027 6.988 2.901A9.822 9.822 0 0122.3 12.07c-.003 5.568-4.474 10.039-10.249 9.929zm8.413-18.342A11.815 11.815 0 0012.145 0C5.453.007.007 5.459 0 12.153a11.82 11.82 0 001.624 6.021L0 24l6.313-1.684a11.87 11.87 0 005.822 1.479h.005c6.691 0 12.139-5.453 12.149-12.146a11.82 11.82 0 00-3.404-8.293z"/>
            </svg>
            WhatsApp
          </a>
              </div>
            </div>
            
            {/* <div>
              <h4 className="text-white font-semibold mb-4">Download the app</h4>
              <div className="flex space-x-3">
                <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-white text-sm">Google Play</span>
                </div>
                <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-white text-sm">App Store</span>
                </div>
              </div>
            </div> */}
            
            <div>
              <p className="text-gray-400 text-sm mb-2">Follow us on</p>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com/vinstockss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 rounded-lg px-3 py-2 flex items-center space-x-1 cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  <img src="/insta.svg" alt="Instagram" width={18} height={18} className="inline-block" />
                  <span className="text-white text-sm">vinstockss</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* <p className="text-gray-500 text-sm">
              Data Powered by CMOTS INFOTECH - ISO Certified<br />
              9001:2015 www.cmots.com
            </p> */}
            <p className="text-gray-500 text-sm">
              © 2025 Vinstocks. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
