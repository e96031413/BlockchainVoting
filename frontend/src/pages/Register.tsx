import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    walletAddress: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: 基本信息, 2: KYC 驗證
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [photoDocument, setPhotoDocument] = useState<File | null>(null);
  
  // 獲取用戶狀態和導航
  const { register, isAuthenticated, isLoading, error: registerError } = useUserStore();
  const navigate = useNavigate();
  
  // 如果已經登入，重定向到首頁
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // 設置錯誤信息
  useEffect(() => {
    if (registerError) {
      // 提供更詳細的錯誤信息
      if (registerError.includes('電子郵件已存在') || registerError.includes('email already exists')) {
        setError('此電子郵件已被註冊，請使用其他電子郵件或嘗試登入');
      } else if (registerError.includes('錢包地址') || registerError.includes('wallet address')) {
        setError('錢包地址格式不正確，請確保輸入有效的以太坊地址');
      } else {
        setError(registerError);
      }
    }
  }, [registerError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep1 = () => {
    // 驗證全名
    if (!formData.fullName) {
      setError('請輸入您的全名');
      return false;
    }
    
    // 驗證電子郵件
    if (!formData.email) {
      setError('請輸入您的電子郵件地址');
      return false;
    }
    
    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('請輸入有效的電子郵件地址');
      return false;
    }
    
    // 驗證密碼
    if (!formData.password) {
      setError('請輸入密碼');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('密碼必須至少包含 8 個字符');
      return false;
    }
    
    // 驗證密碼強度
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordStrengthRegex.test(formData.password)) {
      setError('密碼必須包含至少一個大寫字母、一個小寫字母和一個數字');
      return false;
    }
    
    // 驗證確認密碼
    if (!formData.confirmPassword) {
      setError('請再次輸入密碼進行確認');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('密碼和確認密碼不匹配');
      return false;
    }
    
    // 驗證服務條款同意
    if (!formData.agreeTerms) {
      setError('您必須同意服務條款和隱私政策');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  // 處理文件上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'photo') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'id') {
        setIdDocument(e.target.files[0]);
      } else {
        setPhotoDocument(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNextStep();
      return;
    }
    
    setError('');
    
    try {
      // 使用用戶狀態存儲的 register 方法進行註冊
      await register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.walletAddress || undefined
      );
      
      // 註冊成功後，將在 useEffect 中處理重定向
      
      // 如果需要上傳 KYC 文件，可以在這裡實現
      // 目前我們只模擬註冊成功，不實際上傳文件
      console.log('身份證明文件:', idDocument?.name);
      console.log('證件照:', photoDocument?.name);
      
    } catch (err) {
      // 錯誤已經在 useEffect 中處理
      console.error('註冊錯誤:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">創建新帳戶</h2>
        
        {/* 步驟指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className="text-sm font-medium ml-2">基本信息</div>
            </div>
            <div className={`h-1 w-16 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="text-sm font-medium ml-2">KYC 驗證</div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  全名
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="張三"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="至少 8 個字符"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  密碼必須至少包含 8 個字符，並包含大寫字母、小寫字母和數字
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  確認密碼
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="再次輸入密碼"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                  我同意
                  <button
                    type="button"
                    onClick={() => alert('服務條款內容即將推出')}
                    className="text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                  > 服務條款 </button>
                  和
                  <button
                    type="button"
                    onClick={() => alert('隱私政策內容即將推出')}
                    className="text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                  > 隱私政策</button>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">KYC 身份驗證</h3>
                <p className="text-gray-600 mt-2">
                  為了確保投票的公正性和安全性，我們需要驗證您的身份。
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">請上傳以下文件：</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                  <li>有效的身份證明文件（身份證、護照等）</li>
                  <li>近期的證件照（用於人臉識別）</li>
                </ul>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      身份證明文件
                    </label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'id')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      證件照
                    </label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      錢包地址（可選）
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0x..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      如果您有以太坊錢包，可以在此輸入地址以用於區塊鏈上的投票
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                您的個人資料將被安全地存儲，並僅用於身份驗證目的。詳情請參閱我們的隱私政策。
              </p>
            </>
          )}
          
          <div className="flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                返回
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-lg text-white font-medium ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${step === 1 ? 'ml-auto' : 'w-32'}`}
            >
              {isLoading 
                ? '處理中...' 
                : step === 1 
                  ? '下一步' 
                  : '提交'
              }
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            已有帳戶？{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
