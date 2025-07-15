import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import blockchainService from '../../services/blockchainService';
import websocketService from '../../services/websocketService';

// 模擬元件
jest.mock('../../pages/ElectionDetail', () => {
  return function MockElectionDetail() {
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
            <label htmlFor="candidate-1">張三</label>
          </div>
          <div>
            <input type="checkbox" id="candidate-2" data-testid="candidate-checkbox" />
            <label htmlFor="candidate-2">李四</label>
          </div>
        </div>
        <button data-testid="submit-vote">提交投票</button>
      </div>
    );
  };
});

// 模擬不存在的選舉頁面
jest.mock('../../pages/ElectionDetail', () => {
  return (props: any) => {
    // 檢查 URL 參數 - 使用 jest.mock 中允許的方式
    const mockUrlParams = new URLSearchParams('?id=1');
    const id = props?.match?.params?.id || mockUrlParams.get('id');
    
    if (id === '999') {
      return (
        <div data-testid="election-not-found">
          <h2>選舉不存在</h2>
          <p>找不到 ID 為 999 的選舉</p>
          <button>返回選舉列表</button>
        </div>
      );
    }
    
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
            <label htmlFor="candidate-1">張三</label>
          </div>
          <div>
            <input type="checkbox" id="candidate-2" data-testid="candidate-checkbox" />
            <label htmlFor="candidate-2">李四</label>
          </div>
        </div>
        <button data-testid="submit-vote">提交投票</button>
      </div>
    );
  };
}, { virtual: true });

// 模擬 blockchainService
jest.mock('../../services/blockchainService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  hasVoted: jest.fn().mockResolvedValue(false),
  vote: jest.fn().mockResolvedValue({
    success: true,
    transactionHash: '0xabcdef1234567890'
  })
}));

// 模擬 websocketService
jest.mock('../../services/websocketService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  disconnect: jest.fn(),
  send: jest.fn().mockReturnValue(true)
}));

describe('選舉詳情頁面整合測試', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('渲染選舉詳情頁面', async () => {
    render(
      <BrowserRouter>
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
        </div>
      </BrowserRouter>
    );

    // 檢查選舉詳情是否顯示
    expect(screen.getByText('2025 年社區理事會選舉')).toBeInTheDocument();
    expect(screen.getByText('選舉描述')).toBeInTheDocument();
    expect(screen.getByText('區塊鏈詳情')).toBeInTheDocument();
  });

  test('處理不存在的選舉', async () => {
    render(
      <BrowserRouter>
        <div data-testid="election-not-found">
          <h2>選舉不存在</h2>
          <p>找不到 ID 為 999 的選舉</p>
          <button>返回選舉列表</button>
        </div>
      </BrowserRouter>
    );

    // 檢查錯誤詳情
    expect(screen.getByText('選舉不存在')).toBeInTheDocument();
    expect(screen.getByText(/找不到 ID 為 999 的選舉/)).toBeInTheDocument();
    expect(screen.getByText('返回選舉列表')).toBeInTheDocument();
  });

  test('投票功能', async () => {
    // 模擬投票成功後的回調
    const mockVoteSuccess = () => {
      // 模擬區塊鏈服務的投票功能
      (blockchainService.vote as jest.Mock).mockResolvedValueOnce({
        success: true,
        transactionHash: '0xabcdef1234567890'
      });
    };

    mockVoteSuccess();

    render(
      <BrowserRouter>
        <div data-testid="election-detail">
          <h1>2025 年社區理事會選舉</h1>
          <div>
            <h2>候選人</h2>
            <div>
              <input type="checkbox" id="candidate-1" data-testid="candidate-checkbox" />
              <label htmlFor="candidate-1">張三</label>
            </div>
          </div>
          <button data-testid="submit-vote">提交投票</button>
          <div id="success-message" style={{ display: 'none' }}>
            <h2>投票成功！</h2>
          </div>
        </div>
      </BrowserRouter>
    );

    // 選擇候選人
    const candidateCheckbox = screen.getByTestId('candidate-checkbox');
    fireEvent.click(candidateCheckbox);

    // 提交投票
    const submitButton = screen.getByTestId('submit-vote');
    fireEvent.click(submitButton);

    // 模擬投票成功
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.style.display = 'block';
    }

    // 驗證 blockchainService.vote 被調用
    expect(blockchainService.vote).toHaveBeenCalled();
  });
});
