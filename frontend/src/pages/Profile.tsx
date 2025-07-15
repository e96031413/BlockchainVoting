import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 模擬用戶數據
const mockUser = {
  id: '1',
  name: '張小明',
  email: 'xiaoming@example.com',
  walletAddress: '0xabc...123',
  isVerified: true,
  joinDate: '2025-03-15T10:30:00',
  avatarUrl: null
};

// 模擬投票歷史
const mockVotingHistory = [
  {
    id: '1',
    electionId: '1',
    electionTitle: '2025 年社區理事會選舉',
    votedAt: '2025-06-02T14:25:00',
    transactionHash: '0x1234...5678',
    organization: '陽光社區居委會'
  },
  {
    id: '2',
    electionId: '2',
    electionTitle: '學生會主席選舉',
    votedAt: '2025-05-16T10:42:00',
    transactionHash: '0x9876...5432',
    organization: '明德中學'
  },
  {
    id: '3',
    electionId: '6',
    electionTitle: '校園食堂菜單投票',
    votedAt: '2025-05-05T16:18:00',
    transactionHash: '0xabcd...efgh',
    organization: '陽光大學'
  }
];

// 模擬創建的選舉
const mockCreatedElections = [
  {
    id: '5',
    title: '業主委員會選舉',
    startTime: '2025-05-25T08:00:00',
    endTime: '2025-06-01T20:00:00',
    status: 'active',
    voterCount: 89,
    organization: '幸福家園小區'
  }
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, voting-history, created-elections
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ ...mockUser });
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡將來會實現實際的更新用戶資料邏輯
    console.log('更新用戶資料:', userData);
    setIsEditing(false);
  };
  
  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  // 處理頭像上傳
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 這裡將來會實現實際的頭像上傳邏輯
      console.log('上傳頭像:', e.target.files[0]);
    }
  };
  
  // 截斷交易哈希
  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return hash.substring(0, 6) + '...' + hash.substring(hash.length - 4);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">我的帳戶</h1>
      
      {/* 標籤頁 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              個人資料
            </button>
            <button
              onClick={() => setActiveTab('voting-history')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'voting-history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              投票歷史
            </button>
            <button
              onClick={() => setActiveTab('created-elections')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'created-elections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              我創建的選舉
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* 個人資料 */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">個人資料</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    編輯資料
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {userData.avatarUrl ? (
                        <img src={userData.avatarUrl} alt="用戶頭像" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        更換頭像
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      姓名
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      保存
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {userData.avatarUrl ? (
                          <img src={userData.avatarUrl} alt="用戶頭像" className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{userData.name}</h3>
                        <p className="text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">註冊日期:</span>
                        <span className="text-gray-700">{formatDate(userData.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">KYC 驗證狀態:</span>
                        <span className={`font-medium ${userData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {userData.isVerified ? '已驗證' : '未驗證'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">區塊鏈錢包</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500">錢包地址:</span>
                        <span className="text-gray-700 font-mono">{userData.walletAddress}</span>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          type="button"
                          onClick={() => alert(`即將在區塊瀏覽器中查看錢包地址: ${userData.walletAddress}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center bg-transparent border-none p-0 cursor-pointer"
                        >
                          在區塊瀏覽器中查看
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-blue-700 text-sm">
                        您的錢包地址用於在區塊鏈上記錄您的投票。請確保您的私鑰安全。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 投票歷史 */}
          {activeTab === 'voting-history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">投票歷史</h2>
              
              {mockVotingHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          選舉
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          組織
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          投票時間
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          交易哈希
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockVotingHistory.map((vote) => (
                        <tr key={vote.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/elections/${vote.electionId}`} className="text-blue-600 hover:text-blue-800">
                              {vote.electionTitle}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {vote.organization}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {formatDate(vote.votedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">
                            {truncateHash(vote.transactionHash)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              type="button"
                              onClick={() => alert(`即將查看交易品註: ${vote.transactionHash}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center bg-transparent border-none p-0 cursor-pointer"
                            >
                              查看交易
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-1">沒有投票記錄</h3>
                  <p className="text-gray-500 mb-4">
                    您還沒有參與任何選舉投票。
                  </p>
                  <Link
                    to="/elections"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    瀏覽選舉
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* 我創建的選舉 */}
          {activeTab === 'created-elections' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">我創建的選舉</h2>
                <Link
                  to="/create-election"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm"
                >
                  創建新選舉
                </Link>
              </div>
              
              {mockCreatedElections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCreatedElections.map((election) => (
                    <div key={election.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {election.title}
                          </h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            election.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : election.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {election.status === 'active'
                              ? '進行中'
                              : election.status === 'upcoming'
                                ? '即將開始'
                                : '已結束'}
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">組織:</span>
                            <span className="text-gray-700">{election.organization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">開始時間:</span>
                            <span className="text-gray-700">{formatDate(election.startTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">結束時間:</span>
                            <span className="text-gray-700">{formatDate(election.endTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">已投票人數:</span>
                            <span className="text-gray-700">{election.voterCount} 人</span>
                          </div>
                        </div>
                        
                        <Link
                          to={`/elections/${election.id}`}
                          className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                          查看詳情
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-1">沒有創建的選舉</h3>
                  <p className="text-gray-500 mb-4">
                    您還沒有創建任何選舉。
                  </p>
                  <Link
                    to="/create-election"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    創建新選舉
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
