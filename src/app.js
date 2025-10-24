import React, { useState, useEffect } from 'react';
import { Clock, Zap, Package, AlertTriangle, Trophy, RotateCcw } from 'lucide-react';

export default function TimeMachineGame() {
  const [currentEra, setCurrentEra] = useState('1960s');
  const [inventory, setInventory] = useState([]);
  const [gameState, setGameState] = useState({
    '1920s': { visited: false, itemsTaken: [], eventsCompleted: [] },
    '1940s': { visited: false, itemsTaken: [], eventsCompleted: [] },
    '1960s': { visited: true, itemsTaken: [], eventsCompleted: [] },
    '1980s': { visited: false, itemsTaken: [], eventsCompleted: [] },
    '1990s': { visited: false, itemsTaken: [], eventsCompleted: [] }
  });
  const [paradoxMeter, setParadoxMeter] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showMessage, setShowMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [timelineIntegrity, setTimelineIntegrity] = useState(100);

  const eras = {
    '1920s': {
      name: 'Roaring Twenties',
      color: 'from-amber-600 to-yellow-700',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-900',
      description: 'Jazz, flappers, and prohibition',
      items: ['vinyl-record', 'art-deco-blueprint'],
      events: ['help-musician', 'find-blueprint']
    },
    '1940s': {
      name: 'WWII Era',
      color: 'from-slate-600 to-gray-700',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-900',
      description: 'Innovation through adversity',
      items: ['radio-parts', 'encryption-code'],
      events: ['repair-radio', 'decode-message']
    },
    '1960s': {
      name: 'Space Race',
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      description: 'One giant leap for mankind',
      items: ['moon-rock', 'transistor'],
      events: ['help-scientist', 'find-transistor']
    },
    '1980s': {
      name: 'Tech Boom',
      color: 'from-purple-600 to-pink-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      description: 'Personal computers revolution',
      items: ['floppy-disk', 'microchip'],
      events: ['fix-computer', 'program-software']
    },
    '1990s': {
      name: 'Digital Age',
      color: 'from-green-600 to-teal-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'The internet changes everything',
      items: ['cd-rom', 'modem'],
      events: ['connect-internet', 'upgrade-hardware']
    }
  };

  const itemDescriptions = {
    'vinyl-record': { name: 'Vinyl Record', icon: '🎵', desc: 'Jazz recording from 1920s' },
    'art-deco-blueprint': { name: 'Art Deco Blueprint', icon: '📐', desc: 'Building plans from the 1920s' },
    'radio-parts': { name: 'Radio Parts', icon: '📻', desc: 'Components for early communication' },
    'encryption-code': { name: 'Encryption Code', icon: '🔐', desc: 'Secret wartime cipher' },
    'moon-rock': { name: 'Moon Rock', icon: '🌑', desc: 'Sample from Apollo mission' },
    'transistor': { name: 'Transistor', icon: '⚡', desc: 'Revolutionary electronic component' },
    'floppy-disk': { name: 'Floppy Disk', icon: '💾', desc: 'Data storage from the 80s' },
    'microchip': { name: 'Microchip', icon: '🔲', desc: 'Integrated circuit processor' },
    'cd-rom': { name: 'CD-ROM', icon: '💿', desc: 'Optical disc technology' },
    'modem': { name: 'Modem', icon: '📡', desc: 'Device for internet connection' }
  };

  const levels = {
    1: {
      title: 'The First Paradox',
      objective: 'Help the scientist in 1960s by finding a transistor from 1980s',
      solution: ['Pick up transistor in 1980s', 'Give it to scientist in 1960s']
    },
    2: {
      title: 'Communication Chain',
      objective: 'Fix the computer in 1980s using parts from 1940s',
      solution: ['Get radio parts in 1940s', 'Use them to fix computer in 1980s']
    },
    3: {
      title: 'Digital Evolution',
      objective: 'Enable internet in 1990s by ensuring tech development in earlier eras',
      solution: ['Complete all events in 1960s, 1980s, then 1990s']
    }
  };

  useEffect(() => {
    const state = gameState[currentEra];
    if (!state.visited) {
      setGameState(prev => ({
        ...prev,
        [currentEra]: { ...prev[currentEra], visited: true }
      }));
    }
  }, [currentEra, gameState]);

  const travelToEra = (era) => {
    if (era === currentEra) return;
    
    setShowMessage(`Traveling to ${eras[era].name}...`);
    setTimeout(() => {
      setCurrentEra(era);
      setShowMessage('');
    }, 500);
  };

  const pickUpItem = (item) => {
    if (inventory.includes(item)) {
      setShowMessage('You already have this item!');
      return;
    }

    if (gameState[currentEra].itemsTaken.includes(item)) {
      setShowMessage('This item is no longer here.');
      return;
    }

    setInventory(prev => [...prev, item]);
    setGameState(prev => ({
      ...prev,
      [currentEra]: {
        ...prev[currentEra],
        itemsTaken: [...prev[currentEra].itemsTaken, item]
      }
    }));
    setShowMessage(`Picked up ${itemDescriptions[item].name}!`);
    setTimeout(() => setShowMessage(''), 2000);
  };

  const useItem = (item, event) => {
    if (!inventory.includes(item)) {
      setShowMessage('You need the right item for this!');
      setTimeout(() => setShowMessage(''), 2000);
      return;
    }

    // Level 1: Transistor for scientist
    if (currentLevel === 1 && item === 'transistor' && event === 'help-scientist' && currentEra === '1960s') {
      completeEvent(event);
      setInventory(prev => prev.filter(i => i !== item));
      setShowMessage('✓ You helped the scientist! The transistor advanced technology!');
      setTimelineIntegrity(prev => Math.min(100, prev + 20));
      setTimeout(() => {
        setCurrentLevel(2);
        setShowMessage('Level 2 Unlocked: Communication Chain');
        setTimeout(() => setShowMessage(''), 3000);
      }, 2000);
      return;
    }

    // Level 2: Radio parts for computer
    if (currentLevel === 2 && item === 'radio-parts' && event === 'fix-computer' && currentEra === '1980s') {
      completeEvent(event);
      setInventory(prev => prev.filter(i => i !== item));
      setShowMessage('✓ Computer repaired! Technology is advancing properly!');
      setTimelineIntegrity(prev => Math.min(100, prev + 20));
      setTimeout(() => {
        setCurrentLevel(3);
        setShowMessage('Level 3 Unlocked: Digital Evolution');
        setTimeout(() => setShowMessage(''), 3000);
      }, 2000);
      return;
    }

    // Level 3: Multiple requirements
    if (currentLevel === 3) {
      if (currentEra === '1990s' && event === 'connect-internet') {
        const hasCompletedPrevious = 
          gameState['1960s'].eventsCompleted.includes('help-scientist') &&
          gameState['1980s'].eventsCompleted.includes('fix-computer');
        
        if (hasCompletedPrevious && (item === 'modem' || item === 'cd-rom')) {
          completeEvent(event);
          setInventory(prev => prev.filter(i => i !== item));
          setShowMessage('✓ Internet connected! Timeline restored!');
          setTimelineIntegrity(100);
          setTimeout(() => {
            setGameWon(true);
          }, 2000);
          return;
        } else {
          setShowMessage('Complete previous eras first!');
          setTimeout(() => setShowMessage(''), 2000);
          return;
        }
      }
    }

    setShowMessage('This item doesn\'t work here yet...');
    setTimeout(() => setShowMessage(''), 2000);
  };

  const completeEvent = (event) => {
    setGameState(prev => ({
      ...prev,
      [currentEra]: {
        ...prev[currentEra],
        eventsCompleted: [...prev[currentEra].eventsCompleted, event]
      }
    }));
  };

  const isEventCompleted = (event) => {
    return gameState[currentEra].eventsCompleted.includes(event);
  };

  const resetGame = () => {
    setCurrentEra('1960s');
    setInventory([]);
    setGameState({
      '1920s': { visited: false, itemsTaken: [], eventsCompleted: [] },
      '1940s': { visited: false, itemsTaken: [], eventsCompleted: [] },
      '1960s': { visited: true, itemsTaken: [], eventsCompleted: [] },
      '1980s': { visited: false, itemsTaken: [], eventsCompleted: [] },
      '1990s': { visited: false, itemsTaken: [], eventsCompleted: [] }
    });
    setParadoxMeter(0);
    setCurrentLevel(1);
    setShowMessage('');
    setGameWon(false);
    setTimelineIntegrity(100);
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Timeline Restored!</h1>
          <p className="text-xl text-gray-600 mb-8">
            You successfully navigated the paradoxes of the 20th century and restored the timeline!
          </p>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-8">
            <p className="text-white text-2xl font-bold">Timeline Integrity: 100%</p>
            <p className="text-white text-lg mt-2">All 3 Levels Complete</p>
          </div>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-400" />
                My Time Machine
              </h1>
              <p className="text-purple-300 mt-1">Time Paradox Puzzle - 20th Century</p>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{currentLevel}/3</div>
                <div className="text-xs text-gray-400">Level</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{timelineIntegrity}%</div>
                <div className="text-xs text-gray-400">Timeline</div>
              </div>
              
              <button
                onClick={resetGame}
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition"
                title="Reset Game"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Objective */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur rounded-xl p-4 border border-purple-500/50">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Current Mission: {levels[currentLevel].title}
          </h3>
          <p className="text-purple-200">{levels[currentLevel].objective}</p>
        </div>
      </div>

      {/* Message Display */}
      {showMessage && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-4 text-center animate-pulse">
            <p className="text-blue-200 font-semibold">{showMessage}</p>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Time Travel Navigation */}
        <div className="md:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Time Travel
            </h2>
            <div className="space-y-3">
              {Object.entries(eras).map(([era, data]) => (
                <button
                  key={era}
                  onClick={() => travelToEra(era)}
                  className={`w-full p-4 rounded-xl transition transform hover:scale-105 ${
                    currentEra === era
                      ? `bg-gradient-to-r ${data.color} text-white shadow-lg`
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold">{data.name}</div>
                  <div className="text-sm opacity-75">{era}</div>
                  {gameState[era].visited && (
                    <div className="text-xs mt-1 opacity-60">✓ Visited</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/30 mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Inventory ({inventory.length})
            </h2>
            <div className="space-y-2">
              {inventory.length === 0 ? (
                <p className="text-gray-400 text-sm">No items collected yet</p>
              ) : (
                inventory.map((item, idx) => (
                  <div key={idx} className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{itemDescriptions[item].icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{itemDescriptions[item].name}</div>
                        <div className="text-xs text-gray-400">{itemDescriptions[item].desc}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Current Era Display */}
        <div className="md:col-span-2">
          <div className={`bg-gradient-to-br ${eras[currentEra].color} rounded-2xl p-8 shadow-2xl min-h-[600px]`}>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
              <h2 className="text-3xl font-bold mb-2">{eras[currentEra].name}</h2>
              <p className="text-lg opacity-90">{eras[currentEra].description}</p>
              <p className="text-sm mt-2 opacity-75">Era: {currentEra}</p>
            </div>

            {/* Items to collect */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items Available
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {eras[currentEra].items.map((item, idx) => {
                  const taken = gameState[currentEra].itemsTaken.includes(item);
                  return (
                    <button
                      key={idx}
                      onClick={() => pickUpItem(item)}
                      disabled={taken}
                      className={`p-4 rounded-xl transition transform hover:scale-105 ${
                        taken
                          ? 'bg-gray-600/30 opacity-50 cursor-not-allowed'
                          : 'bg-white/20 hover:bg-white/30 backdrop-blur'
                      }`}
                    >
                      <div className="text-4xl mb-2">{itemDescriptions[item].icon}</div>
                      <div className="font-semibold">{itemDescriptions[item].name}</div>
                      {taken && <div className="text-xs mt-1">Collected</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Events/Puzzles */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Actions
              </h3>
              <div className="space-y-3">
                {eras[currentEra].events.map((event, idx) => {
                  const completed = isEventCompleted(event);
                  const eventNames = {
                    'help-musician': 'Help the Jazz Musician',
                    'find-blueprint': 'Study Art Deco Plans',
                    'repair-radio': 'Repair the Radio',
                    'decode-message': 'Decode Secret Message',
                    'help-scientist': 'Help the Scientist (needs Transistor)',
                    'find-transistor': 'Find Electronic Components',
                    'fix-computer': 'Fix the Computer (needs Radio Parts)',
                    'program-software': 'Program New Software',
                    'connect-internet': 'Connect to Internet (needs Modem/CD)',
                    'upgrade-hardware': 'Upgrade Hardware'
                  };

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl ${
                        completed
                          ? 'bg-green-500/30 border-2 border-green-400'
                          : 'bg-white/10 backdrop-blur border-2 border-white/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{eventNames[event]}</div>
                          {completed && <div className="text-sm text-green-200">✓ Completed</div>}
                        </div>
                        {!completed && inventory.length > 0 && (
                          <div className="flex gap-2">
                            {inventory.map((item, i) => (
                              <button
                                key={i}
                                onClick={() => useItem(item, event)}
                                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm transition"
                                title={`Use ${itemDescriptions[item].name}`}
                              >
                                {itemDescriptions[item].icon}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
