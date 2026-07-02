import React from 'react';
import { Search, Bell, ShoppingCart, Home as HomeIcon, Grid, Package, User, Pill, Syringe, TestTube, Droplet, Beaker, Heart, Zap, Stethoscope, Scissors, Leaf, ShoppingBag, Baby, Sparkles, Activity } from 'lucide-react';

export function Categories() {
  const categories = [
    { name: 'Tablets', color: 'bg-blue-100 text-blue-600', icon: <Pill size={24} /> },
    { name: 'Capsules', color: 'bg-green-100 text-green-600', icon: <Pill size={24} /> },
    { name: 'Injection', color: 'bg-red-100 text-red-600', icon: <Syringe size={24} /> },
    { name: 'Syrup', color: 'bg-yellow-100 text-yellow-600', icon: <TestTube size={24} /> },
    { name: 'Drops', color: 'bg-purple-100 text-purple-600', icon: <Droplet size={24} /> },
    { name: 'Cream', color: 'bg-pink-100 text-pink-600', icon: <Beaker size={24} /> },
    { name: 'Gel', color: 'bg-orange-100 text-orange-600', icon: <Beaker size={24} /> },
    { name: 'Medical Devices', color: 'bg-teal-100 text-teal-600', icon: <Stethoscope size={24} /> },
    { name: 'Surgical', color: 'bg-cyan-100 text-cyan-600', icon: <Scissors size={24} /> },
    { name: 'Ayurvedic', color: 'bg-lime-100 text-lime-600', icon: <Leaf size={24} /> },
    { name: 'OTC', color: 'bg-indigo-100 text-indigo-600', icon: <ShoppingBag size={24} /> },
    { name: 'Baby Care', color: 'bg-rose-100 text-rose-600', icon: <Baby size={24} /> },
    { name: 'Personal Care', color: 'bg-fuchsia-100 text-fuchsia-600', icon: <Heart size={24} /> },
    { name: 'Supplements', color: 'bg-emerald-100 text-emerald-600', icon: <Zap size={24} /> },
    { name: 'Diagnostic', color: 'bg-sky-100 text-sky-600', icon: <Activity size={24} /> },
  ];

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

      <div className="overflow-y-auto h-[calc(844px-80px-80px)] px-5 pb-6 hide-scrollbar">
        <h2 className="text-[20px] font-bold text-gray-900 mt-6 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Browse Categories</h2>
        
        {/* Search */}
        <div className="bg-white h-12 rounded-[14px] flex items-center px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
          <Search size={20} className="text-gray-400 mr-3" />
          <input type="text" placeholder="Search categories…" className="flex-1 bg-transparent border-none outline-none text-[14px] focus:ring-0" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center mb-3`}>
                {cat.icon}
              </div>
              <span className="text-[12px] font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 w-full h-[80px] bg-white border-t border-gray-100 flex justify-between items-center px-6 pb-4 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-30">
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <HomeIcon size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <Grid size={24} className="text-[#0F9D58]" />
          <span className="text-[10px] font-medium text-[#0F9D58]">Categories</span>
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