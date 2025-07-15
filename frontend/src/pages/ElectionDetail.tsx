import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 模擬選舉數據
const mockElectionData = {
  '1': {
    id: '1',
    title: '2025 年社區理事會選舉',
    description: '選出新一屆社區理事會成員，任期兩年。理事會將負責社區的日常管理、設施維護、活動組織等重要事務。',
    startTime: '2025-06-01T08:00:00',
    endTime: '2025-06-07T20:00:00',
    status: 'active',
    organization: '陽光社區居委會',
    maxSelectCount: 2,
    candidates: [
      {
        id: '1',
        name: '張三',
        description: '現任社區志工，有豐富的社區服務經驗，致力於改善社區環境和居民生活品質。',
        votes: 45,
        imageUrl: null
      },
      {
        id: '2',
        name: '李四',
        description: '退休教師，熱心公益事業，希望為社區教育和文化活動貢獻力量。',
        votes: 38,
        imageUrl: null
      },
      {
        id: '3',
        name: '王五',
        description: '小企業主，具有管理經驗，關注社區經濟發展和商業環境改善。',
        votes: 32,
        imageUrl: null
      },
      {
        id: '4',
        name: '趙六',
        description: '年輕的社區居民，IT專業背景，希望推動社區數位化建設。',
        votes: 28,
        imageUrl: null
      }
    ],
    totalVotes: 143,
    creator: {
      name: '社區管理員',
      email: 'admin@community.com'
    }
  },
  '2': {
    id: '2',
    title: '學生會主席選舉',
    description: '選出新一屆學生會主席，負責組織校園活動和代表學生利益。',
    startTime: '2025-05-15T09:00:00',
    endTime: '2025-05-20T18:00:00',
    status: 'active',
    organization: '明德中學',
    maxSelectCount: 1,
    candidates: [
      {
        id: '1',
        name: '劉一',
        description: '高三學生，現任學生會副主席，有豐富的學生工作經驗。',
        votes: 156,
        imageUrl: null
      },
      {
        id: '2',
        name: '陳二',
        description: '高二學生，班長，積極參與各種校園活動，深受同學喜愛。',
        votes: 134,
        imageUrl: null
      },
      {
        id: '3',
        name: '張三',
        description: '高三學生，社團聯合會主席，擅長組織大型活動。',
        votes: 98,
        imageUrl: null
      }
    ],
    totalVotes: 388,
    creator: {
      name: '學務處',
      email: 'student@school.edu'
    }
  }
};

const ElectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<any>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // 模擬從API獲取選舉數據
    if (id && mockElectionData[id as keyof typeof mockElectionData]) {
      setElection(mockElectionData[id as keyof typeof mockElectionData]);
      // 模擬檢查用戶是否已投票
      setHasVoted(Math.random() > 0.5); // 隨機決定是否已投票
    }
  }, [id]);

  if (!election) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  // 獲取狀態標籤
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            進行中
          </span>
        );
      case 'closed':
        return (
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            已結束
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            即將開始
          </span>
        );
      default:
        return null;
    }
  };

  // 處理候選人選擇
  const handleCandidateSelect = (candidateId: string) => {
    if (hasVoted || election.status !== 'active') return;

    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      if (selectedCandidates.length < election.maxSelectCount) {
        setSelectedCandidates([...selectedCandidates, candidateId]);
      } else if (election.maxSelectCount === 1) {
        setSelectedCandidates([candidateId]);
      }
    }
  };

  // 處理投票
  const handleVote = async () => {
    if (selectedCandidates.length === 0) {
      alert('請選擇至少一名候選人');
      return;
    }

    setIsVoting(true);
    
    try {
      // 模擬投票API調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬投票成功
      setHasVoted(true);
      setSelectedCandidates([]);
      alert('投票成功！感謝您的參與。');
      
      // 更新候選人票數（模擬）
      const updatedElection = { ...election };
      selectedCandidates.forEach(candidateId => {
        const candidate = updatedElection.candidates.find((c: any) => c.id === candidateId);
        if (candidate) {
          candidate.votes += 1;
        }
      });
      updatedElection.totalVotes += 1;
      setElection(updatedElection);
      
    } catch (error) {
      alert('投票失敗，請稍後再試');
    } finally {
      setIsVoting(false);
    }
  };

  // 計算投票進度
  const getVotePercentage = (votes: number) => {
    return election.totalVotes > 0 ? (votes / election.totalVotes) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 選舉基本信息 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{election.title}</h1>
              <p className="text-gray-600">{election.organization}</p>
            </div>
            {getStatusBadge(election.status)}
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">{election.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">開始時間:</span>
                <span className="text-gray-700 font-medium">{formatDate(election.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">結束時間:</span>
                <span className="text-gray-700 font-medium">{formatDate(election.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最多可選:</span>
                <span className="text-gray-700 font-medium">{election.maxSelectCount} 名候選人</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">候選人數:</span>
                <span className="text-gray-700 font-medium">{election.candidates.length} 人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">總投票數:</span>
                <span className="text-gray-700 font-medium">{election.totalVotes} 票</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">創建者:</span>
                <span className="text-gray-700 font-medium">{election.creator.name}</span>
              </div>
            </div>
          </div>
          
          {/* 投票狀態提示 */}
          {hasVoted && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700">您已經在此選舉中投票。感謝您的參與！</p>
              </div>
            </div>
          )}
          
          {election.status !== 'active' && !hasVoted && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-700">
                  {election.status === 'upcoming' ? '此選舉尚未開始' : '此選舉已經結束'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 候選人列表 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">候選人</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowResults(!showResults)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  showResults
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showResults ? '隱藏結果' : '顯示結果'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {election.candidates.map((candidate: any) => (
              <div
                key={candidate.id}
                className={`border rounded-xl p-6 cursor-pointer transition duration-300 ${
                  selectedCandidates.includes(candidate.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${hasVoted || election.status !== 'active' ? 'cursor-default' : ''}`}
                onClick={() => handleCandidateSelect(candidate.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {candidate.imageUrl ? (
                      <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                      {selectedCandidates.includes(candidate.id) && (
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{candidate.description}</p>
                    
                    {showResults && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">得票數:</span>
                          <span className="text-gray-700 font-medium">{candidate.votes} 票</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getVotePercentage(candidate.votes)}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          {getVotePercentage(candidate.votes).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 投票按鈕 */}
          {!hasVoted && election.status === 'active' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleVote}
                disabled={selectedCandidates.length === 0 || isVoting}
                className={`px-8 py-3 rounded-lg font-medium text-lg ${
                  selectedCandidates.length === 0 || isVoting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isVoting ? '投票中...' : `投票 (已選 ${selectedCandidates.length}/${election.maxSelectCount})`}
              </button>
            </div>
          )}
          
          {selectedCandidates.length > 0 && !hasVoted && election.status === 'active' && (
            <div className="mt-4 text-center text-sm text-gray-600">
              您已選擇: {selectedCandidates.map(id => {
                const candidate = election.candidates.find((c: any) => c.id === id);
                return candidate?.name;
              }).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* 返回按鈕 */}
      <div className="text-center">
        <Link
          to="/elections"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回選舉列表
        </Link>
      </div>
    </div>
  );
};

export default ElectionDetail;