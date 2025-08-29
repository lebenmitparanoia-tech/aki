type IconProps = { name: string; size?: number; className?: string }
export default function Icon({ name, size=20, className='' }: IconProps){
  const stroke = 'currentColor'
  const strokeWidth = 2
  const s = { width: size, height: size }
  switch(name){
    case 'info': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12.01" y2="8"/><path d="M11 12h1v4h1"/></svg>)
    case 'notebook': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h10"/><path d="M16 3h2a2 2 0 0 1 2 2v16l-6-3l-6 3V5"/><path d="M8 7h8"/></svg>)
    case 'bell': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 8H3c0-3 3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>)
    case 'checklist': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M5 6l1 1l2-2"/><path d="M5 12l1 1l2-2"/><path d="M5 18l1 1l2-2"/></svg>)
    case 'shield': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9c-4.5-1-8-4-8-9V7l8-4z"/></svg>)
    case 'lock': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>)
    case 'users': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>)
    case 'sparkle': return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l3 6l6 3l-6 3l-3 6l-3-6l-6-3l6-3z"/></svg>)
    default: return (<svg viewBox="0 0 24 24" style={s} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth}><circle cx="12" cy="12" r="9"/></svg>)
  }
}
