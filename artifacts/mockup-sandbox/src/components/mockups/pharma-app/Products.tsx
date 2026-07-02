import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Home, Grid, ShoppingCart,
  Package, User, ChevronDown, Heart, Star, Filter, X, Check
} from 'lucide-react';

const medicines = [
  {
    id: 1, name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate',
    brand: 'Sun Pharma', category: 'Capsules', strength: '500mg',
    pack: 'Box of 100', mrp: 1200, price: 890, moq: 5,
    stock: 'In Stock', gst: 12, discount: 26,
    badge: 'BESTSELLER', badgeColor: '#4285F4',
    rx: true, rating: 4.6, reviews: 214,
    colorAccent: '#E8F5E9',
  },
  {
    id: 2, name: 'Dolo 650mg', generic: 'Paracetamol',
    brand: 'Micro Labs', category: 'Tablets', strength: '650mg',
    pack: 'Strip of 15', mrp: 38, price: 28, moq: 100,
    stock: 'In Stock', gst: 5, discount: 26,
    badge: 'TOP SELLER', badgeColor: '#0F9D58',
    rx: false, rating: 4.8, reviews: 892,
    colorAccent: '#E3F2FD',
  },
  {
    id: 3, name: 'Azithromycin 250mg', generic: 'Azithromycin Dihydrate',
    brand: 'Cipla Ltd', category: 'Tablets', strength: '250mg',
    pack: 'Strip of 6', mrp: 115, price: 86, moq: 50,
    stock: 'In Stock', gst: 12, discount: 25,
    badge: '', badgeColor: '',
    rx: true, rating: 4.5, reviews: 341,
    colorAccent: '#FFF8E1',
  },
  {
    id: 4, name: 'Pantoprazole 40mg', generic: 'Pantoprazole Sodium',
    brand: 'Abbott India', category: 'Tablets', strength: '40mg',
    pack: 'Strip of 10', mrp: 98, price: 72, moq: 100,
    stock: 'Low Stock', gst: 12, discount: 27,
    badge: 'NEW', badgeColor: '#EA4335',
    rx: true, rating: 4.4, reviews: 178,
    colorAccent: '#F3E5F5',
  },
  {
    id: 5, name: 'Vitamin D3 60K IU', generic: 'Cholecalciferol',
    brand: 'Mankind Pharma', category: 'Supplements', strength: '60000 IU',
    pack: 'Pack of 8 Sachets', mrp: 220, price: 158, moq: 30,
    stock: 'In Stock', gst: 5, discount: 28,
    badge: 'HOT', badgeColor: '#FBBC05',
    rx: false, rating: 4.7, reviews: 562,
    colorAccent: '#E8F5E9',
  },
  {
    id: 6, name: 'Metformin 500mg', generic: 'Metformin Hydrochloride',
    brand: 'USV Pvt Ltd', category: 'Tablets', strength: '500mg',
    pack: 'Strip of 20', mrp: 42, price: 30, moq: 200,
    stock: 'In Stock', gst: 12, discount: 29,
    badge: '', badgeColor: '',
    rx: true, rating: 4.3, reviews: 289,
    colorAccent: '#E3F2FD',
  },
];

const categories = ['All', 'Tablets', 'Capsules', 'Injection', 'Syrup', 'Supplements'];
const sortOptions = ['Relevance', 'Price: Low–High', 'Price: High–Low', 'Discount', 'Popularity'];

