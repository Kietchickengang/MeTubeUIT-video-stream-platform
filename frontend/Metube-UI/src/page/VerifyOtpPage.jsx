import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerVerify, registerRequest } from '../service/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SiInstructables } from '@icons-pack/react-simple-icons';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const { setUser } = useAuth();
  
  const inputRefs = useRef([]);

  useEffect(() => {
    const p = sessionStorage.getItem('pendingRegister');
    if (!p) {
      navigate('/register');
      return;
    }
    try { 
      setPending(JSON.parse(p)); 
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } 
    catch { 
      navigate('/register'); 
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const shown = local.length <= 2 ? local[0] : local.slice(0, 4);
    return `${shown}***@${domain}`;
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    const lastChar = value.substring(value.length - 1);
  
    if (lastChar && isNaN(lastChar)) return; 

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);
    if (lastChar && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index] !== '') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } 
      else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length - 1, 5);
      if (focusIndex >= 0) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleResend = async () => {
    if (!pending) return;
    setError('');
    setMessage('');
    try {
      await registerRequest({ name: pending.name, email: pending.email, password: pending.password });
      setMessage('OTP sent.');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    } 
    catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Resend failed.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!pending) return;
    
    const finalCode = otp.join('');
    
    if (finalCode.length < 6) { 
      setError('Please enter the full 6-digit code.'); 
      return; 
    }

    try {
      const res = await registerVerify({ email: pending.email, code: finalCode });
      // registerVerify now returns the created user and sets cookie; update auth context
      if (res?.user) setUser(res.user);
      sessionStorage.removeItem('pendingRegister');
      setMessage('Account verified successfully. Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    } 
    catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="h-fit mt-12 relative mx-auto max-w-md overflow-hidden rounded-[32px] border-none bg-[#0f0f0f] pt-12 px-8 pb-8 shadow-2xl shadow-black/80">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3ea6ff]/10 blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
          <div className="mb-3 text-center flex flex-col justify-center items-center">
          <div className="h-16 w-16 bg-zinc-900/80 rounded-full flex items-center justify-center mb-1 shadow-inner border-none">
             <SiInstructables size={40} className="text-red-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Human test</h1>
          <p className="mt-3 text-sm text-zinc-400 w-fit">
            OTP sent to <span className='text-blue-400 font-semibold'>{maskEmail(pending?.email) || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-2 font-inter">
          {/* OTP */}
          <div className="flex justify-between items-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold text-zinc-100 bg-zinc-900/50 border-none rounded-xl outline-none transition-all duration-200 focus:bg-zinc-900 focus:border-[#3ea6ff] focus:ring-1 focus:ring-[#3ea6ff]/50 placeholder-zinc-700"
                placeholder="-"
              />
            ))}
          </div>

          {/* MSG */}
          <div className="min-h-[24px] text-center">
            {error && <p className="text-sm font-medium text-red-400 animate-fade-in">{error}</p>}
            {message && <p className="text-sm font-medium text-emerald-400 animate-fade-in">{message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="submit" 
              className="rounded-xl col-span-1 bg-[#3ea6ff] py-2 text-md font-bold tracking-wide text-white transition-all duration-200 hover:bg-[#65b8ff] active:scale-[0.98] shadow-[0_0_20px_rgba(62,166,255,0.2)]"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`rounded-xl col-span-1 ${countdown>0? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-700 text-zinc-100'} py-2 text-md font-bold tracking-wide transition-all duration-200`}
            >
              {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;