export interface CreatureTraits {
  bodySize: number;
  happiness: number;
  spikes: number;
  eyeGlow: number;
  wings: number;
  aura: number;
  bodyColor: string;
  eyeColor: string;
}

export interface CreatureStats {
  timesHeld: number;
  timesFed: number;
  timesPetted: number;
  timesTrained: number;
  timesTransferred: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface MonanomalyNFT {
  tokenId: number;
  owner: string;
  traits: CreatureTraits;
  stats: CreatureStats;
  metadata: NFTMetadata;
}

export interface ContractState {
  contract: any;
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  network: string | null;
  isCorrectNetwork: boolean;
}

// Add window.ethereum typing
declare global {
  interface Window {
    ethereum?: any;
  }
}