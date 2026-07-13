import React, { useState } from 'react';

export default function AdminLogin({ admins, onLoginSuccess, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find the admin inside the admins array
    const matchedAdmin = admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (matchedAdmin) {
      onLoginSuccess(matchedAdmin);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section" onClick={() => setView('home')} style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <div className="logo-icon">◎</div>
          <div className="logo-text">TRIDEV TYRE</div>
        </div>
        
        <h2 className="login-title">Admin Console</h2>
        <p className="login-subtitle">Sign in to manage tyre listings, specs, and prices</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">⚠️ {error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              type="email"
              id="email-input"
              className="form-input"
              placeholder="e.g., admin@tridevtyre.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              className="form-input"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            Secure Log In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <p>Seeded Test Credentials:</p>
          <p style={{ marginTop: '4px' }}><b>admin@tridevtyre.com</b> / <b>admin123</b></p>
          <p><b>manager@tridevtyre.com</b> / <b>manager123</b></p>
        </div>
      </div>
    </div>
  );
}
