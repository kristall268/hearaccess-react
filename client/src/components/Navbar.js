import { useState, useCallback } from 'react';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const close = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <nav className="site-nav">
        <a href="#home" className="nav-logo">Her<span>Access</span></a>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#partnerships">Partners</a></li>
          <li><a href="#volunteers">Volunteers</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button
          className={`nav-hamburger${drawerOpen ? ' open' : ''}`}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        <ul>
          {['home', 'team', 'partnerships', 'volunteers', 'contact'].map(s => (
            <li key={s}>
              <a href={`#${s}`} onClick={close}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
