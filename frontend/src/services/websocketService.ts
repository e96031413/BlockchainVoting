// WebSocket 服務，用於實時更新選舉結果
class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 3000; // 3 秒
  private listeners: Map<string, Function[]> = new Map();
  private isConnected: boolean = false;

  // 連接到 WebSocket 服務器
  connect(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log('WebSocket 連接成功');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve(true);
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket 連接關閉', event);
          this.isConnected = false;
          this.attemptReconnect(url);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket 錯誤', error);
          this.isConnected = false;
          resolve(false);
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('解析 WebSocket 消息時出錯', error);
          }
        };
      } catch (error) {
        console.error('創建 WebSocket 連接時出錯', error);
        resolve(false);
      }
    });
  }

  // 嘗試重新連接
  private attemptReconnect(url: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('達到最大重連次數，停止重連');
      return;
    }

    this.reconnectAttempts++;
    console.log(`嘗試重連 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect(url);
    }, this.reconnectTimeout);
  }

  // 處理接收到的消息
  private handleMessage(data: any) {
    if (!data || !data.type) return;

    const listeners = this.listeners.get(data.type) || [];
    listeners.forEach(callback => {
      try {
        callback(data.payload);
      } catch (error) {
        console.error('執行監聽器回調時出錯', error);
      }
    });
  }

  // 訂閱特定類型的消息
  subscribe(type: string, callback: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(callback);
  }

  // 取消訂閱特定類型的消息
  unsubscribe(type: string, callback: Function) {
    if (!this.listeners.has(type)) return;

    const listeners = this.listeners.get(type) || [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  // 發送消息到服務器
  send(type: string, payload: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未連接，無法發送消息');
      return false;
    }

    try {
      const message = JSON.stringify({ type, payload });
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('發送 WebSocket 消息時出錯', error);
      return false;
    }
  }

  // 關閉連接
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 檢查是否已連接
  isConnectedToServer(): boolean {
    return this.isConnected && this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// 創建單例實例
const websocketService = new WebSocketService();
export default websocketService;
