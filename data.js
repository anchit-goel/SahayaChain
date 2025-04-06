// Mock community data for trust score visualization
const communities = [
  {
    id: "community-1",
    name: "Delhi Farmers Collective",
    members: 124,
    location: "Delhi, India",
    trustScore: 87
  },
  {
    id: "community-2",
    name: "Mumbai Women Entrepreneurs",
    members: 210,
    location: "Mumbai, India",
    trustScore: 92
  },
  {
    id: "community-3",
    name: "Bangalore Tech Startups",
    members: 89,
    location: "Bangalore, India",
    trustScore: 76
  },
  {
    id: "community-4",
    name: "Chennai Fishermen Cooperative",
    members: 156,
    location: "Chennai, India",
    trustScore: 84
  }
];

// Mock blockchain ledger data for communities
const blockchainLedgerData = {
  'comm1': [
    {
      blockNumber: 12453,
      timestamp: '2023-11-20T14:20:36Z',
      hash: '0x8f7d98a76b54e712f98c38a76b8c5d98a7c6b5e4d32f1a9b8c7d6e5f4a3b2c1d',
      previousHash: '0x7e6d5c4b3a2918d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d',
      transactionType: 'Loan Funding',
      sender: 'Rajiv Kumar',
      recipient: 'Anil Sharma',
      amount: 15000,
      status: 'Completed',
      details: {
        interestRate: '8%',
        loanTerm: '6 months',
        purpose: 'Business Expansion'
      }
    },
    {
      blockNumber: 12452,
      timestamp: '2023-11-18T10:15:22Z',
      hash: '0x7e6d5c4b3a2918d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d',
      previousHash: '0x6d5e4f3c2b1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4',
      transactionType: 'Repayment',
      sender: 'Preeti Gupta',
      recipient: 'Amit Patel',
      amount: 8000,
      status: 'Completed',
      details: {
        loanId: 'L-2023-089',
        installmentNumber: 4,
        remainingAmount: 16000
      }
    },
    {
      blockNumber: 12451,
      timestamp: '2023-11-15T16:45:11Z',
      hash: '0x6d5e4f3c2b1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4',
      previousHash: '0x5c4b3a2918d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2',
      transactionType: 'Loan Request',
      sender: 'Anil Sharma',
      amount: 15000,
      status: 'Approved',
      details: {
        purpose: 'Business Expansion',
        creditScore: 82,
        requestedTerm: '6 months',
        requestedRate: '8%'
      }
    }
  ],
  'comm2': [
    {
      blockNumber: 8765,
      timestamp: '2023-11-19T09:30:45Z',
      hash: '0x9f8e7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
      previousHash: '0x8e7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c',
      transactionType: 'Loan Funding',
      sender: 'Vikram Shah',
      recipient: 'Neha Verma',
      amount: 25000,
      status: 'Completed',
      details: {
        interestRate: '7.5%',
        loanTerm: '12 months',
        purpose: 'Tech Startup Seed Funding'
      }
    },
    {
      blockNumber: 8764,
      timestamp: '2023-11-17T13:20:19Z',
      hash: '0x8e7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c',
      previousHash: '0x7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7',
      transactionType: 'Repayment',
      sender: 'Rohit Mehta',
      recipient: 'Sarah Khan',
      amount: 12000,
      status: 'Completed',
      details: {
        loanId: 'L-2023-075',
        installmentNumber: 2,
        remainingAmount: 36000
      }
    }
  ],
  'comm3': [
    {
      blockNumber: 5432,
      timestamp: '2023-11-21T11:25:33Z',
      hash: '0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9',
      previousHash: '0xb8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
      transactionType: 'Loan Funding',
      sender: 'Priya Singh',
      recipient: 'Meera Reddy',
      amount: 40000,
      status: 'Completed',
      details: {
        interestRate: '6.5%',
        loanTerm: '18 months',
        purpose: 'Women Entrepreneurship Program'
      }
    }
  ],
  'comm4': [
    {
      blockNumber: 3210,
      timestamp: '2023-11-16T08:10:55Z',
      hash: '0xc7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7',
      previousHash: '0xd6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d',
      transactionType: 'Loan Request',
      sender: 'Ramesh Subramaniam',
      amount: 35000,
      status: 'Pending',
      details: {
        purpose: 'Agricultural Equipment',
        creditScore: 71,
        requestedTerm: '12 months',
        requestedRate: '9%'
      }
    }
  ],
  'comm5': [
    {
      blockNumber: 4321,
      timestamp: '2023-11-18T15:40:29Z',
      hash: '0xd6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d',
      previousHash: '0xe5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6',
      transactionType: 'Loan Funding',
      sender: 'Arjun Kapoor',
      recipient: 'Lakshmi Menon',
      amount: 20000,
      status: 'Completed',
      details: {
        interestRate: '8.5%',
        loanTerm: '9 months',
        purpose: 'Artisan Materials Purchase'
      }
    }
  ],
  'comm6': [
    {
      blockNumber: 2109,
      timestamp: '2023-11-17T12:05:18Z',
      hash: '0xe5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e',
      previousHash: '0xf4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5',
      transactionType: 'Loan Request',
      sender: 'Sunita Sharma',
      amount: 15000,
      status: 'Approved',
      details: {
        purpose: 'Educational Support',
        creditScore: 79,
        requestedTerm: '10 months',
        requestedRate: '7%'
      }
    }
  ]
};

// Function to get ledger data by community ID
function getLedgerDataForCommunity(communityId) {
  return blockchainLedgerData[communityId] || [];
}

// Function to get transaction status class
function getTransactionStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'status-completed';
    case 'pending':
      return 'status-pending';
    case 'approved':
      return 'status-approved';
    case 'rejected':
      return 'status-rejected';
    default:
      return 'status-unknown';
  }
}

// Function to get transaction type icon
function getTransactionTypeIcon(type) {
  switch (type.toLowerCase()) {
    case 'loan funding':
      return 'fa-hand-holding-usd';
    case 'loan request':
      return 'fa-file-invoice-dollar';
    case 'repayment':
      return 'fa-money-bill-wave';
    default:
      return 'fa-exchange-alt';
  }
}

// Function to add a new transaction to the blockchain ledger
function addTransactionToLedger(communityId, transactionData) {
  // Initialize the ledger for this community if it doesn't exist
  if (!blockchainLedgerData[communityId]) {
    blockchainLedgerData[communityId] = [];
  }
  
  // Get previous block hash or use genesis hash if first block
  const prevBlock = blockchainLedgerData[communityId][0] || null;
  const previousHash = prevBlock ? prevBlock.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  // Generate new block number (one higher than current highest)
  const highestBlock = blockchainLedgerData[communityId].reduce(
    (highest, block) => Math.max(highest, block.blockNumber || 0), 
    0
  );
  const newBlockNumber = highestBlock + 1;
  
  // Generate a random hash for demonstration purposes
  // In a real blockchain, this would be cryptographically generated
  const hash = '0x' + Array.from(
    { length: 64 }, 
    () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
  
  // Create the new transaction block
  const newBlock = {
    blockNumber: newBlockNumber,
    timestamp: new Date().toISOString(),
    hash: hash,
    previousHash: previousHash,
    ...transactionData
  };
  
  // Add to the beginning of the array so it shows up first (most recent)
  blockchainLedgerData[communityId].unshift(newBlock);
  
  return newBlock;
} 