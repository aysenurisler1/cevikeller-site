type Props = {
  className?: string;
  color?: string;
  size?: number;
};

// Dekoratif bulanık daire — bölümlere derinlik ve "su/güneş" hissi katmak için.
export default function Blob({ className = "", color = "var(--color-aqua)", size = 340 }: Props) {
  return (
    <div
      aria-hidden
      className={`blob ${className}`}
      style={{ width: size, height: size, background: color }}
    />
  );
}