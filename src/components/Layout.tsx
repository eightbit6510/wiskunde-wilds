import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Kaart', icon: '🗺️' },
  { to: '/train', label: 'Trainen', icon: '🐾' },
  { to: '/skills', label: 'Mijn skills', icon: '🌿' },
  { to: '/badges', label: 'Badges', icon: '⭐' },
  { to: '/settings', label: 'Instellingen', icon: '🌙' },
];

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#1E3328" />
      <path
        d="M32 14c-3 6-8 10-12 12 4 2 8 8 10 14 2-6 6-12 10-14-4-2-9-6-8-12z"
        fill="#C9A86A"
      />
      <path
        d="M22 28c-2 1-4 4-4 6M42 28c2 1 4 4 4 6M28 42c1 2 3 3 4 3s3-1 4-3"
        stroke="#E8DFD0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <text x="38" y="22" fontSize="13" fill="#B8A4D4" fontFamily="serif">
        ∑
      </text>
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Hoofdnavigatie">
        <NavLink to="/" className="brand">
          <Logo />
          <span className="brand-text">
            <span className="brand-title">Wiskunde Wilds</span>
            <span className="brand-sub">Level up naar VWO 3</span>
          </span>
        </NavLink>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="mobile-nav" aria-label="Mobiele navigatie">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <span className="nav-ico" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
