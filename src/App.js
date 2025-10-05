import React, { useState, useEffect, useRef } from 'react';
import { Zap, AlertCircle, CheckCircle } from 'lucide-react';

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
      // Efeito de faíscas em todos os fios
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
        // Remove conexões anteriores deste fio
        Object.keys(newConnections).forEach(key => {
          if (newConnections[key] === targetId) {
            delete newConnections[key];
          }
        });
        
        newConnections[dragging] = targetId;
        setConnections(newConnections);
        
        // Verifica se a conexão está correta
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
    // Remove conexão existente se houver
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 border-4 border-gray-700 relative overflow-hidden">
        {/* Efeito de background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
        
        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Zap className="text-yellow-400 animate-pulse" />
            Conecte os Fios
            <Zap className="text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-gray-400">Arraste os fios da esquerda para conectar com as cores correspondentes</p>
        </div>
        
        {/* Status */}
        <div className="flex justify-center mb-4">
          {isComplete ? (
            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border-2 border-green-500 animate-bounce">
              <CheckCircle className="text-green-400" />
              <span className="text-green-400 font-bold">TAREFA COMPLETA!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border-2 border-yellow-500">
              <AlertCircle className="text-yellow-400" />
              <span className="text-yellow-400">
                {Object.keys(connections).length}/4 Conexões
              </span>
            </div>
          )}
        </div>
        
        {/* Game Area */}
        <div className="relative bg-gray-900 rounded-2xl p-4 border-2 border-gray-700">
          <svg
            ref={svgRef}
            width="600"
            height="400"
            className="cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={() => handleMouseUp(null, null)}
            onMouseLeave={() => setDragging(null)}
          >
            {/* Grid pattern background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
              </pattern>
              
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="600" height="400" fill="url(#grid)" />
            
            {/* Rendered connections */}
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
                      className={isCorrect ? "animate-pulse" : ""}
                      opacity={isCorrect ? 1 : 0.8}
                    />
                    {showSparks[sourceId] && (
                      <circle r="8" fill={source.color} filter="url(#glow)"
                        className="animate-ping">
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
            
            {/* Dragging wire */}
            {dragging && (
              <path
                d={`M 80 ${leftWires.find(w => w.id === dragging).y} Q ${mousePos.x - 50} ${mousePos.y} ${mousePos.x} ${mousePos.y}`}
                stroke={leftWires.find(w => w.id === dragging).color}
                strokeWidth="6"
                fill="none"
                opacity="0.7"
                strokeDasharray="10 5"
                className="animate-pulse"
              />
            )}
            
            {/* Left wires */}
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
                  className="cursor-grab hover:scale-110 transition-transform"
                  onMouseDown={() => handleWireStart(wire.id)}
                  filter="url(#glow)"
                />
                <text
                  x="50"
                  y={wire.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  className="pointer-events-none select-none"
                >
                  {wire.label}
                </text>
              </g>
            ))}
            
            {/* Right wires */}
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
                    className={`${dragging ? 'hover:scale-110' : ''} transition-all`}
                    onMouseUp={(e) => handleMouseUp(e, wire.id)}
                    filter={isCorrect ? "url(#glow)" : ""}
                  />
                  <text
                    x="550"
                    y={wire.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    className="pointer-events-none select-none"
                  >
                    {wire.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Reset button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-full font-bold hover:from-red-600 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Resetar Jogo
          </button>
        </div>
        
        {/* Complete animation */}
        {isComplete && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-6xl font-bold text-green-400 animate-ping">
              ✓
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WiresGame;