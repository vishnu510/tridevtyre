import React, { useState, useMemo } from 'react';

export default function UserHome({ products, setView, setSelectedProductId }) {
  // Filters State
  const [activeTab, setActiveTab] = useState('size'); // 'size' or 'vehicle'
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [widthFilter, setWidthFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [rimFilter, setRimFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique filter options from products list
  const uniqueOptions = useMemo(() => {
    const options = {
      widths: new Set(),
      profiles: new Set(),
      rims: new Set(),
      vehicles: new Set()
    };

    products.forEach(p => {
      if (p.specs?.width) options.widths.add(p.specs.width);
      if (p.specs?.profile) options.profiles.add(p.specs.profile);
      if (p.specs?.rim) options.rims.add(p.specs.rim);
      if (p.vehicleType) options.vehicles.add(p.vehicleType);
    });

    return {
      widths: Array.from(options.widths).sort((a, b) => Number(a) - Number(b)),
      profiles: Array.from(options.profiles).sort((a, b) => Number(a) - Number(b)),
      rims: Array.from(options.rims).sort((a, b) => Number(a) - Number(b)),
      vehicles: Array.from(options.vehicles)
    };
  }, [products]);

  // Filter products based on search and selected values
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search matching
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.specs?.width && product.specs.width.includes(searchQuery)) ||
        (product.specs?.rim && product.specs.rim.includes(searchQuery));

      // Category filter (from vehicle tab)
      const matchesVehicle = !vehicleFilter || product.vehicleType === vehicleFilter;

      // Sizing filters (from size tab)
      const matchesWidth = !widthFilter || product.specs?.width === widthFilter;
      const matchesProfile = !profileFilter || product.specs?.profile === profileFilter;
      const matchesRim = !rimFilter || product.specs?.rim === rimFilter;

      if (activeTab === 'size') {
        return matchesSearch && matchesWidth && matchesProfile && matchesRim;
      } else {
        return matchesSearch && matchesVehicle;
      }
    });
  }, [products, searchQuery, vehicleFilter, widthFilter, profileFilter, rimFilter, activeTab]);

  const handleResetFilters = () => {
    setVehicleFilter('');
    setWidthFilter('');
    setProfileFilter('');
    setRimFilter('');
    setSearchQuery('');
  };

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-info">
              <p className="hero-subtitle">High-Performance Driving</p>
              <h1 className="hero-title">
                Uncompromising Grip.<br />
                <span>Ultimate Control.</span>
              </h1>
              <p className="hero-description">
                Explore our state-of-the-art tyre collection featuring MRF, Apollo, CEAT, and other global brands. Engineered to provide safety and longevity on every road.
              </p>
              <div className="hero-cta">
                <button 
                  className="btn-primary"
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Catalog 🔍
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => document.getElementById('brand-info')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Compare Brands
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-circle"></div>
              <img 
                src="/images/apollo_altrust.png" 
                alt="Featured Apollo Tyre" 
                className="hero-tyre-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Tyre Finder Widget */}
        <div className="finder-widget">
          <div className="finder-header">
            <h3 className="finder-title">🔧 Find the Perfect Tyre</h3>
            <div className="finder-tabs">
              <button 
                className={`finder-tab ${activeTab === 'size' ? 'active' : ''}`}
                onClick={() => { setActiveTab('size'); handleResetFilters(); }}
              >
                Search by Size
              </button>
              <button 
                className={`finder-tab ${activeTab === 'vehicle' ? 'active' : ''}`}
                onClick={() => { setActiveTab('vehicle'); handleResetFilters(); }}
              >
                Search by Vehicle Type
              </button>
            </div>
          </div>

          <div className="finder-grid">
            {activeTab === 'size' ? (
              <>
                <div className="filter-group">
                  <label className="filter-label">Section Width (mm)</label>
                  <select 
                    className="filter-select"
                    value={widthFilter}
                    onChange={(e) => setWidthFilter(e.target.value)}
                  >
                    <option value="">Any Width</option>
                    {uniqueOptions.widths.map(w => (
                      <option key={w} value={w}>{w} mm</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Aspect Ratio / Profile (%)</label>
                  <select 
                    className="filter-select"
                    value={profileFilter}
                    onChange={(e) => setProfileFilter(e.target.value)}
                  >
                    <option value="">Any Profile</option>
                    {uniqueOptions.profiles.map(p => (
                      <option key={p} value={p}>{p} %</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Rim Diameter (inches)</label>
                  <select 
                    className="filter-select"
                    value={rimFilter}
                    onChange={(e) => setRimFilter(e.target.value)}
                  >
                    <option value="">Any Rim</option>
                    {uniqueOptions.rims.map(r => (
                      <option key={r} value={r}>R{r}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="filter-group" style={{ gridColumn: 'span 3' }}>
                <label className="filter-label">Vehicle Category</label>
                <select 
                  className="filter-select"
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                >
                  <option value="">All Vehicles</option>
                  {uniqueOptions.vehicles.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Two-Wheeler">Two-Wheeler / Bike</option>
                  <option value="Truck">Truck / Commercial</option>
                </select>
              </div>
            )}

            <div className="filter-group">
              <label className="filter-label">Quick Search</label>
              <input 
                type="text" 
                className="filter-input"
                placeholder="Search brand, model, size..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group" style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              {(widthFilter || profileFilter || rimFilter || vehicleFilter || searchQuery) && (
                <button className="btn-reset-filters" onClick={handleResetFilters}>
                  Clear
                </button>
              )}
              <button 
                className="btn-search"
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Catalogue Listing */}
        <section id="catalog" className="catalogue-section">
          <div className="section-header">
            <h2 className="section-title">Explore Our Range</h2>
            <span className="section-results-count">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Tyre' : 'Tyres'}
            </span>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.mrp);
                const discountPct = hasDiscount 
                  ? Math.round(((product.mrp - product.discountPrice) / product.mrp) * 100)
                  : 0;

                return (
                  <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="product-card-image-wrap">
                      <img 
                        src={product.images?.[0] || '/images/apollo_altrust.png'} 
                        alt={product.title} 
                        className="product-card-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=300";
                        }}
                      />
                      <span className="product-card-badge">{product.vehicleType}</span>
                      {hasDiscount && (
                        <span className="discount-badge">{discountPct}% OFF</span>
                      )}
                    </div>
                    
                    <div className="product-card-body">
                      <span className="product-card-brand">{product.brand}</span>
                      <h3 className="product-card-title">{product.title}</h3>
                      
                      <div className="product-card-specs">
                        {product.specs?.width && (
                          <span className="spec-badge">
                            W: {product.specs.width}
                          </span>
                        )}
                        {product.specs?.profile && (
                          <span className="spec-badge">
                            H: {product.specs.profile}
                          </span>
                        )}
                        {product.specs?.rim && (
                          <span className="spec-badge">
                            R{product.specs.rim}
                          </span>
                        )}
                        {product.specs?.speedRating && (
                          <span className="spec-badge">
                            Speed: {product.specs.speedRating}
                          </span>
                        )}
                      </div>
                      
                      <div className="product-card-price-row">
                        <div className="product-card-prices">
                          {hasDiscount ? (
                            <>
                              <span className="price-mrp-strikethrough">₹{product.mrp.toLocaleString('en-IN')}</span>
                              <span className="price-final has-discount">₹{Number(product.discountPrice).toLocaleString('en-IN')}</span>
                            </>
                          ) : (
                            <>
                              <span className="mrp-label">MRP</span>
                              <span className="price-final">₹{product.mrp.toLocaleString('en-IN')}</span>
                            </>
                          )}
                        </div>
                        <button className="btn-card-action" aria-label="View details">
                          ➜
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-products">
                <div className="no-products-icon">🛞</div>
                <h3>No Tyres Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Try relaxing your dimension filters or search query to find more products.
                </p>
                <button 
                  className="btn-primary" 
                  onClick={handleResetFilters} 
                  style={{ marginTop: '20px' }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Brand Comparison Section */}
      <section id="brand-info" className="brand-comparison">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', flexDirection: 'column', gap: '8px', marginBottom: '48px', textAlign: 'center' }}>
            <h2 className="section-title">Industry-Leading Performance Brands</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
              We partner with India's most trusted manufacturers to deliver premium road safety, enhanced control, and unmatched high-speed stability.
            </p>
          </div>
          
          <div className="comparison-grid">
            <div className="comparison-card">
              <div className="comp-icon">🚀</div>
              <h3 className="comp-title">Apollo Tyres</h3>
              <p className="comp-desc">
                Pioneering innovation in high-speed durability. Famous for the **Altrust** and **Apterra** series, Apollo specializes in responsive road handling, low rolling resistance, and superior fuel economy.
              </p>
            </div>
            
            <div className="comparison-card">
              <div className="comp-icon">⛰️</div>
              <h3 className="comp-title">MRF Tyres</h3>
              <p className="comp-desc">
                India's largest manufacturer. Famous for the **Wanderer** off-road line and high-performance **Perfinza** range. Engineered to handle rugged, unpredictable road terrains with maximum structural strength.
              </p>
            </div>
            
            <div className="comparison-card">
              <div className="comp-icon">🛡️</div>
              <h3 className="comp-title">CEAT Tyres</h3>
              <p className="comp-desc">
                Specializing in wet-weather road grip and ultimate braking efficiency. CEAT's **Milaze** and **SecuraDrive** profiles offer deep structural grooves that effectively resist aquaplaning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
