import React, { useState, useEffect } from 'react';
import { MonanomalyNFT } from '../types';

interface NFTViewerProps {
  nft: MonanomalyNFT;
  onFeed: (tokenId: number) => Promise<void>;
  onPet: (tokenId: number) => Promise<void>;
  onTrain: (tokenId: number) => Promise<void>;
  onAnger: (tokenId: number) => Promise<void>;
  onTransfer: (tokenId: number, toAddress: string) => Promise<void>;
  isLoading: boolean;
}

export const NFTViewer: React.FC<NFTViewerProps> = ({
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
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');

  useEffect(() => {
    // Extract and decode SVG from metadata
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
      // Refresh the NFT data would happen in parent component
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

  const getEvolutionLevel = () => {
    const { traits } = nft;
    const totalEvolution = traits.bodySize + traits.happiness + traits.wings + traits.aura;
    
    if (totalEvolution >= 30) return { level: 'Legendary', color: '#FFD700' };
    if (totalEvolution >= 20) return { level: 'Epic', color: '#9945FF' };
    if (totalEvolution >= 15) return { level: 'Rare', color: '#00D4FF' };
    if (totalEvolution >= 10) return { level: 'Uncommon', color: '#00FF88' };
    return { level: 'Common', color: '#FFFFFF' };
  };

  const evolution = getEvolutionLevel();

  return (
    <div className="nft-viewer">
      <div className="nft-card">
        {/* NFT Header */}
        <div className="nft-header">
          <h3 className="nft-title">{nft.metadata.name}</h3>
          <span 
            className="evolution-badge"
            style={{ backgroundColor: evolution.color, color: '#000' }}
          >
            {evolution.level}
          </span>
        </div>

        {/* SVG Display */}
        <div className="nft-image-container">
          <div 
            className="nft-image"
            dangerouslySetInnerHTML={{ __html: svgData }}
          />
          <div className="floating-elements">
            {/* Floating particles for animation */}
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
          </div>
        </div>

        {/* Traits Display */}
        <div className="traits-section">
          <h4>Creature Traits</h4>
          <div className="traits-grid">
            <div className="trait-item">
              <span className="trait-label">Body Size:</span>
              <div className="trait-bar">
                <div 
                  className="trait-fill" 
                  style={{ width: `${(nft.traits.bodySize / 10) * 100}%` }}
                />
              </div>
              <span className="trait-value">{nft.traits.bodySize}/10</span>
            </div>

            <div className="trait-item">
              <span className="trait-label">Happiness:</span>
              <div className="trait-bar">
                <div 
                  className="trait-fill happiness" 
                  style={{ width: `${(nft.traits.happiness / 10) * 100}%` }}
                />
              </div>
              <span className="trait-value">{nft.traits.happiness}/10</span>
            </div>

            <div className="trait-item">
              <span className="trait-label">Energy:</span>
              <div className="trait-bar">
                <div 
                  className="trait-fill energy" 
                  style={{ width: `${(nft.traits.eyeGlow / 10) * 100}%` }}
                />
              </div>
              <span className="trait-value">{nft.traits.eyeGlow}/10</span>
            </div>

            <div className="trait-item">
              <span className="trait-label">Wings:</span>
              <span className="trait-value">{nft.traits.wings}/3</span>
            </div>

            <div className="trait-item">
              <span className="trait-label">Spikes:</span>
              <span className="trait-value">{nft.traits.spikes}/5</span>
            </div>

            <div className="trait-item">
              <span className="trait-label">Aura:</span>
              <span className="trait-value">{nft.traits.aura}/5</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-section">
          <h4>Evolve Your Creature</h4>
          <div className="action-buttons">
            <button
              className="action-btn feed-btn"
              onClick={() => handleAction('feed', () => onFeed(nft.tokenId))}
              disabled={isLoading || actionLoading === 'feed'}
            >
              {actionLoading === 'feed' ? '🍎 Feeding...' : '🍎 Feed (+Size, +Happy)'}
            </button>

            <button
              className="action-btn pet-btn"
              onClick={() => handleAction('pet', () => onPet(nft.tokenId))}
              disabled={isLoading || actionLoading === 'pet'}
            >
              {actionLoading === 'pet' ? '❤️ Petting...' : '❤️ Pet (+Happy, +Aura)'}
            </button>

            <button
              className="action-btn train-btn"
              onClick={() => handleAction('train', () => onTrain(nft.tokenId))}
              disabled={isLoading || actionLoading === 'train'}
            >
              {actionLoading === 'train' ? '⚡ Training...' : '⚡ Train (+Energy, +Wings)'}
            </button>

            <button
              className="action-btn anger-btn"
              onClick={() => handleAction('anger', () => onAnger(nft.tokenId))}
              disabled={isLoading || actionLoading === 'anger'}
            >
              {actionLoading === 'anger' ? '😠 Angering...' : '😠 Anger (+Spikes, +Energy)'}
            </button>
          </div>
        </div>

        {/* Transfer Section */}
        <div className="transfer-section">
          <h4>🔄 Transfer Creature</h4>
          {!showTransfer ? (
            <button
              className="transfer-toggle-btn"
              onClick={() => setShowTransfer(true)}
              disabled={isLoading}
            >
              🚀 Transfer to Another Wallet
            </button>
          ) : (
            <div className="transfer-form">
              <input
                type="text"
                placeholder="Enter recipient address (0x...)"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="transfer-input"
                disabled={isLoading || actionLoading === 'transfer'}
              />
              <div className="transfer-buttons">
                <button
                  className="transfer-btn confirm"
                  onClick={handleTransfer}
                  disabled={isLoading || actionLoading === 'transfer' || !transferAddress}
                >
                  {actionLoading === 'transfer' ? '🔄 Transferring...' : '✅ Confirm Transfer'}
                </button>
                <button
                  className="transfer-btn cancel"
                  onClick={() => {
                    setShowTransfer(false);
                    setTransferAddress('');
                  }}
                  disabled={actionLoading === 'transfer'}
                >
                  ❌ Cancel
                </button>
              </div>
              <p className="transfer-warning">
                ⚠️ Warning: Transfer will increase spikes (+1) and you'll lose ownership!
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h4>Creature History</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Times Fed:</span>
              <span className="stat-value">{nft.stats.timesFed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Times Petted:</span>
              <span className="stat-value">{nft.stats.timesPetted}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Times Trained:</span>
              <span className="stat-value">{nft.stats.timesTrained}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Transfers:</span>
              <span className="stat-value">{nft.stats.timesTransferred}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nft-viewer {
          max-width: 500px;
          margin: 0 auto;
        }

        .nft-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .nft-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .nft-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .evolution-badge {
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .nft-image-container {
          position: relative;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .nft-image {
          width: 100%;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nft-image svg {
          max-width: 100%;
          max-height: 100%;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #FFD700;
          border-radius: 50%;
          opacity: 0.7;
          animation: float 3s ease-in-out infinite;
        }

        .particle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .particle-2 {
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }

        .particle-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }

        .traits-section, .actions-section, .transfer-section, .stats-section {
          margin-bottom: 20px;
        }

        .traits-section h4, .actions-section h4, .transfer-section h4, .stats-section h4 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 1.1rem;
        }

        .traits-grid {
          display: grid;
          gap: 10px;
        }

        .trait-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trait-label {
          min-width: 80px;
          font-size: 0.9rem;
        }

        .trait-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .trait-fill {
          height: 100%;
          background: linear-gradient(90deg, #00FF88, #00D4FF);
          transition: width 0.3s ease;
        }

        .trait-fill.happiness {
          background: linear-gradient(90deg, #FFB6C1, #FF69B4);
        }

        .trait-fill.energy {
          background: linear-gradient(90deg, #FFD700, #FF4500);
        }

        .trait-value {
          min-width: 40px;
          text-align: right;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .action-btn {
          padding: 12px 8px;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .feed-btn:hover:not(:disabled) { background: linear-gradient(135deg, #4CAF50, #45a049); }
        .pet-btn:hover:not(:disabled) { background: linear-gradient(135deg, #FF69B4, #FF1493); }
        .train-btn:hover:not(:disabled) { background: linear-gradient(135deg, #FFD700, #FFA500); }
        .anger-btn:hover:not(:disabled) { background: linear-gradient(135deg, #FF6B6B, #FF4444); }

        .transfer-section h4 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 1.1rem;
        }

        .transfer-toggle-btn {
          background: linear-gradient(135deg, #9945FF, #7928CA);
          border: none;
          border-radius: 12px;
          color: white;
          padding: 12px 20px;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .transfer-toggle-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(153, 69, 255, 0.4);
        }

        .transfer-toggle-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .transfer-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .transfer-input {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          padding: 12px;
          font-size: 0.9rem;
          font-family: monospace;
          transition: border-color 0.3s ease;
        }

        .transfer-input:focus {
          outline: none;
          border-color: #9945FF;
        }

        .transfer-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .transfer-buttons {
          display: flex;
          gap: 10px;
        }

        .transfer-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .transfer-btn.confirm {
          background: linear-gradient(135deg, #00FF88, #00D4FF);
          color: white;
        }

        .transfer-btn.confirm:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 136, 0.4);
        }

        .transfer-btn.cancel {
          background: linear-gradient(135deg, #FF6B6B, #FF4444);
          color: white;
        }

        .transfer-btn.cancel:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .transfer-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .transfer-warning {
          font-size: 0.8rem;
          color: #FFA500;
          margin: 0;
          text-align: center;
          padding: 8px;
          background: rgba(255, 165, 0, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(255, 165, 0, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
        }

        .stat-value {
          font-weight: bold;
          color: #FFD700;
        }
      `}</style>
    </div>
  );
};