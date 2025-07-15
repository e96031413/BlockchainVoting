/**
 * 選舉服務
 * 處理選舉相關的 API 調用
 */
import apiClient, { ApiResponse } from './apiClient';
import { User } from './authService';

// 候選人類型
export interface Candidate {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  votes: number;
  electionId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 選舉類型
export interface Election {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'created' | 'active' | 'closed' | 'tallied';
  organization: string;
  maxSelectCount: number;
  blockchainAddress?: string;
  transactionHash?: string;
  createdById: string;
  creator?: User;
  candidates?: Candidate[];
  createdAt: string;
  updatedAt: string;
}

// 選舉列表響應類型
interface ElectionListResponse extends ApiResponse<any> {
  count: number;
  totalPages: number;
  currentPage: number;
  elections: Election[];
}

// 選舉詳情響應類型
interface ElectionDetailResponse extends ApiResponse<any> {
  election: Election;
}

// 創建選舉請求類型
interface CreateElectionRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  organization: string;
  maxSelectCount?: number;
  candidates: {
    name: string;
    description?: string;
    imageUrl?: string;
  }[];
}

// 更新選舉請求類型
interface UpdateElectionRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  organization?: string;
  maxSelectCount?: number;
  status?: 'created' | 'active' | 'closed' | 'tallied';
}

/**
 * 選舉服務
 */
const electionService = {
  /**
   * 獲取選舉列表
   */
  getElections: async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<ElectionListResponse> => {
    return await apiClient.get<ElectionListResponse>('/elections', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search }),
      },
    });
  },
  
  /**
   * 獲取選舉詳情
   */
  getElection: async (id: string): Promise<Election> => {
    const response = await apiClient.get<ElectionDetailResponse>(`/elections/${id}`);
    return response.election;
  },
  
  /**
   * 創建選舉
   */
  createElection: async (electionData: CreateElectionRequest): Promise<Election> => {
    const response = await apiClient.post<ElectionDetailResponse>('/elections', electionData);
    return response.election;
  },
  
  /**
   * 更新選舉
   */
  updateElection: async (id: string, electionData: UpdateElectionRequest): Promise<Election> => {
    const response = await apiClient.put<ElectionDetailResponse>(`/elections/${id}`, electionData);
    return response.election;
  },
  
  /**
   * 刪除選舉
   */
  deleteElection: async (id: string): Promise<void> => {
    await apiClient.delete(`/elections/${id}`);
  },
  
  /**
   * 獲取用戶創建的選舉
   */
  getMyElections: async (): Promise<Election[]> => {
    const response = await apiClient.get<{ elections: Election[] }>('/elections/my');
    return response.elections;
  },
  
  /**
   * 上傳候選人圖片
   */
  uploadCandidateImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.upload<{ file: { url: string } }>('/uploads/file', formData);
    return response.file.url;
  },
};

export default electionService;
