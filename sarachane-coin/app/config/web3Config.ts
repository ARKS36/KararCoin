export const SUPPORTED_CHAINS = {
  polygon: {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  mumbai: {
    chainId: '0x13881',
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  }
}

export const CONTRACT_ADDRESSES = {
  token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '',
  dao: process.env.NEXT_PUBLIC_DAO_ADDRESS || '',
}

export const IPFS_CONFIG = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
} 