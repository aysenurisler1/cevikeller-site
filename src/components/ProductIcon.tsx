type IconProps = { className?: string };

// Basit, çizgisel ikonlar — gerçek ürün fotoğrafları eklenene kadar placeholder olarak kullanılıyor.
export function DrumIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="12" y="10" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="2" />
      <rect x="19" y="4" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function RobotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="8" y="14" width="32" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="14" x2="24" y2="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="38" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="34" cy="38" r="4" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SaltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 6l8 8-8 8-8-8 8-8z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 26l6 6-6 6-6-6 6-6z" stroke="currentColor" strokeWidth="2" />
      <path d="M34 26l6 6-6 6-6-6 6-6z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function LampIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="2" x2="24" y2="7" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="43" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
      <path d="M16 34c0 5 4 8 8 8s8-3 8-8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function PumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" />
      <rect x="0" y="20" width="10" height="8" stroke="currentColor" strokeWidth="2" />
      <rect x="38" y="20" width="10" height="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}

export function EquipmentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="20" width="36" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M16 20v-4a8 8 0 0 1 16 0v4" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export const ICONS_BY_SLUG: Record<string, (props: IconProps) => React.ReactElement> = {
  "havuz-kimyasallari": DrumIcon,
  "havuz-temizleme-robotu": RobotIcon,
  "tuzlu-havuz-sistemleri": SaltIcon,
  "havuz-aydinlatma": LampIcon,
  "havuz-pompalari": PumpIcon,
  "havuz-ekipmanlari": EquipmentIcon,
};