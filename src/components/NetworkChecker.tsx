import React, { useState, useEffect } from 'react';

interface NetworkCheckerProps {
  children: React.ReactNode;
}

const MONAD_TESTNET = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

export const NetworkChecker: React.FC<NetworkCheckerProps> = ({ children }) => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) {
        setIsLoading(false);
        return;
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsCorrectNetwork(chainId === MONAD_TESTNET.chainId);
    } catch (error) {
      console.error('Error checking network:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToMonadTestnet = async () => {
    try {
      setIsLoading(true);
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          console.error('Failed to add Monad Testnet:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      return () => {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div className="app">
        <div className="background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="floating-particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }} />
            ))}
          </div>
        </div>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            padding: '3rem',
            backdropFilter: 'blur(20px)',
            color: 'white'
          }}>
            <div style={{
              fontSize: '3rem',
              animation: 'spin 2s linear infinite',
              marginBottom: '1rem'
            }}>🔄</div>
            <p>Checking network...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!window.ethereum) {
    return (
      <div className="app">
        <div className="background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="floating-particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }} />
            ))}
          </div>
        </div>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            padding: '3rem',
            backdropFilter: 'blur(20px)',
            color: 'white'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))'
            }}>🦊</div>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>MetaMask Required</h3>
            <p style={{
              margin: '0 0 2rem 0',
              opacity: 0.9,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>Please install MetaMask to use this application.</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
                border: 'none',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>📥</span>
              Install MetaMask
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="app">
        <div className="background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="floating-particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }} />
            ))}
          </div>
        </div>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            padding: '3rem',
            backdropFilter: 'blur(20px)',
            color: 'white'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.5))'
            }}>🔗</div>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Wrong Network</h3>
            <p style={{
              margin: '0 0 2rem 0',
              opacity: 0.9,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>Please connect to Monad Testnet to use this application.</p>
            <button 
              onClick={switchToMonadTestnet} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                marginBottom: '2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>🔄</span>
              Switch to Monad Testnet
            </button>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'left'
            }}>
              <h4 style={{
                margin: '0 0 1.5rem 0',
                color: '#FFD700',
                textAlign: 'center',
                fontSize: '1.2rem'
              }}>Network Details:</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name:', value: 'Monad Testnet' },
                  { label: 'RPC URL:', value: MONAD_TESTNET.rpcUrls[0] },
                  { label: 'Chain ID:', value: '10143' },
                  { label: 'Currency:', value: 'MON' }
                ].map((detail, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: index < 3 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}>
                    <span style={{ fontWeight: 600, opacity: 0.8 }}>{detail.label}</span>
                    <span style={{
                      fontFamily: 'monospace',
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem'
                    }}>{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};