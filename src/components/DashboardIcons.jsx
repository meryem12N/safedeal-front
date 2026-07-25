export function IconDashboard(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

export function IconBox(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 8l9-5 9 5-9 5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 13v8" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

export function IconReport(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 4.5c1.7.4 3 2 3 3.8 0 1.9-1.3 3.4-3 3.8M18.5 14.3c2.3.6 4 2.8 4 5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconSettings(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" {...props}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWallet(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Bord supérieur, légèrement incurvé aux extrémités */}
      <path d="M4 8.5c0-1.1.9-2 2-2h11.5c.83 0 1.5.67 1.5 1.5V9" />

      {/* Poche principale : grand rectangle aux coins très arrondis */}
      <rect x="2.5" y="8.5" width="19" height="12.5" rx="4" />

      {/* Rabat superposé sur le côté droit */}
      <path d="M15.5 13.2h4c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-4a2.5 2.5 0 0 1 0-5Z" />

      {/* Bouton magnétique au centre du rabat */}
      <circle cx="17.7" cy="15.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconGame(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M6 9h4M8 7v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="16.5" cy="8.5" r="0.9" fill="currentColor"/>
      <circle cx="18.5" cy="10.5" r="0.9" fill="currentColor"/>
      <path d="M6.5 7h11a4 4 0 013.9 4.9l-.9 3.7a3 3 0 01-5.4 1L14 15H10l-1.1 1.6a3 3 0 01-5.4-1l-.9-3.7A4 4 0 016.5 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconBag(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M6 8h12l1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L6 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWatch(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 9v3l2 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 4h6M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconMore(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 11l9-8 9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconDollar(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.66-2-2.5-4.5-2.5s-4.5 1-4.5 3 2 2.7 4.5 3 4.5 1.34 4.5 3-2 3-4.5 3-4.5-.84-4.5-2.5" />
    </svg>
  );
}

export function IconArrowTrendUp(props) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" {...props}>
      <path d="M4 16l6-6 4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 6h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconStarFilled(props) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="#E8C572" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
    </svg>
  );
}

export function IconChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconDispute(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 2L2 20h20L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.9" fill="currentColor"/>
    </svg>
  );
}

export function IconProfile(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2.5 4 5.5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10v-6L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconTruck(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="6" width="13" height="10" rx="1" />
      <path d="M14 9h4l3 3v4h-7V9Z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}

export function IconPackageBox(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}