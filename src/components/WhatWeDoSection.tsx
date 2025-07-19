
const WhatWeDoSection = () => {
  return (
    <section className="py-20 px-4" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How we do?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Card 1 */}
          <div className="gradient-border neomorphic-card p-8 text-center animate-fade-in">
            <div className="gradient-border-content">
              <h3 className="text-2xl font-bold text-white mb-4">
                Predictive
                <br />
                Model
              </h3>
            </div>
          </div>
          
          {/* Connector 1 */}
          {/* <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
              <span className="text-cyan-400 font-semibold">on</span>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
            </div>
          </div> */}
          
          {/* Card 2 */}
          <div className="gradient-border neomorphic-card p-8 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="gradient-border-content">
              <h3 className="text-2xl font-bold text-white mb-4">
                Fundamentally
                <br />
                Strong Stocks
              </h3>
            </div>
          </div>
          
          {/* Mobile Connector */}
          {/* <div className="md:hidden flex items-center justify-center py-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
              <span className="text-purple-400 font-semibold">with</span>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
            </div>
          </div> */}
          
          {/* Connector 2 */}
          {/* <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
              <span className="text-purple-400 font-semibold">with</span>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
            </div>
          </div> */}
          
          {/* Card 3 */}
          <div className="gradient-border neomorphic-card p-8 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="gradient-border-content">
              <h3 className="text-2xl font-bold text-white mb-4">
                Years of
                <br />
                Back-Tested Algos
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
