import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '../service/userDataService.js';
import { MoonStar, Sun } from 'lucide-react';

const SettingsPage = () => {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const currentTheme = getTheme();
    setThemeState(currentTheme);
    document.documentElement.classList.toggle('theme-light', currentTheme === 'light');
    document.documentElement.classList.toggle('theme-dark', currentTheme === 'dark');
  }, []);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setThemeState(selectedTheme);
    document.documentElement.classList.toggle('theme-light', selectedTheme === 'light');
    document.documentElement.classList.toggle('theme-dark', selectedTheme === 'dark');
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-3">Cài đặt</h1>
      <p className="text-md text-[#c0c0c0] leading-relaxed mb-4">
        Thiết lập cá nhân và tùy chọn giao diện sẽ được quản lý ở đây.
      </p>

      <div className="grid gap-6">
        <div className={`rounded-3xl ${theme === 'light'? 'border-1 border-neutral-200':'border-none'} w-fit bg-[#121212] p-6`}>
          <h2 className="text-2xl font-semibold mb-3">Theme</h2>
          <p className="text-sm text-[#c0c0c0] mb-4">
            Chọn giao diện cho ứng dụng. Lựa chọn sẽ được lưu và áp dụng cho toàn bộ trang.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-row  gap-x-2 rounded-full px-5 py-3 text-md font-semibold transition ${theme === 'dark' ? 'bg-[#010B13] text-blue-400 border-1 border-blue-400' : 'bg-[#222222] text-[#BEBFC5] hover:bg-[#2a2a2a]'}`}
            >
              <MoonStar color={`${theme === 'dark'? '#0070FF':'#BEBFC5'}`}></MoonStar>Dark
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex flex-row gap-x-2 rounded-full px-5 py-3 text-md font-semibold transition ${theme === 'light' ? 'bg-[#F5FFFA] text-[#FFD800] border-1 border-yellow-400' : 'bg-[#222222] text-[#BEBFC5] hover:bg-neutral-700'}`}
            >
              <Sun color={`${theme === 'light'? '#FE5A1D':'#BEBFC5'}`}></Sun>Light
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
