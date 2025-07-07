import React, { useState, useEffect } from 'react';
import { useContract } from './hooks/useContract';
import { EnhancedNFTViewer } from './components/EnhancedNFTViewer';
import { MonanomalyNFT } from './types';
import './index.css';
import chog1 from "./assets/chog.jpg";
import chog2 from "./assets/chog2.jpg";
import monanimals from "./assets/bg.png";
import moyaki from "./assets/monkey.png";
import benja from "./assets/benja.jpg";
import logo from "./assets/monkey-hat.png";



function App() {
  const {
    contract,
    account,
    isConnected,
    isLoading,
    error,
    network,
    isCorrectNetwork,
    connectWallet,
    mintNFT,
    feedCreature,
    petCreature,
    trainCreature,
    angerCreature,
    transferNFT,
    getUserNFTs
  } = useContract();

  const [userNFTs, setUserNFTs] = useState<MonanomalyNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<MonanomalyNFT | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user NFTs when connected and on correct network
  useEffect(() => {
    if (isConnected && contract && isCorrectNetwork) {
      refreshNFTs();
    }
  }, [isConnected, contract, isCorrectNetwork]);

  const refreshNFTs = async () => {
    try {
      setRefreshing(true);
      const nfts = await getUserNFTs();
      setUserNFTs(nfts);
      
      // Update selected NFT if it exists
      if (selectedNFT) {
        const updatedNFT = nfts.find(nft => nft.tokenId === selectedNFT.tokenId);
        if (updatedNFT) {
          setSelectedNFT(updatedNFT);
        }
      }
      
      // Auto-select first NFT if none selected
      if (!selectedNFT && nfts.length > 0) {
        setSelectedNFT(nfts[0]);
      }
    } catch (error) {
      console.error('Error refreshing NFTs:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMint = async () => {
    try {
      await mintNFT();
      // Wait a moment for blockchain confirmation
      setTimeout(refreshNFTs, 2000);
    } catch (error) {
      console.error('Mint error:', error);
    }
  };

  const handleCreatureAction = async (action: 'feed' | 'pet' | 'train' | 'anger', tokenId: number) => {
    try {
      switch (action) {
        case 'feed':
          await feedCreature(tokenId);
          break;
        case 'pet':
          await petCreature(tokenId);
          break;
        case 'train':
          await trainCreature(tokenId);
          break;
        case 'anger':
          await angerCreature(tokenId);
          break;
      }
      // Refresh data after action
      setTimeout(refreshNFTs, 1000);
    } catch (error) {
      console.error(`${action} error:`, error);
    }
  };

  const handleTransfer = async (tokenId: number, toAddress: string) => {
    try {
      await transferNFT(tokenId, toAddress);
      // Refresh data after transfer
      setTimeout(refreshNFTs, 1000);
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }} />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">🔮</div>
              <img src={logo} style={{ width: '5vh', height: 'auto' }} alt="logo" />
              <h1 className="title">
                Evolving NFT
              </h1>
            </div>
            <span className="subtitle">Evolving on Interaction</span>
          </div>
          
          {!isConnected ? (
            <button 
              className="connect-btn" 
              onClick={connectWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <span>+</span>
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <div className="wallet-info">
              <div className="network-indicator">
                <span className={`network-status ${isCorrectNetwork ? 'correct' : 'wrong'}`}>
                  {isCorrectNetwork ? '🟢' : '🔴'} {network || 'Unknown'}
                </span>
              </div>
              <span className="wallet-address">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
              <button 
                className="refresh-btn" 
                onClick={refreshNFTs}
                disabled={refreshing}
              >
                {refreshing ? '🔄' : '↻'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Featured Images - Only show when NOT connected */}
      {!isConnected && (
        <section className="hero">
           <div className="character-frame frame-3">
                  <div className="character-placeholder">
                    <span className="placeholder-icon"></span>
                    <img src={monanimals} style={{width:'100%', height:'80vh'}}></img>
                  </div>
                  <div className="character-glow glow-blue"></div>
                </div>
          <div className="hero-content">
          
            
            {/* Featured Character Images */}
            <div className="featured-characters">
              
              <div className="character-showcase">
                <div className="character-frame frame-1">
                  <div className="character-placeholder">
                    <span className="placeholder-icon"></span>
                     <img src={chog1}></img>
                  </div>
                  <div className="character-glow"></div>
                  <div className="character-particles">
                    
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="char-particle" />
                    ))}
                  </div>
                </div>

                <div className="character-frame frame-2">
                  <div className="character-placeholder">
                    <span className="placeholder-icon"></span>
                     <img src={chog2}></img>
                  </div>
                  <div className="character-glow"></div>
                  <div className="character-particles">
                    
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="char-particle" />
                    ))}
                  </div>
                </div>
                
               
                <div className="character-frame frame-4">
                  <div className="character-placeholder">
                    <span className="placeholder-icon"></span>
                    <img src={moyaki}></img>
                  </div>
                  <div className="character-glow glow-blue"></div>
                </div>

                  <div className="character-frame frame-5">
                  <div className="character-placeholder">
                    <span className="placeholder-icon"></span>
                    <img src={benja}></img>
                  </div>
                  <div className="character-glow glow-blue"></div>
                </div>


              </div>
            </div>
          </div>


          
          
          {/* Stats Cards */}
          
        </section>
      )}

      {/* Main Content */}
      <main className="main-content">
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {isConnected && !isCorrectNetwork && (
          <div className="network-warning">
            🔄 You're on {network}. Switch to Monad Testnet for full functionality.
          </div>
        )}

        {!isConnected ? (
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="hero-text">
              <h2>Discover Your Digital Companion</h2>
             
            </div>
              <p>
                Discover and evolve your - a unique onchain mechanism that grows and changes based on your interactions. Even character is onchain.
              </p>
              <div className="features">
                <div className="feature">
                  <span className="feature-icon">🍎</span>
                  <span>Feed to grow bigger</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">❤️</span>
                  <span>Pet for happiness</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Train for power</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👹</span>
                  <span>Anger for spikes</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-new">
            {/* Horizontal NFT Collection */}
            <div className="collection-horizontal">
              <div className="collection-header">
                <h2>Your Monanomalies ({userNFTs.length})</h2>
                <button 
                  className="mint-btn-compact" 
                  onClick={handleMint}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner-small" />
                  ) : (
                    <>
                      <span>✨</span>
                      Mint New
                    </>
                  )}
                </button>
              </div>

              {userNFTs.length === 0 ? (
                <div className="empty-collection-horizontal">
                  <div className="empty-icon-small">🔮</div>
                  <p>You don't have any Monanomalies yet! Mint your first creature to begin.</p>
                </div>
              ) : (
                <div className="nft-horizontal-grid">
                  {userNFTs.map((nft: MonanomalyNFT) => (
                    <div 
                      key={nft.tokenId}
                      className={`nft-card-horizontal ${selectedNFT?.tokenId === nft.tokenId ? 'selected' : ''}`}
                      onClick={() => setSelectedNFT(nft)}
                    >
                      <div className="nft-horizontal-image">
                        <div
                          className="svg-thumbnail-small"
                          dangerouslySetInnerHTML={{
                            __html: nft.metadata.image ? atob(nft.metadata.image.split(',')[1]) : ''
                          }}
                        />
                      </div>
                      <div className="nft-horizontal-info">
                        <h4>{nft.metadata.name}</h4>
                        <p>❤️ {nft.traits.happiness}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Split View: Preview Left, Actions Right */}
            {selectedNFT && (
              <div className="split-view">
                <EnhancedNFTViewer
                  nft={selectedNFT}
                  onFeed={(tokenId) => handleCreatureAction('feed', tokenId)}
                  onPet={(tokenId) => handleCreatureAction('pet', tokenId)}
                  onTrain={(tokenId) => handleCreatureAction('train', tokenId)}
                  onAnger={(tokenId) => handleCreatureAction('anger', tokenId)}
                  onTransfer={handleTransfer}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;