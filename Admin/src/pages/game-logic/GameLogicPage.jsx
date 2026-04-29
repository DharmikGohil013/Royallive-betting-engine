import React, { useState, useMemo, useCallback } from 'react';
import { Search, Plus, Settings, Play, Edit2, Eye, EyeOff, Download, RotateCcw } from 'lucide-react';

// Mock Game Data
const MOCK_GAMES = [
  {
    id: 1,
    name: 'Teen Patti',
    type: 'Card',
    status: 'active',
    icon: '🂡',
    rtp: 96.5,
    minBet: 10,
    maxBet: 10000,
    activePlayers: 245,
    totalBetsToday: 450000,
    winRate: 48.5,
    featured: true,
    isMaintenance: false,
    roundDuration: 120,
    maxConcurrentPlayers: 500,
    commission: 5,
    autoResult: true,
    visibility: true,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Traditional Indian card game',
    changes: [
      { date: '2026-04-28 14:30', admin: 'Admin User', change: 'RTP updated to 96.5%' },
      { date: '2026-04-27 10:15', admin: 'Admin User', change: 'Max bet increased to 10000' },
    ]
  },
  {
    id: 2,
    name: 'Andar Bahar',
    type: 'Card',
    status: 'active',
    icon: '🎰',
    rtp: 95.2,
    minBet: 5,
    maxBet: 5000,
    activePlayers: 189,
    totalBetsToday: 325000,
    winRate: 50.2,
    featured: false,
    isMaintenance: false,
    roundDuration: 60,
    maxConcurrentPlayers: 300,
    commission: 5,
    autoResult: true,
    visibility: true,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Classic card prediction game',
    changes: []
  },
  {
    id: 3,
    name: 'Dragon Tiger',
    type: 'Card',
    status: 'active',
    icon: '🐉',
    rtp: 97.1,
    minBet: 20,
    maxBet: 15000,
    activePlayers: 312,
    totalBetsToday: 625000,
    winRate: 49.8,
    featured: true,
    isMaintenance: false,
    roundDuration: 45,
    maxConcurrentPlayers: 600,
    commission: 4,
    autoResult: true,
    visibility: true,
    userTiers: ['Gold', 'VIP'],
    description: 'High-stakes card prediction',
    changes: []
  },
  {
    id: 4,
    name: 'Roulette',
    type: 'Table',
    status: 'active',
    icon: '🎡',
    rtp: 97.3,
    minBet: 50,
    maxBet: 50000,
    activePlayers: 423,
    totalBetsToday: 1250000,
    winRate: 47.2,
    featured: true,
    isMaintenance: false,
    roundDuration: 90,
    maxConcurrentPlayers: 1000,
    commission: 3,
    autoResult: true,
    visibility: true,
    userTiers: ['VIP'],
    description: 'Premium roulette game',
    changes: []
  },
  {
    id: 5,
    name: 'Color Prediction',
    type: 'Color',
    status: 'active',
    icon: '🌈',
    rtp: 94.5,
    minBet: 1,
    maxBet: 1000,
    activePlayers: 567,
    totalBetsToday: 890000,
    winRate: 51.5,
    featured: false,
    isMaintenance: false,
    roundDuration: 30,
    maxConcurrentPlayers: 2000,
    commission: 6,
    autoResult: true,
    visibility: true,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Predict the next color',
    changes: []
  },
  {
    id: 6,
    name: 'Aviator',
    type: 'Crash',
    status: 'active',
    icon: '✈️',
    rtp: 96.8,
    minBet: 10,
    maxBet: 10000,
    activePlayers: 678,
    totalBetsToday: 1500000,
    winRate: 46.3,
    featured: true,
    isMaintenance: false,
    roundDuration: 60,
    maxConcurrentPlayers: 3000,
    commission: 5,
    autoResult: true,
    visibility: true,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Crash game with multipliers',
    changes: []
  },
  {
    id: 7,
    name: 'Dice Roll',
    type: 'Dice',
    status: 'maintenance',
    icon: '🎲',
    rtp: 95.9,
    minBet: 5,
    maxBet: 5000,
    activePlayers: 0,
    totalBetsToday: 0,
    winRate: 0,
    featured: false,
    isMaintenance: true,
    roundDuration: 45,
    maxConcurrentPlayers: 500,
    commission: 5,
    autoResult: true,
    visibility: false,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Classic dice rolling game',
    changes: []
  },
  {
    id: 8,
    name: 'Lucky Spin',
    type: 'Slot',
    status: 'inactive',
    icon: '🎪',
    rtp: 93.2,
    minBet: 1,
    maxBet: 500,
    activePlayers: 12,
    totalBetsToday: 45000,
    winRate: 52.1,
    featured: false,
    isMaintenance: false,
    roundDuration: 20,
    maxConcurrentPlayers: 1000,
    commission: 7,
    autoResult: true,
    visibility: true,
    userTiers: ['Silver', 'Gold', 'VIP'],
    description: 'Lucky slot machine game',
    changes: []
  }
];

