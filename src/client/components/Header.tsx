import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-[#d2d2d7]/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#005bb5] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">MarkShare</span>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索文档..."
              className="w-full h-9 pl-9 pr-4 bg-[#f5f5f7] rounded-full text-[14px] text-[#1d1d1f] placeholder-[#86868b] border-none transition-all duration-200 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0071e3] to-[#005bb5] flex items-center justify-center">
                  <span className="text-[12px] font-medium text-white">{getInitial()}</span>
                </div>
                <span className="text-[14px] font-medium text-[#1d1d1f]">{user.username}</span>
                <svg className={`w-4 h-4 text-[#86868b] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#d2d2d7]/30 overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-[#e5e5e5]">
                    <p className="text-[14px] font-medium text-[#1d1d1f]">{user.username}</p>
                    <p className="text-[12px] text-[#86868b] truncate">{user.email || 'No email'}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2.5 text-left text-[14px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人设置
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-[14px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      我的文档
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-[14px] text-[#ff3b30] hover:bg-[#fff5f5] transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-[14px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors"
              >
                登录
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-[14px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-all duration-200 hover:scale-105"
              >
                注册
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
