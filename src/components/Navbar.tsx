import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

interface NavbarProps {
  isPreIPOPage?: boolean;
}

const Navbar = ({ isPreIPOPage = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const servicesItems = [
    { name: "Pre-IPO", href: "/pre-ipo" },
    { name: "Investment Advisory", href: "#pricing" },
  ];

  const navLinks = isPreIPOPage
    ? [
        { name: "Home", href: "/" },
      ]
    : [
        { name: "About Us", href: "#about" },
        { name: "Contact", href: "#contact" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Vinstocks" className="w-9 h-9 md:w-10 md:h-10 rounded-lg" />
            <div className="relative">
              <span className="text-lg md:text-xl font-bold">
                <span className="text-primary">VIN</span>
                <span className="text-secondary">STOCKS</span>
              </span>
              <span className="absolute -bottom-1 right-0 text-[8px] md:text-[10px] font-semibold text-muted-foreground tracking-wider text-primary" style={{bottom: '-0.45rem'}}>
                WEALTH
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            {!isPreIPOPage && (
              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1">
                  Services
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="absolute top-full left-0 pt-2 w-48 z-50">
                    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                      {servicesItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors font-medium"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href={isPreIPOPage ? "/#pricing" : "#pricing"}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
            {/* Services Dropdown Mobile */}
            {!isPreIPOPage && (
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Services
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 border-l-2 border-border">
                    {servicesItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                        onClick={() => {
                          setIsOpen(false);
                          setIsServicesOpen(false);
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href={isPreIPOPage ? "/#pricing" : "#pricing"}
              className="block mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-center"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
