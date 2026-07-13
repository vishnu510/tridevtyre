import React from 'react';

export default function Header({ currentView, setView, theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section" onClick={() => setView('home')}>
            <div className="logo-icon">◎</div>
            <div className="logo-text">TRIDEV TYRE</div>
          </div>
          
          <nav className="nav-links">
            <a
              href="#home"
              className={`nav-item ${currentView === 'home' || currentView === 'detail' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setView('home');
              }}
            >
              Tyre Catalog
            </a>
            <a
              href="#about"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setView('home');
                setTimeout(() => {
                  document.getElementById('brand-info')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Why Us
            </a>
            <a
              href="#contact"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                setView('home');
                setTimeout(() => {
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Contact
            </a>
          </nav>

          <div className="header-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {currentView === 'admin-dashboard' ? (
              <button 
                className="admin-login-link" 
                onClick={() => setView('home')}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                ◀ Back to Shop
              </button>
            ) : (
              <button className="admin-login-link" onClick={() => setView('admin-login')}>
                ⚙ Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
