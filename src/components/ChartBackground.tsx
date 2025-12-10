const ChartBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/8 rounded-full blur-2xl animate-pulse-glow animation-delay-200" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-32 left-20 w-24 h-24 border-2 border-secondary/20 rounded-lg rotate-45 animate-bounce-slow" />
      <div className="absolute top-1/3 left-10 w-16 h-16 bg-primary/10 rounded-lg rotate-12 animate-float" />
      
      {/* SVG Chart lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(38, 92%, 55%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(38, 92%, 55%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(38, 92%, 55%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartTeal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(174, 65%, 42%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(174, 65%, 42%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(174, 65%, 42%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Green chart line */}
        <path
          d="M0,400 Q100,350 200,380 T400,320 T600,360 T800,280 T1000,320 T1200,260 T1400,300"
          fill="none"
          stroke="url(#chartGreen)"
          strokeWidth="2"
          className="animate-chart-line"
          strokeDasharray="1000"
        />
        
        {/* Orange chart line */}
        <path
          d="M0,500 Q150,520 300,480 T600,520 T900,460 T1200,500 T1500,440"
          fill="none"
          stroke="url(#chartOrange)"
          strokeWidth="1.5"
          className="animate-chart-line animation-delay-200"
          strokeDasharray="1000"
        />

        {/* Teal chart line */}
        <path
          d="M0,600 Q200,580 400,620 T800,560 T1200,600 T1600,520"
          fill="none"
          stroke="url(#chartTeal)"
          strokeWidth="1.5"
          className="animate-chart-line animation-delay-400"
          strokeDasharray="1000"
        />
      </svg>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating dots decoration */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary/40 rounded-full animate-bounce-slow" />
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-secondary/30 rounded-full animate-bounce-slow animation-delay-200" />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-success/40 rounded-full animate-bounce-slow animation-delay-400" />
    </div>
  );
};

export default ChartBackground;