// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Karar Coin
 * @dev Implementation of the Karar Coin
 * This ERC20 token is centrally administered with a focus on supporting
 * social movements, protests, and boycotts in Turkey.
 */
contract KararCoin is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    // Stake için minimum token miktarı
    uint256 public constant CONTENT_STAKE_AMOUNT = 100 * 10**18; // 100 KARAR
    uint256 public constant VERIFICATION_STAKE_AMOUNT = 50 * 10**18; // 50 KARAR
    uint256 public constant VERIFICATION_REWARD = 10 * 10**18; // 10 KARAR

    // İçerik doğrulama için gerekli minimum doğrulayıcı sayısı
    uint256 public constant MIN_VERIFIERS = 3;

    // İçerik için maximum doğrulayıcı sayısı
    uint256 public constant MAX_VERIFIERS = 5;

    // İçerik durumu
    enum ContentStatus {
        Pending,     // Beklemede - henüz yeterince doğrulama yok
        Approved,    // Onaylandı - doğrulayıcılar tarafından onaylandı
        Rejected,    // Reddedildi - doğrulayıcılar tarafından reddedildi
        Disputed     // İhtilaflı - hem onaylayan hem reddeden doğrulayıcılar var
    }
    
    // Doğrulayıcı oylaması
    enum VerifierVote {
        None,       // Henüz oy vermedi
        Approve,    // Onayladı
        Reject      // Reddetti
    }

    // İçerik yapısı
    struct Content {
        address author;                   // İçerik yazarı/sahibi
        ContentStatus status;             // İçerik durumu
        uint256 approvalCount;            // Onaylayan doğrulayıcı sayısı
        uint256 rejectionCount;           // Reddeden doğrulayıcı sayısı
        mapping(address => VerifierVote) verifierVotes; // Doğrulayıcı oyları
        mapping(address => bool) rewardsClaimed;        // Ödül talep edildi mi?
        bool stakeReleased;               // Yazarın stake'i serbest bırakıldı mı?
    }

    // İçerik hash'i => Content
    mapping(string => Content) public contents;

    mapping(address => bool) public verifiedAccounts;
    mapping(uint256 => address) public protestOwners;
    mapping(uint256 => address) public boycottOwners;
    
    // Events
    event ContentPublished(address indexed author, string contentHash);
    event ContentVerified(address indexed verifier, string contentHash, bool isApproved);
    event ContentApproved(string contentHash);
    event ContentRejected(string contentHash);
    event ContentDisputed(string contentHash);
    event StakeReleased(address indexed author, string contentHash);
    event RewardPaid(address indexed verifier, string contentHash);
    event AccountVerified(address indexed account);
    event ProtestCreated(uint256 indexed protestId, address indexed creator);
    event BoycottCreated(uint256 indexed boycottId, address indexed creator);
    event TokensUsedForVoting(address indexed voter, uint256 indexed itemId, bool isProtest, uint256 amount);

    /**
     * @dev Constructor that gives the msg.sender an initial supply
     */
    constructor(address initialOwner)
        ERC20("Karar Coin", "KARAR")
        ERC20Permit("Karar Coin")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }
    
    /**
     * @dev Creates new tokens and assigns them to the specified address
     * @param to The address that will receive the newly minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Verifies an account
     * @param account The address to verify
     */
    function verifyAccount(address account) public onlyOwner {
        verifiedAccounts[account] = true;
        emit AccountVerified(account);
    }
    
    /**
     * @dev Registers a new protest with its creator
     * @param protestId The ID of the protest
     * @param creator The address of the protest creator
     */
    function registerProtest(uint256 protestId, address creator) public onlyOwner {
        require(protestOwners[protestId] == address(0), "Karar Coin: Protest ID already registered");
        protestOwners[protestId] = creator;
        emit ProtestCreated(protestId, creator);
    }
    
    /**
     * @dev Registers a new boycott with its creator
     * @param boycottId The ID of the boycott
     * @param creator The address of the boycott creator
     */
    function registerBoycott(uint256 boycottId, address creator) public onlyOwner {
        require(boycottOwners[boycottId] == address(0), "Karar Coin: Boycott ID already registered");
        boycottOwners[boycottId] = creator;
        emit BoycottCreated(boycottId, creator);
    }
    
    /**
     * @dev Uses tokens for voting on protests or boycotts
     * @param itemId The ID of the protest or boycott
     * @param isProtest Whether the item is a protest (true) or boycott (false)
     * @param amount The amount of tokens to use
     */
    function useTokensForVoting(uint256 itemId, bool isProtest, uint256 amount) public {
        require(verifiedAccounts[msg.sender], "Karar Coin: Account not verified");
        require(balanceOf(msg.sender) >= amount, "Karar Coin: Insufficient balance");
        
        address owner = isProtest ? protestOwners[itemId] : boycottOwners[itemId];
        require(owner != address(0), "Karar Coin: Item not registered");
        
        // Burn tokens used for voting
        _burn(msg.sender, amount);
        
        emit TokensUsedForVoting(msg.sender, itemId, isProtest, amount);
    }

    function publishContent(string memory contentHash) external {
        require(bytes(contentHash).length > 0, "Karar Coin: Content hash cannot be empty");
        require(contents[contentHash].author == address(0), "Karar Coin: Content already exists");
        
        Content storage newContent = contents[contentHash];
        newContent.author = msg.sender;
        
        // Stake alınır
        _transfer(msg.sender, address(this), CONTENT_STAKE_AMOUNT);
        
        emit ContentPublished(msg.sender, contentHash);
    }
    
    function verifyContent(string memory contentHash, bool isApproved) external {
        require(bytes(contentHash).length > 0, "Karar Coin: Content hash cannot be empty");
        require(contents[contentHash].author != address(0), "Karar Coin: Content does not exist");
        require(contents[contentHash].author != msg.sender, "Karar Coin: Author cannot verify own content");
        require(contents[contentHash].verifierVotes[msg.sender] == VerifierVote.None, "Karar Coin: Already verified by this account");
        
        Content storage content = contents[contentHash];
        
        // Verify the content
        if (isApproved) {
            content.verifierVotes[msg.sender] = VerifierVote.Approve;
            content.approvalCount++;
        } else {
            content.verifierVotes[msg.sender] = VerifierVote.Reject;
            content.rejectionCount++;
        }
        
        // Update content status based on verification counts
        if (content.approvalCount >= MIN_VERIFIERS && content.rejectionCount == 0) {
            content.status = ContentStatus.Approved;
            emit ContentApproved(contentHash);
        } else if (content.rejectionCount >= MIN_VERIFIERS && content.approvalCount == 0) {
            content.status = ContentStatus.Rejected;
            emit ContentRejected(contentHash);
        } else if (content.approvalCount > 0 && content.rejectionCount > 0) {
            content.status = ContentStatus.Disputed;
            emit ContentDisputed(contentHash);
        }
        
        emit ContentVerified(msg.sender, contentHash, isApproved);
    }

    function getContent(string memory contentHash) external view returns (
        address author,
        uint256 verificationCount,
        bool isVerified
    ) {
        Content storage content = contents[contentHash];
        return (
            content.author,
            content.verificationCount,
            content.isVerified
        );
    }

    function hasVerified(string memory contentHash, address verifier) external view returns (bool) {
        return contents[contentHash].verifiers[verifier];
    }
} 