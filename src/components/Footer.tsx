import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import WhatsAppIcon from "@/assets/WhatsAppIcon";
import BullIcon from "./illustrations/BullIcon";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="py-16 border-t border-border bg-muted/30 relative overflow-hidden">
      {/* Decorative bull */}
      {/* <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
        <BullIcon className="w-64 h-64" />
      </div> */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Vinstocks" className="w-12 h-12 rounded-lg" />
              <span className="text-2xl font-bold">
                <span className="text-primary">VIN</span>
                <span className="text-secondary">STOCKS</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              An investment advisory service designed for ambitious retailers seeking expert guidance in the Indian equity market. Benefit from a personalized investment roadmap engineered to align with your capital goals and risk profile.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:vinstocks.help@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  vinstocks.help@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917977524553"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +91 7977524553
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                Mumbai, Maharashtra
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/vinstockss"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/917977524553"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-success hover:text-white hover:border-success transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
            
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917977524553"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-success text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          © 2025 Vinstocks. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
