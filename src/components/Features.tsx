import { Brain, BarChart3, Clock } from "lucide-react";
import BullIcon from "./illustrations/BullIcon";

const features = [
  {
    icon: Brain,
    title: "Predictive Model",
    description: "Advanced algorithms that analyze market patterns and predict optimal entry/exit points.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Fundamentally Strong Stocks",
    description: "We only recommend stocks with solid fundamentals, reducing risk and maximizing potential.",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Years of Back-Tested Algos",
    description: "Our strategies are rigorously tested against years of historical data for proven reliability.",
    color: "success",
  },
];

const Features = () => {
  return (
    <section id="services" className="py-24 relative">
      {/* Decorative bull icon */}
      {/* <div className="absolute right-10 top-10 hidden xl:block opacity-20">
        <BullIcon className="w-48 h-48" />
      </div> */}
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How we <span className="text-gradient">do?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our data-driven approach combines cutting-edge technology with fundamental analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  feature.color === "primary"
                    ? "bg-primary/15 text-primary"
                    : feature.color === "secondary"
                    ? "bg-secondary/15 text-secondary"
                    : "bg-success/15 text-success"
                }`}
              >
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
