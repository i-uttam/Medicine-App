import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, Tag, ChevronRight, Info, Home, Grid, ShoppingCart, Package, User } from 'lucide-react';

export function Cart() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex items-center gap-4 sticky top-0 z-20">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <ArrowLeft size={24} className="text-gray-900" />
        </div>
        <div>
          <h1 className="text-[18px] text-gray-900" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            My Cart
          </h1>
          <p className="text-[12px] text-gray-500 font-medium">3 items</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto hide-scrollbar px-5 pt-4 pb-4" style={{ height: 'calc(844px - 76px - 140px)' }}>

        {/* Cart Items */}
        <div className="flex flex-col gap-3 mb-5">

          {/* Item 1 */}
          <div className="bg-white p-4 rounded-[16px] border border-gray-100 flex gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 border-2 border-gray-200 rounded-md bg-white flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-bold text-[13px] text-gray-900 leading-tight">Amoxicillin 500mg</h3>
                <button className="text-gray-300 ml-2 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">Sun Pharma · Box of 100</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-[14px] text-[#0F9D58]">₹4,450</span>
                  <span className="text-[10px] text-gray-400 ml-1">@ ₹890/box</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                  <button className="text-[#0F9D58]"><Minus size={13} /></button>
                  <span className="text-[12px] font-bold text-gray-900 w-4 text-center">5</span>
                  <button className="text-[#0F9D58]"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white p-4 rounded-[16px] border border-gray-100 flex gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 border-2 border-gray-200 rounded-md bg-white flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-bold text-[13px] text-gray-900 leading-tight">Dolo 650mg</h3>
                <button className="text-gray-300 ml-2 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">Micro Labs · Strip of 15</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-[14px] text-[#0F9D58]">₹2,450</span>
                  <span className="text-[10px] text-gray-400 ml-1">@ ₹245/strip</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                  <button className="text-[#0F9D58]"><Minus size={13} /></button>
                  <span className="text-[12px] font-bold text-gray-900 w-4 text-center">10</span>
                  <button className="text-[#0F9D58]"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white p-4 rounded-[16px] border border-gray-100 flex gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 border-2 border-gray-200 rounded-md bg-white flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-bold text-[13px] text-gray-900 leading-tight">Azithromycin 500mg</h3>
                <button className="text-gray-300 ml-2 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">Cipla Ltd · Strip of 5</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-[14px] text-[#0F9D58]">₹2,450</span>
                  <span className="text-[10px] text-gray-400 ml-1">@ ₹490/strip</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                  <button className="text-[#0F9D58]"><Minus size={13} /></button>
                  <span className="text-[12px] font-bold text-gray-900 w-4 text-center">5</span>
                  <button className="text-[#0F9D58]"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white p-2 pl-4 rounded-[14px] border border-gray-100 flex items-center mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Tag size={18} className="text-[#0F9D58] mr-3 flex-shrink-0" />
          <input type="text" placeholder="Enter coupon code" className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-700" />
          <button className="bg-gray-900 text-white font-semibold text-[12px] px-4 py-2 rounded-[10px]">Apply</button>
        </div>

        {/* Bill Summary */}
        <div className="bg-white p-4 rounded-[16px] border border-gray-100 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 className="font-bold text-[14px] text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Bill Summary</h3>
          <div className="flex justify-between text-[12px] text-gray-500 mb-2">
            <span>Item Total (3 items)</span>
            <span className="text-gray-800 font-medium">₹9,350</span>
          </div>
          <div className="flex justify-between text-[12px] text-gray-500 mb-2">
            <span>Bulk Discount</span>
            <span className="text-[#0F9D58] font-medium">−₹2,100</span>
          </div>
          <div className="flex justify-between text-[12px] text-gray-500 mb-2">
            <span>Subtotal</span>
            <span className="text-gray-800 font-medium">₹7,250</span>
          </div>
          <div className="flex justify-between text-[12px] text-gray-500 mb-2">
            <span className="flex items-center gap-1">GST (12%) <Info size={11} className="text-gray-400" /></span>
            <span className="text-gray-800 font-medium">₹870</span>
          </div>
          <div className="flex justify-between text-[12px] text-gray-500 mb-3 pb-3 border-b border-dashed border-gray-200">
            <span>Delivery Fee</span>
            <span className="text-[#0F9D58] font-medium">FREE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[15px] text-gray-900">To Pay</span>
            <span className="font-bold text-[17px] text-[#0F9D58]">₹8,120</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="absolute bottom-14 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-3 pb-3 z-20" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <button className="w-full text-white h-[52px] rounded-[14px] flex items-center justify-between px-5" style={{ background: 'linear-gradient(135deg, #0F9D58, #34A853)', boxShadow: '0 4px 16px rgba(15,157,88,0.3)' }}>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Amount</span>
            <span className="text-[15px] font-bold">₹8,120</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[14px]">
            Proceed to Checkout <ChevronRight size={17} />
          </div>
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30" style={{ height: 56 }}>
        {[
          { icon: Home, label: 'Home', active: false },
          { icon: Grid, label: 'Categories', active: false },
          { icon: ShoppingCart, label: 'Cart', active: true },
          { icon: Package, label: 'Orders', active: false },
          { icon: User, label: 'Profile', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            {active && label === 'Cart' && (
              <div className="absolute top-2 right-[22px] w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: '#EA4335', fontSize: 9 }}>3</div>
            )}
            <Icon size={22} color={active ? '#0F9D58' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium" style={{ color: active ? '#0F9D58' : '#9CA3AF' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
