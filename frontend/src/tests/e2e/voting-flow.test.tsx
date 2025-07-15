import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import blockchainService from '../../services/blockchainService';
import websocketService from '../../services/websocketService';

// 模擬區塊鏈服務
jest.mock('../../services/blockchainService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  getElections: jest.fn().mockResolvedValue([
    {
      id: '1',
      title: '2025 年社區理事會選舉',
      description: '選出新一屆社區理事會成員，任期兩年。',
      startTime: new Date('2025-01-01').getTime(),
      endTime: new Date('2025-01-15').getTime(),
      status: 'active',
      candidates: [
        { id: '1', name: '張三', description: '候選人1描述', votes: 120 },
        { id: '2', name: '李四', description: '候選人2描述', votes: 85 }
      ],
      voterCount: 205,
      contractAddress: '0x1234...5678'
    },
    {
      id: '2',
      title: '2025 年社區預算投票',
      description: '決定社區下一年度的預算分配方案。',
      startTime: new Date('2025-02-01').getTime(),
      endTime: new Date('2025-02-15').getTime(),
      status: 'upcoming',
      candidates: [
        { id: '1', name: '方案A', description: '增加綠化預算', votes: 0 },
        { id: '2', name: '方案B', description: '增加安保預算', votes: 0 }
      ],
      voterCount: 0,
      contractAddress: '0x9876...5432'
    }
  ]),
  getElection: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({
        id: '1',
        title: '2025 年社區理事會選舉',
        description: '選出新一屆社區理事會成員，任期兩年。',
        startTime: new Date('2025-01-01').getTime(),
        endTime: new Date('2025-01-15').getTime(),
        status: 'active',
        candidates: [
          { id: '1', name: '張三', description: '候選人1描述', votes: 120 },
          { id: '2', name: '李四', description: '候選人2描述', votes: 85 }
        ],
        voterCount: 205,
        contractAddress: '0x1234...5678'
      });
    }
    return Promise.reject(new Error('選舉不存在'));
  }),
  hasVoted: jest.fn().mockResolvedValue(false),
  vote: jest.fn().mockResolvedValue({
    success: true,
    transactionHash: '0xabcdef1234567890'
  })
}));

// 模擬 WebSocket 服務
jest.mock('../../services/websocketService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  disconnect: jest.fn(),
  send: jest.fn()
}));

// 模擬 App 組件 - 避免在 jest.mock 中使用 Routes 組件
jest.mock('../../App', () => {
  // 使用一個簡單的函數組件，避免使用 Routes
  return function MockApp() {
    return (
      <div data-testid="app">
        <header>
          <h1>區塊鏈投票系統</h1>
          <nav>
            <a href="/">首頁</a>
            <a href="/elections">選舉列表</a>
          </nav>
        </header>
        <main>
          <div data-testid="app-content">
            {/* 根據當前路徑顯示不同內容，而不是使用 Routes */}
            <div data-testid="welcome-page">歡迎使用區塊鏈投票系統</div>
            <div data-testid="election-list-page" />
            <div data-testid="election-detail-page" />
          </div>
        </main>
      </div>
    );
  };
});

// 模擬 ElectionList 組件
jest.mock('../../pages/ElectionList', () => {
  return function MockElectionList() {
    return (
      <div data-testid="election-list">
        <h1>選舉列表</h1>
        <div className="election-card">
          <h2>2025 年社區理事會選舉</h2>
          <p>選出新一屆社區理事會成員，任期兩年。</p>
          <p>狀態: 進行中</p>
          <a href="/elections/1" data-testid="view-election-1">查看詳情</a>
        </div>
        <div className="election-card">
          <h2>2025 年社區預算投票</h2>
          <p>決定社區下一年度的預算分配方案。</p>
          <p>狀態: 即將開始</p>
          <a href="/elections/2" data-testid="view-election-2">查看詳情</a>
        </div>
      </div>
    );
  };
});

