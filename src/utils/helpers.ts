import { CreatureTraits } from '../types';

/**
 * Formats wallet address for display
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Formats time duration from seconds
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Calculate evolution level based on traits
 */
export const getEvolutionLevel = (traits: CreatureTraits) => {
  const totalEvolution = traits.bodySize + traits.happiness + traits.wings + traits.aura + traits.eyeGlow;
  
  if (totalEvolution >= 35) return { level: 'Transcendent', color: '#FF00FF', tier: 6 };
  if (totalEvolution >= 30) return { level: 'Legendary', color: '#FFD700', tier: 5 };
  if (totalEvolution >= 23) return { level: 'Epic', color: '#9945FF', tier: 4 };
  if (totalEvolution >= 18) return { level: 'Rare', color: '#00D4FF', tier: 3 };
  if (totalEvolution >= 12) return { level: 'Uncommon', color: '#00FF88', tier: 2 };
  return { level: 'Common', color: '#FFFFFF', tier: 1 };
};

/**
 * Get personality based on traits
 */
export const getPersonality = (traits: CreatureTraits): string => {
  const { happiness, spikes, eyeGlow, wings } = traits;
  
  if (spikes >= 3 && eyeGlow >= 6) return 'Fierce Warrior';
  if (happiness >= 8 && wings >= 2) return 'Gentle Spirit';
  if (eyeGlow >= 8 && wings >= 3) return 'Mystical Sage';
  if (happiness >= 6 && spikes <= 1) return 'Peaceful Guardian';
  if (spikes >= 2 && happiness <= 4) return 'Wild Beast';
  if (wings >= 2 && eyeGlow >= 5) return 'Sky Dancer';
  return 'Curious Explorer';
};

/**
 * Get creature mood based on happiness
 */
export const getMood = (happiness: number): { mood: string; emoji: string } => {
  if (happiness >= 9) return { mood: 'Ecstatic', emoji: '🤩' };
  if (happiness >= 7) return { mood: 'Happy', emoji: '😊' };
  if (happiness >= 5) return { mood: 'Content', emoji: '😌' };
  if (happiness >= 3) return { mood: 'Neutral', emoji: '😐' };
  if (happiness >= 1) return { mood: 'Sad', emoji: '😢' };
  return { mood: 'Miserable', emoji: '😭' };
};

/**
 * Get energy level description
 */
export const getEnergyLevel = (eyeGlow: number): { level: string; description: string } => {
  if (eyeGlow >= 9) return { level: 'Maximum', description: 'Eyes blazing with cosmic power' };
  if (eyeGlow >= 7) return { level: 'High', description: 'Radiating intense energy' };
  if (eyeGlow >= 5) return { level: 'Moderate', description: 'Glowing with steady power' };
  if (eyeGlow >= 3) return { level: 'Low', description: 'Faint energy emanating' };
  return { level: 'Minimal', description: 'Barely glowing' };
};

/**
 * Get wing development stage
 */
export const getWingStage = (wings: number): string => {
  switch (wings) {
    case 0: return 'Wingless';
    case 1: return 'Sprouting';
    case 2: return 'Developed';
    case 3: return 'Majestic';
    default: return 'Unknown';
  }
};

/**
 * Calculate next evolution requirements
 */
export const getNextEvolutionRequirements = (traits: CreatureTraits) => {
  const requirements = [];
  
  if (traits.bodySize < 10) {
    requirements.push({
      action: 'Feed',
      current: traits.bodySize,
      max: 10,
      description: 'Feed to grow bigger'
    });
  }
  
  if (traits.happiness < 10) {
    requirements.push({
      action: 'Pet',
      current: traits.happiness,
      max: 10,
      description: 'Pet for happiness'
    });
  }
  
  if (traits.eyeGlow < 10) {
    requirements.push({
      action: 'Train',
      current: traits.eyeGlow,
      max: 10,
      description: 'Train for energy'
    });
  }
  
  if (traits.wings < 3) {
    const actionsNeeded = Math.max(0, (traits.wings + 1) * 5 - (traits.bodySize + traits.happiness + traits.eyeGlow));
    requirements.push({
      action: 'Any Action',
      current: traits.wings,
      max: 3,
      description: `${actionsNeeded} more actions for next wing stage`
    });
  }
  
  return requirements;
};

/**
 * Get trait color based on value
 */
export const getTraitColor = (value: number, max: number): string => {
  const percentage = value / max;
  
  if (percentage >= 0.9) return '#FFD700'; // Gold
  if (percentage >= 0.7) return '#00FF88'; // Green
  if (percentage >= 0.5) return '#00D4FF'; // Blue
  if (percentage >= 0.3) return '#FFA500'; // Orange
  return '#FF6B6B'; // Red
};

/**
 * Generate random creature name based on traits
 */
export const generateCreatureName = (traits: CreatureTraits): string => {
  const prefixes = {
    high_happiness: ['Joyful', 'Blissful', 'Cheerful', 'Radiant'],
    high_energy: ['Blazing', 'Electric', 'Cosmic', 'Brilliant'],
    high_spikes: ['Thorned', 'Spiky', 'Armored', 'Fierce'],
    high_wings: ['Soaring', 'Winged', 'Celestial', 'Flying']
  };
  
  const suffixes = ['Mona', 'Sprite', 'Beast', 'Guardian', 'Spirit', 'Anomaly'];
  
  let prefix = 'Mysterious';
  
  if (traits.happiness >= 7) {
    prefix = prefixes.high_happiness[Math.floor(Math.random() * prefixes.high_happiness.length)];
  } else if (traits.eyeGlow >= 7) {
    prefix = prefixes.high_energy[Math.floor(Math.random() * prefixes.high_energy.length)];
  } else if (traits.spikes >= 3) {
    prefix = prefixes.high_spikes[Math.floor(Math.random() * prefixes.high_spikes.length)];
  } else if (traits.wings >= 2) {
    prefix = prefixes.high_wings[Math.floor(Math.random() * prefixes.high_wings.length)];
  }
  
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Check if wallet is connected to correct network
 */
export const isCorrectNetwork = async (targetChainId: number): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16) === targetChainId;
  } catch (error) {
    return false;
  }
};

/**
 * Switch to target network
 */
export const switchNetwork = async (chainId: number, rpcUrl: string, chainName: string): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // Network not added to wallet
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName,
            rpcUrls: [rpcUrl],
            nativeCurrency: {
              name: 'MON',
              symbol: 'MON',
              decimals: 18,
            },
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate creature evolution story
 */
export const generateEvolutionStory = (traits: CreatureTraits): string => {
  const personality = getPersonality(traits);
  const mood = getMood(traits.happiness);
  const energy = getEnergyLevel(traits.eyeGlow);
  
  const stories = [
    `This ${personality.toLowerCase()} emerged from the digital ether, ${mood.mood.toLowerCase()} and ${energy.description.toLowerCase()}.`,
    `Born in the fractured realms of Monad, this creature has evolved into a ${personality.toLowerCase()}.`,
    `Through countless interactions, this being has developed a ${mood.mood.toLowerCase()} disposition and ${energy.level.toLowerCase()} energy.`,
    `The blockchain has shaped this entity into a unique ${personality.toLowerCase()}, radiating ${mood.mood.toLowerCase()} vibes.`
  ];
  
  return stories[Math.floor(Math.random() * stories.length)];
};