import { NextRequest, NextResponse } from 'next/server';

const MOCK_DATA = {
  overview: {
    name: "propchain",
    purpose: "A decentralized real estate platform for tokenizing and trading property assets.",
    techStack: [
      { name: "React", category: "Frontend", version: "18.x", color: "#61dafb", usage: "Interactive user interface components" },
      { name: "Next.js", category: "Framework", version: "14.x", color: "#000000", usage: "Server-side rendering and API routes" },
      { name: "Solidity", category: "Smart Contracts", version: "0.8.x", color: "#363636", usage: "Ethereum smart contracts for property tokenization" },
      { name: "Tailwind CSS", category: "Styling", version: "3.x", color: "#38bdf8", usage: "Utility-first styling system" }
    ],
    architecture: "The application follows a modern Web3 architecture. The frontend is built with React/Next.js and interacts with Ethereum smart contracts via Ethers.js. The backend relies on a decentralized network for state management and transaction execution.",
    entryPoints: [
      { file: "src/pages/index.js", purpose: "Main landing page connecting users to Web3 wallets" },
      { file: "contracts/PropertyToken.sol", purpose: "Core ERC-721 implementation for tokenization" }
    ],
    keyDirectories: [
      { path: "src/components", purpose: "Reusable UI components and Web3 connectors", fileCount: 24 },
      { path: "contracts", purpose: "Smart contracts for the blockchain layer", fileCount: 5 }
    ],
    designPatterns: ["Factory Pattern", "React Context Provider", "Observer"],
    difficulty: "Intermediate",
    setupSteps: ["npm install", "npx hardhat compile", "npm run dev"],
    highlights: [
      "Secure smart contract implementation protecting user assets",
      "Seamless Web3 wallet integration via specialized hooks"
    ]
  },

  flashcards: [
    {
      id: 1,
      front: "What is the primary function of PropertyToken.sol?",
      back: "It implements an ERC-721 token standard to represent unique, non-fungible real estate properties on the Ethereum blockchain.",
      codeExample: "contract PropertyToken is ERC721URIStorage { ... }",
      category: "Architecture",
      difficulty: "Intermediate",
      repoConnection: "Found in contracts/PropertyToken.sol"
    },
    {
      id: 2,
      front: "How does the platform handle Wallet Connection?",
      back: "It uses a custom React Context provider that wraps the application and exposes the connection state to all child components.",
      codeExample: "export const Web3Context = createContext(null);",
      category: "State Management",
      difficulty: "Beginner",
      repoConnection: "Web3Provider component inside the src/context directory"
    },
    {
      id: 3,
      front: "Why is Next.js used for this specific Web3 app?",
      back: "Next.js allows colocation of server actions to quickly read public blockchain state via RPC nodes before handing off to the client-side wallet for mutations.",
      codeExample: "export async function getStaticProps() { /* fetch RPC */ }",
      category: "Architecture",
      difficulty: "Advanced",
      repoConnection: "Relates to the overall structure of the pages directory"
    },
    {
      id: 4,
      front: "What styling approach does the UI use?",
      back: "The project uses Tailwind CSS for utility-first styling.",
      codeExample: "<div className='flex items-center justify-between p-4'>",
      category: "Frontend",
      difficulty: "Beginner",
      repoConnection: "Visible across all components in src/components"
    },
    {
      id: 5,
      front: "How are smart contract ABIs utilized in the frontend?",
      back: "ABIs are imported as JSON and passed to ethers.js Contract instances to allow the frontend to call contract functions.",
      codeExample: "const contract = new ethers.Contract(address, abi, signer);",
      category: "API Design",
      difficulty: "Intermediate",
      repoConnection: "Used heavily in src/hooks/useContract.js"
    }
  ],

  dsa: [
    {
      id: 1,
      title: "Merge Blockchain & Local Property Listings",
      difficulty: "Medium",
      topics: ["Arrays", "Two Pointers", "Sorting"],
      repoInspiration: "Inspired by how the frontend merges fetched blockchain listings with local database caches for faster initial render.",
      description: "You are given two sorted arrays of property objects based on their created dates. Merge them into a single sorted array. The properties must be sorted in descending order based on timestamp.",
      constraints: ["0 <= list1.length, list2.length <= 50", "Dates are represented as Unix timestamps"],
      examples: [
        { input: "list1 = [1700, 1690], list2 = [1695]", output: "[1700, 1695, 1690]", explanation: "Merged and sorted strictly descending." }
      ],
      hint: "Use two pointers, one for each array, and compare elements to build the result array in O(n+m) time.",
      starterCode: {
        javascript: "function mergeProperties(list1, list2) {\n  // your code\n}",
        python: "def mergeProperties(list1, list2):\n    # your code\n    pass"
      },
      repoCodeSnippet: "const merged = [...blockchainListings, ...localListings].sort((a,b) => b.date - a.date);"
    },
    {
      id: 2,
      title: "Detect Duplicate Token Mints",
      difficulty: "Easy",
      topics: ["Hash Map", "Set"],
      repoInspiration: "Inspired by the smart contract's uniqueness check to prevent double-minting the same physical property.",
      description: "Given an array of property ID hashes attempting to be minted in a batch, return true if any duplicate ID exists, otherwise return false.",
      constraints: ["1 <= ids.length <= 10^5"],
      examples: [
        { input: "ids = ['0x123', '0x456', '0x123']", output: "true", explanation: "'0x123' appears twice." }
      ],
      hint: "Use a Set or Hash Map to keep track of seen IDs for O(1) lookups.",
      starterCode: {
        javascript: "function hasDuplicateMints(ids) {\n  // your code\n}",
        python: "def hasDuplicateMints(ids):\n    # your code\n    pass"
      },
      repoCodeSnippet: "require(!_mintedProperties[propertyHash], 'Property already minted');"
    }
  ],

  quiz: [
    {
      id: 1,
      question: "Which token standard is primarily used for the property assets in this repository?",
      context: "Reviewing the implementation in the contracts directory.",
      options: [
        "ERC-20 (Fungible Tokens)",
        "ERC-721 (Non-Fungible Tokens)",
        "ERC-1155 (Multi-Token Standard)",
        "ERC-4626 (Tokenized Vaults)"
      ],
      correctIndex: 1,
      explanation: "ERC-721 is used because each real estate property is completely unique (non-fungible), unlike ERC-20 which is used for identical, fungible tokens like currency."
    },
    {
      id: 2,
      question: "What is the main purpose of the Ethers.js library in the frontend?",
      context: "Looking at the import statements in src/hooks",
      options: [
        "To perform complex math operations",
        "To manage React state globally",
        "To connect the UI to the Ethereum blockchain and sign transactions",
        "To securely host the database"
      ],
      correctIndex: 2,
      explanation: "Ethers.js is a library specifically designed to interact with the Ethereum Blockchain and its ecosystem, providing utilities for wallets, providers, and contracts."
    },
    {
      id: 3,
      question: "Why does the smart contract use the `require` statement during minting?",
      context: "Inside PropertyToken.sol's mint function",
      options: [
        "To format the output data",
        "To import other Solidity files",
        "To enforce conditions (like ownership or uniqueness) and revert the transaction if they fail",
        "To loop through arrays"
      ],
      correctIndex: 2,
      explanation: "`require` evaluates a condition and if it evaluates to false, it immediately stops execution, reverts all state changes, and optionally provides an error message."
    }
  ],

  docs: `# PropChain Documentation

## Overview
PropChain is a decentralized platform enabling the tokenization and seamless peer-to-peer trading of real estate assets on the Ethereum blockchain. It brings transparency and liquidity to traditional real estate markets.

## Architecture
The platform utilizes **Next.js** for a globally distributed, high-performance frontend and **Solidity** smart contracts for secure, immutable asset ownership. Communication between the web layer and the blockchain is handled flawlessly via **Ethers.js**.

## Prerequisites
- Node.js v18+
- Hardhat (for local blockchain development)
- MetaMask or any Web3 compatible wallet extension

## Installation
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/nitishsingh10/propchain.git
cd propchain

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
\`\`\`

## Configuration
Create a \`.env.local\` file in the root directory:
\`\`\`env
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_development_key
\`\`\`

## Key Components
1. **PropertyToken.sol**: The core smart contract. Handles minting and transferring of NFTs representing physical properties. Includes metadata storage for IPFS URIs.
2. **Web3Context**: A global React state provider managing the user's wallet connection, network switching, and account balance.
3. **PropertyCard**: The reusable UI component displaying property details fetched directly from the blockchain.

## Contributing
1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License
Distributed under the MIT License. See \`LICENSE\` for more information.
`
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ feature: string }> }
) {
  try {
    const { feature } = await params;

    // Simulate a slight network/processing delay to make loaders visible during presentation
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!MOCK_DATA[feature as keyof typeof MOCK_DATA]) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    const data = MOCK_DATA[feature as keyof typeof MOCK_DATA];

    // For docs, return raw text. For others, return the parsed JSON structure.
    if (feature === 'docs') {
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ data });
    }

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
