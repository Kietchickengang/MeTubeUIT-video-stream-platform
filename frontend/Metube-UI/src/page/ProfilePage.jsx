import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../context/AuthContext.jsx';
import { changeAvatar, changePassword } from '../service/authService.js';
import { getCroppedImg } from '../utils/cropImg.js'
import { 
  User, Mail, ScanFace, KeyRound, LogOut, Eye, EyeOff, 
  ChevronRight, RotateCcw, SquarePlus, PersonStanding, 
  AtSign, Camera, CircleFadingArrowUp, Image
} from 'lucide-react';

const ProfilePage = () => {
  // const { user, logout } = useAuth();
  const { user, setUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  
  // Password's state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Avatar's state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarError('Please select an image file (png, jpg, jpeg).');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarSuccess('');
      setAvatarError('');
      setZoom(1);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatarPreview || !croppedAreaPixels) {
      setAvatarError('Please select and area to crop first.');
      return;
    }

    setAvatarLoading(true);
    setAvatarError('');
    setAvatarSuccess('');

    try {
      const croppedBlob = await getCroppedImg(avatarPreview, croppedAreaPixels);

      const finalCroppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('avatar', finalCroppedFile);
      
      // Logic change avatar here
      const data = await changeAvatar(formData);

      if (data && data.user) {
        setUser(data.user);
      } else if (data && data.avatarUrl) {
        setUser({ ...user, avatarUrl: data.avatarUrl });
      }

      setAvatarSuccess('Avatar updated successfully!');
      setAvatarFile(null);
      setAvatarPreview('');
      
      setTimeout(() => setShowChangeAvatar(false), 1500);
    } 
    catch (err) {
      setAvatarError(err?.message || 'Upload avatar failed.');
    } 
    finally {
      setAvatarLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill all before submit.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6-characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Unmatched confirmed password ');
      setLoading(false);
      return;
    }

    try {
      const data = await changePassword({ oldPassword, newPassword });
      setMessage(data.message || 'Change password successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowChangePassword(false), 1500);
    } 
    catch (err) {
      setError(err?.response?.data?.message || 'Change password failed.');
    }
    finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <div className="text-center font-inter animate-fade-in">
          <p className="text-zinc-500 mb-5 text-sm font-medium tracking-wide">Require verify account</p>
          <a 
            href="/login" 
            className="inline-block rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-white shadow-lg active:scale-95"
          >
            Login now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 relative mx-auto max-w-lg overflow-hidden rounded-[32px] border-none bg-[#0f0f0f] p-8 shadow-2xl shadow-black/80 font-inter select-none transition-all duration-300">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3ea6ff]/5 blur-[80px] pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-red-500/[0.03] blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Profile Card Header */}
        <div className="flex items-center gap-3 bg-zinc-900/10 p-2 rounded-2xl">
          <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-zinc-900/60 shadow-inner flex items-center justify-center overflow-hidden border-none group">
            {user.avatarUrl || user.image ? (
              <img 
                src={user.image || user.avatarUrl} 
                alt="Avatar" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <img src="https://tinyurl.com/49hydya9" className="text-zinc-500" alt="Default Avatar" />
            )}
          </div>
          <div className="text-left truncate mt-3">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100 truncate">{user.name}</h1>
            <p className="text-sm font-semibold text-zinc-500 tracking-wider uppercase">member</p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="space-y-3 mb-6 mt-4">
          <div className="w-full flex items-center justify-between rounded-2xl border-none bg-zinc-900/20 px-4 py-1 transition-all hover:bg-zinc-900/30 group">
            <div className="text-left">
              <span className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-0.5">username</span>
              <span className="text-md font-medium text-zinc-300">{user.name}</span>
            </div>
            <PersonStanding size={24} className="text-blue-600 transition-colors duration-200 group-hover:text-red-500" />
          </div>

          <div className="w-full flex items-center justify-between rounded-2xl border-none bg-zinc-900/20 px-4 py-1 transition-all hover:bg-zinc-900/30 group">
            <div className="text-left truncate pr-4">
              <span className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Email</span>
              <span className="text-md font-medium text-zinc-300 truncate block">{user.email}</span>
            </div>
            <AtSign size={24} className="text-blue-600 transition-colors duration-200 group-hover:text-red-500" />
          </div>
        </div>

        <div className="mb-3">
          {!showChangeAvatar ? (
            <button
              onClick={() => {
                setShowChangeAvatar(true);
                setShowChangePassword(false);
              }}
              className="w-full flex items-center justify-between rounded-xl bg-zinc-900/40 px-4 py-2 text-md font-semibold text-zinc-500 transition-all duration-200 hover:bg-zinc-900/60 hover:text-white active:scale-[0.99] group"
            >
              <div className="flex items-center gap-2">
                <Image size={24} className="text-blue-500 transition-colors duration-200 group-hover:text-red-500" />
                <span>Avatar</span>
              </div>
              <ChevronRight size={24} className="text-blue-300 transition-colors duration-200 group-hover:text-red-500" />
            </button>
          ) : (
            <form onSubmit={handleUploadAvatar} className="space-y-4 bg-zinc-900/10 p-1 rounded-2xl border-none animate-fade-in text-left">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-2 bg-zinc-950/40 transition-colors hover:border-zinc-700 relative min-h-[260px]">
                <input 
                  type="file" 
                  id="avatarInput" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={avatarLoading}
                />
                
                {avatarPreview ? (
                  <div className="w-full space-y-4">
                    <div className="relative w-full h-52 rounded-xl overflow-hidden bg[#0F0F0F]">
                      <Cropper
                        image={avatarPreview}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} 
                        cropShape="round" 
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="px-2 flex items-center gap-3">
                      <span className="text-xs font-bold text-red-400 font-inter uppercase tracking-wider">x{zoom.toFixed(1)}</span>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <label htmlFor="avatarInput" className="cursor-pointer flex flex-col items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors p-8 w-full text-center">
                    <CircleFadingArrowUp size={40} className="text-red-400 animate-pulse" />
                    <span className="text-md font-semibold tracking-wide text-red-400">Style your avatar</span>
                  </label>
                )}

                {avatarPreview && (
                  <label htmlFor="avatarInput" className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900/90 text-zinc-400 hover:text-white shadow-lg cursor-pointer z-20 backdrop-blur-sm transition-colors">
                    <Camera size={16} />
                  </label>
                )}
              </div>

              {avatarError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/5 p-3 text-sm font-medium text-red-400/90 border-none transition-all">
                  <span className="h-1 w-1 rounded-full bg-red-400 shrink-0"></span>
                  <span>{avatarError}</span>
                </div>
              )}
              {avatarSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 p-3 text-sm font-medium text-emerald-400/90 border-none transition-all">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>{avatarSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-1">
                <button
                  type="submit"
                  disabled={avatarLoading || !avatarPreview}
                  className="flex-1 rounded-xl py-2 text-sm font-bold uppercase tracking-wide text-green-500 transition-all duration-200 hover:bg-white active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
                >
                  {avatarLoading ? '...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeAvatar(false);
                    setAvatarFile(null);
                    setAvatarPreview('');
                  }}
                  className="hover:text-red-400 flex-1 rounded-xl bg-zinc-900/60 py-2 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all duration-200 hover:bg-zinc-900 hover:text-zinc-200 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* --- SECURITY & PASSWORD --- */}
        <div>
          {!showChangePassword ? (
            <button
              onClick={() => {
                setShowChangePassword(true);
                setShowChangeAvatar(false); 
              }}
              className="w-full flex items-center justify-between rounded-xl bg-zinc-900/40 px-4 py-2 text-md font-semibold text-zinc-500 transition-all duration-200 hover:bg-zinc-900/60 hover:text-white active:scale-[0.99] group"
            >
              <div className="flex items-center gap-2">
                <ScanFace size={24} className="text-blue-500 transition-colors duration-200 group-hover:text-red-500" />
                <span>Security & Password</span>
              </div>
              <ChevronRight size={24} className="text-blue-300 transition-colors duration-200 group-hover:text-red-500" />
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 mb-4 animate-fade-in text-left">
              {/* Current Password */}
              <div className="relative flex items-center group">
                <KeyRound size={20} className="absolute left-5 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
                <input
                  type={showOldPass ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current password"
                  className="ml-2 w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-12 py-2 text-md font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showOldPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative flex items-center group">
                <SquarePlus size={20} className="absolute left-5 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="ml-2 w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-12 py-2 text-md font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative flex items-center group">
                <RotateCcw size={20} className="absolute left-5 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="ml-2 w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-4 py-2 text-md font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                  disabled={loading}
                />
              </div>

              {/* Feedback */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/5 p-3 text-sm font-medium text-red-400/90 border-none transition-all">
                  <span className="h-1 w-1 rounded-full bg-red-400 shrink-0"></span>
                  <span>{error}</span>
                </div>
              )}
              {message && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 p-3 text-sm font-medium text-emerald-400/90 border-none transition-all">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>{message}</span>
                </div>
              )}

              {/* Form Buttons */}
              <div className="ml-2 mr-1 flex pt-1 items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success flex-1 rounded-xl bg-zinc-100 py-2.5 text-md font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-white active:scale-95 disabled:opacity-40"
                >
                  {loading ? '...' : 'OK'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="btn btn-danger flex-1 rounded-xl bg-zinc-900/60 py-2.5 text-md font-bold uppercase tracking-wide text-zinc-400 transition-all duration-200 hover:bg-zinc-900 hover:text-zinc-200 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;