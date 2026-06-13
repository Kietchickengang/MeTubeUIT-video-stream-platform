import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, registerRequest } from '../service/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Name must have at least 2 characters.');
      return false;
    }
    if (name.trim().length > 100) {
      setError('Name must not exceed 100 characters.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Invalid email format.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must have at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    try {
      // request OTP and store pending registration in sessionStorage
      await registerRequest({ name: name.trim(), email: email.trim(), password });
      const pending = { name: name.trim(), email: email.trim(), password };
      sessionStorage.setItem('pendingRegister', JSON.stringify(pending));
      navigate('/verify-otp');
      return;
    } 
    catch (err) {
      console.error('Register error details:', err);
      console.error('Error response:', err?.response?.data);
      const responseMessage = err?.response?.data?.message || 'Register failed. Please try later.';
      setError(responseMessage);
    }
  };

  return (
    <div className="h-fit mt-2 relative mx-auto max-w-md overflow-hidden rounded-3xl border-none border-zinc-800/60 bg-[#0f0f0f] pt-10 px-10 pb-6 shadow-2xl shadow-black/40">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#3ea6ff]/10 blur-[60px] pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-red-500/5 blur-[60px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Đăng ký</h1>
          <p className="mt-3 text-md text-zinc-400">Nâng tầm giải trí với nền tảng streaming Metube</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-inter font-semibold">
          {/* Name Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-[#007FFF] transition-colors duration-200 group-focus-within:text-red-400">
              username
            </label>
            <input
              autoComplete='false'
              spellCheck={false}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Email Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-[#007FFF] transition-colors duration-200 group-focus-within:text-red-400">
              Email
            </label>
            <input
              autoComplete='false'
              spellCheck={false}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#007FFF] transition-colors duration-200 group-focus-within:text-red-400">
              Password
            </label>
            <input
              autoComplete='false'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secure your account"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border-none border-red-500/20 bg-red-500/10 p-3.5 text-sm font-mono text-red-400 transition-all">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2.5 rounded-xl border-none border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-mono text-emerald-400 transition-all">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-200 py-2.5 text-md font-semibold text-gray-600 transition-all duration-200 hover:bg-white hover:scale-[1.01] hover:text-blue-500 active:scale-[0.99] shadow-md"
          >
            Đăng ký
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-4 text-center text-md text-zinc-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="ml-2 font-semibold text-red-500 hover:underline transition-colors no-underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;