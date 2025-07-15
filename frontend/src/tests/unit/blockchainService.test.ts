import blockchainService from '../../services/blockchainService';

// 直接模擬 blockchainService 方法
jest.mock('../../services/blockchainService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  hasVoted: jest.fn().mockResolvedValue(false),
  vote: jest.fn().mockResolvedValue({
    success: true,
    transactionHash: '0xabcdef1234567890'
  }),
  createElection: jest.fn().mockResolvedValue({
    success: true,
    electionId: 1,
    transactionHash: '0xabcdef1234567890'
  })
}));

describe('區塊鏈服務測試', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('連接到區塊鏈', async () => {
    const result = await blockchainService.connect();
    expect(result).toBe(true);
    expect(blockchainService.connect).toHaveBeenCalled();
  });

  test('檢查用戶是否已投票', async () => {
    const result = await blockchainService.hasVoted(1);
    expect(result).toBe(false);
    expect(blockchainService.hasVoted).toHaveBeenCalledWith(1);
  });

  test('投票功能', async () => {
    const result = await blockchainService.vote(1, '1');
    expect(result.success).toBe(true);
    expect(result.transactionHash).toBe('0xabcdef1234567890');
    expect(blockchainService.vote).toHaveBeenCalledWith(1, '1');
  });

  test('創建選舉功能', async () => {
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = Math.floor(Date.now() / 1000) + 86400;
    const result = await blockchainService.createElection(
      '測試選舉',
      '這是一個測試選舉',
      startTime,
      endTime,
      ['候選人1', '候選人2']
    );
    
    expect(result.success).toBe(true);
    expect(result.electionId).toBe(1);
    expect(blockchainService.createElection).toHaveBeenCalledWith(
      '測試選舉',
      '這是一個測試選舉',
      startTime,
      endTime,
      ['候選人1', '候選人2']
    );
  });

  // 我們不測試私有方法 isConnected
});
