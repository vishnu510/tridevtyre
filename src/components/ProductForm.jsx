import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/assetHelper';

const PRESET_IMAGES = [
  "/images/apollo_altrust.png",
  "/images/mrf_wanderer.png",
  "/images/ceat_milaze.png"
];

export default function ProductFormModal({ product, onClose, onSave }) {
  // Main fields state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  
  // Specifications state
  const [width, setWidth] = useState('');
  const [profile, setProfile] = useState('');
  const [rim, setRim] = useState('');
  const [speedRating, setSpeedRating] = useState('');
  const [loadIndex, setLoadIndex] = useState('');
  const [warranty, setWarranty] = useState('5 Years');
  const [runflat, setRunflat] = useState('No');
  const [plyRating, setPlyRating] = useState('');
  const [treadDepth, setTreadDepth] = useState('');

  // Images state (holds array of base64 data URLs or preset paths)
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Load product data if editing
  useEffect(() => {
    if (product) {
      setBrand(product.brand || '');
      setModel(product.model || '');
      setTitle(product.title || '');
      setDescription(product.description || '');
      setMrp(product.mrp || '');
      setDiscountPrice(product.discountPrice || '');
      setVehicleType(product.vehicleType || 'Car');
      
      if (product.specs) {
        setWidth(product.specs.width || '');
        setProfile(product.specs.profile || '');
        setRim(product.specs.rim || '');
        setSpeedRating(product.specs.speedRating || '');
        setLoadIndex(product.specs.loadIndex || '');
        setWarranty(product.specs.warranty || '5 Years');
        setRunflat(product.specs.runflat || 'No');
        setPlyRating(product.specs.plyRating || '');
        setTreadDepth(product.specs.treadDepth || '');
      }
      setImages(product.images || []);
    } else {
      // Default placeholder images for new product to make it easy for testing
      setImages([
        "/images/apollo_altrust.png",
        "/images/apollo_altrust.png"
      ]);
    }
  }, [product]);

  // Handle image upload and convert to base64 data URL
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageError('');

    if (images.length + files.length > 6) {
      setImageError('Maximum limit is 6 images. Please delete existing ones first.');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const usePresetImage = (url) => {
    setImageError('');
    if (images.length >= 6) {
      setImageError('Maximum limit is 6 images.');
      return;
    }
    setImages(prev => [...prev, url]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Field Valildation checks
    const parsedMrp = Number(mrp);
    const parsedDiscount = discountPrice ? Number(discountPrice) : null;

    if (parsedDiscount !== null && parsedDiscount >= parsedMrp) {
      setValidationError('Discounted price must be strictly lower than the MRP.');
      return;
    }

    if (images.length < 1) {
      setImageError('Please provide at least 1 image (up to 6 allowed).');
      return;
    }

    const savedProduct = {
      id: product?.id || `tyre-${Date.now()}`,
      title,
      brand,
      model,
      description,
      mrp: parsedMrp,
      discountPrice: parsedDiscount,
      vehicleType,
      images,
      specs: {
        width,
        profile,
        rim,
        speedRating,
        loadIndex,
        warranty,
        runflat,
        plyRating,
        treadDepth
      }
    };

    onSave(savedProduct);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header">
          <h3 className="modal-title">{product ? '✏️ Edit Tyre Listing' : '➕ Add New Tyre Listing'}</h3>
          <button className="btn-close-modal" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && <div className="login-error" style={{ marginBottom: '16px' }}>⚠️ {validationError}</div>}

            {/* Section 1: Core Details */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Brand</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Apollo, MRF, CEAT" 
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tread Model Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Altrust, Wanderer A/T" 
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Product Page Listing Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Apollo Altrust Commercial Van Tyre" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vehicle Category</label>
                <select 
                  className="filter-select"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="Car">Passenger Car</option>
                  <option value="SUV">SUV / All-Terrain</option>
                  <option value="Two-Wheeler">Two-Wheeler / Bike</option>
                  <option value="Truck">Truck & Commercial</option>
                </select>
              </div>
              
              <div className="form-group">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Base Price (MRP)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 6500" 
                      required
                      min="100"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Offer Price (Optional)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 5750" 
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Product Description</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Describe tread compound, grip profile, handling characteristics, and warranty details..."
                style={{ resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Section 2: Specifications */}
            <div className="spec-form-section">
              <h4 className="spec-section-title">⚙ Technical Fitment Specifications</h4>
              
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Section Width (mm)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 205" 
                    required
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Aspect Ratio / Profile (%)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 65" 
                    required
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rim Diameter (inches)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 15" 
                    required
                    value={rim}
                    onChange={(e) => setRim(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Speed Rating Symbol</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., T, H, V, W" 
                    value={speedRating}
                    onChange={(e) => setSpeedRating(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Load Index Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 91, 102" 
                    value={loadIndex}
                    onChange={(e) => setLoadIndex(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Run-Flat Capability</label>
                  <select 
                    className="filter-select"
                    value={runflat}
                    onChange={(e) => setRunflat(e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '0' }}>
                <div className="form-group">
                  <label className="form-label">Warranty</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 5 Years Warranty" 
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ply Rating (PR)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 8 PR" 
                    value={plyRating}
                    onChange={(e) => setPlyRating(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tread Depth</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 8.5 mm" 
                    value={treadDepth}
                    onChange={(e) => setTreadDepth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Multi-Image Upload */}
            <div className="spec-form-section" style={{ marginBottom: '0' }}>
              <h4 className="spec-section-title">🖼 Product Image Gallery (Upload 5-6 Images recommended)</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px' }}>
                For best results, upload 5 to 6 images showcasing the tyre's tread pattern, side angles, and rim fitment. Minimum 1 required.
              </p>

              {imageError && <div className="login-error" style={{ marginBottom: '16px', padding: '8px 12px' }}>⚠️ {imageError}</div>}

              {/* Upload Dropzone */}
              <div className="image-upload-area">
                <div className="upload-icon">📁</div>
                <p className="upload-text">Drag and drop images here or <b>Click to Browse</b></p>
                <input 
                  type="file" 
                  className="upload-input" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Quick pre-seeded selector for convenience */}
              <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick add samples:</span>
                {PRESET_IMAGES.map((url, idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    className="finder-tab"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    onClick={() => usePresetImage(url)}
                  >
                    + Sample {idx + 1} ({url.split('/').pop().split('.')[0]})
                  </button>
                ))}
              </div>

              {/* Upload Previews Grid */}
              <div className="image-previews-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="image-preview-item">
                    <img 
                      src={getAssetUrl(img)} 
                      alt="" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=150";
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn-remove-preview"
                      onClick={() => removeImage(idx)}
                      title="Remove Image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Visual empty slots representing 6 images */}
                {Array.from({ length: Math.max(0, 6 - images.length) }).map((_, idx) => (
                  <div 
                    key={`empty-${idx}`} 
                    className="image-preview-item" 
                    style={{ borderStyle: 'dashed', color: 'var(--text-muted)', fontSize: '20px' }}
                  >
                    +
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {product ? 'Save Changes' : 'Publish Tyre Listing'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
