// lucide-react (v1+) dropped brand/logo icons (Facebook, Instagram, Twitter,
// Linkedin, Youtube) for trademark reasons. These are small hand-drawn
// stand-ins, sized/styled to match lucide's icon props (size, className).
interface IconProps {
  size?: number
  className?: string
}

export const Facebook = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.5v-2.88h2.5V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.88h-2.32v6.99A10 10 0 0 0 22 12z" />
  </svg>
)

export const Instagram = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export const Twitter = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
)

export const Linkedin = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.6v1.64h.05c.5-.95 1.73-1.95 3.56-1.95 3.81 0 4.51 2.5 4.51 5.76V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9z" />
  </svg>
)

export const Youtube = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="4" fill="none" stroke="currentColor" strokeWidth={2} />
    <polygon points="10,9 16,12 10,15" fill="currentColor" />
  </svg>
)
