import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  // 獲取用戶狀態和導航
  const { login, isAuthenticated, isLoading, error: loginError } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 獲取重定向路徑（如果有）
  const from = (location.state as any)?.from?.pathname || '/';

  // 如果已經登入，重定向到首頁
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);
  
  // 設置錯誤信息
  useEffect(() => {
    if (loginError) {
      // 提供更詳細的錯誤信息
      if (loginError.includes('認證失敗') || loginError.includes('authentication failed')) {
        setError('電子郵件或密碼不正確，請重試');
      } else if (loginError.includes('找不到用戶') || loginError.includes('not found')) {
        setError('找不到此電子郵件的帳戶，請檢查或註冊新帳戶');
      } else {
        setError(loginError);
      }
    }
  }, [loginError]);

  // 在組件加載時檢查是否有記住的電子郵件
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 增強的表單驗證
    if (!email) {
      setError('請輸入電子郵件地址');
      return;
    }
    
    if (!password) {
      setError('請輸入密碼');
      return;
    }
    
    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('請輸入有效的電子郵件地址');
      return;
    }
    
    setError('');
    
    try {
      // 使用用戶狀態存儲的 login 方法進行認證
      await login(email, password);
      
      // 如果選擇了「記住我」，可以在這裡設置本地存儲
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // 登入成功後，將在 useEffect 中處理重定向
    } catch (err) {
      // 錯誤已經在 useEffect 中處理
      console.error('登入錯誤:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">登入您的帳戶</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                記住我
              </label>
            </div>
            
            <div className="text-sm">
              <button
                type="button"
                onClick={() => alert('密碼重置功能即將推出')}
                className="text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
              >
                忘記密碼？
              </button>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            還沒有帳戶？{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              立即註冊
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            登入即表示您同意我們的
            <button
              type="button"
              onClick={() => alert('服務條款內容即將推出')}
              className="text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
            >服務條款</button>
            和
            <button
              type="button"
              onClick={() => alert('隱私政策內容即將推出')}
              className="text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
            >隱私政策</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
