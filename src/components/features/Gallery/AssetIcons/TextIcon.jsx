export default function TextIcon() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paper */}
      <path
        d="M16 4H38L52 18V58C52 60.2 50.2 62 48 62H16C13.8 62 12 60.2 12 58V8C12 5.8 13.8 4 16 4Z"
        fill="#F8F9FA"
        stroke="#6B7280"
        strokeWidth="2"
      />

      {/* Fold */}
      <path d="M38 4V18H52" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" />

      {/* PDF Badge */}
      <rect x="16" y="38" width="32" height="14" rx="3" fill="blue" />

      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        TXT
      </text>

      {/* Decorative lines */}
      <rect x="18" y="24" width="28" height="2.5" rx="1.25" fill="#C4C4C4" />
      <rect x="18" y="29" width="22" height="2.5" rx="1.25" fill="#C4C4C4" />
    </svg>
  );
}