export function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Relevance');
  const [showSort, setShowSort] = useState(false);
  const [wishlisted, setWishlisted] = useState<number[]>([2, 5]);

  const filtered = medicines.filter(m =>
    activeCategory === 'All' || m.category === activeCategory
  );

  return (
    <div style={{
      width: 390, height: 844, overflow: 'hidden', position: 'relative',
      backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .card-hover { transition: box-shadow 0.15s ease; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#fff',
        boxShadow: '0 1px 0 #f0f0f0',
        paddingTop: 44,
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 12px' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111', fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>
              All Products
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 1 }}>
              {filtered.length} medicines found
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={18} color="#6B7280" />
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <ShoppingCart size={18} color="#6B7280" />
              <div style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: '#EA4335', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>3</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, background: '#F3F4F6', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
            height: 42, border: '1.5px solid #E5E7EB',
          }}>
            <Search size={16} color="#9CA3AF" />
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>Search medicines, brands…</span>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #0F9D58, #34A853)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <SlidersHorizontal size={18} color="#fff" />
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }} className="hide-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              flexShrink: 0,
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeCategory === cat ? '#0F9D58' : '#F3F4F6',
              color: activeCategory === cat ? '#fff' : '#6B7280',
              transition: 'all 0.15s',
            }}>{cat}</button>
          ))}
        </div>

        {/* Sort & Filter row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px', borderTop: '1px solid #F3F4F6', position: 'relative',
        }}>
          <button onClick={() => setShowSort(s => !s)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#374151',
          }}>
            <span style={{ color: '#9CA3AF', fontWeight: 400 }}>Sort:</span>
            &nbsp;{activeSort}
            <ChevronDown size={14} color="#0F9D58" />
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#374151',
          }}>
            <Filter size={13} color="#0F9D58" /> Filters
            <span style={{
              background: '#0F9D58', color: '#fff',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</span>
          </button>

          {/* Sort dropdown */}
          {showSort && (
            <div style={{
              position: 'absolute', top: '100%', left: 16, zIndex: 50,
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid #F3F4F6', minWidth: 180,
            }}>
              {sortOptions.map(opt => (
                <button key={opt} onClick={() => { setActiveSort(opt); setShowSort(false); }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '11px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 13,
                  fontWeight: activeSort === opt ? 600 : 400,
                  color: activeSort === opt ? '#0F9D58' : '#374151',
                  borderBottom: '1px solid #F9FAFB',
                }}>
                  {opt}
                  {activeSort === opt && <Check size={14} color="#0F9D58" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="hide-scrollbar" style={{
        overflowY: 'auto',
        height: 'calc(844px - 210px - 56px)',
        padding: '12px 12px 8px',
      }}>
        {/* Active filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {['Rx Required', 'In Stock'].map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#E8F5E9', border: '1px solid #A5D6A7',
              borderRadius: 20, padding: '3px 10px',
              fontSize: 11, fontWeight: 600, color: '#0F9D58',
            }}>
              {f}
              <X size={10} color="#0F9D58" strokeWidth={2.5} />
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.map(med => (
            <div key={med.id} className="card-hover" style={{
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid #F0F0F0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Image area */}
              <div style={{
                background: med.colorAccent,
                height: 90,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Badge */}
                {med.badge && (
                  <div style={{
                    position: 'absolute', top: 7, left: 7,
                    background: med.badgeColor,
                    color: '#fff', fontSize: 8, fontWeight: 700,
                    borderRadius: 4, padding: '2px 6px',
                    letterSpacing: '0.04em',
                  }}>{med.badge}</div>
                )}
                {/* Wishlist */}
                <button
                  onClick={() => setWishlisted(w => w.includes(med.id) ? w.filter(i => i !== med.id) : [...w, med.id])}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#fff', borderRadius: '50%',
                    width: 24, height: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}>
                  <Heart size={13}
                    color={wishlisted.includes(med.id) ? '#EA4335' : '#D1D5DB'}
                    fill={wishlisted.includes(med.id) ? '#EA4335' : 'none'}
                  />
                </button>
                {/* Medicine illustration — blister pack */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect x="6" y="14" width="44" height="28" rx="6" fill="rgba(255,255,255,0.8)" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                  {[0,1,2].map(col => [0,1].map(row => (
                    <ellipse key={`${col}-${row}`}
                      cx={16 + col * 14} cy={22 + row * 12}
                      rx="5" ry="5"
                      fill="rgba(15,157,88,0.25)" stroke="rgba(15,157,88,0.4)" strokeWidth="0.8"
                    />
                  )))}
                </svg>
                {/* Rx badge */}
                {med.rx && (
                  <div style={{
                    position: 'absolute', bottom: 6, left: 7,
                    background: 'rgba(66,133,244,0.12)', color: '#4285F4',
                    fontSize: 8, fontWeight: 700, borderRadius: 4, padding: '1px 5px',
                    border: '1px solid rgba(66,133,244,0.25)',
                  }}>Rx</div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '10px 10px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111', lineHeight: 1.3, marginBottom: 2 }}>
                  {med.name}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4, lineHeight: 1.3 }}>
                  {med.generic}
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500, marginBottom: 6 }}>
                  {med.brand} · {med.pack}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
                  <Star size={10} fill="#FBBC05" color="#FBBC05" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>{med.rating}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>({med.reviews})</span>
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0F9D58', fontFamily: "'Poppins', sans-serif" }}>
                      ₹{med.price}
                    </span>
                    <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 500 }}>
                      /strip
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{med.mrp}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      background: '#FEE2E2', color: '#EA4335',
                      borderRadius: 4, padding: '1px 5px',
                    }}>{med.discount}% OFF</span>
                  </div>
                </div>

                {/* MOQ + stock */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600,
                    background: '#F3F4F6', color: '#6B7280',
                    borderRadius: 4, padding: '2px 6px',
                  }}>MOQ: {med.moq}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 600,
                    color: med.stock === 'In Stock' ? '#0F9D58' : '#FBBC05',
                  }}>{med.stock}</span>
                </div>

                {/* Add to cart */}
                <button style={{
                  width: '100%', height: 32, borderRadius: 10,
                  border: '1.5px solid #0F9D58',
                  background: 'transparent', color: '#0F9D58',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  transition: 'all 0.15s',
                }}>
                  <ShoppingCart size={12} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
          <button style={{
            background: 'none', border: '1.5px solid #E5E7EB',
            borderRadius: 10, padding: '9px 28px',
            fontSize: 12, fontWeight: 600, color: '#6B7280', cursor: 'pointer',
          }}>
            Load More Products
          </button>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 56, background: '#fff',
        borderTop: '1px solid #F3F4F6',
        display: 'flex', zIndex: 30,
      }}>
        {[
          { icon: Home,         label: 'Home',       active: false },
          { icon: Grid,         label: 'Categories', active: true  },
          { icon: ShoppingCart, label: 'Cart',       active: false },
          { icon: Package,      label: 'Orders',     active: false },
          { icon: User,         label: 'Profile',    active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative',
          }}>
            <Icon size={22} color={active ? '#0F9D58' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: 500, color: active ? '#0F9D58' : '#9CA3AF' }}>{label}</span>
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 24, height: 3, borderRadius: 99, background: '#0F9D58',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
