import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  description: string;
}

const CreateElection: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 基本信息, 2: 候選人信息, 3: 確認
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 基本信息
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxSelectCount, setMaxSelectCount] = useState('1');
  
  // 候選人信息
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: '1', name: '', description: '' },
    { id: '2', name: '', description: '' }
  ]);
  
  // 處理候選人變更
  const handleCandidateChange = (id: string, field: 'name' | 'description', value: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, [field]: value } : candidate
    ));
  };
  
  // 添加候選人
  const addCandidate = () => {
    const newId = (parseInt(candidates[candidates.length - 1].id) + 1).toString();
    setCandidates([...candidates, { id: newId, name: '', description: '' }]);
  };
  
  // 刪除候選人
  const removeCandidate = (id: string) => {
    if (candidates.length <= 2) {
      setError('至少需要兩名候選人');
      return;
    }
    setCandidates(candidates.filter(candidate => candidate.id !== id));
    setError('');
  };
  
  // 驗證基本信息
  const validateBasicInfo = () => {
    if (!title || !description || !organization || !startTime || !endTime) {
      setError('請填寫所有必填欄位');
      return false;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    
    if (start < now) {
      setError('開始時間必須晚於當前時間');
      return false;
    }
    
    if (end <= start) {
      setError('結束時間必須晚於開始時間');
      return false;
    }
    
    setError('');
    return true;
  };
  
  // 驗證候選人信息
  const validateCandidates = () => {
    for (const candidate of candidates) {
      if (!candidate.name) {
        setError('所有候選人必須有名稱');
        return false;
      }
    }
    
    setError('');
    return true;
  };
  
  // 處理下一步
  const handleNextStep = () => {
    if (step === 1) {
      if (validateBasicInfo()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateCandidates()) {
        setStep(3);
      }
    }
  };
  
  // 處理上一步
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };
  
  // 處理提交
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 這裡將來會實現實際的創建選舉邏輯
      console.log('選舉數據:', {
        title,
        description,
        organization,
        startTime,
        endTime,
        maxSelectCount: parseInt(maxSelectCount),
        candidates
      });
      
      // 模擬 API 請求延遲
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模擬創建成功
      navigate('/elections');
      
    } catch (err) {
      setError('創建選舉失敗，請稍後再試');
      console.error('創建選舉錯誤:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 格式化日期時間字符串為本地格式
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">創建新選舉</h2>
        
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
              <div className="text-sm font-medium ml-2">候選人</div>
            </div>
            <div className={`h-1 w-16 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div className="text-sm font-medium ml-2">確認</div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* 步驟 1: 基本信息 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                選舉標題 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：2025 年社區理事會選舉"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                選舉描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="請描述此次選舉的目的、背景和重要性..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                主辦方/組織 <span className="text-red-500">*</span>
              </label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：陽光社區居委會"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  開始時間 <span className="text-red-500">*</span>
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  結束時間 <span className="text-red-500">*</span>
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="maxSelectCount" className="block text-sm font-medium text-gray-700 mb-1">
                每位選民最多可選候選人數
              </label>
              <select
                id="maxSelectCount"
                value={maxSelectCount}
                onChange={(e) => setMaxSelectCount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 名候選人</option>
                <option value="2">2 名候選人</option>
                <option value="3">3 名候選人</option>
                <option value="4">4 名候選人</option>
                <option value="5">5 名候選人</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                選民在投票時最多可以選擇的候選人數量
              </p>
            </div>
          </div>
        )}
        
        {/* 步驟 2: 候選人信息 */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">
              請添加至少兩名候選人。每個候選人必須有姓名，描述為可選項。
            </p>
            
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">候選人 #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeCandidate(candidate.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div>
                  <label htmlFor={`candidate-name-${candidate.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`candidate-name-${candidate.id}`}
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="候選人姓名"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor={`candidate-description-${candidate.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    id={`candidate-description-${candidate.id}`}
                    value={candidate.description}
                    onChange={(e) => handleCandidateChange(candidate.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="候選人簡介、背景或競選主張..."
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCandidate}
              className="w-full py-2 px-4 border border-blue-300 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加候選人
            </button>
          </div>
        )}
        
        {/* 步驟 3: 確認 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-700">
                請確認以下信息無誤。創建後，選舉的基本信息將無法修改。
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">基本信息</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">選舉標題:</span>
                    <span className="text-gray-800 font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">主辦方/組織:</span>
                    <span className="text-gray-800">{organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">開始時間:</span>
                    <span className="text-gray-800">{formatDateTime(startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">結束時間:</span>
                    <span className="text-gray-800">{formatDateTime(endTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">最多可選:</span>
                    <span className="text-gray-800">{maxSelectCount} 名候選人</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">選舉描述</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-line">{description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">候選人 ({candidates.length})</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                      <div className="font-medium text-gray-800 mb-1">
                        {index + 1}. {candidate.name}
                      </div>
                      {candidate.description && (
                        <p className="text-gray-600 text-sm">{candidate.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 按鈕區域 */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              上一步
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/elections')}
              className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              取消
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              下一步
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`py-2 px-4 rounded-lg text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? '創建中...' : '創建選舉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateElection;
