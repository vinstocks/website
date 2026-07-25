import { MessageCircle, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const CTABanner = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10" />

      <div
        ref={ref}
        className={`container mx-auto px-4 relative z-10 reveal ${isVisible ? "visible" : ""}`}
      >
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-card to-background border border-border p-12 md:p-16 shadow-xl relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 heading-serif relative">
            Have Questions?{" "}
            <span className="text-gradient">Let's Talk</span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 relative">
            Our research team is here to understand your goals and craft a
            strategy that fits. No obligations, just a conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <a
              href="https://wa.me/917977524553?text=Hello%20Vinstocks%2C%20I%20would%20like%20to%20connect%20with%20your%20team%20to%20discuss%20investment%20opportunities."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:opacity-90 transition-all glow-primary"
            >
              <MessageCircle className="w-5 h-5" />
              Interact with Our Team
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold text-lg hover:bg-primary hover:text-white transition-all"
            >
              <Users className="w-5 h-5" />
              View Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
