import { Search, Menu, Video, Bell, User, Mic, Play, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';
import { getNotifications } from '../service/authService.js';

const Navbar = ({ goToUploadPage, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const allVideosRef = useRef([]);
  const blurTimerRef = useRef(null);
  const socketRef = useRef(null);

  const api_port = 8000;
  const hostPath = `http://localhost:${api_port}/metube/videos`;

  useEffect(() => {
    const h = localStorage.getItem('search_history');
    if (h) {
      try { setHistory(JSON.parse(h)); } catch { setHistory([]); }
    }

    // Prefetch videos to provide suggestions
    (async () => {
      try {
        const res = await fetch(hostPath);
        const data = await res.json();
        allVideosRef.current = data || [];
      } 
      catch (err) {
        allVideosRef.current = [];
      }
    })();
  }, []);

  // Connect socket and join user room for notifications
  useEffect(() => {
    if (!user) return;
    const socket = io('http://localhost:8000');
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('join_user', user.id);
    });

    socket.on('notification', (n) => {
      setNotifications((prev) => [n, ...prev]);
    });

    // load existing notifications once
    (async () => {
      try {
        const res = await getNotifications();
        if (res && res.notifications) setNotifications(res.notifications);
      } catch (e) { console.error('Failed to load notifications', e); }
    })();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      pushHistory(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const pushHistory = (q) => {
    if (!q) return;
    const next = [q, ...history.filter((x) => x !== q)].slice(0, 10);
    setHistory(next);
    localStorage.setItem('search_history', JSON.stringify(next));
  };

  const handleSuggestionClick = (val) => {
    setSearchQuery(val);
    pushHistory(val);
    navigate(`/search?q=${encodeURIComponent(val)}`);
    setFocused(false);
  };

  const updateSuggestions = (q) => {
    if (!q) {
      // show history or recommendation
      const popular = (allVideosRef.current || []).slice(0, 6).map(v => v.title).filter(Boolean);
      setSuggestions(history.length ? history : popular);
      return;
    }
    const text = q.toLowerCase();
    const matches = (allVideosRef.current || []).filter(v => (`${v.title || ''} ${v.description || ''} ${v.channelName || ''} ${v.userId?.name || ''}`).toLowerCase().includes(text)).slice(0,6);
    const mapped = matches.map(m => m.title || m.channelName || m.videoId);
    setSuggestions(mapped.length ? mapped : [q]);
  };

  return (
    <nav className="fixed top-0 w-full bg-[#0f0f0f] text-white flex justify-between items-center px-4 h-14 z-50">
      {/* Left side: Menu & Logo */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 hover:bg-[#272727] border-none rounded-full transition text-white">
          <Menu size={23} strokeWidth={1.5} />
        </button>
        
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-1 cursor-pointer"
        >
          <div className="bg-red-600 p-1 rounded-lg">
             <Play size={20} color="red" fill="white" className="w-7 h-4"/>
          </div>
          <span className="font-semibold text-[23px] tracking-[-0.11em] text-white hover:no-underline">MeTube <sup className="text-[10px] text-gray-400 -translate-y-2 inline-block tracking-tight">VN</sup></span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-[720px] ml-10 items-center gap-4">
        <form onSubmit={handleSearch} className={`flex w-full ${focused? 'border-2 border-blue-400 rounded-pill':''}`}>
            <div className="relative flex items-center w-full bg-[#121212] rounded-l-full px-4 py-2 focus-within:border-[#1c62b9] focus-within:ml-[-1px] transition-all">
            <Search size={18} className="text-[#aaaaaa] mr-3 hidden focus-within:block" />
            <input 
              autoComplete="false"
              spellCheck="false"
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); updateSuggestions(e.target.value); }}
              onFocus={() => { setFocused(true); updateSuggestions(searchQuery); }}
              onBlur={() => { blurTimerRef.current = setTimeout(() => setFocused(false), 150); }}
              placeholder="Tìm kiếm" 
              className={`w-full bg-transparent outline-none text-[17px] placeholder-[#aaaaaa] text-[#f1f1f1]`}
            />

            {focused && suggestions && suggestions.length > 0 && (
              <div className="absolute left-4 top-full mt-3 w-fit max-h-72 overflow-auto rounded-2xl bg-neutral-900 border-none shadow-2xl p-1 z-50">
                {suggestions.map((s, idx) => (
                  <div key={idx} onMouseDown={() => { 
                    if (blurTimerRef.current) clearTimeout(blurTimerRef.current); handleSuggestionClick(s); }} className="flex gap-2 font-semibold px-3 py-2.5 hover:bg-[#1a1a1a] cursor-pointer text-[#e6e6e6] text-md rounded-md tracking-tight">
                    <Search/> {s}
                  </div>
                ))}
                {suggestions.length === 0 && <div className="px-3 py-2 text-[#777]">No suggestions</div>}
              </div>
            )}
          </div>
          <button type="submit" className="bg-[#222222] border-none rounded-r-full px-4 py-1.5 hover:bg-[#272727] transition shadow-sm group">
            <Search size={20} strokeWidth={2.5} className="text-[#f1f1f1]" />
          </button>
        </form>
        <button className="p-2.5 bg-[#181818] hover:bg-[#272727] rounded-full transition text-white">
          <Mic size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white" onClick={goToUploadPage}>
          <Plus size={24} strokeWidth={1.5} />
        </button>
        <div className="relative">
          <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white">
            <Bell size={24} strokeWidth={1.5} />
          </button>
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{notifications.length}</div>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center">
            <button
              onClick={() => navigate('/profile')}
              className="p-1 border-none text-[#FFFFFF] rounded-full flex items-center gap-2 px-3 hover:bg-[#272727] hover:border-transparent transition"
            >
              <div className="border-2 border-blue-500 rounded-full p-0.5">
                <img
                  src={user?.avatarUrl || user?.image || "https://tinyurl.com/49hydya9"}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
              <span className="text-md font-semibold hidden md:inline text-white truncate max-w-[120px]">
                {user.name.split(' ').at(-1)}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#272727] rounded-full text-white transition hidden sm:block"
              title="Đăng xuất"
            >
              <LogOut size={22} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            className="group p-1.5 border-none text-[#FFFFFF] rounded-full flex items-center gap-2 px-3 hover:bg-[#263850] hover:border-transparent transition ml-2"
            onClick={() => navigate('/login')}
          >
            <div className="border-2 border-[#007FFF] rounded-full p-0.5 group-hover:border-[#FF3366]">
              <User size={20} strokeWidth={3} className="text-[#007FFF] group-hover:text-[#FF3366]"/>
            </div>
            <span className="text-[16px] text-[#007FFF] font-bold hidden md:inline hover:no-underline group-hover:text-[#FF3366]">Đăng nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;