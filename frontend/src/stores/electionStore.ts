/**
 * 選舉狀態存儲
 * 管理選舉相關的狀態
 */
import { create } from 'zustand';
import electionService, { Election } from '../services/electionService';
import voteService, { ElectionResult } from '../services/voteService';

// 選舉狀態類型
interface ElectionState {
  // 選舉列表狀態
  elections: Election[];
  totalElections: number;
  totalPages: number;
  currentPage: number;
  
  // 當前選舉狀態
  currentElection: Election | null;
  electionResults: ElectionResult[] | null;
  totalVotes: number;
  
  // 用戶選舉狀態
  myElections: Election[];
  
  // 加載和錯誤狀態
  isLoading: boolean;
  error: string | null;
  
  // 選舉列表動作
  fetchElections: (page?: number, limit?: number, status?: string, search?: string) => Promise<void>;
  
  // 選舉詳情動作
  fetchElection: (id: string) => Promise<void>;
  fetchElectionResults: (id: string) => Promise<void>;
  
  // 選舉管理動作
  createElection: (electionData: {
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
  }) => Promise<Election>;
  
  updateElection: (id: string, electionData: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    organization?: string;
    maxSelectCount?: number;
    status?: 'created' | 'active' | 'closed' | 'tallied';
  }) => Promise<void>;
  
  deleteElection: (id: string) => Promise<void>;
  
  // 用戶選舉動作
  fetchMyElections: () => Promise<void>;
  
  // 投票動作
  castVote: (electionId: string, candidateId: string) => Promise<void>;
  
  // 其他動作
  clearCurrentElection: () => void;
  clearError: () => void;
}

// 創建選舉狀態存儲
const useElectionStore = create<ElectionState>((set, get) => ({
  // 初始狀態
  elections: [],
  totalElections: 0,
  totalPages: 0,
  currentPage: 1,
  currentElection: null,
  electionResults: null,
  totalVotes: 0,
  myElections: [],
  isLoading: false,
  error: null,
  
  // 獲取選舉列表
  fetchElections: async (page = 1, limit = 10, status, search) => {
    try {
      set({ isLoading: true, error: null });
      const response = await electionService.getElections(page, limit, status, search);
      set({ 
        elections: response.elections,
        totalElections: response.count,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '獲取選舉列表失敗',
      });
    }
  },
  
  // 獲取選舉詳情
  fetchElection: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const election = await electionService.getElection(id);
      set({ 
        currentElection: election,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '獲取選舉詳情失敗',
      });
    }
  },
  
  // 獲取選舉結果
  fetchElectionResults: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await voteService.getElectionResults(id);
      set({ 
        electionResults: response.results,
        totalVotes: response.totalVotes,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '獲取選舉結果失敗',
      });
    }
  },
  
  // 創建選舉
  createElection: async (electionData) => {
    try {
      set({ isLoading: true, error: null });
      const election = await electionService.createElection(electionData);
      
      // 更新我的選舉列表
      const myElections = [...get().myElections, election];
      set({ 
        myElections,
        isLoading: false,
      });
      
      return election;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '創建選舉失敗',
      });
      throw error;
    }
  },
  
  // 更新選舉
  updateElection: async (id, electionData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedElection = await electionService.updateElection(id, electionData);
      
      // 更新當前選舉
      if (get().currentElection?.id === id) {
        set({ currentElection: updatedElection });
      }
      
      // 更新選舉列表
      const elections = get().elections.map(election => 
        election.id === id ? updatedElection : election
      );
      
      // 更新我的選舉列表
      const myElections = get().myElections.map(election => 
        election.id === id ? updatedElection : election
      );
      
      set({ 
        elections,
        myElections,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '更新選舉失敗',
      });
      throw error;
    }
  },
  
  // 刪除選舉
  deleteElection: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await electionService.deleteElection(id);
      
      // 更新選舉列表
      const elections = get().elections.filter(election => election.id !== id);
      
      // 更新我的選舉列表
      const myElections = get().myElections.filter(election => election.id !== id);
      
      set({ 
        elections,
        myElections,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '刪除選舉失敗',
      });
      throw error;
    }
  },
  
  // 獲取我的選舉
  fetchMyElections: async () => {
    try {
      set({ isLoading: true, error: null });
      const elections = await electionService.getMyElections();
      set({ 
        myElections: elections,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '獲取我的選舉失敗',
      });
    }
  },
  
  // 投票
  castVote: async (electionId, candidateId) => {
    try {
      set({ isLoading: true, error: null });
      await voteService.castVote({ electionId, candidateId });
      
      // 重新獲取選舉詳情和結果
      await get().fetchElection(electionId);
      await get().fetchElectionResults(electionId);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '投票失敗',
      });
      throw error;
    }
  },
  
  // 清除當前選舉
  clearCurrentElection: () => {
    set({ 
      currentElection: null,
      electionResults: null,
      totalVotes: 0,
    });
  },
  
  // 清除錯誤
  clearError: () => {
    set({ error: null });
  },
}));

export default useElectionStore;
