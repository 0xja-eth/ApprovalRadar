export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Radar circles */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradient1)"
        strokeWidth="2"
        opacity="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="url(#gradient1)"
        strokeWidth="2"
        opacity="0.5"
      />
      <circle
        cx="50"
        cy="50"
        r="25"
        stroke="url(#gradient1)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill="url(#gradient2)" />

      {/* Radar sweep line */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="10"
        stroke="url(#gradient2)"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </line>

      {/* Approval checkmark */}
      <path
        d="M 35 50 L 45 60 L 65 35"
        stroke="url(#gradient2)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
    </svg>
  );
}
