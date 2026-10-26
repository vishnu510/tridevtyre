import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assetHelper';

export default function TyreDetail({ productId, products, setView }) {
  const product = products.find(p => p.id === productId);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', count: '4' });

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button className="btn-primary" onClick={() => setView('home')} style={{ marginTop: '20px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.mrp);
  const discountPct = hasDiscount 
    ? Math.round(((product.mrp - product.discountPrice) / product.mrp) * 100)
    : 0;
  const savings = hasDiscount ? product.mrp - product.discountPrice : 0;

  // Ensure there are images, fallback if not
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/images/apollo_altrust.png'];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setShowEnquiryModal(false);
      setFormData({ name: '', phone: '', email: '', count: '4' });
    }, 2500);
  };

  return (
    <div className="container">
      {/* Back navigation */}
      <div style={{ padding: '24px 0 8px' }}>
        <button 
          className="btn-secondary" 
          onClick={() => setView('home')}
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
        >
          🠔 Back to Catalog
        </button>
      </div>

      <div className="detail-layout">
        {/* Left Column: Gallery */}
        <div className="detail-gallery">
          <div className="detail-main-img-wrap">
            <img 
              src={getAssetUrl(images[activeImgIndex] || '/images/apollo_altrust.png')} 
              alt={product.title} 
              className="detail-main-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600";
              }}
            />
            {hasDiscount && (
              <span className="discount-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                {discountPct}% OFF
              </span>
            )}
          </div>
          
          <div className="gallery-thumbnails">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`gallery-thumbnail ${activeImgIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
              >
                <img 
                  src={getAssetUrl(img || '/images/apollo_altrust.png')} 
                  alt={`${product.title} Thumbnail ${idx + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=150";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="detail-info">
          <span className="detail-brand">{product.brand} Tyres</span>
          <h1 className="detail-title">{product.title}</h1>
          
          <div className="detail-pricing-panel">
            <div className="detail-pricing">
              <span className="mrp-label">{hasDiscount ? 'Special Offer Price' : 'MRP (Inclusive of all taxes)'}</span>
              <div className="detail-pricing-row">
                <span className={`price-final ${hasDiscount ? 'has-discount' : ''}`} style={{ fontSize: '32px' }}>
                  ₹{(hasDiscount ? Number(product.discountPrice) : product.mrp).toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="price-mrp-strikethrough" style={{ fontSize: '18px' }}>
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {hasDiscount && (
              <div className="detail-savings">
                Save ₹{savings.toLocaleString('en-IN')} ({discountPct}%)
              </div>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>
          
          <h3 className="detail-specs-title">⚙ Technical Specifications</h3>
          <table className="detail-specs-table">
            <tbody>
              <tr>
                <td className="detail-specs-label">Tyre Width</td>
                <td className="detail-specs-value">{product.specs?.width ? `${product.specs.width} mm` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Aspect Ratio (Profile)</td>
                <td className="detail-specs-value">{product.specs?.profile ? `${product.specs.profile} %` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Rim Diameter</td>
                <td className="detail-specs-value">{product.specs?.rim ? `R${product.specs.rim} inches` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Speed Rating</td>
                <td className="detail-specs-value">{product.specs?.speedRating || 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Load Index</td>
                <td className="detail-specs-value">{product.specs?.loadIndex || 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Warranty Period</td>
                <td className="detail-specs-value">{product.specs?.warranty || 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Run-Flat Capability</td>
                <td className="detail-specs-value">{product.specs?.runflat || 'No'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Ply Rating</td>
                <td className="detail-specs-value">{product.specs?.plyRating || 'N/A'}</td>
              </tr>
              <tr>
                <td className="detail-specs-label">Tread Depth</td>
                <td className="detail-specs-value">{product.specs?.treadDepth || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <div className="detail-actions">
            <button className="btn-primary" onClick={() => setShowEnquiryModal(true)} style={{ flex: 1, padding: '16px' }}>
              💬 Enquire Now / Get Best Deal
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                setView('home');
                setTimeout(() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              style={{ flex: 0.5 }}
            >
              📍 Find Dealer
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Request a Callback</h3>
              <button className="btn-close-modal" onClick={() => setShowEnquiryModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {enquirySuccess ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '48px', color: 'var(--success-color)', marginBottom: '16px' }}>✓</div>
                    <h4>Enquiry Submitted!</h4>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                      Thank you. Our tyre experts will contact you shortly regarding the **{product.title}**.
                    </p>
                  </div>
                ) : (
                  <div className="login-form">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                      Fill in details below to receive a custom discount quote and fitment scheduling.
                    </p>
                    
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        className="form-input" 
                        placeholder="Your Name" 
                        required 
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        className="form-input" 
                        placeholder="Your 10-digit number" 
                        required 
                        value={formData.phone}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        name="email"
                        className="form-input" 
                        placeholder="name@email.com" 
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Quantity Required</label>
                      <select 
                        name="count"
                        className="filter-select"
                        value={formData.count}
                        onChange={handleFormChange}
                      >
                        <option value="1">1 Tyre</option>
                        <option value="2">2 Tyres</option>
                        <option value="4">4 Tyres (Recommended Full Set)</option>
                        <option value="5">5 Tyres (Including Spare)</option>
                        <option value="more">More than 5</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {!enquirySuccess && (
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowEnquiryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Request
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
