const CoinStack = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45, 93%, 65%)" />
          <stop offset="50%" stopColor="hsl(38, 92%, 55%)" />
          <stop offset="100%" stopColor="hsl(35, 85%, 45%)" />
        </linearGradient>
        <linearGradient id="coinTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(174, 65%, 55%)" />
          <stop offset="100%" stopColor="hsl(174, 65%, 35%)" />
        </linearGradient>
      </defs>
      
      {/* Bottom coin */}
      <ellipse cx="40" cy="88" rx="35" ry="10" fill="hsl(35, 85%, 40%)" />
      <ellipse cx="40" cy="85" rx="35" ry="10" fill="url(#coinGold)" />
      
      {/* Second coin */}
      <ellipse cx="40" cy="73" rx="35" ry="10" fill="hsl(35, 85%, 40%)" />
      <ellipse cx="40" cy="70" rx="35" ry="10" fill="url(#coinGold)" />
      
      {/* Third coin */}
      <ellipse cx="40" cy="58" rx="35" ry="10" fill="hsl(35, 85%, 40%)" />
      <ellipse cx="40" cy="55" rx="35" ry="10" fill="url(#coinGold)" />
      
      {/* Fourth coin (teal) */}
      <ellipse cx="40" cy="43" rx="35" ry="10" fill="hsl(174, 65%, 30%)" />
      <ellipse cx="40" cy="40" rx="35" ry="10" fill="url(#coinTeal)" />
      
      {/* Top coin (teal) */}
      <ellipse cx="40" cy="28" rx="35" ry="10" fill="hsl(174, 65%, 30%)" />
      <ellipse cx="40" cy="25" rx="35" ry="10" fill="url(#coinTeal)" />
      
      {/* Rupee symbol on top coin */}
      <text
        x="40"
        y="30"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="white"
      >
        ₹
      </text>
    </svg>
  );
};

export default CoinStack;
