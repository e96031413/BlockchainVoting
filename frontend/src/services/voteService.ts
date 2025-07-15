/**
 * 投票服務
 * 處理投票相關的 API 調用
 */
import apiClient, { ApiResponse } from './apiClient';
import { Election, Candidate } from './electionService';

// 投票類型
export interface Vote {
  id: string;
  userId: string;
  electionId: string;
  candidateId: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp: string;
  ipAddress?: string;
  election?: Election;
  candidate?: Candidate;
  createdAt: string;
  updatedAt: string;
}

// 投票請求類型
interface CastVoteRequest {
  electionId: string;
  candidateId: string;
}

// 投票響應類型
interface VoteResponse extends ApiResponse<any> {
  vote: Vote;
}

// 投票列表響應類型
interface VoteListResponse extends ApiResponse<any> {
  count: number;
  votes: Vote[];
}

// 投票狀態響應類型
interface VoteStatusResponse extends ApiResponse<any> {
  hasVoted: boolean;
  vote?: Vote;
}

// 選舉結果類型
export interface ElectionResult {
  id: string;
  name: string;
  description?: string;
  votes: number;
  percentage: number;
  imageUrl?: string;
}

// 選舉結果響應類型
interface ElectionResultsResponse extends ApiResponse<any> {
  electionId: string;
  totalVotes: number;
  results: ElectionResult[];
}

/**
 * 投票服務
 */
const voteService = {
  /**
   * 投票
   */
  castVote: async (voteData: CastVoteRequest): Promise<Vote> => {
    const response = await apiClient.post<VoteResponse>('/votes', voteData);
    return response.vote;
  },
  
  /**
   * 獲取用戶的投票歷史
   */
  getMyVotes: async (): Promise<Vote[]> => {
    const response = await apiClient.get<VoteListResponse>('/votes/me');
    return response.votes;
  },
  
  /**
   * 檢查用戶是否已經在特定選舉中投票
   */
  checkVoteStatus: async (electionId: string): Promise<VoteStatusResponse> => {
    return await apiClient.get<VoteStatusResponse>(`/votes/check/${electionId}`);
  },
  
  /**
   * 獲取選舉結果
   */
  getElectionResults: async (electionId: string): Promise<ElectionResultsResponse> => {
    return await apiClient.get<ElectionResultsResponse>(`/votes/results/${electionId}`);
  },
};

export default voteService;
