
import { TrendingUp, DollarSign, FileText, BarChart3 } from 'lucide-react';

const WhatYouGetSection = () => {
  const services = [
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
      title: "Short term calls",
      description: "We give calls with hold period ranging from ~2 days to ~45 days",
      bgColor: "bg-purple-100/10",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <DollarSign className="w-12 h-12 text-teal-500" />,
      title: "Multibagger Portfolio",
      description: "Curated portfolio with potential 3x-10x returns within duration of 30 months",
      bgColor: "bg-teal-100/10",
      borderColor: "border-teal-500/30"
    },
    {
      icon: <FileText className="w-12 h-12 text-blue-500" />,
      title: "Portfolio Review",
      description: "Suggestions for restructuring, diversification, or consolidatio",
      bgColor: "bg-blue-100/10",
      borderColor: "border-blue-500/30"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What You Get?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`${service.bgColor} ${service.borderColor} border neomorphic-card p-8 text-center animate-fade-in hover:scale-105 transition-transform duration-300`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {service.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
