import React from 'react';

export default function Footer({ setView }) {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo-section" onClick={() => setView('home')} style={{ marginBottom: '16px' }}>
              <div className="logo-icon">◎</div>
              <div className="logo-text">TRIDEV TYRE</div>
            </div>
            <p className="footer-brand-desc">
              Your trusted partner for high-performance tyres. Catering to all your highway, track, and off-road journeys with industry-leading brands.
            </p>
          </div>
          
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); setView('home'); }}>Tyre Finder</a></li>
              <li><a href="#catalog" onClick={(e) => { e.preventDefault(); setView('home'); }}>All Products</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); setView('home'); setTimeout(() => document.getElementById('brand-info')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Brand Comparison</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); setView('admin-login'); }}>Admin Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-col-title">Our Brands</h4>
            <ul className="footer-links">
              <li><a href="#mrf" onClick={(e) => { e.preventDefault(); setView('home'); }}>MRF Tyres</a></li>
              <li><a href="#apollo" onClick={(e) => { e.preventDefault(); setView('home'); }}>Apollo Tyres</a></li>
              <li><a href="#ceat" onClick={(e) => { e.preventDefault(); setView('home'); }}>CEAT Tyres</a></li>
              <li><a href="#michelin" onClick={(e) => { e.preventDefault(); setView('home'); }}>Michelin</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-col-title">Contact & Help</h4>
            <ul className="footer-links" style={{ color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '8px' }}>📍 102, Highway Ring Road, Sector-4, Industrial Area</li>
              <li style={{ marginBottom: '8px' }}>📞 +91 98765 43210</li>
              <li style={{ marginBottom: '8px' }}>✉️ support@tridevtyre.com</li>
              <li style={{ marginBottom: '8px' }}>⏰ Mon - Sat: 9:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Tridev Tyre Private Limited. All Rights Reserved.</p>
          <p>Powered by Antigravity Design System</p>
        </div>
      </div>
    </footer>
  );
}
