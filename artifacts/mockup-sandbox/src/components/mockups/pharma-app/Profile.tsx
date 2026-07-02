import React from 'react';
import { Camera, ShieldCheck, ChevronRight, Bell, CreditCard, Heart, Globe, Moon, HelpCircle, Star, FileText, LogOut, Home as HomeIcon, Grid, Package, User, ShoppingCart } from 'lucide-react';

export function Profile() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header Area */}
      <div className="relative">
        <div className="h-[140px] bg-gradient-to-r from-[#0F9D58] to-[#34A853] w-full" />
        
        {/* Profile Card */}
        <div className="absolute top-[80px] left-5 right-5 bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center">
          <div className="relative -mt-[50px] mb-3">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold font-['Poppins']">
                CM
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-gray-600">
              <Camera size={14} />
            </div>
          </div>
          
          <h2 className="text-[20px] font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>City Medical Store</h2>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#0F9D58] bg-green-50 px-2.5 py-1 rounded-full border border-green-100 mb-3">
            <ShieldCheck size={14} /> Verified Business
          </div>
          <p className="text-[12px] text-gray-500 font-medium">GST: 27ABCDE1234F1Z5</p>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(844px-180px-80px)] px-5 pt-[130px] pb-8 hide-scrollbar">
        
        {/* Business Info Details */}
        <div className="bg-white rounded-[16px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 mb-6">
          <h3 className="text-[14px] font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">Business Information</h3>
          <div className="flex flex-col gap-3 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Drug License</span>
              <span className="font-semibold text-gray-900">DL/MH/12345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium text-gray-900">Rajesh Kumar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">+91 98765 43210</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-gray-500">Registered Address</span>
              <span className="font-medium text-gray-900 leading-tight">Shop No. 42, Ground Floor, Sai Complex, MG Road, Andheri West, Mumbai 400058</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 mb-6 overflow-hidden">
          {[
            { icon: <Bell size={18} className="text-blue-500" />, label: 'Notifications', badge: '2 New' },
            { icon: <CreditCard size={18} className="text-purple-500" />, label: 'Payment & Credit Limit' },
            { icon: <Heart size={18} className="text-red-500" />, label: 'My Wishlist' },
            { icon: <Globe size={18} className="text-teal-500" />, label: 'Language', value: 'English' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-4 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-medium text-[14px] text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                {item.value && <span className="text-[12px] text-gray-500 font-medium">{item.value}</span>}
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 mb-6 overflow-hidden">
          {[
            { icon: <Moon size={18} className="text-indigo-500" />, label: 'Dark Mode', toggle: true },
            { icon: <HelpCircle size={18} className="text-orange-500" />, label: 'Help & Support' },
            { icon: <Star size={18} className="text-yellow-500" />, label: 'Rate the App' },
            { icon: <FileText size={18} className="text-gray-500" />, label: 'Terms & Privacy' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-4 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-medium text-[14px] text-gray-900">{item.label}</span>
              </div>
              {item.toggle ? (
                <div className="w-[40px] h-[22px] bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                  <div className="w-[18px] h-[18px] bg-white rounded-full shadow-sm"></div>
                </div>
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>

        <button className="w-full bg-white border border-red-200 text-red-500 h-[52px] rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm mb-4">
          <LogOut size={18} /> Logout
        </button>
        
        <p className="text-center text-gray-400 text-[11px]">App Version 2.4.1 (Build 84)</p>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 w-full h-[80px] bg-white border-t border-gray-100 flex justify-between items-center px-6 pb-4 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-30">
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <HomeIcon size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Home</span>
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
          <User size={24} className="text-[#0F9D58]" />
          <span className="text-[10px] font-medium text-[#0F9D58]">Profile</span>
        </div>
      </div>
    </div>
  );
}