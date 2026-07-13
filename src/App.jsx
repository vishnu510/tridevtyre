import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UserHome from './pages/UserHome';
import TyreDetail from './pages/TyreDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { INITIAL_PRODUCTS, DEFAULT_ADMINS } from './mockData';

export default function App() {
  // 1. Theme state (default: dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // 2. Data state (Products & Admins synced to localStorage)
  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('tridev_products');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse local products, resetting database", e);
      }
    }
    // Fallback to seed data and write
    localStorage.setItem('tridev_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [admins, setAdmins] = useState(() => {
    const local = localStorage.getItem('tridev_admins');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse local admins, resetting database", e);
      }
    }
    // Fallback to default admins and write
    localStorage.setItem('tridev_admins', JSON.stringify(DEFAULT_ADMINS));
    return DEFAULT_ADMINS;
  });

  // 3. Navigation and session states
  const [currentView, setView] = useState('home'); // 'home' | 'detail' | 'admin-login' | 'admin-dashboard'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const local = sessionStorage.getItem('tridev_current_admin');
    return local ? JSON.parse(local) : null;
  });

  // Effect to sync theme class with document body
  useEffect(() => {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light');
    } else {
      body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync products state to localStorage
  const syncProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('tridev_products', JSON.stringify(newProducts));
  };

  // Sync admins state to localStorage
  const syncAdmins = (newAdmins) => {
    setAdmins(newAdmins);
    localStorage.setItem('tridev_admins', JSON.stringify(newAdmins));
  };

  // CRUD handlers
  const handleAddProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    syncProducts(updated);
  };

  const handleEditProduct = (updatedProduct) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    syncProducts(updated);
    if (selectedProductId === updatedProduct.id) {
      // Refresh details view if edited the currently viewed item
      setSelectedProductId(null);
      setTimeout(() => setSelectedProductId(updatedProduct.id), 0);
    }
  };

  const handleDeleteProduct = (productId) => {
    const updated = products.filter(p => p.id !== productId);
    syncProducts(updated);
    if (selectedProductId === productId) {
      setSelectedProductId(null);
      setView('home');
    }
  };

  const handleAddAdmin = (newAdmin) => {
    const updated = [...admins, newAdmin];
    syncAdmins(updated);
  };

  // Authentication actions
  const handleLoginSuccess = (admin) => {
    setCurrentUser(admin);
    sessionStorage.setItem('tridev_current_admin', JSON.stringify(admin));
    setView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('tridev_current_admin');
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Render active view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <UserHome 
            products={products} 
            setView={setView} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
      case 'detail':
        return (
          <TyreDetail 
            productId={selectedProductId} 
            products={products} 
            setView={setView} 
          />
        );
      case 'admin-login':
        // If already logged in, redirect directly to dashboard
        if (currentUser) {
          setView('admin-dashboard');
          return null;
        }
        return (
          <AdminLogin 
            admins={admins} 
            onLoginSuccess={handleLoginSuccess} 
            setView={setView}
          />
        );
      case 'admin-dashboard':
        // If not logged in, redirect to login page
        if (!currentUser) {
          setView('admin-login');
          return null;
        }
        return (
          <AdminDashboard 
            products={products}
            admins={admins}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddAdmin={handleAddAdmin}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <UserHome 
            products={products} 
            setView={setView} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Header 
        currentView={currentView} 
        setView={setView} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="main-content">
        {renderView()}
      </main>

      <Footer setView={setView} />
    </div>
  );
}
