const ChartArrow = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(38, 92%, 55%)" />
          <stop offset="100%" stopColor="hsl(142, 71%, 45%)" />
        </linearGradient>
      </defs>
      {/* Rising chart path */}
      <path
        d="M10 70 Q30 65 40 55 Q55 40 70 45 Q85 50 95 25"
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head */}
      <path
        d="M90 35 L95 25 L105 30"
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dots on the path */}
      <circle cx="40" cy="55" r="4" fill="hsl(38, 92%, 55%)" />
      <circle cx="70" cy="45" r="4" fill="hsl(174, 65%, 42%)" />
      <circle cx="95" cy="25" r="5" fill="hsl(142, 71%, 45%)" />
    </svg>
  );
};

export default ChartArrow;
