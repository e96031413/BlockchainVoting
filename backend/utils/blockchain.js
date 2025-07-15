/**
 * 區塊鏈工具類
 * 用於與智能合約進行交互
 */
const { ethers } = require('ethers');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

// 讀取智能合約 ABI
const getContractABI = () => {
  try {
    const abiPath = path.join(__dirname, '../../blockchain/artifacts/contracts/Voting.sol/Voting.json');
    const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    return contractJson.abi;
  } catch (error) {
    console.error('無法讀取合約 ABI:', error);
    return null;
  }
};

// 創建以太坊提供者
const getProvider = () => {
  try {
    return new ethers.providers.JsonRpcProvider(config.blockchain.rpcUrl);
  } catch (error) {
    console.error('無法創建以太坊提供者:', error);
    return null;
  }
};

// 創建合約實例
const getContract = (signerOrProvider) => {
  try {
    const abi = getContractABI();
    if (!abi) {
      throw new Error('合約 ABI 不可用');
    }
    
    const contractAddress = config.blockchain.votingContractAddress;
    if (!contractAddress) {
      throw new Error('合約地址未設置');
    }
    
    return new ethers.Contract(contractAddress, abi, signerOrProvider);
  } catch (error) {
    console.error('無法創建合約實例:', error);
    return null;
  }
};

// 創建錢包
const getWallet = (privateKey) => {
  try {
    const provider = getProvider();
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error('無法創建錢包:', error);
    return null;
  }
};

// 創建選舉
const createElection = async (privateKey, name, description, startTime, endTime, candidates) => {
  try {
    const wallet = getWallet(privateKey);
    const contract = getContract(wallet);
    
    // 轉換時間戳
    const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);
    
    // 調用合約方法
    const tx = await contract.createElection(
      name,
      description,
      startTimeUnix,
      endTimeUnix,
      candidates.map(c => c.name)
    );
    
    // 等待交易確認
    const receipt = await tx.wait();
    
    // 解析事件日誌
    const event = receipt.events.find(e => e.event === 'ElectionCreated');
    const electionId = event.args.electionId.toNumber();
    
    return {
      success: true,
      electionId,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error('創建選舉失敗:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 投票
const castVote = async (privateKey, electionId, candidateId) => {
  try {
    const wallet = getWallet(privateKey);
    const contract = getContract(wallet);
    
    // 調用合約方法
    const tx = await contract.vote(electionId, candidateId);
    
    // 等待交易確認
    const receipt = await tx.wait();
    
    // 解析事件日誌
    const event = receipt.events.find(e => e.event === 'VoteCast');
    
    return {
      success: true,
      electionId: event.args.electionId.toNumber(),
      candidateId: event.args.candidateId.toNumber(),
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error('投票失敗:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 獲取選舉結果
const getElectionResults = async (electionId) => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    // 調用合約方法
    const results = await contract.getElectionResults(electionId);
    
    // 解析結果
    const candidates = results[0];
    const votes = results[1].map(v => v.toNumber());
    
    // 組合結果
    const electionResults = candidates.map((candidate, index) => ({
      name: candidate,
      votes: votes[index],
    }));
    
    return {
      success: true,
      results: electionResults,
    };
  } catch (error) {
    console.error('獲取選舉結果失敗:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 獲取選舉信息
const getElection = async (electionId) => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    // 調用合約方法
    const election = await contract.elections(electionId);
    
    // 解析結果
    return {
      success: true,
      election: {
        name: election.name,
        description: election.description,
        startTime: new Date(election.startTime.toNumber() * 1000),
        endTime: new Date(election.endTime.toNumber() * 1000),
        isActive: election.isActive,
        owner: election.owner,
      },
    };
  } catch (error) {
    console.error('獲取選舉信息失敗:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  getProvider,
  getContract,
  getWallet,
  createElection,
  castVote,
  getElectionResults,
  getElection,
};
