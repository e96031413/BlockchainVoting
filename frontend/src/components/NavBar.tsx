import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 獲取用戶狀態
  const { user, isAuthenticated, logout } = useUserStore();

  // 檢查當前路徑是否匹配
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // 處理登出
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo 和主導航連結 */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                區塊鏈投票系統
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') 
                    ? 'border-white text-white' 
                    : 'border-transparent text-blue-100 hover:border-blue-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                首頁
              </Link>
              <Link
                to="/elections"
                className={`${
                  isActive('/elections') 
                    ? 'border-white text-white' 
                    : 'border-transparent text-blue-100 hover:border-blue-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                選舉列表
              </Link>
              <Link
                to="/create-election"
                className={`${
                  isActive('/create-election') 
                    ? 'border-white text-white' 
                    : 'border-transparent text-blue-100 hover:border-blue-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                創建選舉
              </Link>
            </div>
          </div>

          {/* 用戶菜單 */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              {isAuthenticated ? (
                <div className="flex space-x-4 items-center">
                  <Link
                    to="/profile"
                    className={`${isActive('/profile') ? 'border-white text-white' : 'border-transparent text-blue-100 hover:border-blue-200 hover:text-white'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {user?.name || '個人資料'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-blue-100 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    登出
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-blue-100 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    登入
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    註冊
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 移動端菜單按鈕 */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">打開主菜單</span>
              {/* 漢堡圖標 */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移動端菜單，根據 isMenuOpen 狀態顯示/隱藏 */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`${
              isActive('/') 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-100 hover:bg-blue-600 hover:text-white'
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            首頁
          </Link>
          <Link
            to="/elections"
            className={`${
              isActive('/elections') 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-100 hover:bg-blue-600 hover:text-white'
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            選舉列表
          </Link>
          <Link
            to="/create-election"
            className={`${
              isActive('/create-election') 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-100 hover:bg-blue-600 hover:text-white'
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            創建選舉
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`${
                  isActive('/profile') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {user?.name || '個人資料'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-100 hover:bg-blue-600 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${
                  isActive('/login') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                登入
              </Link>
              <Link
                to="/register"
                className={`${
                  isActive('/register') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                註冊
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
