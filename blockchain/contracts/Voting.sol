// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title 投票合約
 * @dev 一個簡單的投票系統合約，允許創建選舉、註冊選民和進行投票
 */
contract Voting {
    // 選舉狀態枚舉
    enum ElectionState { Created, Active, Closed, Tallied }
    
    // 選舉結構
    struct Election {
        uint256 id;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
        address admin;
        string[] candidates;
        mapping(string => uint256) candidateVotes; // 候選人得票數
        mapping(address => bool) hasVoted; // 記錄選民是否已投票
        uint256 totalVotes; // 總投票數
    }
    
    // 選民結構
    struct Voter {
        address id;
        bool isRegistered;
        bool isVerified; // KYC 驗證狀態
    }
    
    // 事件
    event ElectionCreated(uint256 electionId, string name, address admin);
    event VoterRegistered(address voter);
    event VoterVerified(address voter);
    event VoteCast(uint256 electionId, address voter);
    event ElectionStateChanged(uint256 electionId, ElectionState state);
    
    // 狀態變量
    uint256 private electionCount;
    mapping(uint256 => Election) public elections;
    mapping(address => Voter) public voters;
    address public owner;
    
    // 修飾符
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier onlyElectionAdmin(uint256 _electionId) {
        require(elections[_electionId].admin == msg.sender, "Only election admin can call this function");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        _;
    }
    
    modifier onlyVerifiedVoter() {
        require(voters[msg.sender].isVerified, "Voter not verified by KYC");
        _;
    }
    
    // 構造函數
    constructor() {
        owner = msg.sender;
        electionCount = 0;
    }
    
    /**
     * @dev 註冊新選民
     * @param _voter 選民地址
     */
    function registerVoter(address _voter) public onlyOwner {
        require(!voters[_voter].isRegistered, "Voter already registered");
        
        voters[_voter].id = _voter;
        voters[_voter].isRegistered = true;
        voters[_voter].isVerified = false; // 預設為未驗證
        
        emit VoterRegistered(_voter);
    }
    
    /**
     * @dev 驗證選民 (KYC 通過)
     * @param _voter 選民地址
     */
    function verifyVoter(address _voter) public onlyOwner {
        require(voters[_voter].isRegistered, "Voter not registered");
        require(!voters[_voter].isVerified, "Voter already verified");
        
        voters[_voter].isVerified = true;
        
        emit VoterVerified(_voter);
    }
    
    /**
     * @dev 創建新選舉
     * @param _name 選舉名稱
     * @param _description 選舉描述
     * @param _startTime 開始時間 (UNIX 時間戳)
     * @param _endTime 結束時間 (UNIX 時間戳)
     * @param _candidates 候選人列表
     * @return 新選舉的 ID
     */
    function createElection(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _candidates
    ) public returns (uint256) {
        require(_startTime < _endTime, "End time must be later than start time");
        require(_candidates.length > 1, "At least two candidates required");
        
        uint256 electionId = electionCount++;
        
        Election storage newElection = elections[electionId];
        newElection.id = electionId;
        newElection.name = _name;
        newElection.description = _description;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.state = ElectionState.Created;
        newElection.admin = msg.sender;
        newElection.totalVotes = 0;
        
        // 添加候選人
        for (uint i = 0; i < _candidates.length; i++) {
            newElection.candidates.push(_candidates[i]);
            newElection.candidateVotes[_candidates[i]] = 0;
        }
        
        emit ElectionCreated(electionId, _name, msg.sender);
        
        return electionId;
    }
    
    /**
     * @dev 啟動選舉
     * @param _electionId 選舉 ID
     */
    function startElection(uint256 _electionId) public onlyElectionAdmin(_electionId) {
        Election storage election = elections[_electionId];
        
        require(election.state == ElectionState.Created, "Election state must be Created");
        require(block.timestamp <= election.startTime, "Election start time has passed");
        
        election.state = ElectionState.Active;
        
        emit ElectionStateChanged(_electionId, ElectionState.Active);
    }
    
    /**
     * @dev 結束選舉
     * @param _electionId 選舉 ID
     */
    function endElection(uint256 _electionId) public onlyElectionAdmin(_electionId) {
        Election storage election = elections[_electionId];
        
        require(election.state == ElectionState.Active, "Election state must be Active");
        require(block.timestamp >= election.endTime, "Election end time has not reached");
        
        election.state = ElectionState.Closed;
        
        emit ElectionStateChanged(_electionId, ElectionState.Closed);
    }
    
    /**
     * @dev 投票
     * @param _electionId 選舉 ID
     * @param _candidate 候選人名稱
     */
    function vote(uint256 _electionId, string memory _candidate) public onlyRegisteredVoter onlyVerifiedVoter {
        Election storage election = elections[_electionId];
        
        require(election.state == ElectionState.Active, "Election must be in Active state");
        require(block.timestamp >= election.startTime && block.timestamp <= election.endTime, "Not within election voting time range");
        require(!election.hasVoted[msg.sender], "Voter has already voted");
        
        // 檢查候選人是否存在
        bool candidateExists = false;
        for (uint i = 0; i < election.candidates.length; i++) {
            if (keccak256(bytes(election.candidates[i])) == keccak256(bytes(_candidate))) {
                candidateExists = true;
                break;
            }
        }
        require(candidateExists, "Candidate does not exist");
        
        // 記錄投票
        election.hasVoted[msg.sender] = true;
        election.candidateVotes[_candidate]++;
        election.totalVotes++;
        
        emit VoteCast(_electionId, msg.sender);
    }
    
    /**
     * @dev 計票並公布結果
     * @param _electionId 選舉 ID
     */
    function tallyVotes(uint256 _electionId) public onlyElectionAdmin(_electionId) {
        Election storage election = elections[_electionId];
        
        require(election.state == ElectionState.Closed, "Election must be in Closed state");
        
        election.state = ElectionState.Tallied;
        
        emit ElectionStateChanged(_electionId, ElectionState.Tallied);
    }
    
    /**
     * @dev 獲取候選人得票數
     * @param _electionId 選舉 ID
     * @param _candidate 候選人名稱
     * @return 得票數
     */
    function getCandidateVotes(uint256 _electionId, string memory _candidate) public view returns (uint256) {
        return elections[_electionId].candidateVotes[_candidate];
    }
    
    /**
     * @dev 獲取選舉總投票數
     * @param _electionId 選舉 ID
     * @return 總投票數
     */
    function getTotalVotes(uint256 _electionId) public view returns (uint256) {
        return elections[_electionId].totalVotes;
    }
    
    /**
     * @dev 檢查選民是否已投票
     * @param _electionId 選舉 ID
     * @param _voter 選民地址
     * @return 是否已投票
     */
    function hasVoted(uint256 _electionId, address _voter) public view returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }
    
    /**
     * @dev 獲取選舉狀態
     * @param _electionId 選舉 ID
     * @return 選舉狀態
     */
    function getElectionState(uint256 _electionId) public view returns (ElectionState) {
        return elections[_electionId].state;
    }
    
    /**
     * @dev 獲取選舉候選人列表
     * @param _electionId 選舉 ID
     * @return 候選人列表
     */
    function getElectionCandidates(uint256 _electionId) public view returns (string[] memory) {
        return elections[_electionId].candidates;
    }
}