const GAME_TYPES = ['Card', 'Table', 'Color', 'Crash', 'Dice', 'Slot'];
const STATUSES = ['active', 'inactive', 'maintenance'];
const USER_TIERS = ['Silver', 'Gold', 'VIP'];

export default function GameLogicPage() {
  const [games, setGames] = useState(MOCK_GAMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Modal states
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Form states
  const [newGame, setNewGame] = useState({
    name: '',
    type: 'Card',
    rtp: 95,
    minBet: 10,
    maxBet: 5000,
    roundDuration: 60,
    autoResult: true
  });

  const [editFormData, setEditFormData] = useState(null);
  const [settingsFormData, setSettingsFormData] = useState(null);

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    let result = games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || game.type === filterType;
      const matchesStatus = !filterStatus || game.status === filterStatus;
      const matchesFeatured = !filterFeatured || game.featured;
      return matchesSearch && matchesType && matchesStatus && matchesFeatured;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'players':
          return b.activePlayers - a.activePlayers;
        case 'bets':
          return b.totalBetsToday - a.totalBetsToday;
        case 'winRate':
          return b.winRate - a.winRate;
        default:
          return 0;
      }
    });

    return result;
  }, [games, searchTerm, filterType, filterStatus, filterFeatured, sortBy]);

  // Stats
  const stats = useMemo(() => ({
    totalGames: games.length,
    activeGames: games.filter(g => g.status === 'active').length,
    maintenanceGames: games.filter(g => g.isMaintenance).length,
    totalBetsToday: games.reduce((sum, g) => sum + g.totalBetsToday, 0),
    highestPlayedGame: games.reduce((max, g) => g.activePlayers > (max?.activePlayers || 0) ? g : max, null)
  }), [games]);

  // Handlers
  const handleAddGame = useCallback(() => {
    const addedGame = {
      id: Math.max(...games.map(g => g.id)) + 1,
      ...newGame,
      status: 'active',
      icon: '🎮',
      activePlayers: 0,
      totalBetsToday: 0,
      winRate: 0,
      featured: false,
      isMaintenance: false,
      maxConcurrentPlayers: 1000,
      commission: 5,
      visibility: true,
      userTiers: ['Silver', 'Gold', 'VIP'],
      description: '',
      changes: []
    };
    setGames([...games, addedGame]);
    setNewGame({ name: '', type: 'Card', rtp: 95, minBet: 10, maxBet: 5000, roundDuration: 60, autoResult: true });
    setShowAddGameModal(false);
  }, [games, newGame]);

  const handleEditGame = useCallback(() => {
    setGames(games.map(g => g.id === editFormData.id ? editFormData : g));
    setShowEditGameModal(false);
    setEditFormData(null);
    setSelectedGame(null);
  }, [games, editFormData]);

  const handleSaveSettings = useCallback(() => {
    setGames(games.map(g => g.id === settingsFormData.id ? settingsFormData : g));
    setShowSettingsDrawer(false);
    setSettingsFormData(null);
  }, [games, settingsFormData]);

  const handleToggleGameStatus = useCallback((gameId, newStatus) => {
    setGames(games.map(g => 
      g.id === gameId ? { ...g, status: newStatus } : g
    ));
  }, [games]);

  const handleBulkActivate = useCallback(() => {
    setGames(games.map(g => ({ ...g, status: 'active' })));
  }, [games]);

  const handleBulkDeactivate = useCallback(() => {
    setGames(games.map(g => ({ ...g, status: 'inactive' })));
  }, [games]);

  const handleExportConfig = useCallback(() => {
    const configData = games.map(({ id, name, type, rtp, minBet, maxBet, roundDuration, autoResult, commission }) => ({
      id, name, type, rtp, minBet, maxBet, roundDuration, autoResult, commission
    }));
    const dataStr = JSON.stringify(configData, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', 'game-config.json');
    element.click();
  }, [games]);

  const openEditGameModal = (game) => {
    setSelectedGame(game);
    setEditFormData(game);
    setShowEditGameModal(true);
  };

  const openSettingsDrawer = (game) => {
    setSelectedGame(game);
    setSettingsFormData(game);
    setShowSettingsDrawer(true);
  };

  const openPreviewMode = (game) => {
    setSelectedGame(game);
    setShowPreviewMode(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Game Logic Management</h1>
          <p className="text-slate-400">Control, configure, and manage all games on the platform</p>
        </div>

        {/* Global Controls Bar */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            >
              <option value="">All Types</option>
              {GAME_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            >
              <option value="">All Status</option>
              {STATUSES.map(status => (
                <option key={status} value={status} className="capitalize">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            >
              <option value="name">Sort: Name</option>
              <option value="players">Sort: Players</option>
              <option value="bets">Sort: Bets</option>
              <option value="winRate">Sort: Win Rate</option>
            </select>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-white text-sm">Featured Only</span>
              </label>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleBulkActivate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition"
              >
                Activate All
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition border border-slate-600"
              >
                Deactivate All
              </button>
              <button
                onClick={handleExportConfig}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => setShowAddGameModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg text-sm transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add Game
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-slate-400 text-sm mb-1">Total Games</p>
            <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-slate-400 text-sm mb-1">Active Games</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.activeGames}</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-slate-400 text-sm mb-1">In Maintenance</p>
            <p className="text-3xl font-bold text-red-400">{stats.maintenanceGames}</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-slate-400 text-sm mb-1">Bets Today</p>
            <p className="text-3xl font-bold text-amber-400">₹{(stats.totalBetsToday / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-slate-400 text-sm mb-1">Top Game</p>
            <p className="text-xl font-bold text-white truncate">{stats.highestPlayedGame?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 group"
            >
              {/* Game Header */}
              <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-b border-slate-700">
                <div className="text-6xl opacity-70 group-hover:opacity-100 transition">{game.icon}</div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    game.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    game.status === 'maintenance' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {game.status === 'maintenance' ? 'Maintenance' : game.status.toUpperCase()}
                  </span>
                  {game.featured && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">⭐ Featured</span>}
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{game.type} • RTP {game.rtp}%</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                  <div className="bg-slate-700 rounded p-2">
                    <p className="text-slate-400">Players</p>
                    <p className="text-white font-semibold">{game.activePlayers}</p>
                  </div>
                  <div className="bg-slate-700 rounded p-2">
                    <p className="text-slate-400">Bets</p>
                    <p className="text-amber-400 font-semibold">₹{(game.totalBetsToday / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-slate-700 rounded p-2">
                    <p className="text-slate-400">Win %</p>
                    <p className="text-white font-semibold">{game.winRate}%</p>
                  </div>
                </div>

                {/* Bet Limits */}
                <p className="text-xs text-slate-400 mb-4">Bet: ₹{game.minBet} - ₹{game.maxBet}</p>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => openEditGameModal(game)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg text-xs font-semibold transition border border-purple-500/20 hover:border-purple-500/50"
                  >
                    <Edit2 size={14} />
                    Edit Logic
                  </button>
                  <button
                    onClick={() => openPreviewMode(game)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg text-xs font-semibold transition border border-emerald-500/20 hover:border-emerald-500/50"
                  >
                    <Play size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => openSettingsDrawer(game)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold transition border border-slate-600 hover:border-slate-500"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No games found matching your filters</p>
          </div>
        )}
      </div>

      {/* ===== MODALS & DRAWERS ===== */}

      {/* Add Game Modal */}
      {showAddGameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Game</h2>
              <button
                onClick={() => setShowAddGameModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Game Name</label>
                <input
                  type="text"
                  value={newGame.name}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                  placeholder="e.g., Poker Premium"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Game Type</label>
                <select
                  value={newGame.type}
                  onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                >
                  {GAME_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Min Bet</label>
                  <input
                    type="number"
                    value={newGame.minBet}
                    onChange={(e) => setNewGame({ ...newGame, minBet: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Max Bet</label>
                  <input
                    type="number"
                    value={newGame.maxBet}
                    onChange={(e) => setNewGame({ ...newGame, maxBet: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">RTP %</label>
                <input
                  type="number"
                  min="85"
                  max="99"
                  value={newGame.rtp}
                  onChange={(e) => setNewGame({ ...newGame, rtp: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Round Duration (seconds)</label>
                <input
                  type="number"
                  value={newGame.roundDuration}
                  onChange={(e) => setNewGame({ ...newGame, roundDuration: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newGame.autoResult}
                  onChange={(e) => setNewGame({ ...newGame, autoResult: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-white text-sm">Enable auto result generation</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowAddGameModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGame}
                  disabled={!newGame.name}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-semibold rounded-lg transition"
                >
                  Create Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Game Logic Modal */}
      {showEditGameModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Game Logic: {editFormData.name}</h2>
              <button
                onClick={() => {
                  setShowEditGameModal(false);
                  setEditFormData(null);
                }}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Game Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Type</label>
                    <select
                      value={editFormData.type}
                      onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    >
                      {GAME_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-white mb-2">Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    placeholder="Game description..."
                  />
                </div>
              </div>

              {/* Bet Rules */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded"></span>
                  Bet Rules
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Min Bet</label>
                    <input
                      type="number"
                      value={editFormData.minBet}
                      onChange={(e) => setEditFormData({ ...editFormData, minBet: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Max Bet</label>
                    <input
                      type="number"
                      value={editFormData.maxBet}
                      onChange={(e) => setEditFormData({ ...editFormData, maxBet: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Max Payout Multiplier</label>
                    <input
                      type="number"
                      value={editFormData.maxPayoutMultiplier || 100}
                      onChange={(e) => setEditFormData({ ...editFormData, maxPayoutMultiplier: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Odds & RTP */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded"></span>
                  Odds & RTP
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">RTP % ({editFormData.rtp}%)</label>
                    <input
                      type="range"
                      min="85"
                      max="99"
                      value={editFormData.rtp}
                      onChange={(e) => setEditFormData({ ...editFormData, rtp: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">House Edge: {(100 - editFormData.rtp).toFixed(2)}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Commission %</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={editFormData.commission || 5}
                      onChange={(e) => setEditFormData({ ...editFormData, commission: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Game Settings */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded"></span>
                  Game Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Round Duration (seconds)</label>
                    <input
                      type="number"
                      value={editFormData.roundDuration}
                      onChange={(e) => setEditFormData({ ...editFormData, roundDuration: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Max Concurrent Players</label>
                    <input
                      type="number"
                      value={editFormData.maxConcurrentPlayers}
                      onChange={(e) => setEditFormData({ ...editFormData, maxConcurrentPlayers: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={editFormData.autoResult}
                    onChange={(e) => setEditFormData({ ...editFormData, autoResult: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-white text-sm">Auto-generate results</span>
                </label>
              </div>

              {/* Win Conditions */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded"></span>
                  Win Conditions (JSON)
                </h3>
                <textarea
                  defaultValue={JSON.stringify({ rules: 'Define win logic here' }, null, 2)}
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="Win logic in JSON format..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowEditGameModal(false);
                    setEditFormData(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setEditFormData(null);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={handleEditGame}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {showSettingsDrawer && settingsFormData && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-slate-800 rounded-l-xl border-l border-slate-700 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Settings: {settingsFormData.name}</h2>
              <button
                onClick={() => {
                  setShowSettingsDrawer(false);
                  setSettingsFormData(null);
                }}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Visibility Settings */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsFormData.visibility}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, visibility: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-white text-sm">Visible to Players</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsFormData.featured}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-white text-sm">Featured on Homepage</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsFormData.isMaintenance}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, isMaintenance: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-white text-sm">Maintenance Mode</span>
                  </label>
                </div>
              </div>

              {/* User Tiers */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Allowed User Tiers</h3>
                <div className="space-y-2">
                  {USER_TIERS.map(tier => (
                    <label key={tier} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.userTiers?.includes(tier) || false}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(settingsFormData.userTiers || []), tier]
                            : (settingsFormData.userTiers || []).filter(t => t !== tier);
                          setSettingsFormData({ ...settingsFormData, userTiers: updated });
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-white text-sm">{tier}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Game Status */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Game Status</h3>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => setSettingsFormData({ ...settingsFormData, status })}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        settingsFormData.status === status
                          ? status === 'active' ? 'bg-emerald-600 text-white' :
                            status === 'maintenance' ? 'bg-red-600 text-white' :
                            'bg-slate-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tags */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Category Tags</h3>
                <input
                  type="text"
                  value={settingsFormData.categoryTags || ''}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, categoryTags: e.target.value })}
                  placeholder="e.g., Premium, Beginner-Friendly, Live"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-sm"
                />
              </div>

              {/* Cooldown */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Cooldown Settings</h3>
                <label className="block text-sm font-semibold text-white mb-2">Cooldown Between Rounds (seconds)</label>
                <input
                  type="number"
                  value={settingsFormData.cooldown || 5}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, cooldown: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              {/* Audit Log */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Recent Changes</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(settingsFormData.changes || []).slice(0, 5).map((change, idx) => (
                    <div key={idx} className="text-xs bg-slate-700 rounded p-2">
                      <p className="text-slate-300">{change.date}</p>
                      <p className="text-slate-400">{change.admin}</p>
                      <p className="text-amber-300 mt-1">{change.change}</p>
                    </div>
                  ))}
                  {(!settingsFormData.changes || settingsFormData.changes.length === 0) && (
                    <p className="text-slate-400 text-xs">No recent changes</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowSettingsDrawer(false);
                    setSettingsFormData(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-semibold transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {showPreviewMode && selectedGame && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-red-100 mb-1">⚠️ ADMIN PREVIEW MODE — Not Real Money</p>
                <h2 className="text-xl font-bold text-white">Preview: {selectedGame.name}</h2>
              </div>
              <button
                onClick={() => {
                  setShowPreviewMode(false);
                  setSelectedGame(null);
                }}
                className="text-white hover:text-red-100 transition text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Game Preview Header */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-8 text-center mb-6 border border-slate-600">
                <div className="text-8xl mb-4">{selectedGame.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedGame.name}</h3>
                <p className="text-slate-300 mb-4">{selectedGame.description}</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="bg-slate-600/50 px-4 py-2 rounded">
                    <p className="text-slate-300 text-xs">Game Type</p>
                    <p className="text-white font-bold">{selectedGame.type}</p>
                  </div>
                  <div className="bg-slate-600/50 px-4 py-2 rounded">
                    <p className="text-slate-300 text-xs">RTP</p>
                    <p className="text-amber-300 font-bold">{selectedGame.rtp}%</p>
                  </div>
                  <div className="bg-slate-600/50 px-4 py-2 rounded">
                    <p className="text-slate-300 text-xs">Bet Range</p>
                    <p className="text-white font-bold">₹{selectedGame.minBet} - ₹{selectedGame.maxBet}</p>
                  </div>
                </div>
              </div>

              {/* Bet Simulator */}
              <div className="bg-slate-700 rounded-lg p-4 mb-6 border border-slate-600">
                <h4 className="text-white font-bold mb-4">🎮 Bet Simulator</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Test Bet Amount</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        defaultValue="100"
                        className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                      <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                        Place Bet
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Round History */}
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h4 className="text-white font-bold mb-4">📊 Recent Results</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {[
                    { round: 1234, result: 'WIN', multiplier: 2.5, timestamp: '14:32' },
                    { round: 1233, result: 'LOSS', multiplier: 0, timestamp: '14:31' },
                    { round: 1232, result: 'WIN', multiplier: 1.8, timestamp: '14:30' }
                  ].map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-600/50 p-2 rounded">
                      <span className="text-slate-300">Round #{entry.round}</span>
                      <span className={entry.result === 'WIN' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {entry.result} {entry.multiplier > 0 ? `×${entry.multiplier}` : ''}
                      </span>
                      <span className="text-slate-400">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowPreviewMode(false);
                    setSelectedGame(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Exit Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}