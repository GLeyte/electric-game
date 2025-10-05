import React, { useState, useEffect, useRef, useMemo } from 'react';
import background from './assets/background.png';
import right from './assets/right.png';
import wrong from './assets/wrong.png';

const WiresGame = () => {
  const [connections, setConnections] = useState({});
  const [dragging, setDragging] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showSparks, setShowSparks] = useState({});
  const [selectedConnector, setSelectedConnector] = useState(null);
  const svgRef = useRef(null);
  
  const leftWires = [
    { id: 'left-1', color: '#0062ffff', label: '', y: 189 },
    { id: 'left-2', color: '#ff9900ff', label: '', y: 322 },
    { id: 'left-3', color: '#ffdd00', label: '', y: 456 },
    { id: 'left-4', color: '#aa00ffff', label: '', y: 590 },
    { id: 'left-5', color: '#ff1100ff', label: '', y: 723 },
    { id: 'left-6', color: '#ffffffff', label: '', y: 861 }
  ];
  
  const rightWires = [
    { id: 'right-1', color: '#868686ff', label: '', y: 189 },
    { id: 'right-2', color: '#868686ff', label: '', y: 322 },
    { id: 'right-3', color: '#868686ff', label: '', y: 456 },
    { id: 'right-4', color: '#868686ff', label: '', y: 590 },
    { id: 'right-5', color: '#868686ff', label: '', y: 723 },
    { id: 'right-6', color: '#868686ff', label: '', y: 861 }
  ];
  
  const correctConnections = useMemo(() => ({
    'left-1': 'right-1',
    'left-2': 'right-3',
    'left-3': 'right-2',
    'left-4': 'right-5',
    'left-5': 'right-6',
    'left-6': 'right-4'
  }), []);
  
  useEffect(() => {
    const allConnected = Object.keys(correctConnections).every(
      key => connections[key] === correctConnections[key]
    );
    if (allConnected && Object.keys(connections).length === 6) {
      setIsComplete(true);
      Object.keys(correctConnections).forEach((key, index) => {
        setTimeout(() => {
          setShowSparks(prev => ({ ...prev, [key]: true }));
        }, index * 100);
      });
    } else {
      setIsComplete(false);
    }
  }, [connections, correctConnections]);
  
  const handleMouseMove = (e) => {
    if (dragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  const handleMouseUp = (e, targetId) => {
    if (dragging && targetId) {
      const isRightWire = targetId.startsWith('right-');
      if (isRightWire) {
        const newConnections = { ...connections };
        Object.keys(newConnections).forEach(key => {
          if (newConnections[key] === targetId) {
            delete newConnections[key];
          }
        });
        
        newConnections[dragging] = targetId;
        setConnections(newConnections);
        
        if (correctConnections[dragging] === targetId) {
          setShowSparks(prev => ({ ...prev, [dragging]: true }));
          setTimeout(() => {
            setShowSparks(prev => ({ ...prev, [dragging]: false }));
          }, 600);
        }
      }
    }
    setDragging(null);
    setSelectedConnector(null);
  };
  
  const handleWireStart = (wireId) => {
  if (connections[wireId]) {
    const newConnections = { ...connections };
    delete newConnections[wireId];
    setConnections(newConnections);
  }
  setDragging(wireId);
  setSelectedConnector(wireId);
  };
  
  const resetGame = () => {
    setConnections({});
    setIsComplete(false);
    setShowSparks({});
    setSelectedConnector(null);
  };
  
  const getWireEndpoint = (targetId) => {
    const wire = rightWires.find(w => w.id === targetId);
    return wire ? { x: 714, y: wire.y } : null;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #6b46c1 50%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    gameCard: {
      background: '#1f2937',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 50px rgba(139, 92, 246, 0.3)',
      padding: '32px',
      border: '4px solid #374151',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '700px',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      position: 'relative',
      zIndex: 10
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    statusContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '9999px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    },
    statusIncomplete: {
      background: 'rgba(245, 158, 11, 0.2)',
      border: '2px solid #f59e0b',
      color: '#fbbf24'
    },
    statusComplete: {
      background: 'rgba(16, 185, 129, 0.2)',
      border: '2px solid #10b981',
      color: '#34d399',
      animation: 'bounce 1s ease-in-out infinite'
    },
    gameArea: {
      position: 'relative',
      borderRadius: '16px',
      padding: '16px',
      border: '2px solid #374151',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    resetButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '9999px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '24px auto 0',
      display: 'block',
      fontSize: '16px'
    },
    resetButtonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      fontSize: '96px',
      color: '#10b981'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          @keyframes wireConnect {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes zoomInOut {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { 
              opacity: 0;
              transform: scale(0.8);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          .connector-selected {
            animation: zoomInOut 0.5s ease-in-out;
          }
          .connector-hover {
            transform: scale(1.15);
            transition: all 0.2s ease-in-out;
          }
          .wire-connected {
            animation: wireConnect 0.5s ease-out forwards;
          }
          .wire-dragging {
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          .lightning-icon {
            animation: pulse 2s ease-in-out infinite;
            color: #facc15;
          }
          .status-complete {
            animation: bounce 1s ease-in-out infinite;
          }
          .success-ping {
            animation: ping 1s ease-out;
          }
          .wire-connector {
            cursor: grab;
            transition: transform 0.2s ease;
            transform-origin: center;
          }
          .wire-connector:hover {
            transform: scale(1.1);
            transform-origin: center;
          }
          .wire-connector:active {
            cursor: grabbing;
          }
        `}
      </style>
      
      <div style={styles.gameCard}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span className="lightning-icon">⚡</span>
            Connect the Wires
            <span className="lightning-icon">⚡</span>
          </h1>
          <p style={styles.subtitle}>Drag the wires from the left to connect with the matching colors</p>
        </div>
        
        <div style={styles.statusContainer}>
          {isComplete ? (
            <div style={{...styles.statusBadge, ...styles.statusComplete}} className="status-complete">
              <span>✅</span>
              <span>TASK COMPLETE!</span>
            </div>
          ) : (
            <div style={{...styles.statusBadge, ...styles.statusIncomplete}}>
              <span>⚠️</span>
              <span>{Object.keys(connections).length}/6 Connections</span>
            </div>
          )}
        </div>
        
        <div style={styles.gameArea}>
          <svg
            ref={svgRef}
            width="1000"
            height="1000"
            style={{ cursor: 'crosshair', display: 'block', width: '100%', height: 'auto', maxWidth: '1000px',position: 'relative', zIndex: 1}}
            viewBox="0 0 1000 1000"
            onMouseMove={handleMouseMove}
            onMouseUp={() => handleMouseUp(null, null)}
            onMouseLeave={() => setDragging(null)}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
              </pattern>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="600" height="400" fill="url(#grid)" />
            
            {Object.entries(connections).map(([sourceId, targetId]) => {
              const source = leftWires.find(w => w.id === sourceId);
              const endpoint = getWireEndpoint(targetId);
              if (source && endpoint) {
                const isCorrect = correctConnections[sourceId] === targetId;

                return (
                  <g key={`${sourceId}-${targetId}`}>
                    <path
                      d={`M 210 ${source.y} Q ${(210 + endpoint.x) / 2} ${
                        Math.abs(source.y - endpoint.y) < 50 
                          ? (source.y + endpoint.y) / 2 - 100 
                          : (source.y + endpoint.y) / 2
                      } ${endpoint.x} ${endpoint.y}`}
                      strokeWidth="12"
                      fill="none"
                      stroke={source.color}
                      style={{
                        filter: isCorrect ? 'url(#glow)' : 'none',
                        opacity: isCorrect ? 1 : 0.8,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    {showSparks[sourceId] && (
                      <circle
                        r="8"
                        fill="white"
                        filter="url(#glow)"
                        className="success-ping"
                      >
                        <animateMotion
                          dur="0.6s"
                          repeatCount="1"
                          path={`M 210 ${source.y} Q ${(210 + endpoint.x) / 2} ${(source.y + endpoint.y) / 2} ${endpoint.x} ${endpoint.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              }
              return null;
            })}
            
            {dragging && (
              <path
                d={`M 210 ${leftWires.find(w => w.id === dragging).y} Q ${mousePos.x - 50} ${
                  Math.abs(leftWires.find(w => w.id === dragging).y - mousePos.y) < 50 
                    ? mousePos.y - 50 
                    : mousePos.y
                } ${mousePos.x} ${mousePos.y}`}
                strokeWidth="12"
                fill="none"
                stroke={leftWires.find(w => w.id === dragging).color}
                opacity="0.7"
                style={{ filter: 'url(#glow)' }}
              />
            )}
            
            {leftWires.map(wire => (
              <g key={wire.id}>
                <circle
                  cx="210"
                  cy={wire.y}
                  r="50"
                  fill="transparent"
                  stroke={wire.color}
                  strokeWidth="8"
                  className={`wire-connector ${selectedConnector === wire.id ? 'connector-selected' : ''}`}
                  style={{
                    transformOrigin: 'center',
                    transformBox: 'fill-box'
                  }}
                  onMouseDown={() => {
                    handleWireStart(wire.id);
                    setSelectedConnector(wire.id);
                  }}
                  onMouseEnter={(e) => {
                    e.target.classList.add('connector-hover');
                  }}
                  onMouseLeave={(e) => {
                    e.target.classList.remove('connector-hover');
                  }}
                  filter="url(#glow)"
                />
              </g>
            ))}
            
            {rightWires.map(wire => {
              const isConnected = Object.values(connections).includes(wire.id);
              const connectedWire = Object.entries(connections).find(([_, target]) => target === wire.id);
              const sourceWire = connectedWire ? leftWires.find(w => w.id === connectedWire[0]) : null;
              const isCorrect = connectedWire ? correctConnections[connectedWire[0]] === wire.id : false;
              
              return (
                <g key={wire.id}>
                  <circle
                    cx="714"
                    cy={wire.y}
                    r="50"
                    fill="transparent"
                    stroke={isConnected 
                      ? sourceWire?.color
                      : '#868686ff'
                    }
                    strokeWidth="8"
                    className={selectedConnector === wire.id ? 'connector-selected' : ''}
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: dragging ? 'pointer' : 'default',
                      transformOrigin: 'center',
                      transformBox: 'fill-box'
                    }}
                    onMouseEnter={(e) => {
                      if (dragging) {
                        e.target.classList.add('connector-hover');
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.classList.remove('connector-hover');
                    }}
                    onMouseUp={(e) => {
                      handleMouseUp(e, wire.id);
                      setSelectedConnector(null);
                    }}
                    filter={isCorrect ? "url(#glow)" : ""}
                  />
                  {isConnected && (
                    <image
                      href={isCorrect ? right : wrong}
                      x="816"
                      y={wire.y - 80}
                      width="140"
                      height="140"
                      style={{
                        opacity: 1,
                        position: 'relative',
                        zIndex: 1
                      }}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        <button
          onClick={resetGame}
          style={styles.resetButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          Reset Game
        </button>
        
        {isComplete && (
          <div style={styles.successOverlay}>
            <div className="success-ping">✓</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WiresGame;