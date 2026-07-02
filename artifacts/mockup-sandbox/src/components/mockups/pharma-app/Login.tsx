import React from 'react';
import { Lock } from 'lucide-react';

export function Login() {
  return (
    <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', backgroundColor: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
      `}</style>

      {/* Top Green Wave Background */}
      <svg className="absolute top-0 w-full h-[200px]" viewBox="0 0 390 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H390V120C390 120 288.5 186.5 195 186.5C101.5 186.5 0 120 0 120V0Z" fill="url(#paint0_linear)"/>
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="390" y2="186.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F9D58"/>
            <stop offset="1" stopColor="#34A853"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="relative pt-[160px] px-6">
        <h1 className="text-[24px] text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Welcome Back
        </h1>
        <p className="text-[14px] text-gray-500 mb-8">Sign in to your account</p>

        <div className="flex bg-gray-50 border border-gray-200 rounded-[14px] h-[52px] items-center px-4 mb-4">
          <span className="text-gray-600 font-medium mr-2 border-r border-gray-300 pr-2">+91</span>
          <input type="tel" placeholder="Enter Mobile Number" className="bg-transparent border-none outline-none flex-1 text-gray-900 font-medium" />
        </div>

        <button className="w-full h-[52px] bg-[#0F9D58] text-white rounded-[14px] font-semibold text-[15px] mb-6 shadow-[0_4px_14px_rgba(15,157,88,0.3)]">
          Send OTP
        </button>

        <div className="flex justify-between gap-3 mb-6">
          {[1,2,3,4].map(i => (
            <input key={i} type="text" maxLength={1} className="w-[72px] h-[64px] bg-gray-50 border border-gray-200 rounded-[14px] text-center text-2xl font-semibold text-gray-900 outline-[#0F9D58] focus:border-[#0F9D58]" />
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">or</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <button className="w-full h-[52px] bg-white border border-gray-200 text-gray-700 rounded-[14px] font-semibold text-[15px] flex items-center justify-center gap-3 mb-10 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[#0F9D58] font-semibold text-[14px] mb-8">
          New user? Register your business
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Lock size={14} />
          <span className="text-[12px] font-medium">Secure B2B Login</span>
        </div>
      </div>
    </div>
  );
}