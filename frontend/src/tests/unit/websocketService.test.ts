import websocketService from '../../services/websocketService';

// 定義測試用的 WebSocket 類
class TestWebSocket {
  url: string;
  onopen: ((event: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  readyState: number = 1; // OPEN
  send: jest.Mock = jest.fn();
  close: jest.Mock = jest.fn();
  
  constructor(url: string) {
    this.url = url;
    // 模擬連接成功
    setTimeout(() => {
      if (this.onopen) {
        this.onopen({ target: this });
      }
    }, 0);
  }
  
  // 模擬接收消息
  mockReceiveMessage(data: any) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }
}

// 定義模擬連接錯誤的 WebSocket 類
class ErrorTestWebSocket extends TestWebSocket {
  constructor(url: string) {
    super(url);
    // 立即觸發錯誤
    setTimeout(() => {
      if (this.onerror) {
        this.onerror({ error: new Error('Connection failed') });
      }
      if (this.onclose) {
        this.onclose({ target: this });
      }
    }, 0);
  }
}

// 替換全局 WebSocket 類
const originalWebSocket = global.WebSocket;
global.WebSocket = TestWebSocket as any;

describe('WebSocket 服務測試', () => {
  let mockCallback: jest.Mock;
  
  beforeEach(() => {
    // 重置服務狀態
    websocketService.disconnect();
    // 創建模擬回調函數
    mockCallback = jest.fn();
  });
  
  test('連接到 WebSocket 服務器', async () => {
    const result = await websocketService.connect('ws://localhost:8080');
    expect(result).toBe(true);
  });
  
  test('訂閱事件', async () => {
    // 先連接
    await websocketService.connect('ws://localhost:8080');
    
    // 訂閱事件
    websocketService.subscribe('electionUpdate', mockCallback);
    
    // 模擬接收消息
    const mockData = {
      type: 'electionUpdate',
      data: {
        electionId: '1',
        candidates: [
          { id: '1', name: '張三', votes: 10 },
          { id: '2', name: '李四', votes: 5 }
        ]
      }
    };
    
    // 獲取內部 WebSocket 實例並發送模擬消息
    const ws = (websocketService as any).ws as TestWebSocket;
    ws.mockReceiveMessage(mockData);
    
    // 驗證回調被調用
    expect(mockCallback).toHaveBeenCalledWith(mockData.data);
  });
  
  test('取消訂閱事件', async () => {
    // 先連接
    await websocketService.connect('ws://localhost:8080');
    
    // 訂閱事件
    websocketService.subscribe('electionUpdate', mockCallback);
    
    // 取消訂閱
    websocketService.unsubscribe('electionUpdate', mockCallback);
    
    // 模擬接收消息
    const mockData = {
      type: 'electionUpdate',
      data: { electionId: '1' }
    };
    
    // 獲取內部 WebSocket 實例並發送模擬消息
    const ws = (websocketService as any).ws as TestWebSocket;
    ws.mockReceiveMessage(mockData);
    
    // 驗證回調沒有被調用
    expect(mockCallback).not.toHaveBeenCalled();
  });
  
  test('發送消息', async () => {
    // 先連接
    await websocketService.connect('ws://localhost:8080');
    
    // 模擬 WebSocket 的 send 方法
    const ws = (websocketService as any).ws as TestWebSocket;
    // 使用 ws.send 作為 jest.Mock
    
    // 發送消息
    const type = 'subscribeElection';
    const payload = {
      electionId: '1'
    };
    
    websocketService.send(type, payload);
    
    // 驗證 send 方法被調用
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type, payload }));
  });
  
  test('斷開連接', async () => {
    // 先連接
    await websocketService.connect('ws://localhost:8080');
    
    // 獲取內部 WebSocket 實例
    const ws = (websocketService as any).ws as TestWebSocket;
    // 使用 ws.close 作為 jest.Mock
    
    // 斷開連接
    websocketService.disconnect();
    
    // 驗證 close 方法被調用
    expect(ws.close).toHaveBeenCalled();
    
    // 驗證內部 WebSocket 實例被清除
    expect((websocketService as any).ws).toBeNull();
  });
  
  test('處理連接錯誤', async () => {
    // 模擬連接錯誤
    (global as any).WebSocket = ErrorTestWebSocket;
    
    
    // 嘗試連接
    const result = await websocketService.connect('ws://invalid-server');
    
    // 驗證連接失敗
    expect(result).toBe(false);
  });
});
