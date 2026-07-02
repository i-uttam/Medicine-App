import React from 'react';
import { Search, Home as HomeIcon, Grid, Package, User, ShoppingCart, ChevronRight, CheckCircle2, Truck, FileText, RotateCcw } from 'lucide-react';

export function Orders() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-2 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[22px] text-gray-900" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            My Orders
          </h1>
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <Search size={20} className="text-gray-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 pb-3 text-center text-[14px] font-bold text-[#0F9D58] border-b-2 border-[#0F9D58] relative">
            Current Orders
          </div>
          <div className="flex-1 pb-3 text-center text-[14px] font-medium text-gray-500">
            Past Orders
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(844px-130px-80px)] px-5 pt-5 pb-6 hide-scrollbar">
        
        {/* Order 1 (In Transit) */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 mb-5 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-1">Order #MW-2024-1847</p>
              <h3 className="font-bold text-[14px] text-gray-900 mb-1">3 items <span className="text-gray-300 mx-1">•</span> ₹4,760</h3>
              <p className="text-[11px] text-gray-400">Placed on 26 Jun 2024, 10:45 AM</p>
            </div>
            <div className="bg-orange-50 text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded border border-orange-100">
              Out for Delivery
            </div>
          </div>
          
          <div className="p-5 bg-gray-50/50">
            <div className="relative pl-6">
              {/* Timeline Line */}
              <div className="absolute top-2 bottom-2 left-[9px] w-[2px] bg-gray-200 rounded">
                <div className="absolute top-0 w-full bg-[#0F9D58] rounded h-[75%]"></div>
              </div>

              {/* Steps */}
              <div className="mb-4 relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-[#0F9D58] flex items-center justify-center border-2 border-white">
                  <CheckCircle2 size={10} color="white" />
                </div>
                <h4 className="text-[12px] font-bold text-gray-900 leading-none mb-1">Order Confirmed</h4>
                <p className="text-[10px] text-gray-500">26 Jun, 10:45 AM</p>
              </div>

              <div className="mb-4 relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-[#0F9D58] flex items-center justify-center border-2 border-white">
                  <CheckCircle2 size={10} color="white" />
                </div>
                <h4 className="text-[12px] font-bold text-gray-900 leading-none mb-1">Packed</h4>
                <p className="text-[10px] text-gray-500">26 Jun, 02:30 PM</p>
              </div>

              <div className="mb-4 relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-white border-[3px] border-[#0F9D58]"></div>
                <h4 className="text-[12px] font-bold text-[#0F9D58] leading-none mb-1">Out for Delivery</h4>
                <p className="text-[10px] text-[#0F9D58]">Arriving today by 7:00 PM</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                <h4 className="text-[12px] font-medium text-gray-400 leading-none mb-1">Delivered</h4>
                <p className="text-[10px] text-gray-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-3">
            <button className="flex-1 bg-white border border-[#0F9D58] text-[#0F9D58] h-[40px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2">
              <Truck size={16} /> Track Order
            </button>
          </div>
        </div>

        {/* Order 2 (Delivered) */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 mb-5 overflow-hidden">
          <div className="p-4 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                <div className="w-full h-full bg-white border border-gray-200 rounded-sm"></div>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium mb-1">Order #MW-2024-1831</p>
                <h3 className="font-bold text-[14px] text-gray-900 mb-1">12 items <span className="text-gray-300 mx-1">•</span> ₹18,450</h3>
                <div className="flex items-center gap-1 text-[#0F9D58]">
                  <CheckCircle2 size={12} />
                  <span className="text-[11px] font-bold">Delivered on 28 Jun</span>
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          
          <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/30">
            <button className="flex-1 bg-white border border-gray-200 text-gray-700 h-[36px] rounded-[8px] font-semibold text-[12px] flex items-center justify-center gap-2 shadow-sm">
              <FileText size={14} /> Invoice
            </button>
            <button className="flex-1 bg-[#0F9D58] text-white h-[36px] rounded-[8px] font-semibold text-[12px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(15,157,88,0.2)]">
              <RotateCcw size={14} /> Reorder
            </button>
          </div>
        </div>

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
          <Package size={24} className="text-[#0F9D58]" />
          <span className="text-[10px] font-medium text-[#0F9D58]">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <User size={24} className="text-gray-400" />
          <span className="text-[10px] font-medium text-gray-400">Profile</span>
        </div>
      </div>
    </div>
  );
}