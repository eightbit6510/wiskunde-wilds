import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import vosNeutraal from '../assets/mascots/vos-neutraal.png';
import { SketchIcon } from './SketchIcon';

const navItems = [
  { to: '/', label: 'Kaart', icon: 'explore' as const },
  { to: '/train', label: 'Trainen', icon: 'tracks' as const },
  { to: '/skills', label: 'Mijn skills', icon: 'leaf' as const },
  { to: '/badges', label: 'Badges', icon: 'star' as const },
  { to: '/settings', label: 'Instellingen', icon: 'measure' as const },
];

function Logo() {
  return (
    <img
      className="brand-logo"
      src={vosNeutraal}
      width={44}
      height={44}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
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
            <span className="brand-sub">Leeravontuur in het bos</span>
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
                <SketchIcon name={item.icon} size={22} />
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
              <SketchIcon name={item.icon} size={20} />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
