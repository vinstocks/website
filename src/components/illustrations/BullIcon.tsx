const BullIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(38, 92%, 55%)" />
          <stop offset="100%" stopColor="hsl(174, 65%, 42%)" />
        </linearGradient>
      </defs>
      {/* Bull head silhouette */}
      <path
        d="M15 40 Q10 30 5 25 Q15 28 20 35 L25 40 Q30 35 40 33 Q50 31 60 33 Q70 35 75 40 L80 35 Q85 28 95 25 Q90 30 85 40 Q88 50 85 60 Q80 75 65 82 Q50 88 35 82 Q20 75 15 60 Q12 50 15 40Z"
        fill="url(#bullGradient)"
        opacity="0.9"
      />
      {/* Horns */}
      <path
        d="M5 25 Q8 15 20 10 Q15 20 20 35"
        stroke="url(#bullGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M95 25 Q92 15 80 10 Q85 20 80 35"
        stroke="url(#bullGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eyes */}
      <circle cx="35" cy="50" r="4" fill="white" />
      <circle cx="65" cy="50" r="4" fill="white" />
      {/* Nostrils */}
      <circle cx="42" cy="68" r="3" fill="hsl(38, 50%, 40%)" opacity="0.5" />
      <circle cx="58" cy="68" r="3" fill="hsl(38, 50%, 40%)" opacity="0.5" />
    </svg>
  );
};

export default BullIcon;
