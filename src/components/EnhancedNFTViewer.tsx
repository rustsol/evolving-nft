
import React, { useState, useEffect } from 'react';
import { MonanomalyNFT } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import {
  getEvolutionLevel,
  getPersonality,
  getMood,
  getEnergyLevel,
  getWingStage,
  getNextEvolutionRequirements,
  getTraitColor,
  generateEvolutionStory,
  copyToClipboard
} from '../utils/helpers';

interface EnhancedNFTViewerProps {
  nft: MonanomalyNFT;
  onFeed: (tokenId: number) => Promise<void>;
  onPet: (tokenId: number) => Promise<void>;
  onTrain: (tokenId: number) => Promise<void>;
  onAnger: (tokenId: number) => Promise<void>;
  onTransfer: (tokenId: number, toAddress: string) => Promise<void>;
  isLoading: boolean;
}

export const EnhancedNFTViewer: React.FC<EnhancedNFTViewerProps> = ({
  nft,
  onFeed,
  onPet,
  onTrain,
  onAnger,
  onTransfer,
  isLoading
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [svgData, setSvgData] = useState<string>('');
  const [showStory, setShowStory] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');

  useEffect(() => {
    if (nft.metadata.image) {
      const base64Data = nft.metadata.image.split(',')[1];
      const svgString = atob(base64Data);
      setSvgData(svgString);
    }
  }, [nft.metadata.image]);

  const handleAction = async (action: string, actionFn: () => Promise<void>) => {
    try {
      setActionLoading(action);
      await actionFn();
    } catch (error) {
      console.error(`Error ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTransfer = async () => {
    if (!transferAddress || !transferAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    try {
      setActionLoading('transfer');
      await onTransfer(nft.tokenId, transferAddress);
      setShowTransfer(false);
      setTransferAddress('');
    } catch (error) {
      console.error('Transfer error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyTokenURI = async () => {
    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(nft.metadata))}`;
    const success = await copyToClipboard(tokenURI);
    if (success) {
      setCopiedMessage('Token URI copied!');
      setTimeout(() => setCopiedMessage(null), 2000);
    }
  };

  const evolution = getEvolutionLevel(nft.traits);
  const personality = getPersonality(nft.traits);
  const mood = getMood(nft.traits.happiness);
  const energy = getEnergyLevel(nft.traits.eyeGlow);
  const wingStage = getWingStage(nft.traits.wings);
  const nextRequirements = getNextEvolutionRequirements(nft.traits);
  const story = generateEvolutionStory(nft.traits);

  const traitData = [
    { label: 'Body Size', value: nft.traits.bodySize, max: 10, icon: '🫧' },
    { label: 'Happiness', value: nft.traits.happiness, max: 10, icon: '😊' },
    { label: 'Energy', value: nft.traits.eyeGlow, max: 10, icon: '⚡' },
    { label: 'Aura Power', value: nft.traits.aura, max: 5, icon: '✨' },
    { label: 'Wing Level', value: nft.traits.wings, max: 3, icon: '🪶' },
    { label: 'Spike Count', value: nft.traits.spikes, max: 5, icon: '🔥' },
  ];

  const actionButtons = [
    { action: 'feed', label: 'Feed', icon: '🍎', desc: '+Size, +Happy', color: '#4CAF50', fn: onFeed },
    { action: 'pet', label: 'Pet', icon: '❤️', desc: '+Happy, +Aura', color: '#FF69B4', fn: onPet },
    { action: 'train', label: 'Train', icon: '⚡', desc: '+Energy, +Wings', color: '#FFD700', fn: onTrain },
    { action: 'anger', label: 'Anger', icon: '😠', desc: '+Spikes, +Energy', color: '#FF6B6B', fn: onAnger }
  ];

  const historyData = [
    { label: 'Times Fed', value: nft.stats.timesFed, icon: '🍎' },
    { label: 'Times Petted', value: nft.stats.timesPetted, icon: '❤️' },
    { label: 'Times Trained', value: nft.stats.timesTrained, icon: '⚡' },
    { label: 'Transfers', value: nft.stats.timesTransferred, icon: '↔️' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxHeight: '80vh'
    }}>
      {/* LEFT SIDE - Preview & Info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '1.5rem',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
        scrollbarWidth: 'thin'
      }}>
        {/* Creature Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: 'white'
          }}>{nft.metadata.name}</h2>
          <p style={{
            margin: '0 0 1rem 0',
            fontStyle: 'italic',
            color: '#FFD700',
            fontSize: '1rem'
          }}>{personality}</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '15px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              backgroundColor: evolution.color,
              color: evolution.color === '#FFFFFF' ? '#000' : '#FFF'
            }}>
              {evolution.level}
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.3rem 0.8rem',
              borderRadius: '15px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>{mood.emoji} {mood.mood}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            opacity: 0.9
          }}>
            <span>⚡ {energy.level}</span>
            <span>🪶 {wingStage}</span>
            <span>Tier {evolution.tier}</span>
          </div>
        </div>

        {/* Creature Image */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: svgData }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>

        {/* Story */}
        <button 
          onClick={() => setShowStory(!showStory)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: '100%',
            marginBottom: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          📖 {showStory ? 'Hide' : 'Show'} Creature Story
        </button>
        
        {showStory && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            borderLeft: '3px solid #FFD700'
          }}>
            <p style={{
              margin: 0,
              fontStyle: 'italic',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.9)'
            }}>{story}</p>
          </div>
        )}

        {/* Creature Attributes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#FFD700',
            fontSize: '1.1rem'
          }}>🎯 Creature Attributes</h3>
          {traitData.map((trait, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{trait.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{trait.label}:</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(trait.value / trait.max) * 100}%`,
                    backgroundColor: getTraitColor(trait.value, trait.max),
                    transition: 'width 0.5s ease',
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  minWidth: '35px'
                }}>{trait.value}/{trait.max}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evolution Goals */}
        {nextRequirements.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#FFD700',
              fontSize: '1.1rem'
            }}>🎯 Evolution Goals</h3>
            {nextRequirements.map((req, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.85rem', flex: 1 }}>{req.description}</span>
                <div style={{
                  width: '50px',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  margin: '0 0.5rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(req.current / req.max) * 100}%`,
                    background: 'linear-gradient(90deg, #00FF88, #00D4FF)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#FFD700'
                }}>{req.current}/{req.max}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '1.5rem',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
        scrollbarWidth: 'thin'
      }}>
        {/* Evolution Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#FFD700',
            fontSize: '1.1rem'
          }}>⚗️ Evolution Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem'
          }}>
            {actionButtons.map((btn) => (
              <button
                key={btn.action}
                onClick={() => handleAction(btn.action, () => btn.fn(nft.tokenId))}
                disabled={isLoading || actionLoading === btn.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading || actionLoading === btn.action ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: btn.color,
                  color: 'black',
                  position: 'relative',
                  
                  opacity: isLoading || actionLoading === btn.action ? 0.6 : 1
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{btn.icon}</span>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1
                }}>
                  <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '0.1rem'
                  }}>{btn.label}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    opacity: 0.9
                  }}>{btn.desc}</span>
                </div>
                {actionLoading === btn.action && (
                  <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <LoadingSpinner size="small" message="" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#FFD700',
            fontSize: '1.1rem'
          }}>🔄 Transfer Creature</h3>
          {!showTransfer ? (
            <button
              onClick={() => setShowTransfer(true)}
              disabled={isLoading}
              style={{
                background: 'linear-gradient(45deg, #9945FF, #7928CA)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '1rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              🚀 Transfer to Another Wallet
            </button>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                placeholder="Enter recipient address (0x...)"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                disabled={isLoading || actionLoading === 'transfer'}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleTransfer}
                  disabled={isLoading || actionLoading === 'transfer' || !transferAddress}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(45deg, #00FF88, #00D4FF)',
                    color: 'white'
                  }}
                >
                  {actionLoading === 'transfer' ? '🔄 Transferring...' : '✅ Confirm Transfer'}
                </button>
                <button
                  onClick={() => {
                    setShowTransfer(false);
                    setTransferAddress('');
                  }}
                  disabled={actionLoading === 'transfer'}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
                    color: 'white'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
              <p style={{
                fontSize: '0.7rem',
                color: '#FFA500',
                margin: 0,
                textAlign: 'center',
                padding: '0.5rem',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '4px'
              }}>
                ⚠️ Warning: Transfer will increase spikes (+1) and you'll lose ownership!
              </p>
            </div>
          )}
        </div>

        {/* Interaction History */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#FFD700',
            fontSize: '1.1rem'
          }}>📊 Interaction History</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem'
          }}>
            {historyData.map((stat, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '1rem' }}>{stat.icon}</span>
                <span style={{ fontSize: '0.8rem', flex: 1 }}>{stat.label}:</span>
                <span style={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                  fontSize: '0.9rem'
                }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleCopyTokenURI}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
          >
            📋 Copy Metadata
          </button>
          {copiedMessage && (
            <span style={{
              fontSize: '0.75rem',
              color: '#00FF88',
              fontWeight: 'bold'
            }}>{copiedMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
};
