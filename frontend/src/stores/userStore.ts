/**
 * 用戶狀態存儲
 * 管理用戶的登入狀態和資料
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService, { User } from '../services/authService';

// 用戶狀態類型
interface UserState {
  // 狀態
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 動作
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, walletAddress?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: { name?: string; email?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

// 創建用戶狀態存儲
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始狀態
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // 登入
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login({ email, password });
          set({ 
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '登入失敗',
          });
          throw error;
        }
      },
      
      // 註冊
      register: async (name: string, email: string, password: string, walletAddress?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register({ name, email, password, walletAddress });
          set({ 
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '註冊失敗',
          });
          throw error;
        }
      },
      
      // 登出
      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '登出失敗',
          });
        }
      },
      
      // 更新用戶資料
      updateProfile: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const updatedUser = await authService.updateUserDetails(userData);
          set({ 
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '更新資料失敗',
          });
          throw error;
        }
      },
      
      // 更新密碼
      updatePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          await authService.updatePassword({ currentPassword, newPassword });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '更新密碼失敗',
          });
          throw error;
        }
      },
      
      // 清除錯誤
      clearError: () => {
        set({ error: null });
      },
      
      // 檢查認證狀態
      checkAuth: async () => {
        try {
          // 如果已經有用戶信息，則直接返回
          if (get().user && get().isAuthenticated) {
            return true;
          }
          
          // 從本地存儲獲取用戶信息
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            set({ user: storedUser, isAuthenticated: true });
            return true;
          }
          
          // 如果有令牌但沒有用戶信息，則從服務器獲取
          if (authService.isLoggedIn()) {
            set({ isLoading: true });
            const user = await authService.getCurrentUser();
            if (user) {
              set({ user, isAuthenticated: true, isLoading: false });
              return true;
            }
          }
          
          set({ isLoading: false });
          return false;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : '認證檢查失敗',
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },
    }),
    {
      name: 'user-storage', // 本地存儲的鍵名
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // 只持久化這些字段
    }
  )
);

export default useUserStore;
