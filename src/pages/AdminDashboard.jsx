import React, { useState, useMemo } from 'react';
import { getAssetUrl } from '../utils/assetHelper';

export default function AdminDashboard({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  admins, 
  onAddAdmin,
  currentUser, 
  onLogout 
}) {
  const [activeSubTab, setActiveSubTab] = useState('products'); // 'products' or 'admins'
  const [productSearch, setProductSearch] = useState('');
  
  // States for Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new

  // Register Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Manager');
  const [adminRegisterSuccess, setAdminRegisterSuccess] = useState('');
  const [adminRegisterError, setAdminRegisterError] = useState('');

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const total = products.length;
    const offers = products.filter(p => p.discountPrice && Number(p.discountPrice) < Number(p.mrp)).length;
    const categories = new Set(products.map(p => p.vehicleType)).size;
    
    // Average price
    const sumPrice = products.reduce((acc, curr) => acc + curr.mrp, 0);
    const avgPrice = total > 0 ? Math.round(sumPrice / total) : 0;

    return { total, offers, categories, avgPrice };
  }, [products]);

  // Filter products for administrative listing
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.model.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the tyre "${title}"?`)) {
      onDeleteProduct(id);
    }
  };

  const handleRegisterAdmin = (e) => {
    e.preventDefault();
    setAdminRegisterSuccess('');
    setAdminRegisterError('');

    if (admins.some(a => a.email.toLowerCase() === newAdminEmail.toLowerCase())) {
      setAdminRegisterError('An admin account with this email already exists.');
      return;
    }

    const newAdmin = {
      email: newAdminEmail,
      password: newAdminPassword,
      name: newAdminName,
      role: newAdminRole
    };

    onAddAdmin(newAdmin);
    setAdminRegisterSuccess(`Successfully registered ${newAdminName} as an administrator!`);
    setNewAdminEmail('');
    setNewAdminPassword('');
    setNewAdminName('');
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <h1 style={{ fontSize: '32px' }}>Operational Control</h1>
            <div>
              <span className="admin-badge">
                👤 {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
          </div>
          <div className="dashboard-actions">
            <button 
              className={`btn-secondary ${activeSubTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('products')}
              style={{ fontWeight: 600 }}
            >
              🛞 Tyre Inventory
            </button>
            <button 
              className={`btn-secondary ${activeSubTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('admins')}
              style={{ fontWeight: 600 }}
            >
              👥 Manage Admins ({admins.length})
            </button>
            <button className="btn-danger" onClick={onLogout}>
              Logout ⎋
            </button>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap">🛞</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Listings</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrap">🏷️</div>
            <div className="stat-info">
              <span className="stat-value">{stats.offers}</span>
              <span className="stat-label">Active Discount Offers</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap">🚗</div>
            <div className="stat-info">
              <span className="stat-value">{stats.categories}</span>
              <span className="stat-label">Product Categories</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap">💰</div>
            <div className="stat-info">
              <span className="stat-value">₹{stats.avgPrice.toLocaleString('en-IN')}</span>
              <span className="stat-label">Average Base Price (MRP)</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Product Inventory */}
        {activeSubTab === 'products' && (
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2 className="panel-title">Tyre Inventory Database</h2>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="filter-input search-box" 
                  placeholder="Search catalogue..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <button className="btn-primary" onClick={handleOpenAddModal}>
                  ➕ Add New Tyre
                </button>
              </div>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product details</th>
                    <th>Category</th>
                    <th>Dimensions (W/P/R)</th>
                    <th>Base Price (MRP)</th>
                    <th>Offer Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => {
                      const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.mrp);
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="table-product-cell">
                              <div className="table-product-thumb">
                                <img 
                                  src={getAssetUrl(product.images?.[0] || '/images/apollo_altrust.png')} 
                                  alt="" 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=150";
                                  }}
                                />
                              </div>
                              <div className="table-product-info">
                                <span className="table-product-title">{product.title}</span>
                                <span className="table-product-brand">{product.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge-cat">{product.vehicleType}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>
                              {product.specs?.width || 'N/A'} / {product.specs?.profile || 'N/A'} R{product.specs?.rim || 'N/A'}
                            </span>
                          </td>
                          <td>
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </td>
                          <td>
                            {hasDiscount ? (
                              <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>
                                ₹{Number(product.discountPrice).toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>No Discount</span>
                            )}
                          </td>
                          <td>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                className="btn-icon" 
                                title="Edit Product"
                                onClick={() => handleOpenEditModal(product)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon delete" 
                                title="Delete Product"
                                onClick={() => handleDeleteClick(product.id, product.title)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No matching tyres found in inventory database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Admins */}
        {activeSubTab === 'admins' && (
          <div className="dashboard-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
            
            {/* Registered Admins List */}
            <div>
              <h2 className="panel-title" style={{ marginBottom: '24px' }}>Authorized Admin Accounts</h2>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{admin.name}</div>
                        </td>
                        <td>{admin.email}</td>
                        <td>
                          <span className="badge-cat" style={{ borderColor: admin.role === 'Administrator' ? 'var(--accent-color)' : 'var(--border-color)', color: admin.role === 'Administrator' ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                            {admin.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Register New Admin Form */}
            <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>🔑 Register New Admin</h3>
              
              <form onSubmit={handleRegisterAdmin} className="login-form">
                {adminRegisterSuccess && <div style={{ color: 'var(--success-color)', fontSize: '13px', background: 'rgba(0, 230, 118, 0.1)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(0, 230, 118, 0.2)' }}>{adminRegisterSuccess}</div>}
                {adminRegisterError && <div className="login-error" style={{ padding: '8px 12px' }}>{adminRegisterError}</div>}

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Full Name" 
                    required 
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="name@tridevtyre.com" 
                    required 
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Credentials Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    required 
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Authorization Role</label>
                  <select 
                    className="filter-select"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                  >
                    <option value="Administrator">Super Administrator</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                  Register Admin Account
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Product Form Modal (Imported and dynamically loaded) */}
      {showFormModal && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => setShowFormModal(false)} 
          onSave={(savedProduct) => {
            if (editingProduct) {
              onEditProduct(savedProduct);
            } else {
              onAddProduct(savedProduct);
            }
            setShowFormModal(false);
          }}
        />
      )}
    </div>
  );
}

// Inline product form modal loader to avoid import headaches
// We will build this in a separate file too, but we will import it inside App.jsx or define it cleanly.
// For clean organization, let's keep ProductForm in a separate component and import/pass it down.
import ProductFormModal from '../components/ProductForm';
