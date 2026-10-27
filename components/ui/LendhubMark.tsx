export default function LendhubMark({ className = '' }: { className?: string }) {
  return (
    <span
      aria-label="lendhub"
      className={`inline-flex items-baseline font-bold leading-none tracking-[-0.05em] text-star ${className}`}
      style={{ fontFamily: 'var(--font-lendhub)' }}
    >
      lendhub<span style={{ color: '#4ade80' }}>.</span>
    </span>
  );
}
