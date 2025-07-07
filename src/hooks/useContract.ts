import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ContractState, MonanomalyNFT, CreatureTraits, CreatureStats } from '../types';

// Contract ABI (simplified for key functions)
const CONTRACT_ABI = [
  "function mint() external",
  "function feedCreature(uint256 tokenId) external",
  "function petCreature(uint256 tokenId) external", 
  "function trainCreature(uint256 tokenId) external",
  "function angerCreature(uint256 tokenId) external",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function traits(uint256 tokenId) external view returns (uint256, uint256, uint256, uint256, uint256, uint256, string, string)",
  "function getCreatureStats(uint256 tokenId) external view returns (uint256, uint256, uint256, uint256, uint256)",
  "function totalSupply() external view returns (uint256)",
  "event CreatureEvolved(uint256 indexed tokenId, string action, string newTrait)"
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x7f35c20994A02eC29627B18eaa511A9AF8B52504"; // Update this!
//const CONTRACT_ADDRESS = "0xFfff46e77aDa6e59F509BeA5f641407D55EDEF60"; // Update this!

// Network mapping
const getNetworkName = (chainId: string): string => {
  const networks: { [key: string]: string } = {
    '0x1': 'Ethereum',
    '0x89': 'Polygon',
    '0x38': 'BSC',
    '0xa86a': 'Avalanche',
    '0x279F': 'Monad Testnet',
    '0x539': 'Localhost',
  };
  return networks[chainId] || `Unknown (${parseInt(chainId, 16)})`;
};

export const useContract = () => {
  const [state, setState] = useState<ContractState>({
    contract: null,
    account: null,
    isConnected: false,
    isLoading: false,
    error: null,
    network: null,
    isCorrectNetwork: false
  });

  // Check current network
  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);
      const isCorrectNetwork = chainId === '0x279F'; // Monad Testnet
      
      setState(prev => ({
        ...prev,
        network: networkName,
        isCorrectNetwork
      }));
    } catch (error) {
      console.error('Error checking network:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!window.ethereum) {
        throw new Error('Please install MetaMask or OKX Wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Auto-switch to Monad Testnet if not on it
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const monadChainId = '0x279F'; // 10143 in hex
      
      if (chainId !== monadChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: monadChainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network not added, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: monadChainId,
                chainName: 'Monad Testnet',
                rpcUrls: ['https://testnet-rpc.monad.xyz'],
                nativeCurrency: {
                  name: 'MON',
                  symbol: 'MON',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.monadexplorer.com'],
              }],
            });
          }
        }
      }

      // Create simple provider (ENS errors are harmless)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setState({
        contract,
        account: accounts[0],
        isConnected: true,
        isLoading: false,
        error: null,
        network: 'Monad Testnet',
        isCorrectNetwork: true
      });

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  }, []);

  const mintNFT = useCallback(async () => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.mint();
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract]);

  const feedCreature = useCallback(async (tokenId: number) => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.feedCreature(tokenId);
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract]);

  const petCreature = useCallback(async (tokenId: number) => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.petCreature(tokenId);
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract]);

  const trainCreature = useCallback(async (tokenId: number) => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.trainCreature(tokenId);
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract]);

  const angerCreature = useCallback(async (tokenId: number) => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.angerCreature(tokenId);
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract]);

  const transferNFT = useCallback(async (tokenId: number, toAddress: string) => {
    if (!state.contract) throw new Error('Contract not connected');
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const tx = await state.contract.transferFrom(state.account, toAddress, tokenId);
      await tx.wait();
      setState(prev => ({ ...prev, isLoading: false }));
      return tx;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [state.contract, state.account]);

  const getCreatureData = useCallback(async (tokenId: number): Promise<MonanomalyNFT | null> => {
    if (!state.contract) return null;

    try {
      const traitsData = await state.contract.traits(tokenId);
      const traits: CreatureTraits = {
        bodySize: Number(traitsData[0]),
        happiness: Number(traitsData[1]),
        spikes: Number(traitsData[2]),
        eyeGlow: Number(traitsData[3]),
        wings: Number(traitsData[4]),
        aura: Number(traitsData[5]),
        bodyColor: traitsData[6],
        eyeColor: traitsData[7]
      };

      const statsData = await state.contract.getCreatureStats(tokenId);
      const stats: CreatureStats = {
        timesHeld: Number(statsData[0]),
        timesFed: Number(statsData[1]),
        timesPetted: Number(statsData[2]),
        timesTrained: Number(statsData[3]),
        timesTransferred: Number(statsData[4])
      };

      const tokenURI = await state.contract.tokenURI(tokenId);
      const metadataJson = atob(tokenURI.split(',')[1]);
      const metadata = JSON.parse(metadataJson);

      const owner = await state.contract.ownerOf(tokenId);

      return {
        tokenId,
        owner,
        traits,
        stats,
        metadata
      };

    } catch (error) {
      console.error('Error fetching creature data:', error);
      return null;
    }
  }, [state.contract]);

  const getUserNFTs = useCallback(async (): Promise<MonanomalyNFT[]> => {
    if (!state.contract || !state.account) return [];

    try {
      const totalSupply = await state.contract.totalSupply();
      const userNFTs: MonanomalyNFT[] = [];

      for (let i = 1; i <= Number(totalSupply); i++) {
        try {
          const owner = await state.contract.ownerOf(i);
          if (owner.toLowerCase() === state.account.toLowerCase()) {
            const nftData = await getCreatureData(i);
            if (nftData) {
              userNFTs.push(nftData);
            }
          }
        } catch (error) {
          continue;
        }
      }

      return userNFTs;
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }, [state.contract, state.account, getCreatureData]);

  // Listen for account and network changes
  useEffect(() => {
    checkNetwork(); // Check network on load
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setState({
            contract: null,
            account: null,
            isConnected: false,
            isLoading: false,
            error: null,
            network: null,
            isCorrectNetwork: false
          });
        } else {
          setState(prev => ({ ...prev, account: accounts[0] }));
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        const networkName = getNetworkName(chainId);
        const isCorrectNetwork = chainId === '0x279F';
        
        setState(prev => ({
          ...prev,
          network: networkName,
          isCorrectNetwork
        }));
        
        // Reload page to reset contract connection on network change
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [checkNetwork]);

  return {
    contract: state.contract,
    account: state.account,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    error: state.error,
    network: state.network,
    isCorrectNetwork: state.isCorrectNetwork,
    connectWallet,
    mintNFT,
    feedCreature,
    petCreature,
    trainCreature,
    angerCreature,
    transferNFT,
    getCreatureData,
    getUserNFTs,
    checkNetwork
  };
};