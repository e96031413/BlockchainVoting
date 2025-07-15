import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useElectionStore from '../stores/electionStore';
import { Election } from '../services/electionService';

// 統一的選舉顯示類型
interface ElectionDisplay {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  organization: string;
  candidates?: any[];
  voterCount?: number;
}

// 模擬選舉數據
const mockElections: ElectionDisplay[] = [
  {
    id: '1',
    title: '2025 年社區理事會選舉',
    description: '選出新一屆社區理事會成員，任期兩年。',
    startTime: '2025-06-01T08:00:00',
    endTime: '2025-06-07T20:00:00',
    status: 'active',
    organization: '陽光社區居委會',
    candidates: [
      { id: '1', name: '張三' },
      { id: '2', name: '李四' },
      { id: '3', name: '王五' },
      { id: '4', name: '趙六' }
    ],
    voterCount: 245
  },
  {
    id: '2',
    title: '學生會主席選舉',
    description: '選出新一屆學生會主席，負責組織校園活動和代表學生利益。',
    startTime: '2025-05-15T09:00:00',
    endTime: '2025-05-20T18:00:00',
    status: 'active',
    organization: '明德中學',
    candidates: [
      { id: '1', name: '劉一' },
      { id: '2', name: '陳二' },
      { id: '3', name: '張三' }
    ],
    voterCount: 1203
  },
  {
    id: '3',
    title: '公司董事會選舉',
    description: '選出新一屆公司董事會成員，負責公司重大決策。',
    startTime: '2025-04-10T00:00:00',
    endTime: '2025-04-15T23:59:59',
    status: 'closed',
    organization: '未來科技有限公司',
    candidates: [
      { id: '1', name: '張董事' },
      { id: '2', name: '李董事' },
      { id: '3', name: '王董事' }
    ],
    voterCount: 56
  },
  {
    id: '4',
    title: '社團主席選舉',
    description: '選出新一屆社團主席，任期一年。',
    startTime: '2025-07-01T08:00:00',
    endTime: '2025-07-05T20:00:00',
    status: 'upcoming',
    organization: '攝影愛好者協會',
    candidates: [
      { id: '1', name: '小明' },
      { id: '2', name: '小紅' },
      { id: '3', name: '小藍' }
    ],
    voterCount: 0
  },
  {
    id: '5',
    title: '業主委員會選舉',
    description: '選出新一屆業主委員會成員，負責小區管理和服務監督。',
    startTime: '2025-05-25T08:00:00',
    endTime: '2025-06-01T20:00:00',
    status: 'active',
    organization: '幸福家園小區',
    candidates: [
      { id: '1', name: '張業主' },
      { id: '2', name: '李業主' },
      { id: '3', name: '王業主' },
      { id: '4', name: '趙業主' }
    ],
    voterCount: 89
  },
  {
    id: '6',
    title: '校園食堂菜單投票',
    description: '投票決定下個月的校園食堂菜單。',
    startTime: '2025-05-01T08:00:00',
    endTime: '2025-05-10T20:00:00',
    status: 'closed',
    organization: '陽光大學',
    candidates: [
      { id: '1', name: '方案A' },
      { id: '2', name: '方案B' },
      { id: '3', name: '方案C' }
    ],
    voterCount: 2567
  }
];

// 選舉卡片組件
interface ElectionCardProps {
  election: ElectionDisplay;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
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

  // 根據狀態返回不同的標籤樣式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            進行中
          </span>
        );
      case 'closed':
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            已結束
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            即將開始
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {election.title}
          </h3>
          {getStatusBadge(election.status)}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {election.description}
        </p>
        
        <div className="flex flex-col space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">主辦方:</span>
            <span className="text-gray-700 font-medium">{election.organization}</span>
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
            <span className="text-gray-500">候選人數:</span>
            <span className="text-gray-700">{election.candidates?.length || 0} 人</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">已投票人數:</span>
            <span className="text-gray-700">{election.voterCount || 0} 人</span>
          </div>
        </div>
        
        <Link
          to={`/elections/${election.id}`}
          className={`block w-full text-center py-2 px-4 rounded-lg font-medium ${
            election.status === 'active'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : election.status === 'upcoming'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {election.status === 'active'
            ? '立即投票'
            : election.status === 'upcoming'
              ? '查看詳情'
              : '查看結果'}
        </Link>
      </div>
    </div>
  );
};

const ElectionList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { elections, fetchElections } = useElectionStore();
  
  // 在組件加載時獲取選舉數據
  useEffect(() => {
    fetchElections(1, 20, statusFilter === 'all' ? undefined : statusFilter, searchTerm || undefined);
  }, [fetchElections, statusFilter, searchTerm]);
  
  // 轉換後端數據為顯示格式
  const convertElectionToDisplay = (election: Election): ElectionDisplay => ({
    id: election.id,
    title: election.title,
    description: election.description,
    startTime: election.startTime,
    endTime: election.endTime,
    status: election.status,
    organization: election.organization,
    candidates: election.candidates,
    voterCount: election.candidates?.reduce((sum, candidate) => sum + (candidate.votes || 0), 0) || 0
  });
  
  // 使用實際數據或回退到模擬數據
  const displayElections: ElectionDisplay[] = elections.length > 0 
    ? elections.map(convertElectionToDisplay)
    : mockElections;
  
  // 過濾選舉
  const filteredElections = displayElections.filter(election => {
    // 搜索詞過濾
    const matchesSearch = !searchTerm || 
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 狀態過濾
    const matchesStatus = statusFilter === 'all' || election.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">選舉列表</h1>
        <Link
          to="/create-election"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
        >
          創建新選舉
        </Link>
      </div>
      
      {/* 過濾和搜索 */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜索選舉標題、描述或組織..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              狀態:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="all">全部</option>
              <option value="upcoming">即將開始</option>
              <option value="active">進行中</option>
              <option value="closed">已結束</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 選舉列表 */}
      {filteredElections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map(election => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-1">沒有找到符合條件的選舉</h3>
          <p className="text-gray-500">
            嘗試調整您的搜索條件或創建一個新的選舉。
          </p>
        </div>
      )}
    </div>
  );
};

export default ElectionList;
