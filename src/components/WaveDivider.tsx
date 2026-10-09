type Props = { className?: string; fill?: string; flip?: boolean };

export default function WaveDivider({ className, fill = "var(--color-surface)", flip }: Props) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 30c100-22 200-22 300 0s200 22 300 0 200-22 300 0 200 22 300 0v30H0z"
        fill={fill}
      />
    </svg>
  );
}
