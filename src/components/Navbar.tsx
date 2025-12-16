import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

interface NavbarProps {
  isPreIPOPage?: boolean;
}

const Navbar = ({ isPreIPOPage = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = isPreIPOPage
    ? [
        { name: "Home", href: "/" },
      ]
    : [
        { name: "Pre IPO", href: "/pre-ipo" },
        { name: "Services", href: "#pricing" },
        // { name: "Investment Advisory", href: "#pricing" },
        { name: "About Us", href: "#about" },
        { name: "Contact", href: "#contact" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Vinstocks" className="w-10 h-10 md:w-12 md:h-12 rounded-lg" />
            <div className="relative">
              <span className="text-xl md:text-2xl font-bold">
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
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity"
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
