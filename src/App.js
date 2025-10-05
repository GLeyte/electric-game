import React, { useState, useEffect, useRef } from 'react';

const WiresGame = () => {
  const [connections, setConnections] = useState({});
  const [dragging, setDragging] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showSparks, setShowSparks] = useState({});
  const svgRef = useRef(null);
  
  const leftWires = [
    { id: 'left-1', color: '#ff0000', label: 'Vermelho', y: 80 },
    { id: 'left-2', color: '#0066ff', label: 'Azul', y: 160 },
    { id: 'left-3', color: '#ffdd00', label: 'Amarelo', y: 240 },
    { id: 'left-4', color: '#ff00ff', label: 'Rosa', y: 320 }
  ];
  
  const rightWires = [
    { id: 'right-1', color: '#ffdd00', label: 'Amarelo', y: 80 },
    { id: 'right-2', color: '#ff00ff', label: 'Rosa', y: 160 },
    { id: 'right-3', color: '#ff0000', label: 'Vermelho', y: 240 },
    { id: 'right-4', color: '#0066ff', label: 'Azul', y: 320 }
  ];
  
  const correctConnections = {
    'left-1': 'right-3',
    'left-2': 'right-4',
    'left-3': 'right-1',
    'left-4': 'right-2'
  };
  
  useEffect(() => {
    const allConnected = Object.keys(correctConnections).every(
      key => connections[key] === correctConnections[key]
    );
    if (allConnected && Object.keys(connections).length === 4) {
      setIsComplete(true);
      Object.keys(correctConnections).forEach((key, index) => {
        setTimeout(() => {
          setShowSparks(prev => ({ ...prev, [key]: true }));
        }, index * 100);
      });
    } else {
      setIsComplete(false);
    }
  }, [connections]);
  
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
  };
  
  const handleWireStart = (wireId) => {
    const newConnections = { ...connections };
    delete newConnections[wireId];
    setConnections(newConnections);
    setDragging(wireId);
  };
  
  const resetGame = () => {
    setConnections({});
    setIsComplete(false);
    setShowSparks({});
  };
  
  const getWireEndpoint = (targetId) => {
    const wire = rightWires.find(w => w.id === targetId);
    return wire ? { x: 520, y: wire.y } : null;
  };

  // Estilos inline para garantir que funcione sem Tailwind
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
      background: '#111827',
      borderRadius: '16px',
      padding: '16px',
      border: '2px solid #374151',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
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
          }
          .wire-connector:hover {
            transform: scale(1.1);
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
            Conecte os Fios
            <span className="lightning-icon">⚡</span>
          </h1>
          <p style={styles.subtitle}>Arraste os fios da esquerda para conectar com as cores correspondentes</p>
        </div>
        
        <div style={styles.statusContainer}>
          {isComplete ? (
            <div style={{...styles.statusBadge, ...styles.statusComplete}} className="status-complete">
              <span>✅</span>
              <span>TAREFA COMPLETA!</span>
            </div>
          ) : (
            <div style={{...styles.statusBadge, ...styles.statusIncomplete}}>
              <span>⚠️</span>
              <span>{Object.keys(connections).length}/4 Conexões</span>
            </div>
          )}
        </div>
        
        <div style={styles.gameArea}>
          <svg
            ref={svgRef}
            width="600"
            height="400"
            style={{ cursor: 'crosshair', display: 'block', width: '100%', height: 'auto', maxWidth: '600px' }}
            viewBox="0 0 600 400"
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
                      d={`M 80 ${source.y} Q 300 ${source.y} ${endpoint.x} ${endpoint.y}`}
                      stroke={source.color}
                      strokeWidth="6"
                      fill="none"
                      filter={isCorrect ? "url(#glow)" : ""}
                      style={isCorrect ? { animation: 'pulse 2s ease-in-out infinite' } : {}}
                      opacity={isCorrect ? 1 : 0.8}
                    />
                    {showSparks[sourceId] && (
                      <circle r="8" fill={source.color} filter="url(#glow)" className="success-ping">
                        <animateMotion dur="0.6s" repeatCount="1">
                          <mpath href={`#path-${sourceId}`} />
                        </animateMotion>
                      </circle>
                    )}
                    <path
                      id={`path-${sourceId}`}
                      d={`M 80 ${source.y} Q 300 ${source.y} ${endpoint.x} ${endpoint.y}`}
                      fill="none"
                    />
                  </g>
                );
              }
              return null;
            })}
            
            {dragging && (
              <path
                d={`M 80 ${leftWires.find(w => w.id === dragging).y} Q ${mousePos.x - 50} ${mousePos.y} ${mousePos.x} ${mousePos.y}`}
                stroke={leftWires.find(w => w.id === dragging).color}
                strokeWidth="6"
                fill="none"
                opacity="0.7"
                strokeDasharray="10 5"
                style={{ animation: 'pulse 1s ease-in-out infinite' }}
              />
            )}
            
            {leftWires.map(wire => (
              <g key={wire.id}>
                <rect
                  x="20"
                  y={wire.y - 20}
                  width="100"
                  height="40"
                  fill="#1f2937"
                  stroke="#374151"
                  strokeWidth="2"
                  rx="5"
                />
                <circle
                  cx="80"
                  cy={wire.y}
                  r="12"
                  fill={wire.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="wire-connector"
                  onMouseDown={() => handleWireStart(wire.id)}
                  filter="url(#glow)"
                />
                <text
                  x="50"
                  y={wire.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {wire.label}
                </text>
              </g>
            ))}
            
            {rightWires.map(wire => {
              const isConnected = Object.values(connections).includes(wire.id);
              const isCorrect = Object.entries(connections).some(
                ([source, target]) => target === wire.id && correctConnections[source] === target
              );
              
              return (
                <g key={wire.id}>
                  <rect
                    x="480"
                    y={wire.y - 20}
                    width="100"
                    height="40"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="2"
                    rx="5"
                  />
                  <circle
                    cx="520"
                    cy={wire.y}
                    r="12"
                    fill={isConnected ? (isCorrect ? '#10b981' : wire.color) : '#374151'}
                    stroke={isConnected ? '#fff' : '#6b7280'}
                    strokeWidth="2"
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: dragging ? 'pointer' : 'default',
                      transform: dragging && !isConnected ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onMouseUp={(e) => handleMouseUp(e, wire.id)}
                    filter={isCorrect ? "url(#glow)" : ""}
                  />
                  <text
                    x="550"
                    y={wire.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {wire.label}
                  </text>
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
          Resetar Jogo
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