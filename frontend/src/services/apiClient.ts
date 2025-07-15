/**
 * API 客戶端
 * 處理與後端 API 的通信
 */

// API 基礎 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 請求選項類型
interface RequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string>;
}

// 響應類型
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

/**
 * 處理 API 錯誤
 */
class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 獲取存儲在本地的認證令牌
 */
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 構建 URL，包括查詢參數
 */
const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
};

/**
 * 發送 API 請求
 */
const request = async <T>(
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  options: RequestOptions = {}
): Promise<T> => {
  const { token = getToken(), params, ...customOptions } = options;
  const url = buildUrl(endpoint, params);
  
  // 構建請求選項
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customOptions.headers,
    },
    ...customOptions,
  };
  
  // 添加請求體（如果有）
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  
  try {
    // 發送請求
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    
    // 檢查響應狀態
    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.message || '請求失敗',
        responseData
      );
    }
    
    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, (error as Error).message || '未知錯誤');
  }
};

/**
 * API 客戶端
 */
const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, 'GET', null, options),
    
  post: <T>(endpoint: string, data: any, options?: RequestOptions) => 
    request<T>(endpoint, 'POST', data, options),
    
  put: <T>(endpoint: string, data: any, options?: RequestOptions) => 
    request<T>(endpoint, 'PUT', data, options),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, 'DELETE', null, options),
    
  // 文件上傳請求
  upload: async <T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> => {
    const { token = getToken(), ...customOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 構建請求選項（不包含 Content-Type，讓瀏覽器自動設置）
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customOptions.headers,
      },
      body: formData,
      ...customOptions,
    };
    
    try {
      // 發送請求
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      
      // 檢查響應狀態
      if (!response.ok) {
        throw new ApiError(
          response.status,
          responseData.message || '請求失敗',
          responseData
        );
      }
      
      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, (error as Error).message || '未知錯誤');
    }
  },
};

export { ApiError };
export type { ApiResponse };
export default apiClient;
