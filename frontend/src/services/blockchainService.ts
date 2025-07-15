import { ethers } from 'ethers';

// 投票合約 ABI（簡化版，只包含我們需要的函數）
const votingABI = [
  // 查詢函數
  "function getElectionState(uint256 _electionId) view returns (uint8)",
  "function getCandidateVotes(uint256 _electionId, string memory _candidate) view returns (uint256)",
  "function getTotalVotes(uint256 _electionId) view returns (uint256)",
  "function hasVoted(uint256 _electionId, address _voter) view returns (bool)",
  
  // 寫入函數
  "function createElection(string memory _name, string memory _description, uint256 _startTime, uint256 _endTime, string[] memory _candidates) returns (uint256)",
  "function vote(uint256 _electionId, string memory _candidate)",
  
  // 事件
  "event ElectionCreated(uint256 electionId, string name, address admin)",
  "event VoteCast(uint256 electionId, address voter)",
  "event ElectionStateChanged(uint256 electionId, uint8 state)"
];

// 合約地址（從環境變量獲取或使用默認值）
const CONTRACT_ADDRESS = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// 區塊鏈服務類
class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected: boolean = false;

  // 初始化區塊鏈連接
  async connect() {
    if (window.ethereum) {
      try {
        // 請求用戶連接錢包
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // 創建 provider 和 signer
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // 創建合約實例
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, votingABI, this.signer);
        
        this.isConnected = true;
        console.log('成功連接到區塊鏈');
        
        return true;
      } catch (error) {
        console.error('連接區塊鏈時出錯:', error);
        return false;
      }
    } else {
      console.error('未檢測到 MetaMask 或其他以太坊錢包');
      return false;
    }
  }

  // 檢查是否已連接
  isConnectedToBlockchain() {
    return this.isConnected;
  }

  // 創建新選舉
  async createElection(name: string, description: string, startTime: number, endTime: number, candidates: string[]) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      const tx = await this.contract!.createElection(name, description, startTime, endTime, candidates);
      const receipt = await tx.wait();
      
      // 從事件中獲取選舉 ID
      const event = receipt.events?.find((e: any) => e.event === 'ElectionCreated');
      const electionId = event?.args?.electionId.toNumber();
      
      return {
        success: true,
        electionId,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('創建選舉時出錯:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤'
      };
    }
  }

  // 投票
  async vote(electionId: number, candidate: string) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      const tx = await this.contract!.vote(electionId, candidate);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('投票時出錯:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤'
      };
    }
  }

  // 獲取候選人得票數
  async getCandidateVotes(electionId: number, candidate: string) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      const votes = await this.contract!.getCandidateVotes(electionId, candidate);
      return votes.toNumber();
    } catch (error) {
      console.error('獲取候選人得票數時出錯:', error);
      throw error;
    }
  }

  // 獲取選舉總投票數
  async getTotalVotes(electionId: number) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      const totalVotes = await this.contract!.getTotalVotes(electionId);
      return totalVotes.toNumber();
    } catch (error) {
      console.error('獲取總投票數時出錯:', error);
      throw error;
    }
  }

  // 檢查用戶是否已投票
  async hasVoted(electionId: number, voterAddress?: string) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      // 如果未提供地址，使用當前連接的地址
      const address = voterAddress || await this.signer!.getAddress();
      return await this.contract!.hasVoted(electionId, address);
    } catch (error) {
      console.error('檢查投票狀態時出錯:', error);
      throw error;
    }
  }

  // 獲取選舉狀態
  async getElectionState(electionId: number) {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }
    
    try {
      const state = await this.contract!.getElectionState(electionId);
      // 將數字狀態轉換為字符串
      const stateMap = ['Created', 'Active', 'Closed', 'Tallied'];
      return stateMap[state] || 'Unknown';
    } catch (error) {
      console.error('獲取選舉狀態時出錯:', error);
      throw error;
    }
  }
}

// 創建單例實例
const blockchainService = new BlockchainService();

export default blockchainService;

// 為 TypeScript 添加 window.ethereum 類型定義
declare global {
  interface Window {
    ethereum: any;
  }
}
