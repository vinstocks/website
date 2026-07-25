import { Mail, Phone, MapPin, Instagram, ExternalLink, Shield } from "lucide-react";
import WhatsAppIcon from "@/assets/WhatsAppIcon";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-muted/30 relative overflow-hidden">
      {/* Main footer */}
      <div className="container mx-auto px-4 relative z-10 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Vinstocks" className="w-12 h-12 rounded-lg" />
              <div className="relative">
                <span className="text-2xl font-bold">
                  <span className="text-primary">VIN</span>
                  <span className="text-secondary">STOCKS</span>
                </span>
                <span className="absolute -bottom-1 right-0 text-[8px] md:text-[10px] font-semibold text-muted-foreground tracking-wider text-primary" style={{bottom: '-0.45rem'}}>
                  WEALTH
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
              A SEBI-registered investment advisory firm offering research-backed equity strategies for high-net-worth individuals.
              We deliver personalised portfolio management aligned with your financial goals, risk appetite, and long-term wealth creation vision.
            </p>
            <div className="space-y-1.5 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">Registered & Verified</span>
              </div>
              <p className="text-sm">
                <span className="font-semibold text-teal-600">SEBI RIA :</span>{" "}
                <span className="text-muted-foreground font-medium">INA000021766</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-teal-600">BASL :</span>{" "}
                <span className="text-muted-foreground font-medium">2429</span>
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:vinstocks.help@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  vinstocks.help@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917977524553"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  +91 7977524553
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                504 Edge, Runwal Gardens, Thane, Mumbai, Maharashtra
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-5">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/vinstockss"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/917977524553"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-success hover:text-white hover:border-success transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>

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
      </div>

      {/* SEBI Office + Disclaimer band */}
      <div className="bg-card/60 border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* SEBI Office Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-teal-600" />
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">SEBI Office Details</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SEBI Bhavan BKC, Plot No.C4-A, 'G' Block, Bandra-Kurla Complex,
                Bandra (East), Mumbai - 400051, Maharashtra, India
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Tel: +91-22-26449000 / 40459000
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <a
                  href="https://scores.sebi.gov.in/scores-home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-500 transition-colors px-2.5 py-1 rounded-md bg-teal-600/5 border border-teal-600/10"
                >
                  SEBI SCORES
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://smartodr.in/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-500 transition-colors px-2.5 py-1 rounded-md bg-teal-600/5 border border-teal-600/10"
                >
                  SMARTODR
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-amber-500" />
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">Disclaimer</p>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                Registration granted by SEBI, enlistment as IA with Exchange, and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.
                The company does not guarantee or provide any assurance of return, fixed returns, or risk-free return. Investments in the securities are subject to market risks. Read all the related documents carefully before investing.
                Past performance may or may not be sustained in the future, and there is no guarantee of future results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 text-center text-muted-foreground text-sm">
          © 2025-2026 Vinstocks. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
