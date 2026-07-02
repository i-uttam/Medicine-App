import React from 'react';
import { ArrowLeft, Share2, Heart, Check, Info, Package } from 'lucide-react';

export function ProductDetail() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 w-full z-20 px-5 pt-12 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </div>
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <Share2 size={20} className="text-gray-700" />
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <Heart size={20} className="text-gray-700" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(844px-90px)] pt-[88px] pb-6 hide-scrollbar">
        {/* Product Image */}
        <div className="bg-white w-full h-[240px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <div className="w-40 h-32 border-4 border-gray-100 rounded-lg bg-gray-50 flex flex-wrap gap-2 p-3 items-center justify-center relative shadow-sm">
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200"></div>
          </div>
          <div className="absolute bottom-4 left-5 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F9D58]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-2">
          <div className="flex gap-2 mb-2">
            <span className="bg-green-50 text-[#0F9D58] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-green-100">
              <Check size={10} /> Verified Seller
            </span>
            <span className="bg-blue-50 text-[#4285F4] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
              Prescription Required
            </span>
          </div>

          <h1 className="text-[20px] font-bold text-gray-900 leading-tight mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Amoxicillin 500mg Capsules
          </h1>
          <p className="text-[13px] text-gray-500 mb-4">Amoxicillin Trihydrate</p>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-[12px] text-gray-600 font-medium">By</span>
            <span className="text-[12px] font-bold text-gray-900 underline decoration-gray-300 underline-offset-4">Sun Pharma</span>
          </div>

          <div className="flex items-end gap-3 mb-2">
            <span className="text-[#0F9D58] font-bold text-[28px] leading-none">₹890<span className="text-[14px] text-gray-500 font-normal">/box</span></span>
            <span className="bg-[#EA4335]/10 text-[#EA4335] text-[11px] font-bold px-2 py-1 rounded mb-1">26% OFF</span>
          </div>
          <p className="text-gray-400 text-[13px] line-through mb-4">MRP: ₹1,200</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <Package size={14} className="text-gray-500" />
              <span className="text-[12px] font-medium text-gray-700">Pack of 100 Caps</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <Info size={14} className="text-gray-500" />
              <span className="text-[12px] font-medium text-gray-700">GST: 12%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F9D58]"></div>
            <span className="text-[#0F9D58] font-medium text-[13px]">In Stock (5,000 units)</span>
          </div>
        </div>

        {/* Bulk Pricing */}
        <div className="bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-2">
          <h3 className="font-bold text-[15px] mb-4 text-gray-900">Bulk Wholesale Pricing</h3>
          <div className="border border-gray-200 rounded-[12px] overflow-hidden">
            <div className="flex bg-gray-50 text-[12px] font-semibold text-gray-600 p-3 border-b border-gray-200">
              <div className="flex-1">Quantity</div>
              <div className="w-24 text-right">Price/Box</div>
            </div>
            <div className="flex p-3 border-b border-gray-100 text-[13px]">
              <div className="flex-1 font-medium text-gray-900">5 - 9 boxes</div>
              <div className="w-24 text-right font-bold text-gray-900">₹890</div>
            </div>
            <div className="flex p-3 border-b border-gray-100 text-[13px] bg-green-50/50">
              <div className="flex-1 font-medium text-[#0F9D58]">10 - 24 boxes</div>
              <div className="w-24 text-right font-bold text-[#0F9D58]">₹840</div>
            </div>
            <div className="flex p-3 text-[13px]">
              <div className="flex-1 font-medium text-[#0F9D58]">25+ boxes</div>
              <div className="w-24 text-right font-bold text-[#0F9D58]">₹790</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-1">
            <Info size={12} /> Minimum Order Quantity (MOQ): 5 boxes
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-h-[200px]">
          <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
            {['Description', 'Composition', 'Uses', 'Storage'].map((tab, i) => (
              <div key={i} className={`px-5 py-4 text-[14px] font-medium whitespace-nowrap ${i === 0 ? 'text-[#0F9D58] border-b-2 border-[#0F9D58]' : 'text-gray-500'}`}>
                {tab}
              </div>
            ))}
          </div>
          <div className="p-5 text-[13px] text-gray-600 leading-relaxed">
            <p className="mb-3">Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.</p>
            <p>For B2B wholesale only. Valid drug license required for purchase.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 w-full h-[90px] bg-white border-t border-gray-100 px-5 pt-3 pb-6 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-20">
        <button className="flex-1 border-2 border-[#0F9D58] text-[#0F9D58] font-bold text-[15px] rounded-[14px] flex items-center justify-center gap-2">
          Add to Cart
        </button>
        <button className="flex-1 bg-[#0F9D58] text-white font-bold text-[15px] rounded-[14px] shadow-[0_4px_14px_rgba(15,157,88,0.3)]">
          Buy Now
        </button>
      </div>
    </div>
  );
}