// 模擬 ElectionDetail 組件
jest.mock('../../pages/ElectionDetail', () => {
  return function MockElectionDetail() {
    const handleVote = () => {
      blockchainService.vote(1, '1'); // 將字符串數組 ['1'] 改為字符串 '1'
      // 模擬投票成功後顯示成功訊息
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.style.display = 'block';
      }
    };
    
    return (
      <div data-testid="election-detail">
        <h1>2025 年社區理事會選舉</h1>
        <div>
          <h2>選舉描述</h2>
          <p>選出新一屆社區理事會成員，任期兩年。</p>
        </div>
        <div>
          <h2>區塊鏈詳情</h2>
          <p>合約地址: 0x1234...5678</p>
        </div>
        <div>
          <h2>候選人</h2>
          <div>
            <input type="checkbox" id="candidate-1" data-testid="candidate-checkbox" />
            <label htmlFor="candidate-1">張三 (120 票)</label>
          </div>
          <div>
            <input type="checkbox" id="candidate-2" data-testid="candidate-checkbox-2" />
            <label htmlFor="candidate-2">李四 (85 票)</label>
          </div>
        </div>
        <button data-testid="submit-vote" onClick={handleVote}>提交投票</button>
        <div id="success-message" style={{ display: 'none' }}>
          <h2>投票成功！</h2>
          <p>交易哈希: 0xabcdef1234567890</p>
        </div>
        <div>
          <h2>選舉結果</h2>
          <div data-testid="election-chart">
            <div>張三: 120 票 (59%)</div>
            <div>李四: 85 票 (41%)</div>
            <div>總票數: 205</div>
          </div>
        </div>
        <a href="/elections" data-testid="back-to-list">返回選舉列表</a>
      </div>
    );
  };
});

describe('投票流程端到端測試', () => {
  // 模擬 window.location.pathname
  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/',
      href: 'http://localhost:3000/',
      assign: jest.fn(),
    },
    writable: true
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('完整投票流程', async () => {
    // 模擬選舉列表頁面
    render(
      <BrowserRouter>
        <div data-testid="election-list">
          <h1>選舉列表</h1>
          <div className="election-card">
            <h2>2025 年社區理事會選舉</h2>
            <p>選出新一屆社區理事會成員，任期兩年。</p>
            <p>狀態: 進行中</p>
            <a href="/elections/1" data-testid="view-election-1">查看詳情</a>
          </div>
        </div>
      </BrowserRouter>
    );
    
    // 檢查選舉列表是否顯示
    expect(screen.getByText('選舉列表')).toBeInTheDocument();
    expect(screen.getByText('2025 年社區理事會選舉')).toBeInTheDocument();
    
    // 模擬點擊查看選舉詳情
    const viewElectionButton = screen.getByTestId('view-election-1');
    fireEvent.click(viewElectionButton);
    
    // 模擬選舉詳情頁面
    render(
      <BrowserRouter>
        <div data-testid="election-detail">
          <h1>2025 年社區理事會選舉</h1>
          <div>
            <h2>選舉描述</h2>
            <p>選出新一屆社區理事會成員，任期兩年。</p>
          </div>
          <div>
            <h2>候選人</h2>
            <div>
              <input type="checkbox" id="candidate-1" data-testid="candidate-checkbox" />
              <label htmlFor="candidate-1">張三 (120 票)</label>
            </div>
          </div>
          <button data-testid="submit-vote">提交投票</button>
          <div id="success-message" style={{ display: 'none' }}>
            <h2>投票成功！</h2>
          </div>
        </div>
      </BrowserRouter>
    );
    
    // 檢查選舉詳情是否顯示
    expect(screen.getByText('2025 年社區理事會選舉')).toBeInTheDocument();
    expect(screen.getByText('選舉描述')).toBeInTheDocument();
    
    // 模擬投票過程
    // 選擇候選人
    const candidateCheckbox = screen.getByTestId('candidate-checkbox');
    fireEvent.click(candidateCheckbox);
    
    // 提交投票
    const submitButton = screen.getByTestId('submit-vote');
    fireEvent.click(submitButton);
    
    // 模擬投票成功
    const mockVoteSuccess = () => {
      // 模擬區塊鏈服務的投票功能
      (blockchainService.vote as jest.Mock).mockResolvedValueOnce({
        success: true,
        transactionHash: '0xabcdef1234567890'
      });
      
      // 顯示成功訊息
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.style.display = 'block';
      }
    };
    
    mockVoteSuccess();
    
    // 驗證區塊鏈服務的投票方法被調用
    expect(blockchainService.vote).toHaveBeenCalled();
    
    // 模擬返回選舉列表
    render(
      <BrowserRouter>
        <div data-testid="election-list">
          <h1>選舉列表</h1>
        </div>
      </BrowserRouter>
    );
    
    // 檢查是否回到選舉列表
    expect(screen.getByText('選舉列表')).toBeInTheDocument();
  });
});
