import React from 'react';
import { Search, Mic, Bell, ShoppingCart, Home as HomeIcon, Grid, Package, User } from 'lucide-react';

export function Home() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          <User size={20} className="text-gray-500" />
        </div>
        <h1 className="text-[18px] text-[#0F9D58]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          MediWholesale
        </h1>
        <div className="flex gap-4 relative">
          <Bell size={24} className="text-gray-700" />
          <div className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(844px-80px-80px)] pb-6 hide-scrollbar">
        {/* Search */}
        <div className="px-5 mt-5">
          <div className="bg-white h-12 rounded-[14px] flex items-center px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
            <Search size={20} className="text-gray-400 mr-3" />
            <input type="text" placeholder="Search medicines, brands…" className="flex-1 bg-transparent border-none outline-none text-[14px] focus:ring-0" />
            <Mic size={20} className="text-[#0F9D58]" />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <div className="flex overflow-x-auto hide-scrollbar px-5 gap-3">
            {['Tablets', 'Capsules', 'Injection', 'Syrup', 'Cream', 'Surgical'].map((cat, i) => (
              <div key={i} className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium border ${i === 0 ? 'bg-[#0F9D58] text-white border-[#0F9D58]' : 'bg-white text-gray-600 border-gray-200'}`}>
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="px-5 mt-6">
          <div className="bg-gradient-to-r from-[#0F9D58] to-[#34A853] rounded-[16px] p-5 text-white flex justify-between items-center shadow-[0_4px_16px_rgba(15,157,88,0.2)]">
            <div className="w-[60%]">
              <h2 className="text-[18px] font-bold mb-2 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Up to 30% off on Bulk Orders</h2>
              <button className="bg-white text-[#0F9D58] text-[12px] font-bold px-4 py-1.5 rounded-full mt-2">Order Now</button>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Package size={32} color="white" />
            </div>
          </div>
        </div>

        {/* Recently Ordered */}
        <div className="mt-8 px-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[16px] font-bold text-gray-900">Recently Ordered</h3>
            <span className="text-[#0F9D58] text-[13px] font-semibold">See All</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Product 1 */}
            <div className="bg-white rounded-[16px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col relative">
              <span className="absolute top-3 right-3 bg-[#EA4335]/10 text-[#EA4335] text-[10px] font-bold px-1.5 py-0.5 rounded z-10">24% OFF</span>
              <div className="h-[80px] bg-gray-50 rounded-[10px] mb-3 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-200 rounded-sm bg-white shadow-sm flex items-center justify-center">
                   <div className="w-6 h-6 bg-gray-200 rounded-sm"></div>
                </div>
              </div>
              <h4 className="font-bold text-[14px] text-gray-900 leading-tight mb-1">Dolo 650mg</h4>
              <p className="text-[11px] text-gray-500 mb-2 truncate">Paracetamol</p>
              <p className="text-[10px] text-gray-400 mb-2">Micro Labs</p>
              <div className="mt-auto">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[#0F9D58] font-bold text-[14px]">₹245<span className="text-[10px] text-gray-500 font-normal">/strip</span></span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400 text-[11px] line-through">MRP ₹320</span>
                  <span className="bg-blue-50 text-[#4285F4] text-[9px] font-semibold px-1.5 py-0.5 rounded">MOQ: 10</span>
                </div>
                <button className="w-full border border-[#0F9D58] text-[#0F9D58] rounded-lg py-1.5 text-[12px] font-semibold">Add to Cart</button>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-[16px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col relative">
              <span className="absolute top-3 right-3 bg-[#EA4335]/10 text-[#EA4335] text-[10px] font-bold px-1.5 py-0.5 rounded z-10">18% OFF</span>
              <div className="h-[80px] bg-gray-50 rounded-[10px] mb-3 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-200 rounded-sm bg-white shadow-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-sm"></div>
                </div>
              </div>
              <h4 className="font-bold text-[14px] text-gray-900 leading-tight mb-1">Amoxil 500mg</h4>
              <p className="text-[11px] text-gray-500 mb-2 truncate">Amoxicillin</p>
              <p className="text-[10px] text-gray-400 mb-2">GSK Pharma</p>
              <div className="mt-auto">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[#0F9D58] font-bold text-[14px]">₹890<span className="text-[10px] text-gray-500 font-normal">/box</span></span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400 text-[11px] line-through">MRP ₹1080</span>
                  <span className="bg-blue-50 text-[#4285F4] text-[9px] font-semibold px-1.5 py-0.5 rounded">MOQ: 5</span>
                </div>
                <button className="w-full border border-[#0F9D58] text-[#0F9D58] rounded-lg py-1.5 text-[12px] font-semibold">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Brands */}
        <div className="mt-8 mb-6">
          <div className="px-5 mb-4">
            <h3 className="text-[16px] font-bold text-gray-900">Popular Brands</h3>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar px-5 gap-4">
            {['Cipla', 'Sun Pharma', 'Abbott', 'Lupin', 'Mankind'].map((brand, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center">
                  <span className="font-bold text-[12px] text-gray-700">{brand[0]}</span>
                </div>
                <span className="text-[11px] text-gray-600 font-medium">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 w-full h-[80px] bg-white border-t border-gray-100 flex justify-between items-center px-6 pb-4 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <HomeIcon size={24} className="text-[#0F9D58]" />
          <span className="text-[10px] font-medium text-[#0F9D58]">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <Grid size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Categories</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer relative">
          <div className="relative">
            <ShoppingCart size={24} className="text-gray-400" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
          </div>
          <span className="text-[10px] font-medium text-gray-400">Cart</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <Package size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <User size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Profile</span>
        </div>
      </div>
    </div>
  );
}