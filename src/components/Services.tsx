import { Zap, Gem, FileSearch } from "lucide-react";
import ChartArrow from "./illustrations/ChartArrow";

const services = [
  {
    icon: Zap,
    title: "Mid-term recommendations",
    description: "We recommend stocks with holding period ranging from 3 to 8 Months",
    gradient: "from-primary to-amber-400",
  },
  {
    icon: Gem,
    title: "Multibagger Portfolio",
    description: "Curated portfolio with potential 3x-10x returns within duration of 3 to 5 years",
    gradient: "from-secondary to-cyan-400",
  },
  {
    icon: FileSearch,
    title: "Portfolio Review",
    description: "Suggestions for restructuring, diversification, or consolidation",
    gradient: "from-success to-emerald-400",
  },
];

const Services = () => {
  return (
    <section className="py-24 relative bg-muted/30">
      {/* Decorative element */}
      <div className="absolute left-10 bottom-20 hidden xl:block opacity-30 rotate-12">
        <ChartArrow className="w-40 h-28" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What will you <span className="text-gradient">Get?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive investment solutions tailored for the modern investor
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative overflow-hidden"
            >
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 h-full shadow-sm">
                {/* Animated gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
