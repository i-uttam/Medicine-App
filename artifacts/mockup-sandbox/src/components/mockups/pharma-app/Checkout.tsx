import React from 'react';
import { ArrowLeft, ChevronDown, Check, Info, FileText, CheckSquare, Briefcase, Banknote } from 'lucide-react';

export function Checkout() {
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
        <h1 className="text-[18px] text-gray-900" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Checkout
        </h1>
      </div>

      <div className="overflow-y-auto h-[calc(844px-80px-100px)] px-5 pt-6 pb-6 hide-scrollbar">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 w-1/2 h-[2px] bg-[#0F9D58] -z-10 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center gap-2 bg-[#F8FAFC]">
            <div className="w-6 h-6 rounded-full bg-[#0F9D58] text-white flex items-center justify-center">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-semibold text-[#0F9D58]">Address</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-[#F8FAFC] px-2">
            <div className="w-6 h-6 rounded-full bg-[#0F9D58] text-white flex items-center justify-center border-[3px] border-green-100 font-bold text-[12px]">
              2
            </div>
            <span className="text-[11px] font-bold text-gray-900">Payment</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-[#F8FAFC]">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-[12px]">
              3
            </div>
            <span className="text-[11px] font-medium text-gray-400">Confirm</span>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-[14px] text-gray-900 flex items-center gap-2">
              Delivery Address
            </h3>
            <span className="text-[#0F9D58] text-[12px] font-semibold cursor-pointer">Change</span>
          </div>
          <div className="text-[13px] text-gray-600 leading-relaxed">
            <p className="font-bold text-gray-900 mb-1">City Medical Store</p>
            <p>Shop No. 42, Ground Floor, Sai Complex</p>
            <p>MG Road, Andheri West</p>
            <p>Mumbai, Maharashtra - 400058</p>
            <p className="mt-2 text-gray-500 flex items-center gap-1"><span className="text-gray-900 font-medium">+91 98765 43210</span></p>
          </div>
        </div>

        {/* Payment Methods */}
        <h3 className="font-bold text-[16px] text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Method</h3>
        
        <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#0F9D58] mb-4 overflow-hidden">
          <div className="p-4 flex gap-3 bg-green-50/30">
            <div className="mt-0.5">
              <div className="w-5 h-5 rounded-full border-[5px] border-[#0F9D58] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F9D58]"></div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[14px] text-gray-900 mb-1">UPI</h4>
              <p className="text-[12px] text-gray-500 mb-3">Pay via GPay, PhonePe, Paytm</p>
              
              <div className="bg-white border border-gray-200 rounded-[10px] p-2 flex gap-2 items-center">
                <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfc)" className="flex-1 text-[13px] outline-none px-2" />
                <button className="bg-gray-100 text-gray-700 text-[12px] font-semibold px-3 py-1.5 rounded-[6px]">Verify</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Briefcase size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[14px] text-gray-900">Credit Account</h4>
            <p className="text-[11px] text-[#0F9D58] font-medium mt-0.5">Available limit: ₹45,000</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <FileText size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[14px] text-gray-900">Purchase Order</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Upload PO document</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[14px] text-gray-900">Net Banking</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">All Indian banks supported</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Banknote size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[14px] text-gray-900">Cash on Delivery</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Pay in cash when order arrives</p>
          </div>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">COD</span>
        </div>

        {/* GST Invoice */}
        <div className="flex items-start gap-3 mb-6 p-4 bg-[#F8FAFC] rounded-[12px] border border-gray-200 border-dashed">
          <div className="text-[#0F9D58] mt-0.5"><CheckSquare size={18} /></div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[13px] text-gray-900">Request GST Invoice</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Invoice will be generated for GSTIN: 27ABCDE1234F1Z5</p>
          </div>
        </div>

        {/* Order Summary Mini */}
        <div className="bg-white p-4 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[12px] text-gray-500 font-medium">Order Total (3 items)</span>
            <span className="font-bold text-[16px] text-gray-900 mt-1">₹4,760</span>
          </div>
          <ChevronDown size={20} className="text-gray-400" />
        </div>

      </div>

      {/* Place Order Button */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-20">
        <button className="w-full bg-[#0F9D58] text-white h-[56px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[16px] shadow-[0_4px_16px_rgba(15,157,88,0.25)]">
          Place Order <span className="mx-1 opacity-50">|</span> ₹4,760
        </button>
      </div>
    </div>
  );
}