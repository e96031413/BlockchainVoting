const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    // 獲取測試帳戶
    [owner, voter1, voter2, voter3] = await ethers.getSigners();

    // 部署合約
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  describe("選民註冊", function () {
    it("應該允許合約擁有者註冊選民", async function () {
      await voting.registerVoter(voter1.address);
      const voter = await voting.voters(voter1.address);
      expect(voter.isRegistered).to.be.true;
      expect(voter.isVerified).to.be.false;
    });

    it("不應該允許非擁有者註冊選民", async function () {
      await expect(
        voting.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only contract owner can call this function");
    });

    it("不應該允許重複註冊同一選民", async function () {
      await voting.registerVoter(voter1.address);
      await expect(
        voting.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter already registered");
    });
  });

  describe("選民驗證", function () {
    beforeEach(async function () {
      await voting.registerVoter(voter1.address);
    });

    it("應該允許合約擁有者驗證選民", async function () {
      await voting.verifyVoter(voter1.address);
      const voter = await voting.voters(voter1.address);
      expect(voter.isVerified).to.be.true;
    });

    it("不應該允許驗證未註冊的選民", async function () {
      await expect(
        voting.verifyVoter(voter2.address)
      ).to.be.revertedWith("Voter not registered");
    });

    it("不應該允許重複驗證同一選民", async function () {
      await voting.verifyVoter(voter1.address);
      await expect(
        voting.verifyVoter(voter1.address)
      ).to.be.revertedWith("Voter already verified");
    });
  });

  describe("選舉創建", function () {
    it("應該允許創建新選舉", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1小時後
      const endTime = startTime + 86400; // 24小時後
      const candidates = ["候選人A", "候選人B", "候選人C"];

      const tx = await voting.createElection(
        "測試選舉",
        "這是一個測試選舉",
        startTime,
        endTime,
        candidates
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return voting.interface.parseLog(log).name === "ElectionCreated";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      
      const election = await voting.elections(0);
      expect(election.name).to.equal("測試選舉");
      expect(election.admin).to.equal(owner.address);
    });

    it("不應該允許創建結束時間早於開始時間的選舉", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const endTime = startTime - 1800; // 早於開始時間
      const candidates = ["候選人A", "候選人B"];

      await expect(
        voting.createElection(
          "無效選舉",
          "結束時間早於開始時間",
          startTime,
          endTime,
          candidates
        )
      ).to.be.revertedWith("End time must be later than start time");
    });

    it("不應該允許創建候選人少於2個的選舉", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const endTime = startTime + 86400;
      const candidates = ["候選人A"]; // 只有一個候選人

      await expect(
        voting.createElection(
          "無效選舉",
          "候選人不足",
          startTime,
          endTime,
          candidates
        )
      ).to.be.revertedWith("At least two candidates required");
    });
  });

  describe("投票功能", function () {
    let electionId;
    const startTime = Math.floor(Date.now() / 1000) - 1800; // 30分鐘前開始
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1小時後結束
    const candidates = ["候選人A", "候選人B", "候選人C"];

    beforeEach(async function () {
      // 註冊並驗證選民
      await voting.registerVoter(voter1.address);
      await voting.verifyVoter(voter1.address);
      await voting.registerVoter(voter2.address);
      await voting.verifyVoter(voter2.address);

      // 創建選舉
      const tx = await voting.createElection(
        "投票測試選舉",
        "用於測試投票功能",
        startTime,
        endTime,
        candidates
      );
      
      electionId = 0; // 第一個選舉的ID

      // 啟動選舉
      await voting.startElection(electionId);
    });

    it("應該允許已驗證的選民投票", async function () {
      await voting.connect(voter1).vote(electionId, "候選人A");
      
      const hasVoted = await voting.hasVoted(electionId, voter1.address);
      expect(hasVoted).to.be.true;
      
      const votes = await voting.getCandidateVotes(electionId, "候選人A");
      expect(votes).to.equal(1);
    });

    it("不應該允許選民重複投票", async function () {
      await voting.connect(voter1).vote(electionId, "候選人A");
      
      await expect(
        voting.connect(voter1).vote(electionId, "候選人B")
      ).to.be.revertedWith("Voter has already voted");
    });

    it("不應該允許未註冊的選民投票", async function () {
      await expect(
        voting.connect(voter3).vote(electionId, "候選人A")
      ).to.be.revertedWith("Voter not registered");
    });

    it("不應該允許投票給不存在的候選人", async function () {
      await expect(
        voting.connect(voter1).vote(electionId, "不存在的候選人")
      ).to.be.revertedWith("Candidate does not exist");
    });
  });

  describe("選舉狀態管理", function () {
    let electionId;
    const startTime = Math.floor(Date.now() / 1000) + 3600; // 1小時後開始
    const endTime = startTime + 86400; // 24小時後結束
    const candidates = ["候選人A", "候選人B"];

    beforeEach(async function () {
      const tx = await voting.createElection(
        "狀態測試選舉",
        "用於測試選舉狀態管理",
        startTime,
        endTime,
        candidates
      );
      
      electionId = 0;
    });

    it("應該允許選舉管理員啟動選舉", async function () {
      await voting.startElection(electionId);
      const state = await voting.getElectionState(electionId);
      expect(state).to.equal(1); // Active state
    });

    it("不應該允許非管理員啟動選舉", async function () {
      await expect(
        voting.connect(voter1).startElection(electionId)
      ).to.be.revertedWith("Only election admin can call this function");
    });
  });

  describe("結果查詢", function () {
    let electionId;
    const startTime = Math.floor(Date.now() / 1000) - 1800; // 30分鐘前開始
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1小時後結束
    const candidates = ["候選人A", "候選人B", "候選人C"];

    beforeEach(async function () {
      // 註冊並驗證選民
      await voting.registerVoter(voter1.address);
      await voting.verifyVoter(voter1.address);
      await voting.registerVoter(voter2.address);
      await voting.verifyVoter(voter2.address);

      // 創建並啟動選舉
      await voting.createElection(
        "結果測試選舉",
        "用於測試結果查詢",
        startTime,
        endTime,
        candidates
      );
      
      electionId = 0;
      await voting.startElection(electionId);

      // 進行投票
      await voting.connect(voter1).vote(electionId, "候選人A");
      await voting.connect(voter2).vote(electionId, "候選人A");
    });

    it("應該正確返回候選人得票數", async function () {
      const votesA = await voting.getCandidateVotes(electionId, "候選人A");
      const votesB = await voting.getCandidateVotes(electionId, "候選人B");
      
      expect(votesA).to.equal(2);
      expect(votesB).to.equal(0);
    });

    it("應該正確返回總投票數", async function () {
      const totalVotes = await voting.getTotalVotes(electionId);
      expect(totalVotes).to.equal(2);
    });

    it("應該正確返回候選人列表", async function () {
      const candidateList = await voting.getElectionCandidates(electionId);
      expect(candidateList).to.deep.equal(candidates);
    });
  });
});