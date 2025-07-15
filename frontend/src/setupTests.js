// Jest 測試環境設置文件
import '@testing-library/jest-dom';

// 模擬 window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
    search: '?id=1',
    hash: '',
    host: 'localhost:3000',
    hostname: 'localhost',
    href: 'http://localhost:3000/?id=1',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true
});

// 模擬 URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(searchString) {
    this.searchString = searchString || '';
  }
  
  get(key) {
    if (key === 'id' && this.searchString.includes('id=999')) {
      return '999';
    }
    return '1'; // 默認返回 ID 為 1
  }
};

// 模擬 mockWebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.readyState = 1; // OPEN
    this.send = jest.fn();
    this.close = jest.fn();
    
    // 模擬連接成功
    setTimeout(() => {
      if (this.onopen) {
        this.onopen({ target: this });
      }
    }, 0);
  }
  
  // 模擬接收消息
  mockReceiveMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }
}

// 替換全局 WebSocket
global.WebSocket = MockWebSocket;

// 模擬 document.getElementById
document.getElementById = jest.fn().mockImplementation((id) => {
  if (id === 'success-message') {
    return {
      style: {
        display: 'none'
      }
    };
  }
  return null;
});
