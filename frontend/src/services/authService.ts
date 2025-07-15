/**
 * 認證服務
 * 處理用戶註冊、登入和資料管理
 */
import apiClient, { ApiResponse } from './apiClient';

// 用戶類型
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 登入請求類型
interface LoginRequest {
  email: string;
  password: string;
}

// 註冊請求類型
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  walletAddress?: string;
}

// 更新用戶資料請求類型
interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// 更新密碼請求類型
interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 認證響應類型
interface AuthResponse extends ApiResponse<any> {
  token: string;
  user: User;
}

/**
 * 認證服務
 */
const authService = {
  /**
   * 用戶註冊
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // 保存令牌到本地存儲
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * 用戶登入
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // 保存令牌到本地存儲
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * 用戶登出
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.get('/auth/logout');
    } catch (error) {
      console.error('登出時發生錯誤:', error);
    } finally {
      // 無論如何，清除本地存儲
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  /**
   * 獲取當前用戶信息
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      console.error('獲取用戶信息時發生錯誤:', error);
      return null;
    }
  },
  
  /**
   * 更新用戶資料
   */
  updateUserDetails: async (userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<{ user: User }>('/auth/updatedetails', userData);
    
    // 更新本地存儲中的用戶信息
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.user;
  },
  
  /**
   * 更新用戶密碼
   */
  updatePassword: async (passwordData: UpdatePasswordRequest): Promise<{ token: string }> => {
    const response = await apiClient.put<{ token: string }>('/auth/updatepassword', passwordData);
    
    // 更新本地存儲中的令牌
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },
  
  /**
   * 從本地存儲獲取當前用戶
   */
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  /**
   * 檢查用戶是否已登入
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
