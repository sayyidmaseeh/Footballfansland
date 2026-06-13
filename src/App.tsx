import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  MessageSquare, 
  Camera, 
  MapPin, 
  Search, 
  Flame, 
  Check, 
  Copy,
  X, 
  Info, 
  Lock,
  Coins, 
  CreditCard,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Share2,
  Clock,
  Paintbrush,
  Receipt,
  Navigation,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Map,
  Gamepad2,
  User,
  LogIn,
  LogOut,
  Wallet,
  Shield,
  Trash2,
  Ban,
  Plus,
  History,
  Mail,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { TileData, TeamChoice, TeamStyle, ChatMessage, UserReferralData } from './types';
import CharacterAnimationLoop from './components/CharacterAnimationLoop';
import {
  dbFetchUsers,
  dbUpsertUser,
  dbFetchTiles,
  dbSaveTile,
  dbReleaseTile,
  dbFetchBlockedEmails,
  dbSetUserBanned,
  dbDeleteUser,
  isSupabaseConfigured,
  dbAddActivityLog,
  dbFetchActivityLogs,
  dbSignUp,
  dbSignIn,
  dbSignOut,
  dbUploadImage,
  getRegisteredMissingTables,
  getRegisteredMissingBuckets,
  resetMissingTableCache,
  dbVerifySchemasOnBoot
} from './lib/supabase';

// Supported countries with high-contrast theme variations
const TEAM_STYLES: Record<string, TeamStyle> = {
  'Canada': {
    name: 'Canada',
    color: '#ef4444',
    secondaryColor: '#ffffff',
    accentColor: '#b91c1c',
    textColor: 'text-red-400',
    flagEmoji: '🇨🇦'
  },
  'Mexico': {
    name: 'Mexico',
    color: '#15803d',
    secondaryColor: '#dc2626',
    accentColor: '#166534',
    textColor: 'text-green-500',
    flagEmoji: '🇲🇽'
  },
  'United States': {
    name: 'United States',
    color: '#1d4ed8',
    secondaryColor: '#ef4444',
    accentColor: '#1e40af',
    textColor: 'text-blue-500',
    flagEmoji: '🇺🇸'
  },
  'Australia': {
    name: 'Australia',
    color: '#fbbf24',
    secondaryColor: '#047857',
    accentColor: '#d97706',
    textColor: 'text-amber-350',
    flagEmoji: '🇦🇺'
  },
  'Iraq': {
    name: 'Iraq',
    color: '#22c55e',
    secondaryColor: '#ffffff',
    accentColor: '#15803d',
    textColor: 'text-green-400',
    flagEmoji: '🇮🇶'
  },
  'Iran': {
    name: 'Iran',
    color: '#22c55e',
    secondaryColor: '#ef4444',
    accentColor: '#15803d',
    textColor: 'text-emerald-400',
    flagEmoji: '🇮🇷'
  },
  'Japan': {
    name: 'Japan',
    color: '#f43f5e',
    secondaryColor: '#ffffff',
    accentColor: '#be123c',
    textColor: 'text-rose-450',
    flagEmoji: '🇯🇵'
  },
  'Jordan': {
    name: 'Jordan',
    color: '#16a34a',
    secondaryColor: '#dc2626',
    accentColor: '#15803d',
    textColor: 'text-green-400',
    flagEmoji: '🇯🇴'
  },
  'South Korea': {
    name: 'South Korea',
    color: '#3b82f6',
    secondaryColor: '#ef4444',
    accentColor: '#1d4ed8',
    textColor: 'text-blue-400',
    flagEmoji: '🇰🇷'
  },
  'Qatar': {
    name: 'Qatar',
    color: '#881337',
    secondaryColor: '#ffffff',
    accentColor: '#4c0519',
    textColor: 'text-rose-500',
    flagEmoji: '🇶🇦'
  },
  'Saudi Arabia': {
    name: 'Saudi Arabia',
    color: '#15803d',
    secondaryColor: '#ffffff',
    accentColor: '#166534',
    textColor: 'text-green-400',
    flagEmoji: '🇸🇦'
  },
  'Uzbekistan': {
    name: 'Uzbekistan',
    color: '#06b6d4',
    secondaryColor: '#22c55e',
    accentColor: '#0891b2',
    textColor: 'text-cyan-400',
    flagEmoji: '🇺🇿'
  },
  'Algeria': {
    name: 'Algeria',
    color: '#16a34a',
    secondaryColor: '#dc2626',
    accentColor: '#15803d',
    textColor: 'text-emerald-500',
    flagEmoji: '🇩🇿'
  },
  'Cabo Verde': {
    name: 'Cabo Verde',
    color: '#1e3a8a',
    secondaryColor: '#facc15',
    accentColor: '#1e40af',
    textColor: 'text-blue-400',
    flagEmoji: '🇨🇻'
  },
  'DR Congo': {
    name: 'DR Congo',
    color: '#06b6d4',
    secondaryColor: '#facc15',
    accentColor: '#0891b2',
    textColor: 'text-cyan-400',
    flagEmoji: '🇨🇩'
  },
  "Côte d'Ivoire": {
    name: "Côte d'Ivoire",
    color: '#f97316',
    secondaryColor: '#22c55e',
    accentColor: '#ea580c',
    textColor: 'text-orange-400',
    flagEmoji: "🇨🇮"
  },
  'Egypt': {
    name: 'Egypt',
    color: '#b45309',
    secondaryColor: '#000000',
    accentColor: '#78350f',
    textColor: 'text-amber-600',
    flagEmoji: '🇪🇬'
  },
  'Ghana': {
    name: 'Ghana',
    color: '#eab308',
    secondaryColor: '#22c55e',
    accentColor: '#ca8a04',
    textColor: 'text-amber-400',
    flagEmoji: '🇬🇭'
  },
  'Morocco': {
    name: 'Morocco',
    color: '#c2410c',
    secondaryColor: '#15803d',
    accentColor: '#9a3412',
    textColor: 'text-orange-400',
    flagEmoji: '🇲🇦'
  },
  'Senegal': {
    name: 'Senegal',
    color: '#eab308',
    secondaryColor: '#16a34a',
    accentColor: '#d97706',
    textColor: 'text-yellow-500',
    flagEmoji: '🇸🇳'
  },
  'South Africa': {
    name: 'South Africa',
    color: '#22c55e',
    secondaryColor: '#f97316',
    accentColor: '#15803d',
    textColor: 'text-emerald-400',
    flagEmoji: '🇿🇦'
  },
  'Tunisia': {
    name: 'Tunisia',
    color: '#e11d48',
    secondaryColor: '#ffffff',
    accentColor: '#9f1239',
    textColor: 'text-rose-500',
    flagEmoji: '🇹🇳'
  },
  'Curaçao': {
    name: 'Curaçao',
    color: '#1d4ed8',
    secondaryColor: '#eab308',
    accentColor: '#1e40af',
    textColor: 'text-blue-500',
    flagEmoji: '🇨🇼'
  },
  'Haiti': {
    name: 'Haiti',
    color: '#3b82f6',
    secondaryColor: '#ef4444',
    accentColor: '#2563eb',
    textColor: 'text-blue-400',
    flagEmoji: '🇭🇹'
  },
  'Panama': {
    name: 'Panama',
    color: '#3b82f6',
    secondaryColor: '#ef4444',
    accentColor: '#1d4ed8',
    textColor: 'text-blue-500',
    flagEmoji: '🇵🇦'
  },
  'Argentina': {
    name: 'Argentina',
    color: '#38bdf8',
    secondaryColor: '#f1f5f9',
    accentColor: '#0ea5e9',
    textColor: 'text-sky-400',
    flagEmoji: '🇦🇷'
  },
  'Brazil': {
    name: 'Brazil',
    color: '#eab308',
    secondaryColor: '#10b981',
    accentColor: '#ca8a04',
    textColor: 'text-amber-400',
    flagEmoji: '🇧🇷'
  },
  'Colombia': {
    name: 'Colombia',
    color: '#eab308',
    secondaryColor: '#3b82f6',
    accentColor: '#ca8a04',
    textColor: 'text-yellow-500',
    flagEmoji: '🇨🇴'
  },
  'Ecuador': {
    name: 'Ecuador',
    color: '#eab308',
    secondaryColor: '#3b82f6',
    accentColor: '#ca8a04',
    textColor: 'text-yellow-500',
    flagEmoji: '🇪🇨'
  },
  'Paraguay': {
    name: 'Paraguay',
    color: '#ef4444',
    secondaryColor: '#3b82f6',
    accentColor: '#b91c1c',
    textColor: 'text-red-450',
    flagEmoji: '🇵🇾'
  },
  'Uruguay': {
    name: 'Uruguay',
    color: '#38bdf8',
    secondaryColor: '#ffffff',
    accentColor: '#0284c7',
    textColor: 'text-sky-400',
    flagEmoji: '🇺🇾'
  },
  'New Zealand': {
    name: 'New Zealand',
    color: '#1e293b',
    secondaryColor: '#ffffff',
    accentColor: '#0f172a',
    textColor: 'text-slate-200',
    flagEmoji: '🇳🇿'
  },
  'Austria': {
    name: 'Austria',
    color: '#ef4444',
    secondaryColor: '#ffffff',
    accentColor: '#b91c1c',
    textColor: 'text-red-450',
    flagEmoji: '🇦🇹'
  },
  'Belgium': {
    name: 'Belgium',
    color: '#eab308',
    secondaryColor: '#ef4444',
    accentColor: '#ca8a04',
    textColor: 'text-yellow-500',
    flagEmoji: '🇧🇪'
  },
  'Bosnia and Herzegovina': {
    name: 'Bosnia and Herzegovina',
    color: '#1d4ed8',
    secondaryColor: '#facc15',
    accentColor: '#1e40af',
    textColor: 'text-blue-500',
    flagEmoji: '🇧🇦'
  },
  'Croatia': {
    name: 'Croatia',
    color: '#ef4444',
    secondaryColor: '#3b82f6',
    accentColor: '#b91c1c',
    textColor: 'text-red-500',
    flagEmoji: '🇭🇷'
  },
  'Czechia': {
    name: 'Czechia',
    color: '#3b82f6',
    secondaryColor: '#ef4444',
    accentColor: '#2563eb',
    textColor: 'text-blue-500',
    flagEmoji: '🇨🇿'
  },
  'England': {
    name: 'England',
    color: '#ffffff',
    secondaryColor: '#ef4444',
    accentColor: '#e2e8f0',
    textColor: 'text-white',
    flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  'France': {
    name: 'France',
    color: '#3b82f6',
    secondaryColor: '#ef4444',
    accentColor: '#1d4ed8',
    textColor: 'text-blue-400',
    flagEmoji: '🇫🇷'
  },
  'Germany': {
    name: 'Germany',
    color: '#a8a29e',
    secondaryColor: '#ef4444',
    accentColor: '#1c1917',
    textColor: 'text-stone-300',
    flagEmoji: '🇩🇪'
  },
  'Netherlands': {
    name: 'Netherlands',
    color: '#f97316',
    secondaryColor: '#ffffff',
    accentColor: '#ea580c',
    textColor: 'text-orange-500',
    flagEmoji: '🇳🇱'
  },
  'Norway': {
    name: 'Norway',
    color: '#ef4444',
    secondaryColor: '#1d4ed8',
    accentColor: '#b91c1c',
    textColor: 'text-red-500',
    flagEmoji: '🇳🇴'
  },
  'Portugal': {
    name: 'Portugal',
    color: '#ef4444',
    secondaryColor: '#10b981',
    accentColor: '#b91c1c',
    textColor: 'text-red-400',
    flagEmoji: '🇵🇹'
  },
  'Scotland': {
    name: 'Scotland',
    color: '#0284c7',
    secondaryColor: '#ffffff',
    accentColor: '#0369a1',
    textColor: 'text-sky-400',
    flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
  },
  'Spain': {
    name: 'Spain',
    color: '#f97316',
    secondaryColor: '#10b981',
    accentColor: '#ea580c',
    textColor: 'text-orange-400',
    flagEmoji: '🇪🇸'
  },
  'Sweden': {
    name: 'Sweden',
    color: '#3b82f6',
    secondaryColor: '#eab308',
    accentColor: '#1d4ed8',
    textColor: 'text-blue-400',
    flagEmoji: '🇸🇪'
  },
  'Switzerland': {
    name: 'Switzerland',
    color: '#e11d48',
    secondaryColor: '#ffffff',
    accentColor: '#be123c',
    textColor: 'text-red-500',
    flagEmoji: '🇨🇭'
  },
  'Türkiye': {
    name: 'Türkiye',
    color: '#ef4444',
    secondaryColor: '#ffffff',
    accentColor: '#be123c',
    textColor: 'text-red-500',
    flagEmoji: '🇹🇷'
  },
  'None': {
    name: 'Claim Free',
    color: '#64748b', // slate-500
    secondaryColor: '#334155', // slate-700
    accentColor: '#475569', // slate-600
    textColor: 'text-slate-400',
    flagEmoji: '🏳️'
  }
};

const WORLD_CUP_TEAMS = [
  'Canada', 'Mexico', 'United States', 'Australia', 'Iraq', 'Iran', 'Japan',
  'Jordan', 'South Korea', 'Qatar', 'Saudi Arabia', 'Uzbekistan', 'Algeria',
  'Cabo Verde', 'DR Congo', "Côte d'Ivoire", 'Egypt', 'Ghana', 'Morocco',
  'Senegal', 'South Africa', 'Tunisia', 'Curaçao', 'Haiti', 'Panama',
  'Argentina', 'Brazil', 'Colombia', 'Ecuador', 'Paraguay', 'Uruguay',
  'New Zealand', 'Austria', 'Belgium', 'Bosnia and Herzegovina', 'Croatia',
  'Czechia', 'England', 'France', 'Germany', 'Netherlands', 'Norway',
  'Portugal', 'Scotland', 'Spain', 'Sweden', 'Switzerland', 'Türkiye'
];

const TRIVIA_QUESTIONS = [
  {
    question: "Which legendary Kerala forward is widely known as the 'Black Pearl of Indian Football'?",
    options: ["Sahal Abdul Samad", "VP Sathyan", "I.M. Vijayan", "Jo Paul Ancheri"],
    answerIndex: 2,
    explanation: "Correct! I.M. Vijayan, one of India's most talented players, is affectionately crowned the 'Black Pearl' and famously scored a goal in just 12 seconds."
  },
  {
    question: "Which northern district of Kerala is internationally famous as the epicenter of Sevens Football?",
    options: ["Ernakulam", "Malappuram", "Thiruvananthapuram", "Alappuzha"],
    answerIndex: 1,
    explanation: "Correct! Malappuram is revered as the hotbed of Sevens Football, where thousands of passionate ticket buyers cram into local temporary venues."
  },
  {
    question: "Which local club representing Kozhikode achieved historic back-to-back I-League championship victories?",
    options: ["Kerala Blasters FC", "FC Kochin", "Gokulam Kerala FC", "Viva Kerala FC"],
    answerIndex: 2,
    explanation: "Correct! Gokulam Kerala FC won consecutive I-League titles (2020-21 and 2021-22), establishing Kerala's professional supremacy."
  },
  {
    question: "In which year did Kerala famously conquer West Bengal at Malappuram Payyanad Stadium to lift their 7th Santosh Trophy?",
    options: ["2015", "2018", "2022", "2024"],
    answerIndex: 2,
    explanation: "Correct! In 2022, Kerala defeated West Bengal in a legendary penalty shootout before 25,000 screaming grassroots fans."
  },
  {
    question: "What is the iconic signature element deployed by rival fan groups (Brazil/Argentina) during World Cups on Kerala's riverbanks?",
    options: ["Massive floating boat rally floats", "Giant vertical player cutout boards", "Traditional temple chenda drum matches", "Elephant sand castles"],
    answerIndex: 1,
    explanation: "Correct! Giant, high-climbing visual board cutouts (some reaching over 100 feet tall) of Neymar, Messi, and Ronaldo are erected on rivers and lands."
  }
];

const saveClaimedTiles = (tilesData: Record<string, TileData>) => {
  const key = 'kerala_claimed_tiles';
  try {
    localStorage.setItem(key, JSON.stringify(tilesData));
    localStorage.removeItem('kerala_world_cup_tiles_v3');
  } catch (err: any) {
    if (err.name === 'QuotaExceededError' || err.code === 1014 || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.warn("Storage quota exceeded! Attempting to optimize data size...");
      try {
        localStorage.removeItem('kerala_world_cup_tiles_v3');
      } catch (e) {}

      const optimizedTiles = { ...tilesData };
      // Step A: Keep only 3 latest messages
      Object.keys(optimizedTiles).forEach(id => {
        const t = { ...optimizedTiles[id] };
        if (t.chats && t.chats.length > 3) {
          t.chats = t.chats.slice(-3);
          optimizedTiles[id] = t;
        }
      });
      
      try {
        localStorage.setItem(key, JSON.stringify(optimizedTiles));
        return;
      } catch (err2) {
        // Step B: Clear photos
        Object.keys(optimizedTiles).forEach(id => {
          const t = { ...optimizedTiles[id] };
          if (t.photo) {
            t.photo = '';
            optimizedTiles[id] = t;
          }
        });
        
        try {
          localStorage.setItem(key, JSON.stringify(optimizedTiles));
          return;
        } catch (err3) {
          // Step C: Clear all chats
          Object.keys(optimizedTiles).forEach(id => {
            const t = { ...optimizedTiles[id] };
            t.chats = [];
            optimizedTiles[id] = t;
          });
          try {
            localStorage.setItem(key, JSON.stringify(optimizedTiles));
          } catch (err4) {
            console.error("Critical storage quota error: Could not save even minimal metadata", err4);
          }
        }
      }
    } else {
      console.error("Local storage error:", err);
    }
  }
};

// Performance cache to prevent heavy grid calculations and GeoJSON requests on every mount
let cachedKeralaData: any = null;
let cachedRenderFeature: any = null;
let cachedAllCells: any[] | null = null;
let cachedDLat: number = 0;
let cachedDLng: number = 0;
let cachedSpatialGrid: any[][] | null = null;
let cachedGridBounds: any = null;

export default function App() {
  // Application State
  const [tiles, setTiles] = useState<Record<string, TileData>>({});
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState('');
  const [highlightTeam, setHighlightTeam] = useState<TeamChoice | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [tileCount, setTileCount] = useState(242827); // Fixed as 242,827 tiles
  const [tickerMessages, setTickerTickerMessages] = useState<{ id: string, tileId: string, text: string, team: string }[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [missingBuckets, setMissingBuckets] = useState<string[]>([]);
  const [showFixSql, setShowFixSql] = useState(false);

  useEffect(() => {
    setMissingTables(getRegisteredMissingTables());
    setMissingBuckets(getRegisteredMissingBuckets());
    const handleUpdate = () => {
      setMissingTables(getRegisteredMissingTables());
      setMissingBuckets(getRegisteredMissingBuckets());
    };
    window.addEventListener('supabase_tables_updated', handleUpdate);
    return () => {
      window.removeEventListener('supabase_tables_updated', handleUpdate);
    };
  }, []);

  const tourSteps = [
    {
      title: "Welcome to Kerala's Football Religion! ⚽",
      description: "In Kerala, soccer is more than a sport—it's an absolute religion! Deep Mind's Fan Club Grid divides the entire state into 242,827 high-resolution coordinate sectors. Support your favorite club and paint Kerala in their colors!",
      targetLabel: "Kerala Fan Grid Base",
      icon: "Trophy",
      highlight: "map"
    },
    {
      title: "The Interactive Territory Map 🗺️",
      description: "Welcome to the central command! Neutral unclaimed grids are gray. Pledged/claimed sectors light up with your team's designated colors. Drag to pan around towns or double-click to center coordinates.",
      targetLabel: "Central Interactive Map Screen",
      icon: "Map",
      highlight: "map"
    },
    {
      title: "Claiming Turf & Fan Boards 🚩",
      description: "Tap any tile on the map to see its Fan Board: inspect district tallies, view regional chat streams, post messages, and share local fan photos to claim points and assert overall dominance!",
      targetLabel: "Individual Tile Board Panels",
      icon: "Sparkles",
      highlight: "map"
    },
    {
      title: "The Multi-Select Smart Brush 🖌️",
      description: "Expand at lighting speed! Press & hold any tile on the map for 3 seconds to lock map panning and activate the Smart Painting Brush. Drag over adjacent tiles to paint dozens of grids in bulk!",
      targetLabel: "Smart Brush Drag-to-Highlight Tool",
      icon: "Paintbrush",
      highlight: "map"
    },
    {
      title: "Fan Club Arena Leaderboard 🏆",
      description: "Whose faction rules Kerala? View Kerala Blasters, Argentina Fans, Brazil Fans, or custom local organizations battling for the supreme share of claimed global tiles!",
      targetLabel: "Unified Fan Standings (Arena Mode)",
      icon: "Trophy",
      highlight: "arena"
    },
    {
      title: "Predict Matches to Earn Free Slots 🎁",
      description: "Low on slot tokens? Submit secure score predictions for local and regional matches! Correct results verified by our automated referee add free sector slots to your account balance automatically.",
      targetLabel: "Earn Slots Prediction Drawer",
      icon: "Coins",
      highlight: "predictions"
    },
    {
      title: "Sync & Secure Your Territory 👑",
      description: "Register your personalized account to sync sandbox tile claims. Secure accounts get +3 starting slots and let you lock down permanent sectors forever across the state!",
      targetLabel: "Register / Log In Drawer Panel",
      icon: "ShieldAlert",
      highlight: "auth"
    },
    {
      title: "Tactics Briefing Complete! 🔥",
      description: "You've mastered the rules. Select your team colors, rally your friends, paint the map, and lead your faction to absolute victory across Kerala's ultimate territory map! Kick off now!",
      targetLabel: "Ready to Play",
      icon: "Flame",
      highlight: "map"
    }
  ];

  const getTourStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-5 h-5 text-emerald-400" />;
      case 'Map': return <Map className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />;
      case 'Coins': return <Coins className="w-5 h-5 text-yellow-500 animate-bounce" />;
      case 'ShieldAlert': return <Shield className="w-5 h-5 text-rose-450 text-amber-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'Paintbrush': return <Paintbrush className="w-5 h-5 text-teal-400" />;
      default: return <Navigation className="w-5 h-5 text-teal-400" />;
    }
  };
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvalidShapeModal, setShowInvalidShapeModal] = useState(false);
  const [pendingTeam, setPendingTeam] = useState<TeamChoice>('None');
  const [leaderboardCollapsed, setLeaderboardCollapsed] = useState(true);
  const [leaderboardTab, setLeaderboardTab] = useState<'clubs' | 'players'>('clubs');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(true);
  const [currentZoom, setCurrentZoom] = useState(8);

  // Input States for Drawer
  const [tempTeam, setTempTeam] = useState<TeamChoice>('None');
  const [hasSelectedTeamInSession, setHasSelectedTeamInSession] = useState<boolean>(false);
  const [drawerActiveWindow, setDrawerActiveWindow] = useState<'team_select' | 'addons_and_payment'>('team_select');
  const [chatInput, setChatInput] = useState('');
  const [customUser, setCustomUser] = useState('SuperFan ⚽');
  const [copiedSecId, setCopiedSecId] = useState(false);
  const [activeFooterModal, setActiveFooterModal] = useState<{ type: string; title: string; content: string } | null>(null);
  const [footerCollapsed, setFooterCollapsed] = useState(true);
  const [activePage, setActivePage] = useState<'map' | 'arena'>('map');

  // Interactive Penalty Shootout Game States
  const [penaltyStatus, setPenaltyStatus] = useState<'idle' | 'aiming' | 'kick' | 'goal' | 'saved' | 'missed'>('idle');
  const [penaltyDirection, setPenaltyDirection] = useState<null | 'left' | 'center' | 'right' | 'top_left' | 'top_right'>(null);
  const [penaltyPower, setPenaltyPower] = useState<null | 'low' | 'medium' | 'high'>(null);
  const [penaltyCommentary, setPenaltyCommentary] = useState('Step up to the spot! Claim your district glory.');
  const [penaltyScore, setPenaltyScore] = useState(0);
  const [penaltyAttempts, setPenaltyAttempts] = useState(0);
  const [penaltyStreak, setPenaltyStreak] = useState(0);
  const [penaltyOpponent, setPenaltyOpponent] = useState('Yellow Army' as TeamChoice);

  // Football Trivia Game States
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaSelectedOption, setTriviaSelectedOption] = useState<null | number>(null);
  const [triviaHasAnswered, setTriviaHasAnswered] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaFeedback, setTriviaFeedback] = useState('');

  // Daily Match Predictions & Free Slots Slots State
  const [freeSlots, setFreeSlots] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('kerala_claimed_free_slots_count');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Gift Tiles Balance State
  const [giftTiles, setGiftTiles] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('kerala_gift_tiles_balance');
      return stored ? parseFloat(stored) : 1.2; // 1.2 initial tiles for sandbox fun!
    } catch {
      return 1.2;
    }
  });

  // User Referral Reward System State
  const [referralData, setReferralData] = useState<UserReferralData>(() => {
    try {
      const stored = localStorage.getItem('kerala_football_map_referrals_v1');
      return stored ? JSON.parse(stored) : { referredCount: 0, pendingFractionalTiles: 0.0 };
    } catch {
      return { referredCount: 0, pendingFractionalTiles: 0.0 };
    }
  });

  const processReferral = (userId?: string) => {
    setReferralData(prev => {
      const nextCount = prev.referredCount + 1;
      let nextFractional = parseFloat((prev.pendingFractionalTiles + 0.1).toFixed(2));
      let slotRewardCount = 0;
      let milestoneMsg = "";
      
      // Base fractional progress: every 1.0 (10 referrals) adds 1 full tile slot
      if (nextFractional >= 1.0) {
        slotRewardCount += 1;
        nextFractional = parseFloat((nextFractional - 1.0).toFixed(2));
      }
      
      // Detailed user-specified milestone tiers
      if (nextCount === 10) {
        slotRewardCount += 3; // 10 invites -> 3 tiles
        milestoneMsg = "🎉 Milestone achieved: 10 invites! You received +3 Free Claim Slots!";
      } else if (nextCount === 20) {
        slotRewardCount += 5; // 20 invites -> 5 tiles
        milestoneMsg = "🎉 Milestone achieved: 20 invites! You received +5 Free Claim Slots!";
      } else if (nextCount === 30) {
        slotRewardCount += 7; // 30 invites -> 7 tiles
        milestoneMsg = "🎉 Pro Milestone achieved: 30 invites! You received +7 Free Claim Slots!";
      } else if (nextCount === 40) {
        slotRewardCount += 9; // 40 invites -> 9 tiles
        milestoneMsg = "🎉 Super Milestone achieved: 40 invites! You received +9 Free Claim Slots!";
      } else if (nextCount === 50) {
        slotRewardCount += 15; // 50 invites -> 15 slots
        milestoneMsg = "🔥 Ultimate Milestone achieved: 50 invites! You received +15 Ultimate Claim Slots!";
      }
      
      const updated = {
        referredCount: nextCount,
        pendingFractionalTiles: nextFractional
      };
      
      localStorage.setItem('kerala_football_map_referrals_v1', JSON.stringify(updated));
      
      if (slotRewardCount > 0) {
        setFreeSlots(curr => {
          const updatedSlots = curr + slotRewardCount;
          localStorage.setItem('kerala_claimed_free_slots_count', updatedSlots.toString());
          return updatedSlots;
        });
        
        setToast({
          message: "🏆 milestone Award Cleared! 🏆",
          description: milestoneMsg || `Incredible! You earned +${slotRewardCount} Free Claim Slots from invite bonuses!`,
          type: "success"
        });
      } else {
        setToast({
          message: "Referral Accredited! ⚽",
          description: `Friend successfully registered. Progress of +0.1 added to tile balance towards the next slot!`,
          type: "success"
        });
      }
      return updated;
    });
  };


  // User Authentication
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    email: string;
    favoriteClub: string;
    isAdmin?: boolean;
    picture?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('kerala_logged_in_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Extended Super Admin & User Directory Persistence
  const [registeredUsers, setRegisteredUsers] = useState<{
    username: string;
    email: string;
    password?: string;
    favoriteClub: string;
    isAdmin?: boolean;
    picture?: string;
    emailVerified?: boolean;
  }[]>(() => {
    try {
      const stored = localStorage.getItem('kerala_registered_users_list_v4');
      if (stored) return JSON.parse(stored);
      // Seed default admin and users
      const seeded = [
        { username: 'SuperAdmin 👑', email: 'admin@footballmap.com', password: 'admin123', favoriteClub: 'None', isAdmin: true },
        { username: 'Malabar_Maestro ⚽', email: 'maestro@kerala.in', password: 'user123', favoriteClub: 'Argentina' },
        { username: 'Kochi_Kingpin 👑', email: 'king@kerala.in', password: 'user123', favoriteClub: 'Brazil' }
      ];
      localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(seeded));
      return seeded;
    } catch {
      return [];
    }
  });

  const [blockedUserEmails, setBlockedUserEmails] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kerala_blocked_user_emails_v4');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Admin Prediction Match Controller
  const [adminPredictionMatch, setAdminPredictionMatch] = useState<{
    title: string;
    teamA: string;
    teamB: string;
    status: 'open' | 'closed' | 'settled';
    winningTeam: string;
  }>(() => {
    try {
      const stored = localStorage.getItem('kerala_admin_prediction_match_v4');
      return stored ? JSON.parse(stored) : {
        title: "Malabar Soccer Derby (Gokulam Kerala vs Kerala Blasters)",
        teamA: "Argentina", // rep
        teamB: "Brazil",
        status: 'open',
        winningTeam: 'None'
      };
    } catch {
      return {
        title: "Malabar Soccer Derby (Gokulam Kerala vs Kerala Blasters)",
        teamA: "Argentina",
        teamB: "Brazil",
        status: 'open',
        winningTeam: 'None'
      };
    }
  });

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'derby' | 'images' | 'users' | 'activity'>('derby');
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const reloadActivityLogs = async () => {
    setLogsLoading(true);
    try {
      const logs = await dbFetchActivityLogs();
      setActivityLogs(logs);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (showAdminPanel) {
      reloadActivityLogs();
    }
  }, [showAdminPanel, activeAdminTab]);

  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [slotsToBuy, setSlotsToBuy] = useState(3);
  const [showBuySlotsModal, setShowBuySlotsModal] = useState(false);
  const [showMyTerritoriesModal, setShowMyTerritoriesModal] = useState(false);

  // Listen for Google Auth callback message
  useEffect(() => {
    const handleGoogleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'GOOGLE_OAUTH_SUCCESS') {
        const token = event.data.accessToken;
        
        if (!token || token === 'simulated_dummy_token_xyz') {
          // Use user's real email if available or fallback
          const googleEmail = "kingforstudy@gmail.com";
          
          if (blockedUserEmails.includes(googleEmail.toLowerCase())) {
            setToast({
              message: "Access Blocked! 🚫",
              description: "This Google Account is banned from access.",
              type: "error"
            });
            return;
          }

          const googleUser = {
            username: "kingforstudy",
            email: googleEmail,
            favoriteClub: "Argentina" as TeamChoice,
            picture: "https://api.dicebear.com/7.x/pixel-art/svg?seed=kingforstudy"
          };

          // Register in database if doesn't exist
          if (!registeredUsers.some(u => u.email.toLowerCase() === googleEmail.toLowerCase())) {
            const nextUsers = [...registeredUsers, { ...googleUser, password: 'google_oauth_user' }];
            setRegisteredUsers(nextUsers);
            localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsers));
          } else {
            // Load preferred club if exists
            const ex = registeredUsers.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
            if (ex) {
              googleUser.favoriteClub = ex.favoriteClub as TeamChoice;
            }
          }

          setLoggedInUser(googleUser);
          localStorage.setItem('kerala_logged_in_user', JSON.stringify(googleUser));
          setShowLoginModal(false);
          setToast({
            message: "Google Auth Sandbox Connected! 🚀",
            description: `Successfully logged in via Google OAuth as @kingforstudy!`,
            type: "success"
          });
        } else {
          // Real Google API fetch
          try {
            const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            if (!res.ok) throw new Error("Failed to load Google profile information");
            const googleData = await res.json();
            
            const googleEmail = googleData.email;
            const googleName = googleData.name || googleData.given_name || "Google_Fan";
            const googlePhoto = googleData.picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(googleEmail)}`;
            
            if (blockedUserEmails.includes(googleEmail.toLowerCase())) {
              setToast({
                message: "Access Blocked! 🚫",
                description: "This Google Account has been blocked by a Super Admin.",
                type: "error"
              });
              return;
            }

            const cleanNickname = googleEmail.split('@')[0] + "_google";
            const syncedUser = {
              username: cleanNickname,
              email: googleEmail,
              favoriteClub: "Argentina" as TeamChoice,
              picture: googlePhoto
            };

            // Register in database if first time
            if (!registeredUsers.some(u => u.email.toLowerCase() === googleEmail.toLowerCase())) {
              const nextUsers = [...registeredUsers, { ...syncedUser, password: 'google_oauth_user' }];
              setRegisteredUsers(nextUsers);
              localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsers));
            } else {
              const ex = registeredUsers.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
              if (ex) {
                syncedUser.favoriteClub = ex.favoriteClub as TeamChoice;
              }
            }

            setLoggedInUser(syncedUser);
            localStorage.setItem('kerala_logged_in_user', JSON.stringify(syncedUser));
            setShowLoginModal(false);
            setToast({
              message: "Google Auth Sync! 🔑",
              description: `Successfully authenticated as ${googleName} (${googleEmail})!`,
              type: "success"
            });
          } catch(err) {
            console.error("Failed Google userinfo fetch:", err);
            // Simulated flow fallback if real fetch fails
            const googleEmail = "kingforstudy@gmail.com";
            const fallbackUser = {
              username: "kingforstudy",
              email: googleEmail,
              favoriteClub: "Argentina" as TeamChoice,
              picture: `https://api.dicebear.com/7.x/initials/svg?seed=King`
            };
            setLoggedInUser(fallbackUser);
            localStorage.setItem('kerala_logged_in_user', JSON.stringify(fallbackUser));
            setShowLoginModal(false);
            setToast({
              message: "Google Google Auth Connected! 🎨",
              description: "Completed secure authentication sandbox for " + googleEmail,
              type: "success"
            });
          }
        }
      } else if (event.data?.type === 'GOOGLE_OAUTH_FAILURE') {
        setToast({
          message: "Google Login Cancelled ⚠️",
          description: event.data.error || "The popup authentication request failed or was closed.",
          type: "error"
        });
      }
    };
    
    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, [registeredUsers, blockedUserEmails]);

  // Session suspension hook for blocked users
  useEffect(() => {
    if (loggedInUser && blockedUserEmails.includes(loggedInUser.email.toLowerCase())) {
      handleUserLogout();
      setToast({
        message: "Session Suspended! 🚫",
        description: "Your session has been terminated because this account is blocked.",
        type: "error"
      });
    }
  }, [blockedUserEmails, loggedInUser]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFavClub, setLoginFavClub] = useState<TeamChoice>('Argentina');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Guided Tour state synchronization effect
  useEffect(() => {
    if (!showTour) return;
    if (tourStep === 0 || tourStep === 1 || tourStep === 2 || tourStep === 3) {
      setActivePage('map');
      setShowPredictionModal(false);
      setShowLoginModal(false);
    } else if (tourStep === 4) {
      setActivePage('arena');
      setShowPredictionModal(false);
      setShowLoginModal(false);
    } else if (tourStep === 5) {
      setActivePage('map');
      setShowPredictionModal(true);
      setShowLoginModal(false);
    } else if (tourStep === 6) {
      setActivePage('map');
      setShowPredictionModal(false);
      setShowLoginModal(true);
      setIsRegisterMode(true);
    } else if (tourStep === 7) {
      setActivePage('map');
      setShowPredictionModal(false);
      setShowLoginModal(false);
    }
  }, [tourStep, showTour]);

  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [earnSlotsTab, setEarnSlotsTab] = useState<'predictions' | 'referrals'>('predictions');
  const [isVerifyingPrediction, setIsVerifyingPrediction] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, { choice: string; status: 'simulating' | 'won' | 'lost' | 'claimed' }>>(() => {
    try {
      const stored = localStorage.getItem('kerala_submitted_predictions_v3');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Multi-select / Merge and custom style states
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [multiSelectTool, setMultiSelectTool] = useState<'brush' | 'box'>('brush');
  const multiSelectToolRef = useRef<'brush' | 'box'>('brush');
  useEffect(() => {
    multiSelectToolRef.current = multiSelectTool;
  }, [multiSelectTool]);
  const [isMergePanelCollapsed, setIsMergePanelCollapsed] = useState(true);
  const [multiSelectedTileIds, setMultiSelectedTileIds] = useState<string[]>([]);
  const [slotPurchaseCount, setSlotPurchaseCount] = useState<number>(0);
  const [isMultiSelectCheckout, setIsMultiSelectCheckout] = useState<boolean>(false);
  const [multiSelectTargetTeam, setMultiSelectTargetTeam] = useState<TeamChoice>('None');
  const [activeMultiTab, setActiveMultiTab] = useState<'merge' | 'claim'>('claim');
  const [customTextInput, setCustomTextInput] = useState('');
  const [textBackgroundStyle, setTextBackgroundStyle] = useState<'none' | 'team_color'>('none');
  const [imageBorderStyle, setImageBorderStyle] = useState<'none' | 'team_color'>('none');
  const [hyperlinkInput, setHyperlinkInput] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');

  // Popup notification toast state
  const [toast, setToast] = useState<{ message: string; description?: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Territory Engagement state for selected tiles owned by another person
  const [ownerEngagementTile, setOwnerEngagementTile] = useState<TileData | null>(null);

  // Responsive device viewport detection
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSheetState, setMobileSheetState] = useState<'expanded' | 'collapsed'>('expanded');

  useEffect(() => {
    if (selectedTileId) {
      if (isMultiSelectMode) {
        setMobileSheetState('collapsed');
      } else {
        setMobileSheetState('expanded');
      }
    }
  }, [selectedTileId, isMultiSelectMode]);

  // GPS Live Tracking States
  const [isGPSTrackingActive, setIsGPSTrackingActive] = useState(false);
  const [currentGPSCoords, setCurrentGPSCoords] = useState<{ lat: number; lng: number; accuracy: number | null } | null>(null);
  const [usingSimulatedGPS, setUsingSimulatedGPS] = useState(false);
  const gpsWatchIdRef = useRef<number | null>(null);
  const triedLowAccuracyRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (gpsWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-clear toast alert
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sophisticated glowing and pulse animations on button touch/click
  useEffect(() => {
    const handleStart = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement).closest('.btn-interactive');
      if (!target) return;

      // Add the active glow class
      target.classList.add('btn-active-glow');

      // Modern Web Animations API pulse animation
      try {
        target.animate([
          { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px rgba(0, 242, 254, 0))' },
          { transform: 'scale(0.95)', filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.85))', offset: 0.3 },
          { transform: 'scale(1.03)', filter: 'drop-shadow(0 0 25px rgba(0, 242, 254, 1))', offset: 0.75 },
          { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.6))' }
        ], {
          duration: 300,
          easing: 'ease-out'
        });
      } catch (err) {
        console.warn("Web Animations API failed or not supported in environment:", err);
      }
    };

    const handleEnd = (e: Event) => {
      const target = (e.target as HTMLElement).closest('.btn-interactive');
      if (!target) return;
      target.classList.remove('btn-active-glow');
    };

    document.addEventListener('mousedown', handleStart, { passive: true });
    document.addEventListener('touchstart', handleStart, { passive: true });
    
    document.addEventListener('mouseup', handleEnd, { passive: true });
    document.addEventListener('mouseleave', handleEnd, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    document.addEventListener('touchcancel', handleEnd, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('mouseleave', handleEnd);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, []);

  // Map elements
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polygonLayersRef = useRef<Record<string, any>>({});
  const selectedOutlineRef = useRef<any>(null);
  const boundaryLayerRef = useRef<any>(null);
  const overlayLayersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const latestTilesRef = useRef<Record<string, TileData>>({});
  latestTilesRef.current = tiles;
  const latestSelectedTileIdRef = useRef<string | null>(null);
  latestSelectedTileIdRef.current = selectedTileId;
  const latestTempTeamRef = useRef<TeamChoice>('None');
  latestTempTeamRef.current = tempTeam;
  const latestMultiSelectTargetTeamRef = useRef<TeamChoice>('None');
  latestMultiSelectTargetTeamRef.current = multiSelectTargetTeam;
  const latestHasSelectedTeamInSessionRef = useRef<boolean>(false);
  latestHasSelectedTeamInSessionRef.current = hasSelectedTeamInSession;

  const latestIsMultiSelectModeRef = useRef<boolean>(false);
  latestIsMultiSelectModeRef.current = isMultiSelectMode;
  const latestMultiSelectedTileIdsRef = useRef<string[]>([]);
  latestMultiSelectedTileIdsRef.current = multiSelectedTileIds;

  // Fast math references
  const allCellsRef = useRef<any[]>([]);
  const dLatRef = useRef<number>(0.0035);
  const dLngRef = useRef<number>(0.0035);
  const spatialGridRef = useRef<any[][]>([]);
  const gridBoundsRef = useRef<{ minLat: number; maxLat: number; minLng: number; maxLng: number }>({ minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.5 });

  const isDraggingSelectionRef = useRef(false);
  const holdTimerRef = useRef<any>(null);
  const hasTriggeredHoldRef = useRef(false);

  // Toggle map dragging based on multi-select active state
  useEffect(() => {
    if (!mapRef.current) return;
    try {
      if (isMultiSelectMode) {
        mapRef.current.dragging?.disable();
      } else {
        mapRef.current.dragging?.enable();
      }
    } catch (e) {
      console.warn("Leaflet dragging set error", e);
    }
  }, [isMultiSelectMode]);

  // Window global mouseup event listener to reset dragging state robustly
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingSelectionRef.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Implement Drag-Box Selection on the leafet map template
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    let isDrawing = false;
    let startLatLng: any = null;
    let visualBox: any = null;

    const handleMapMouseDown = (e: any) => {
      // Only draw when multi-select mode is active and box tool is selected
      if (!latestIsMultiSelectModeRef.current || multiSelectToolRef.current !== 'box') return;

      // Prevent leaflet panning/zooming side effects
      if (e.originalEvent) {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
      }

      isDrawing = true;
      startLatLng = e.latlng;

      if (visualBox) {
        mapInstance.removeLayer(visualBox);
        visualBox = null;
      }
    };

    const handleMapMouseMove = (e: any) => {
      if (!isDrawing || !startLatLng) return;

      const currentLatLng = e.latlng;
      const bounds = (window as any).L.latLngBounds(startLatLng, currentLatLng);

      if (!visualBox) {
        visualBox = (window as any).L.rectangle(bounds, {
          color: '#f59e0b', // Amber selection border
          weight: 2,
          fillColor: '#f59e0b',
          fillOpacity: 0.18,
          dashArray: '5, 5',
          className: 'drag-selection-box'
        }).addTo(mapInstance);
      } else {
        visualBox.setBounds(bounds);
      }
    };

    const handleMapMouseUp = (e: any) => {
      if (!isDrawing) return;
      isDrawing = false;

      const currentLatLng = e.latlng;
      if (startLatLng && currentLatLng) {
        const bounds = (window as any).L.latLngBounds(startLatLng, currentLatLng);
        const minLatCoord = bounds.getSouthWest().lat;
        const maxLatCoord = bounds.getNorthEast().lat;
        const minLngCoord = bounds.getSouthWest().lng;
        const maxLngCoord = bounds.getNorthEast().lng;

        // Perform ultra-fast O(N) lookup inside coordinate bounds
        const newlySelectedIds: string[] = [];
        const cells = allCellsRef.current;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (cell.lat >= minLatCoord && cell.lat <= maxLatCoord &&
              cell.lng >= minLngCoord && cell.lng <= maxLngCoord) {
            newlySelectedIds.push(cell.id);
          }
        }

        if (newlySelectedIds.length > 0) {
          setMultiSelectedTileIds(prev => {
            const next = [...prev];
            newlySelectedIds.forEach(id => {
              if (!next.includes(id)) {
                next.push(id);
              }
            });
            return next;
          });

          // Apply instant visual style updates to polygons
          newlySelectedIds.forEach(id => {
            const polygon = polygonLayersRef.current[id];
            if (polygon) {
              const targetTeamName = latestMultiSelectTargetTeamRef.current;
              const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];
              polygon.setStyle({
                stroke: true,
                color: targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff'),
                dashArray: '5, 5',
                weight: 2.5,
                fillColor: targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent'),
                fillOpacity: targetTeamName === 'None' ? 0 : 0.35
              });
            }
          });

          setToast({
            message: `Selected ${newlySelectedIds.length} sectors! 🧩`,
            description: "Drag-box calculation finished successfully.",
            type: "success"
          });
        }
      }

      // Cleanup visual box layer
      if (visualBox) {
        mapInstance.removeLayer(visualBox);
        visualBox = null;
      }
      startLatLng = null;
    };

    mapInstance.on('mousedown', handleMapMouseDown);
    mapInstance.on('mousemove', handleMapMouseMove);
    mapInstance.on('mouseup', handleMapMouseUp);

    return () => {
      mapInstance.off('mousedown', handleMapMouseDown);
      mapInstance.off('mousemove', handleMapMouseMove);
      mapInstance.off('mouseup', handleMapMouseUp);
      if (visualBox) {
        mapInstance.removeLayer(visualBox);
      }
    };
  }, [isMultiSelectMode, multiSelectTool]);

  // Save changes to localStorage and generate global tickers
  const updateTileInState = (id: string, updatedData: TileData) => {
    // Sync audit trail to database
    try {
      const oldData = tiles[id] || { team: 'None', chats: [], photo: '' };
      const username = loggedInUser?.username || updatedData.claimedBy || 'System Guest';
      
      if (oldData.team === 'None' && updatedData.team !== 'None') {
        dbAddActivityLog({
          username,
          action_type: 'claim',
          description: `Claimed Sector ${id} for ${updatedData.team}`
        }).then(() => { if (showAdminPanel) reloadActivityLogs(); });
      } else if (oldData.team !== 'None' && updatedData.team === 'None') {
        dbAddActivityLog({
          username,
          action_type: 'release',
          description: `Released/vacated Sector ${id}`
        }).then(() => { if (showAdminPanel) reloadActivityLogs(); });
      }

      if (updatedData.photo && updatedData.photo !== oldData.photo) {
        dbAddActivityLog({
          username,
          action_type: 'image_upload',
          description: `Uploaded custom image/banner to Sector ${id}`
        }).then(() => { if (showAdminPanel) reloadActivityLogs(); });
      }

      if ((updatedData.chats?.length || 0) > (oldData.chats?.length || 0)) {
        const lastChat = updatedData.chats[updatedData.chats.length - 1];
        dbAddActivityLog({
          username: lastChat?.user || username,
          action_type: 'chat',
          description: `Posted message at Sector ${id}: "${lastChat?.text?.substring(0, 30)}${lastChat?.text?.length > 30 ? '...' : ''}"`
        }).then(() => { if (showAdminPanel) reloadActivityLogs(); });
      }
    } catch (err) {
      console.error("Failed to compute action audit status:", err);
    }

    let next: Record<string, TileData> = {};
    setTiles(prev => {
      next = { ...prev, [id]: updatedData };
      latestTilesRef.current = next;
      saveClaimedTiles(next);
      return next;
    });

    // Sync individual tile change to Supabase backend asynchronously
    dbSaveTile(id, updatedData).then((success) => {
      if (success && isSupabaseConfigured) {
        console.log(`Successfully persisted Tile ${id} to Supabase`);
      }
    });

    // Update tile style instantly on the leaflet map if it exists
    const layer = polygonLayersRef.current[id];
    if (layer) {
      const style = TEAM_STYLES[updatedData.team];
      const isMerged = !!(updatedData?.isMergedChild || (updatedData?.mergedWith && updatedData.mergedWith.length > 0));
      layer.setStyle({
        stroke: !isMerged,
        fillColor: (updatedData.team === 'None' || updatedData.photo) ? 'transparent' : style.color,
        fillOpacity: (updatedData.team === 'None' || updatedData.photo) ? 0 : 0.4,
        color: updatedData.team === 'None' ? '#475569' : style.color,
        weight: updatedData.team === 'None' ? 0.5 : 1.5,
      });
    }

    // Refresh glowing outline if selected (don't pan on intermediate keystroke updates)
    if (selectedTileId === id) {
      highlightSelectedTileOnMap(id, updatedData, false);
    }

    // Instantly synchronize overlays on map
    setTimeout(() => {
      updateVisibleGrid(next);
    }, 0);
  };

  // Batch updates for merges / splits
  const updateTilesBatch = (bulkUpdates: Record<string, TileData>) => {
    let next: Record<string, TileData> = {};
    setTiles(prev => {
      next = { ...prev, ...bulkUpdates };
      latestTilesRef.current = next;
      saveClaimedTiles(next);
      return next;
    });

    // Sync batch of tiles to Supabase backend asynchronously
    Object.entries(bulkUpdates).forEach(([tileId, data]) => {
      dbSaveTile(tileId, data);
    });

    setTimeout(() => {
      updateVisibleGrid(next);
    }, 0);
  };

  // Instantly persist in-place changes to design parameters (text, border, hyperlink)
  const saveDesignSettings = (updates: Partial<TileData>) => {
    if (!selectedTileId) return;
    const currentData = tiles[selectedTileId] || {
      id: selectedTileId,
      team: 'None',
      photo: '',
      chats: []
    };
    
    const updated = {
      ...currentData,
      ...updates
    };
    
    updateTileInState(selectedTileId, updated);
  };

  // Map Tile Click Handler handles multi-select edits or selection redirection
  const handleTileClickOnMap = (id: string, existData: TileData) => {
    if (isMultiSelectMode) {
      if (!selectedTileId) {
        setSelectedTileId(id);
        if (isMobile) {
          setMobileSheetState('collapsed');
        }
      }
      setMultiSelectedTileIds(prev => {
        const isSelected = prev.includes(id);
        const next = isSelected ? prev.filter(x => x !== id) : [...prev, id];
        
        // Instant visual feedback for clicked polygon in multi-select mode
        const polygon = polygonLayersRef.current[id];
        if (polygon) {
          const style = TEAM_STYLES[existData.team || 'None'] || TEAM_STYLES['None'];
          const targetTeamName = latestMultiSelectTargetTeamRef.current;
          const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];
          const isMerged = !!(existData?.isMergedChild || (existData?.mergedWith && existData.mergedWith.length > 0));
          const shouldShowStroke = !isSelected || !isMerged;

          polygon.setStyle({
            stroke: shouldShowStroke,
            color: !isSelected ? (targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff')) : (existData.team === 'None' || !existData.team ? '#475569' : style.color),
            dashArray: !isSelected ? '5, 5' : undefined,
            weight: !isSelected ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5),
            fillColor: !isSelected ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
            fillOpacity: !isSelected ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
          });
        }
        return next;
      });
    } else {
      // Direct user straight to group owner/parent if selected is merged child
      const ownerId = existData.isMergedChild && existData.mergedParentId 
        ? existData.mergedParentId 
        : id;
      const ownerData = tiles[ownerId] || {
        id: ownerId,
        team: 'None',
        photo: '',
        chats: []
      };

      // Check if owned by another person (claimedBy exists and is not equal to loggedInUser/Guest)
      const currentUserName = loggedInUser ? loggedInUser.username : 'Guest';
      const isOwnedBySomeoneElse = ownerData?.claimedBy && ownerData.claimedBy !== currentUserName && ownerData.team !== 'None';

      if (isOwnedBySomeoneElse) {
        let link = ownerData.hyperlink ? ownerData.hyperlink.trim() : '';
        if (link) {
          if (!/^https?:\/\//i.test(link)) {
            link = 'https://' + link;
          }
          try {
            // Scenario A: Hyperlink exists - open in new browser tab
            window.open(link, '_blank');
            return;
          } catch (e) {
            console.error("Failed to open URL:", e);
          }
        }
        
        // Scenario B: No hyperlink - trigger custom popup overlay
        setOwnerEngagementTile(ownerData);
        return;
      }

      triggerTileSelection(ownerId, ownerData);
    }
  };

  // Dedicated drag-over select handler to enable brush painting selection
  const handleTileDragSelect = (id: string) => {
    if (isMultiSelectMode && !selectedTileId) {
      setSelectedTileId(id);
      if (isMobile) {
        setMobileSheetState('collapsed');
      }
    }
    setMultiSelectedTileIds(prev => {
      if (prev.includes(id)) {
        return prev;
      } else {
        const next = [...prev, id];
        // Instant visual feedback for hovered polygon in multi-select mode
        const polygon = polygonLayersRef.current[id];
        if (polygon) {
          const targetTeamName = latestMultiSelectTargetTeamRef.current;
          const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];
          polygon.setStyle({
            stroke: true,
            color: targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff'),
            dashArray: '5, 5',
            weight: 2.5,
            fillColor: targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent'),
            fillOpacity: targetTeamName === 'None' ? 0 : 0.35
          });
        }
        return next;
      }
    });
  };

  // Assemble Multiple Selected Tiles into One Consolidated Large Fan Territory
  const handleMergeAction = () => {
    if (multiSelectedTileIds.length < 2) {
      alert("Please select at least 2 adjacent or nearby tiles from the map to merge!");
      return;
    }

    // Shape Validation check: must form a perfect, solid square or rectangle
    const selectedCells: any[] = [];
    multiSelectedTileIds.forEach(id => {
      if (id.startsWith('K')) {
        const idx = parseInt(id.substring(1), 10) - 1;
        if (idx >= 0 && idx < allCellsRef.current.length) {
          selectedCells.push(allCellsRef.current[idx]);
        }
      }
    });
    const dLat = dLatRef.current || 0.0035;
    const dLng = dLngRef.current || 0.0035;

    let minLatCoord = Infinity;
    let minLngCoord = Infinity;
    selectedCells.forEach(cell => {
      if (cell.lat < minLatCoord) minLatCoord = cell.lat;
      if (cell.lng < minLngCoord) minLngCoord = cell.lng;
    });

    const coords = selectedCells.map(cell => ({
      r: Math.round((cell.lat - minLatCoord) / dLat),
      c: Math.round((cell.lng - minLngCoord) / dLng)
    }));

    let minR = Infinity, maxR = -Infinity;
    let minC = Infinity, maxC = -Infinity;
    coords.forEach(pt => {
      if (pt.r < minR) minR = pt.r;
      if (pt.r > maxR) maxR = pt.r;
      if (pt.c < minC) minC = pt.c;
      if (pt.c > maxC) maxC = pt.c;
    });

    const expectedCount = (maxR - minR + 1) * (maxC - minC + 1);
    const selectedSet = new Set(coords.map(pt => `${pt.r},${pt.c}`));

    let isPerfectRect = true;
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (!selectedSet.has(`${r},${c}`)) {
          isPerfectRect = false;
          break;
        }
      }
      if (!isPerfectRect) break;
    }

    if (selectedCells.length !== expectedCount) {
      isPerfectRect = false;
    }

    if (!isPerfectRect) {
      // Show warning toast for quick user feedback
      setToast({
        message: "Invalid Shape ⚠️",
        description: "Please select a proper square or rectangular shape to merge.",
        type: "warning"
      });

      // Show beautiful custom dialog modal and popup trigger
      setShowInvalidShapeModal(true);

      try {
        alert('Invalid Shape: Please select a proper square or rectangular shape to merge.');
      } catch (e) {
        console.warn("Native alert blocked by browser context:", e);
      }
      return;
    }

    const sortedIds = [...multiSelectedTileIds].sort();
    const masterId = sortedIds[0];
    const childIds = sortedIds.slice(1);

    const masterOriginal = tiles[masterId] || {
      id: masterId,
      team: 'None',
      photo: '',
      chats: []
    };

    // Prepare master update with all member list references
    const masterUpdate: TileData = {
      ...masterOriginal,
      mergedWith: sortedIds,
      isMergedChild: false,
      mergedParentId: undefined
    };

    const bulk: Record<string, TileData> = {
      [masterId]: masterUpdate
    };

    // Prepare child references
    childIds.forEach(cid => {
      const original = tiles[cid] || {
        id: cid,
        team: 'None',
        photo: '',
        chats: []
      };

      bulk[cid] = {
        ...original,
        isMergedChild: true,
        mergedParentId: masterId,
        mergedWith: undefined
      };
    });

    updateTilesBatch(bulk);

    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);

    triggerTileSelection(masterId, masterUpdate);

    // Dynamic referee confirmation chat log added to feed
    const mergerMsg: ChatMessage = {
      id: `sys-merge-${Date.now()}`,
      user: 'System Referee 📣',
      text: `Successfully merged tile ${masterId} with ${childIds.length} adjacent sector(s) into one unified fansite!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTimeout(() => {
      updateTileInState(masterId, {
        ...masterUpdate,
        chats: [...(masterUpdate.chats || []), mergerMsg]
      });
    }, 50);
  };

  // Splitting / Dissolving a merged group back into standalone squares
  const handleSplitAction = () => {
    if (!selectedTileId) return;
    const masterData = tiles[selectedTileId];
    if (!masterData || !masterData.mergedWith) return;

    const allMembers = masterData.mergedWith;
    const bulk: Record<string, TileData> = {};

    allMembers.forEach(mid => {
      const orig = tiles[mid] || { id: mid, team: 'None', photo: '', chats: [] };
      bulk[mid] = {
        ...orig,
        mergedWith: undefined,
        isMergedChild: false,
        mergedParentId: undefined
      };
    });

    updateTilesBatch(bulk);
    triggerTileSelection(selectedTileId, bulk[selectedTileId]);
  };

  // Secure batch claiming of multiple tiles using claim slots
  const handleBatchClaimUsingSlots = () => {
    const N = multiSelectedTileIds.length;
    if (freeSlots < N) {
      setToast({
        message: "Insufficient Slots! ⚠️",
        description: `You need ${N} slots but only have ${freeSlots} slots left. Buy missing slots below!`,
        type: "warning"
      });
      return;
    }

    // Deduct slots
    const nextFreeSlots = freeSlots - N;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';

    // Batch update tiles on the map
    let next: Record<string, TileData> = {};
    setTiles(prev => {
      const copy = { ...prev };
      
      multiSelectedTileIds.forEach(id => {
        const currentData = copy[id] || { id, team: 'None', photo: '', chats: [] };
        
        const botMessage: ChatMessage = {
          id: `sys-batch-${Date.now()}-${id}`,
          user: 'System Referee 📣',
          text: `Secured in slot batch claim for ${TEAM_STYLES[multiSelectTargetTeam]?.flagEmoji || '🏳️'} ${multiSelectTargetTeam}! (Owner: @${ownerName})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        copy[id] = {
          ...currentData,
          team: multiSelectTargetTeam,
          claimedBy: ownerName,
          chats: [...(currentData.chats || []), botMessage],
          lastClaimedAt: new Date().toLocaleString()
        };
      });

      next = copy;
      latestTilesRef.current = copy;
      saveClaimedTiles(copy);

      // Sync batch claim to Supabase
      multiSelectedTileIds.forEach(id => {
        if (copy[id]) {
          dbSaveTile(id, copy[id]);
        }
      });

      // Log batch claim to Audit Trail
      dbAddActivityLog({
        username: ownerName,
        action_type: 'claim',
        description: `Batch claimed ${N} Sectors using slots for ${multiSelectTargetTeam} (${multiSelectedTileIds.slice(0, 5).join(', ')}${N > 5 ? '...' : ''})`
      }).then(() => { if (showAdminPanel) reloadActivityLogs(); });

      return copy;
    });

    setToast({
      message: `${N} Territories Captured! 🚩🎖️`,
      description: `All ${N} selected squares are now mapped and locked for ${multiSelectTargetTeam}! Used ${N} slot tokens.`,
      type: "success"
    });

    // Clear multi-select selection
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
    if (isMobile) {
      setMobileSheetState('expanded');
    }
    updateVisibleGrid(next);
  };


  // Generate tickers dynamically from stored logs
  useEffect(() => {
    const messagesList: { id: string, tileId: string, text: string, team: string }[] = [];
    Object.entries(tiles).forEach(([tileId, item]) => {
      const tileData = item as TileData;
      if (tileData.chats && tileData.chats.length > 0) {
        tileData.chats.forEach((msg, idx) => {
          messagesList.push({
            id: `${tileId}-${idx}`,
            tileId,
            text: msg.text,
            team: tileData.team
          });
        });
      }
    });
    setTickerTickerMessages(messagesList.slice(-10).reverse());
  }, [tiles]);

  // Handle map movement to dynamically render only viewport tiles
  const updateVisibleGrid = (tilesOverride?: Record<string, TileData>) => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const currentTiles = tilesOverride || latestTilesRef.current;
    const zoom = mapInstance.getZoom();
    setCurrentZoom(zoom);

    if (selectedOutlineRef.current) {
      mapInstance.removeLayer(selectedOutlineRef.current);
      selectedOutlineRef.current = null;
    }

    // Clear previous dynamic dynamic overlay markers/image overlays
    overlayLayersRef.current.forEach(layer => mapInstance.removeLayer(layer));
    overlayLayersRef.current = [];

    // Draw grid of empty sectors only at zoom >= 13 for flawless Performance, but ALWAYS show claimed/customized tiles
    let renderList: any[] = [];
    if (zoom < 13) {
      // Find all tiles in currentTiles that are active (have support team or uploaded photo)
      const claimedIds = Object.keys(currentTiles).filter(id => {
        const item = currentTiles[id];
        return item && (item.team !== 'None' || item.photo);
      });
      // Resolve cell coordinates in O(1) performance using fast index math
      claimedIds.forEach(id => {
        if (id.startsWith('K')) {
          const idx = parseInt(id.substring(1), 10) - 1;
          if (idx >= 0 && idx < allCellsRef.current.length) {
            renderList.push(allCellsRef.current[idx]);
          }
        }
      });
    } else {
      const bounds = mapInstance.getBounds();
      const minLat = bounds.getSouth();
      const maxLat = bounds.getNorth();
      const minLng = bounds.getWest();
      const maxLng = bounds.getEast();

      // 10% padding
      const latPad = (maxLat - minLat) * 0.1;
      const lngPad = (maxLng - minLng) * 0.1;

      const padMinLat = minLat - latPad;
      const padMaxLat = maxLat + latPad;
      const padMinLng = minLng - lngPad;
      const padMaxLng = maxLng + lngPad;

      // Extract cells only from overlapping spatial grid blocks to optimize performance
      const { minLat: boundsMinLat, maxLat: boundsMaxLat, minLng: boundsMinLng, maxLng: boundsMaxLng } = gridBoundsRef.current;
      const NUM_BLOCKS = 64;
      
      const startR = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((padMinLat - boundsMinLat) / (boundsMaxLat - boundsMinLat)) * NUM_BLOCKS)));
      const endR = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((padMaxLat - boundsMinLat) / (boundsMaxLat - boundsMinLat)) * NUM_BLOCKS)));
      const startC = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((padMinLng - boundsMinLng) / (boundsMaxLng - boundsMinLng)) * NUM_BLOCKS)));
      const endC = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((padMaxLng - boundsMinLng) / (boundsMaxLng - boundsMinLng)) * NUM_BLOCKS)));
      
      const candidateCells: any[] = [];
      const blocks = spatialGridRef.current;
      if (blocks && blocks.length > 0) {
        for (let r = startR; r <= endR; r++) {
          for (let c = startC; c <= endC; c++) {
            const blockCells = blocks[r * NUM_BLOCKS + c] || [];
            for (let i = 0; i < blockCells.length; i++) {
              candidateCells.push(blockCells[i]);
            }
          }
        }
      } else {
        candidateCells.push(...allCellsRef.current);
      }
      
      const visibleCells = candidateCells.filter(cell => 
        cell.lat >= padMinLat && cell.lat <= padMaxLat && 
        cell.lng >= padMinLng && cell.lng <= padMaxLng
      );

      // Slice to a safe rendering limit (max 1500 polygons)
      renderList = visibleCells.slice(0, 1500);
    }

    // Incremental polygon reuse optimization
    const newRenderIds = new Set(renderList.map(cell => cell.id));
    const prevLayers = polygonLayersRef.current || {};
    const tempLayers: Record<string, any> = {};

    Object.keys(prevLayers).forEach(id => {
      if (!newRenderIds.has(id)) {
        if (prevLayers[id]) {
          mapInstance.removeLayer(prevLayers[id]);
        }
      } else {
        tempLayers[id] = prevLayers[id];
      }
    });

    const dLat = dLatRef.current;
    const dLng = dLngRef.current;

    renderList.forEach(cell => {
      const id = cell.id;

      // Skip creating if we already have it on map
      if (tempLayers[id]) {
        return;
      }

      const cellData = currentTiles[id];
      const ownerId = cellData?.isMergedChild && cellData.mergedParentId 
        ? cellData.mergedParentId 
        : id;

      const existData = currentTiles[ownerId] || {
        id: ownerId,
        team: 'None',
        photo: '',
        chats: []
      };

      const corners = [
        [cell.lat - dLat / 2, cell.lng - dLng / 2],
        [cell.lat + dLat / 2, cell.lng - dLng / 2],
        [cell.lat + dLat / 2, cell.lng + dLng / 2],
        [cell.lat - dLat / 2, cell.lng + dLng / 2]
      ];

      const isSec = isMultiSelectMode && multiSelectedTileIds.includes(id);
      const style = TEAM_STYLES[existData.team];
      const targetTeamName = isMultiSelectMode ? multiSelectTargetTeam : (tempTeam !== 'None' ? tempTeam : 'None');
      const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];

      const isMerged = !!(cellData?.isMergedChild || (cellData?.mergedWith && cellData.mergedWith.length > 0));
      const shouldShowStroke = isSec || !isMerged;

      const cellPolygon = (window as any).L.polygon(corners, {
        stroke: shouldShowStroke,
        color: isSec ? (targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff')) : (existData.team === 'None' ? '#475569' : style.color),
        dashArray: isSec ? '5, 5' : undefined,
        weight: isSec ? 2.5 : (existData.team === 'None' ? 0.5 : 1.5),
        fillColor: isSec ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || existData.photo) ? 0 : 0.4),
        className: `transition-all duration-300 grid-tile-${id}`
      });

      cellPolygon.addTo(mapInstance);

      let holdStartX = 0;
      let holdStartY = 0;
      let wasSelectedOnStart = false;

      const handleStart = (e: any) => {
        const orig = e.originalEvent;
        if (orig) {
          const touch = orig.touches ? orig.touches[0] : null;
          holdStartX = touch ? touch.clientX : orig.clientX;
          holdStartY = touch ? touch.clientY : orig.clientY;
        }

        if (latestIsMultiSelectModeRef.current) {
          isDraggingSelectionRef.current = true;
          wasSelectedOnStart = latestMultiSelectedTileIdsRef.current.includes(id);
          if (!wasSelectedOnStart) {
            handleTileDragSelect(id);
          }
          if (orig) {
            orig.preventDefault();
          }
        } else {
          hasTriggeredHoldRef.current = false;
          if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
          }
          holdTimerRef.current = setTimeout(() => {
            hasTriggeredHoldRef.current = true;
            setIsMultiSelectMode(true);
            setIsMergePanelCollapsed(true); // Starts collapsed on mobile for a clean experience
            setMultiSelectedTileIds([id]);
            setSelectedTileId(null); // Close sidebar drawer
            isDraggingSelectionRef.current = true;
            if (navigator.vibrate) {
              try {
                navigator.vibrate([120]);
              } catch (err) {}
            }
          }, 3000);
        }
      };

      const handleMove = (e: any) => {
        if (!latestIsMultiSelectModeRef.current && holdTimerRef.current) {
          const orig = e.originalEvent;
          if (orig) {
            const touch = orig.touches ? orig.touches[0] : null;
            const currentX = touch ? touch.clientX : orig.clientX;
            const currentY = touch ? touch.clientY : orig.clientY;
            
            const dx = currentX - holdStartX;
            const dy = currentY - holdStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Allow larger movement tolerance on mobile touches
            const threshold = orig.touches ? 30 : 15;
            if (dist > threshold) {
              clearTimeout(holdTimerRef.current);
              holdTimerRef.current = null;
            }
          }
        }
      };

      const handleEnd = () => {
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
      };

      cellPolygon.on('mousedown', handleStart);
      cellPolygon.on('touchstart', handleStart);

      cellPolygon.on('mousemove', handleMove);
      cellPolygon.on('touchmove', handleMove);

      cellPolygon.on('mouseup', handleEnd);
      cellPolygon.on('touchend', handleEnd);
      cellPolygon.on('touchcancel', handleEnd);

      cellPolygon.on('mouseout', () => {
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
      });

      cellPolygon.on('mouseover', () => {
        if (latestIsMultiSelectModeRef.current && isDraggingSelectionRef.current) {
          handleTileDragSelect(id);
        }
      });

      cellPolygon.on('contextmenu', (e: any) => {
        if (e.originalEvent) {
          e.originalEvent.preventDefault();
        }
      });

      cellPolygon.on('click', (e: any) => {
        if (hasTriggeredHoldRef.current) {
          hasTriggeredHoldRef.current = false; // Consume long-press trigger
          if (e.originalEvent) {
            e.originalEvent.preventDefault();
          }
          return;
        }

        if (latestIsMultiSelectModeRef.current) {
          if (e.originalEvent) {
            e.originalEvent.preventDefault();
          }
          if (wasSelectedOnStart) {
            setMultiSelectedTileIds(prev => prev.filter(tileId => tileId !== id));
          }
        } else {
          handleTileClickOnMap(id, existData);
        }
      });

      tempLayers[id] = cellPolygon;
    });

    polygonLayersRef.current = tempLayers;

    // Render image overlays and text overlays for groups visible on the map
    const drawnGroups = new Set<string>();

    renderList.forEach(cell => {
      const id = cell.id;
      const cellData = currentTiles[id];
      const ownerId = cellData?.isMergedChild && cellData.mergedParentId 
        ? cellData.mergedParentId 
        : id;

      if (drawnGroups.has(ownerId)) return;
      drawnGroups.add(ownerId);

      const ownerData = currentTiles[ownerId];
      if (!ownerData) return;

      // Draw only if customized properties are verified
      if (!ownerData.photo) return;

      const memberIds = ownerData.mergedWith && ownerData.mergedWith.length > 0 
        ? ownerData.mergedWith 
        : [ownerId];

      const memberCells: any[] = [];
      memberIds.forEach(id => {
        if (id.startsWith('K')) {
          const idx = parseInt(id.substring(1), 10) - 1;
          if (idx >= 0 && idx < allCellsRef.current.length) {
            memberCells.push(allCellsRef.current[idx]);
          }
        }
      });
      if (memberCells.length === 0) return;

      // Group bounding box bounds
      let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
      memberCells.forEach(mc => {
        const mcMinLat = mc.lat - dLat / 2;
        const mcMaxLat = mc.lat + dLat / 2;
        const mcMinLng = mc.lng - dLng / 2;
        const mcMaxLng = mc.lng + dLng / 2;
        if (mcMinLat < minLat) minLat = mcMinLat;
        if (mcMaxLat > maxLat) maxLat = mcMaxLat;
        if (mcMinLng < minLng) minLng = mcMinLng;
        if (mcMaxLng > maxLng) maxLng = mcMaxLng;
      });

      const bounds = [[minLat, minLng], [maxLat, maxLng]];

      // Photo Layout Overlays with style choices
      if (ownerData.photo) {
        try {
          const imgOverlay = (window as any).L.imageOverlay(ownerData.photo, bounds, {
            opacity: 0.85,
            className: 'merged-region-image',
            interactive: true
          }).addTo(mapInstance);

          imgOverlay.on('click', () => {
            handleTileClickOnMap(ownerId, ownerData);
          });

          overlayLayersRef.current.push(imgOverlay);

          const style = TEAM_STYLES[ownerData.team] || TEAM_STYLES['None'];

          // Dark dropshadow backing outline for visibility
          const shadowRect = (window as any).L.rectangle(bounds, {
            color: '#020617',
            weight: 4.5,
            fill: false,
            opacity: 0.9,
            interactive: false
          }).addTo(mapInstance);
          overlayLayersRef.current.push(shadowRect);

          // Active country flag/team color outline of image
          const borderRect = (window as any).L.rectangle(bounds, {
            color: style.color || '#38bdf8',
            weight: 3.0,
            fill: false,
            opacity: 1.0,
            interactive: false
          }).addTo(mapInstance);
          overlayLayersRef.current.push(borderRect);
        } catch (overlayErr) {
          console.error("Failed to render Leaflet imageOverlay for data:", ownerId, overlayErr);
        }
      }
    });

    // Draw glowing selection outline enclosing all merged sectors of the selected group
    const activeSelectedId = latestSelectedTileIdRef.current;
    if (activeSelectedId) {
      const ownerData = currentTiles[activeSelectedId];
      const ownerId = ownerData?.isMergedChild && ownerData.mergedParentId 
        ? ownerData.mergedParentId 
        : activeSelectedId;
      const finalData = currentTiles[ownerId] || ownerData || { id: ownerId };
      
      const memberIds = finalData.mergedWith && finalData.mergedWith.length > 0 
        ? finalData.mergedWith 
        : [ownerId];

      const memberCells: any[] = [];
      memberIds.forEach(id => {
        if (id.startsWith('K')) {
          const idx = parseInt(id.substring(1), 10) - 1;
          if (idx >= 0 && idx < allCellsRef.current.length) {
            memberCells.push(allCellsRef.current[idx]);
          }
        }
      });
      if (memberCells.length > 0) {
        let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
        memberCells.forEach(mc => {
          const mcMinLat = mc.lat - dLat / 2;
          const mcMaxLat = mc.lat + dLat / 2;
          const mcMinLng = mc.lng - dLng / 2;
          const mcMaxLng = mc.lng + dLng / 2;
          if (mcMinLat < minLat) minLat = mcMinLat;
          if (mcMaxLat > maxLat) maxLat = mcMaxLat;
          if (mcMinLng < minLng) minLng = mcMinLng;
          if (mcMaxLng > maxLng) maxLng = mcMaxLng;
        });

        const activeTeam = (activeSelectedId === ownerId) 
          ? (latestTempTeamRef.current && latestTempTeamRef.current !== 'None' ? latestTempTeamRef.current : (finalData?.team || 'None')) 
          : (finalData?.team || 'None');
        const borderColor = activeTeam === 'None' ? '#ffffff' : TEAM_STYLES[activeTeam].color;

        selectedOutlineRef.current = (window as any).L.rectangle([[minLat, minLng], [maxLat, maxLng]], {
          color: borderColor,
          weight: 3,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: activeTeam === 'None' ? '5, 5' : undefined
        }).addTo(mapInstance);
      }
    }
  };

  // Re-bind viewport update listener
  useEffect(() => {
    if (!mapRef.current) return;
    const handleMapMove = () => {
      updateVisibleGrid();
    };
    mapRef.current.on('moveend', handleMapMove);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend', handleMapMove);
      }
    };
  }, [tiles, isMultiSelectMode, multiSelectedTileIds, selectedTileId]);

  // Instantly synchronize Leaflet polygon colors/styles when selection or claims change
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const currentTiles = latestTilesRef.current || tiles;

    Object.keys(polygonLayersRef.current).forEach(id => {
      const polygon = polygonLayersRef.current[id];
      if (!polygon) return;

      const cellData = currentTiles[id];
      const ownerId = cellData?.isMergedChild && cellData.mergedParentId 
        ? cellData.mergedParentId 
        : id;

      const existData = currentTiles[ownerId] || {
        id: ownerId,
        team: 'None',
        photo: '',
        chats: []
      };

      const isSec = isMultiSelectMode && multiSelectedTileIds.includes(id);
      const style = TEAM_STYLES[existData.team || 'None'] || TEAM_STYLES['None'];
      const targetTeamName = isMultiSelectMode ? multiSelectTargetTeam : (tempTeam !== 'None' ? tempTeam : 'None');
      const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];

      const isMerged = !!(cellData?.isMergedChild || (cellData?.mergedWith && cellData.mergedWith.length > 0));
      const shouldShowStroke = isSec || !isMerged;

      polygon.setStyle({
        stroke: shouldShowStroke,
        color: isSec ? (targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff')) : (existData.team === 'None' || !existData.team ? '#475569' : style.color),
        dashArray: isSec ? '5, 5' : undefined,
        weight: isSec ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5),
        fillColor: isSec ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
      });
    });
  }, [tiles, isMultiSelectMode, multiSelectedTileIds, multiSelectTargetTeam, tempTeam]);

  // Synchronise customUser with loggedInUser
  useEffect(() => {
    if (loggedInUser) {
      setCustomUser(loggedInUser.username);
    } else {
      setCustomUser('SuperFan ⚽');
    }
  }, [loggedInUser]);

  // Load Saved Tiles on Mount and initialize map boundary
  useEffect(() => {
    // 1. Initial Synchronous Placeholder cache load (instant UI response)
    try {
      const saved = localStorage.getItem('kerala_claimed_tiles') || localStorage.getItem('kerala_world_cup_tiles_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTiles(parsed);
        latestTilesRef.current = parsed;
      }
    } catch (e) {
      console.error("Failed to load initial claimed tiles", e);
    }

    // 2. Load latest live data from Supabase backend in parallel if available
    const syncWithSupabaseDatabase = async () => {
      try {
        // Run silent table check first to flag missing tables before fetches start
        await dbVerifySchemasOnBoot();

        const [blockedList, usersList, cloudTiles] = await Promise.all([
          dbFetchBlockedEmails().catch(err => {
            console.warn("Blocked emails sync failed - using offline list:", err);
            return [];
          }),
          dbFetchUsers().catch(err => {
            console.warn("Users sync failed - using offline list:", err);
            return [];
          }),
          dbFetchTiles().catch(err => {
            console.error("Tiles sync failed - using local tiles cache:", err);
            return {};
          })
        ]);

        if (blockedList) {
          setBlockedUserEmails(blockedList);
        }

        if (usersList && usersList.length > 0) {
          setRegisteredUsers(usersList);
        }

        if (cloudTiles && Object.keys(cloudTiles).length > 0) {
          setTiles(cloudTiles);
          latestTilesRef.current = cloudTiles;
          setTimeout(() => {
            updateVisibleGrid(cloudTiles);
          }, 30);
        }
      } catch (err) {
        console.error("Supabase sync bootstrap failed:", err);
      }
    };
    syncWithSupabaseDatabase();

    if (!mapContainerRef.current) return;

    setIsLoading(true);

    // 2. Initialise leaflet map
    if (!mapRef.current) {
      const worldBounds = (window as any).L.latLngBounds(
        (window as any).L.latLng(-90, -180),
        (window as any).L.latLng(90, 180)
      );

      const map = (window as any).L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
        maxBounds: worldBounds,
        maxBoundsViscosity: 0.1, // Less sticky boundaries when panning around Kerala borders
        bounceAtZoomLimits: false,
        inertia: true,
        inertiaDeceleration: 3500,
        inertiaMaxSpeed: 3500,
        easeLinearity: 0.2,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        tap: false // Eliminated double-tap/click latency conflicts on mobile devices
      }).setView([10.4505, 76.2711], 8);

      (window as any).L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors',
        maxZoom: 19,
        noWrap: true,
        bounds: worldBounds,
        subdomains: 'abcd',
        keepBuffer: 3,
        updateWhenIdle: true,
        updateWhenZooming: false,
        updateInterval: 80,
        maxParallelImageRequests: 32,
        crossOrigin: true
      }).addTo(map);

      mapRef.current = map;
    }

    const mapInstance = mapRef.current;

    // Use cached performance profile instantly for instant loading
    if (cachedKeralaData && cachedAllCells && cachedSpatialGrid && cachedGridBounds) {
      const boundaryLayer = (window as any).L.geoJSON(cachedRenderFeature, {
        style: {
          color: '#10b981', // Emerald pristine boundary
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 0.04
        },
        interactive: false
      }).addTo(mapInstance);
      boundaryLayerRef.current = boundaryLayer;

      allCellsRef.current = cachedAllCells;
      dLatRef.current = cachedDLat;
      dLngRef.current = cachedDLng;
      spatialGridRef.current = cachedSpatialGrid;
      gridBoundsRef.current = cachedGridBounds;
      setTileCount(cachedAllCells.length);

      // Pre-fill tiles dictionary
      updateVisibleGrid();
      setIsLoading(false);
      // Direct initial select sync if a deep link is loaded in the address bar on mount
      setTimeout(() => {
        selectTileFromHash();
      }, 50);
      return;
    }

    // Draw boundary state of Kerala in background
    fetch('/Kerala.geojson')
      .then(res => res.json())
      .then(keralaData => {
        const turfObj = (window as any).turf;
        let renderFeature = keralaData;

        // Draw initial boundary state of Kerala instantly so the UI is completely interactive in 0ms!
        const initialBoundaryLayer = (window as any).L.geoJSON(keralaData, {
          style: {
            color: '#10b981', // Emerald pristine boundary
            weight: 2,
            fillColor: '#10b981',
            fillOpacity: 0.04
          },
          interactive: false
        }).addTo(mapInstance);
        boundaryLayerRef.current = initialBoundaryLayer;

        // Perform expensive Turf dissolve asynchronously so it doesn't block immediate loading
        setTimeout(() => {
          if (keralaData && keralaData.features && keralaData.features.length > 0 && turfObj) {
            try {
              // Binary pairwise merge to optimize turf.union performance from O(N^2) to O(N log N)
              const pairwiseMerge = (feats: any[]): any => {
                if (feats.length === 0) return null;
                if (feats.length === 1) return feats[0];
                const mid = Math.floor(feats.length / 2);
                const left = pairwiseMerge(feats.slice(0, mid));
                const right = pairwiseMerge(feats.slice(mid));
                if (left && right) {
                  return turfObj.union(left, right) || left;
                }
                return left || right;
              };

              const merged = pairwiseMerge(keralaData.features);
              if (merged && mapRef.current) {
                // Remove initial boundary layer and replace with pristine outline
                if (boundaryLayerRef.current) {
                  mapRef.current.removeLayer(boundaryLayerRef.current);
                }
                const dissolvedLayer = (window as any).L.geoJSON(merged, {
                  style: {
                    color: '#10b981',
                    weight: 2.2,
                    fillColor: '#10b981',
                    fillOpacity: 0.04
                  },
                  interactive: false
                }).addTo(mapRef.current);
                boundaryLayerRef.current = dissolvedLayer;
                cachedRenderFeature = merged;
              }
            } catch (e) {
              console.warn("Async boundary dissolve failed, using standard fallback outline:", e);
            }
          }
        }, 10);

        // Calculate Turf Bounding Box
        const bbox = turfObj ? turfObj.bbox(keralaData) : [74.8, 8.2, 77.5, 12.8];
        const minLng = bbox[0], minLat = bbox[1], maxLng = bbox[2], maxLat = bbox[3];

        // Gather all geometry coordinate rings from ALL features for pristine full state coverage
        const rings: [number, number][][] = [];
        if (keralaData.geometry) {
          if (keralaData.geometry.type === 'Polygon') {
            rings.push(keralaData.geometry.coordinates[0]);
          } else if (keralaData.geometry.type === 'MultiPolygon') {
            keralaData.geometry.coordinates.forEach((poly: any) => {
              rings.push(poly[0]);
            });
          }
        } else if (keralaData.features) {
          keralaData.features.forEach((feat: any) => {
            const geom = feat.geometry;
            if (geom) {
              if (geom.type === 'Polygon') {
                rings.push(geom.coordinates[0]);
              } else if (geom.type === 'MultiPolygon') {
                geom.coordinates.forEach((poly: any) => {
                  rings.push(poly[0]);
                });
              }
            }
          });
        }

        // Pre-build line segments for extremely fast intersection checks
        const segments: { x1: number; y1: number; x2: number; y2: number; minY: number; maxY: number }[] = [];
        rings.forEach(ring => {
          for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const x1 = ring[i][0], y1 = ring[i][1];
            const x2 = ring[j][0], y2 = ring[j][1];
            if (y1 !== y2) {
              segments.push({
                x1, y1, x2, y2,
                minY: Math.min(y1, y2),
                maxY: Math.max(y1, y2)
              });
            }
          }
        });

        // ------------------ START OPTIMIZATION: Latitude Segment Bucketing ------------------
        // Pre-build O(1) latitudinal bucket indexes to avoid scanning thousands of segments in the inner loop
        const numLatBuckets = 120;
        const latBuckets: { x1: number; y1: number; x2: number; y2: number; minY: number; maxY: number }[][] = 
          Array.from({ length: numLatBuckets }, () => []);
        const bucketHeight = (maxLat - minLat) / numLatBuckets;

        segments.forEach(seg => {
          const startBucket = Math.max(0, Math.floor((seg.minY - minLat) / bucketHeight));
          const endBucket = Math.min(numLatBuckets - 1, Math.floor((seg.maxY - minLat) / bucketHeight));
          for (let b = startBucket; b <= endBucket; b++) {
            latBuckets[b].push(seg);
          }
        });
        // ------------------- END OPTIMIZATION: Latitude Segment Bucketing -------------------

        // Search for grid resolution C, R that produces exactly >= 242,827 cells inside rings
        let C = 700;
        let finalCells: { id: string; lat: number; lng: number }[] = [];
        let finalDLat = 0;
        let finalDLng = 0;

        while (C <= 1000) {
          const R = Math.round(C * (maxLat - minLat) / ((maxLng - minLng) * Math.cos(10.5 * Math.PI / 180)));
          const dLng = (maxLng - minLng) / C;
          const dLat = (maxLat - minLat) / R;

          const tempCells = [];

          for (let r = 0; r < R; r++) {
            const lat = minLat + (r + 0.5) * dLat;

            // Resolve target bucket for the current scan-line latitude in constant time
            const bucketIdx = Math.min(numLatBuckets - 1, Math.max(0, Math.floor((lat - minLat) / bucketHeight)));
            const relevantSegments = latBuckets[bucketIdx];

            const intersections: number[] = [];
            for (let s = 0; s < relevantSegments.length; s++) {
              const seg = relevantSegments[s];
              if (lat > seg.minY && lat <= seg.maxY) {
                const x_intersect = seg.x1 + (lat - seg.y1) * (seg.x2 - seg.x1) / (seg.y2 - seg.y1);
                intersections.push(x_intersect);
              }
            }

            intersections.sort((a, b) => a - b);

            // Pop any odd intersection to prevent the horizontal line leakage bug
            if (intersections.length % 2 !== 0) {
              intersections.pop();
            }

            for (let i = 0; i < intersections.length - 1; i += 2) {
              const xStart = intersections[i];
              const xEnd = intersections[i+1];

              const cStart = Math.max(0, Math.ceil((xStart - minLng) / dLng));
              const cEnd = Math.min(C - 1, Math.floor((xEnd - minLng) / dLng));

              for (let c = cStart; c <= cEnd; c++) {
                const lng = minLng + (c + 0.5) * dLng;
                tempCells.push({
                  id: '',
                  lat,
                  lng
                });
              }
            }
          }

          if (tempCells.length >= 242827) {
            finalCells = tempCells;
            finalDLat = dLat;
            finalDLng = dLng;
            break;
          }
          C += 5;
        }

        // Limit exactly to 242,827 cells as specified
        finalCells = finalCells.slice(0, 242827);
        finalCells.forEach((c, idx) => {
          c.id = 'K' + String(idx + 1).padStart(6, '0');
        });

        allCellsRef.current = finalCells;
        dLatRef.current = finalDLat;
        dLngRef.current = finalDLng;
        setTileCount(242827);

        // Pre-build 64x64 spatial partitioning block grid for O(1) nearest lookup and viewport queries
        const NUM_BLOCKS = 64;
        const gridBlocks: any[][] = Array.from({ length: NUM_BLOCKS * NUM_BLOCKS }, () => []);

        finalCells.forEach(cell => {
          const latPct = (cell.lat - minLat) / (maxLat - minLat);
          const lngPct = (cell.lng - minLng) / (maxLng - minLng);
          const r = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(latPct * NUM_BLOCKS)));
          const c = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(lngPct * NUM_BLOCKS)));
          gridBlocks[r * NUM_BLOCKS + c].push(cell);
        });

        spatialGridRef.current = gridBlocks;
        const finalBounds = { minLat, maxLat, minLng, maxLng };
        gridBoundsRef.current = finalBounds;

        // Set global caches
        cachedKeralaData = keralaData;
        cachedRenderFeature = renderFeature;
        cachedAllCells = finalCells;
        cachedDLat = finalDLat;
        cachedDLng = finalDLng;
        cachedSpatialGrid = gridBlocks;
        cachedGridBounds = finalBounds;

        // Pre-fill tiles dictionary
        updateVisibleGrid();
        setIsLoading(false);
        // Direct initial select sync if a deep link is loaded in the address bar on mount
        setTimeout(() => {
          selectTileFromHash();
        }, 100);
      })
      .catch(err => {
        console.error("GeoJSON fetching error:", err);
        setIsLoading(false);
      });

  }, []);

  // Extremely fast spatial nearest cell lookup
  const findClosestCell = (latitude: number, longitude: number) => {
    if (!allCellsRef.current || allCellsRef.current.length === 0) return null;
    
    const { minLat, maxLat, minLng, maxLng } = gridBoundsRef.current;
    const NUM_BLOCKS = 64;
    
    // Convert coordinate to block index
    const latPct = (latitude - minLat) / (maxLat - minLat);
    const lngPct = (longitude - minLng) / (maxLng - minLng);
    const centerR = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(latPct * NUM_BLOCKS)));
    const centerC = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(lngPct * NUM_BLOCKS)));
    
    let closestCell = null;
    let minDistance = Infinity;
    
    // Check center block and its 8 neighbors to cover segment boundaries properly
    for (let dr = -1; dr <= 1; dr++) {
      const r = centerR + dr;
      if (r < 0 || r >= NUM_BLOCKS) continue;
      
      for (let dc = -1; dc <= 1; dc++) {
        const c = centerC + dc;
        if (c < 0 || c >= NUM_BLOCKS) continue;
        
        const blockCells = spatialGridRef.current[r * NUM_BLOCKS + c] || [];
        for (let i = 0; i < blockCells.length; i++) {
          const cell = blockCells[i];
          const dLat = cell.lat - latitude;
          const dLng = cell.lng - longitude;
          const dist = dLat * dLat + dLng * dLng;
          if (dist < minDistance) {
            minDistance = dist;
            closestCell = cell;
          }
        }
      }
    }
    
    // Safe lookup fallback
    if (!closestCell) {
      for (let i = 0; i < allCellsRef.current.length; i++) {
        const cell = allCellsRef.current[i];
        const dLat = cell.lat - latitude;
        const dLng = cell.lng - longitude;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDistance) {
          minDistance = dist;
          closestCell = cell;
        }
      }
    }
    
    return { cell: closestCell, distance: minDistance };
  };

  // Handle polygon selections
  const triggerTileSelection = (id: string, activeTileDataFallback?: TileData) => {
    const activeData = tiles[id] || activeTileDataFallback;
    if (!activeData) return;

    setSelectedTileId(id);
    setTempTeam(activeData.team as TeamChoice);
    setHasSelectedTeamInSession(false);
    setDrawerActiveWindow('team_select');
    setChatInput('');
    setTeamSearchQuery('');

    // Sync design overlays state variables
    setCustomTextInput(activeData.customText || '');
    setTextBackgroundStyle(activeData.textBackgroundStyle || 'none');
    setImageBorderStyle(activeData.imageBorderStyle || 'none');
    setHyperlinkInput(activeData.hyperlink || '');

    // Ensure we outline selected element and zoom/pan to it on initial selection click
    highlightSelectedTileOnMap(id, activeData, true);
  };

  const highlightSelectedTileOnMap = (id: string, customData?: TileData, shouldPan: boolean = false) => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    // Remove old outline
    if (selectedOutlineRef.current) {
      mapInstance.removeLayer(selectedOutlineRef.current);
      selectedOutlineRef.current = null;
    }

    const ownerData = customData || latestTilesRef.current[id] || tiles[id];
    const ownerId = ownerData?.isMergedChild && ownerData.mergedParentId 
      ? ownerData.mergedParentId 
      : id;
    const finalData = (ownerId === id && customData) ? customData : (latestTilesRef.current[ownerId] || tiles[ownerId] || ownerData || { id: ownerId });

    const memberIds = finalData.mergedWith && finalData.mergedWith.length > 0 
      ? finalData.mergedWith 
      : [ownerId];

    const memberCells: any[] = [];
    memberIds.forEach(id => {
      if (id.startsWith('K')) {
        const idx = parseInt(id.substring(1), 10) - 1;
        if (idx >= 0 && idx < allCellsRef.current.length) {
          memberCells.push(allCellsRef.current[idx]);
        }
      }
    });
    if (memberCells.length > 0) {
      let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
      const dLat = dLatRef.current;
      const dLng = dLngRef.current;

      memberCells.forEach(mc => {
        const mcMinLat = mc.lat - dLat / 2;
        const mcMaxLat = mc.lat + dLat / 2;
        const mcMinLng = mc.lng - dLng / 2;
        const mcMaxLng = mc.lng + dLng / 2;
        if (mcMinLat < minLat) minLat = mcMinLat;
        if (mcMaxLat > maxLat) maxLat = mcMaxLat;
        if (mcMinLng < minLng) minLng = mcMinLng;
        if (mcMaxLng > maxLng) maxLng = mcMaxLng;
      });

      const activeTeam = (selectedTileId === id) 
        ? (latestTempTeamRef.current && latestTempTeamRef.current !== 'None' ? latestTempTeamRef.current : (finalData?.team || 'None')) 
        : (finalData?.team || 'None');
      const borderColor = activeTeam === 'None' ? '#ffffff' : TEAM_STYLES[activeTeam].color;

      selectedOutlineRef.current = (window as any).L.rectangle([[minLat, minLng], [maxLat, maxLng]], {
        color: borderColor,
        weight: 3,
        fillColor: 'transparent',
        fillOpacity: 0,
        dashArray: activeTeam === 'None' ? '5, 5' : undefined
      }).addTo(mapInstance);

      if (shouldPan) {
        // Pan to center of merged bounds and ensure a close-up zoom level (at least 15) so cells are visible
        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLng + maxLng) / 2;
        const targetZoom = Math.max(mapInstance.getZoom(), 15);
        
        if (window.innerWidth < 768) {
          // On mobile, offset slightly south so the marked cell is clearly visible above the bottom sheet
          const latRange = (maxLat - minLat) || dLatRef.current;
          const offsetLat = latRange * 0.15 + 0.0055;
          mapInstance.setView([midLat - offsetLat, midLng], targetZoom, { animate: true });
        } else {
          mapInstance.setView([midLat, midLng], targetZoom, { animate: true });
        }
      }
    }
  };

  // Synchronizes the application selection based on URL hash deep links
  const selectTileFromHash = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const targetId = hash.replace('#', '').trim().toUpperCase();
      // Verify matches cell ID pattern: starts with 'K' followed by 6 digits
      if (/^K\d{6}$/.test(targetId)) {
        // Find matching cell
        const targetCell = allCellsRef.current.find(c => c.id === targetId);
        if (targetCell) {
          if (mapRef.current) {
            mapRef.current.setView([targetCell.lat, targetCell.lng], 15, { animate: true });
          }
          const cellData = latestTilesRef.current[targetId] || { id: targetId, team: 'None', photo: '', chats: [] };
          triggerTileSelection(targetId, cellData);
          setToast({
            message: `Deep Link Loaded! 🔗`,
            description: `Auto-focused and selected Sector ${targetId}`,
            type: "success"
          });
        }
      }
    }
  };

  // Listen for hash changes to support responsive browser back/forward and external link clicks
  useEffect(() => {
    const handleHashChange = () => {
      selectTileFromHash();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Centralized URL hash updater corresponding to selected file indicators
  useEffect(() => {
    if (!selectedTileId) {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      window.history.replaceState(null, '', '#' + selectedTileId);
    }
  }, [selectedTileId]);

  // Synchronously update outline highlight on map when tempTeam scratchpad selection updates
  useEffect(() => {
    if (selectedTileId) {
      highlightSelectedTileOnMap(selectedTileId, tiles[selectedTileId], false);
    }
  }, [tempTeam, selectedTileId, hasSelectedTeamInSession]);
  const handleCopyLink = () => {
    if (!selectedTileId) return;
    const shareUrl = `${window.location.origin}/#${selectedTileId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedSecId(true);
      setToast({
        message: "Deep Link Copied! 📋",
        description: `Link for Sector ${selectedTileId} (${shareUrl}) successfully copied to clipboard. Share with friends!`,
        type: "success"
      });
      setTimeout(() => setCopiedSecId(false), 2200);
    }).catch(err => {
      console.error("Clipboard copy failed", err);
      setToast({
        message: "Copy Failed ⚠️",
        description: "Standard clipboard permissions are unavailable.",
        type: "warning"
      });
    });
  };

  const handleOpenFooterModal = (type: string, socialName?: string) => {
    if (type === 'leaderboard') {
      setActivePage('arena');
      setToast({
        message: "Arena Entered! 🏆",
        description: "Explore district standings and play Kerala active football games!",
        type: "success"
      });
      return;
    }

    let title = '';
    let content = '';

    if (type === 'social' && socialName) {
      title = `${socialName} Integration`;
      content = `Kerala Football Fans connection for ${socialName} has been initialized successfully. In this sandbox preview, all social integrations are simulated so that you can view and test the deep link sharing experience without real tracking trackers or APIs. Use the copy deep link option to share with physical friends!`;
    } else if (type === 'blog') {
      title = `⚽ Grassroots Football Blog`;
      content = `Welcome to the official Football Map blog network! Here we report on the ultimate grassroots football wars from Kozhikode and Malappuram, to Kochi and Greenfield. Fans have pledged massive simulated flags, built merged super-grids, and shared real-time coordinates. Stay tuned as more communities assert their soccer religion!`;
    } else if (type === 'privacy') {
      title = `🛡️ Privacy Policy`;
      content = `Your privacy is our shared sports team standard. All custom modifications, local chats, and image snapshots you upload are kept entirely client-side, persisting securely inside your browser's local sandbox storage index. No cookies or personal metrics are exported to external cloud databases without direct permission.`;
    } else if (type === 'refund') {
      title = `💸 Refund Policy & Simulator Rules`;
      content = `Each territory claim transaction on the Kerala Fan Map is a fully simulated payment sandbox for testing. Since zero real currency (INR) is processed, any refund request is instantly, automatically approved in real-time. Feel safe mapping out massive sections of soccer territory!`;
    } else if (type === 'terms') {
      title = `📜 Terms & Conditions`;
      content = `By pledging support to Kerala's shared soccer grid, you promise to uphold the spirit of clean sportsmanship. Do not merge clusters in malicious patterns, use descriptive and respectable labels for coordinates, and celebrate every team and fan community. Soccer is Kerala's ultimate religion—let's honor it together!`;
    } else if (type === 'about') {
      title = `ℹ️ About Football Map`;
      content = `We are developers, football fans, and cartographers who believe that grassroots soccer is the pure fuel of Kerala. This interactive portal maps 242,827 geographical sectors across Kerala’s districts, letting you claim territorial dominance, merge grids with neighbor fan alliances, decorate custom pitches, and chat live with regional rivals.`;
    } else if (type === 'careers') {
      title = `💼 Join the Fans Team`;
      content = `Interested in building the future of sports visualization? Even though we are a virtual project, we are always on the lookout for creative React developers, GIS spatial analysts, and avid football aficionados. Feel free to clone this sandbox and pitch your high-fidelity contributions!`;
    } else if (type === 'support') {
      title = `💬 Help & Fan Support`;
      content = `Encountering an issue claiming your custom physical coordinates? Need assistance resetting local storage state or correcting custom club flags? Drop us an inquiry anytime! Our team of simulated ground monitors is available 24/7 to resolve spatial grids and team flag claims.`;
    } else if (type === 'submit_ground') {
      title = `🏟️ Submit Local Pitch Coordinates`;
      content = `Know a beautiful local municipal field, beach football turf, or local school ground not currently marked in our Kerala GIS model? Submit the coordinates or sector ID! We regularly verify layout inputs from fans to elevate grassroots spaces.`;
    } else if (type === 'leaderboard') {
      title = `🏆 Football Religion Leaderboard`;
      content = `The Football Religion Leaderboard brings together Kerala's fiercest fan groups (Yellow Army, Red Giants, Blues Alliance, Green Eagles, and others) by calculating occupied grids, active live chat vibes, and district coverage in real-time. Boost your favorite club now by asserting claims on available land or consolidating merged super-grids with neighboring sectors!`;
    } else if (type === 'features') {
      title = `⚡ Map Features & Fan Tools`;
      content = `Discover our key features designed for sports enthusiasts across Kerala:\n\n1. Fan Sector Claims: Select and lock down grid squares within Kerala boundaries to declare your club allegiance.\n2. Live Talk Chat Feed: Broadcast real-time sandbox shoutouts dynamically bound to physical territory coordinates.\n3. Sports Arena Penalty Game: Test your penalty shooting skills in our virtual scoreboard games and district rankings.\n4. Advanced Spatial Tracking: Search specific places, districts, or coordinates instantly with integrated GPS localization.`;
    } else if (type === 'pricing') {
      title = `💎 Fan Grid Claiming & Pricing`;
      content = `Football Map Kerala is 100% free and open-source for grassroots sports lovers!\n\nFor advanced club custom branding options, automated team news feeds, and professional player representation panels, we offer a simulated premium VIP tier subscription at exactly 0 INR (Kerala Rupees). Claim, paint, and customize any territorial zone without any financial charges!`;
    } else if (type === 'faqs') {
      title = `❓ Frequently Asked Questions`;
      content = `Q: How do I claim a geographical sector?\nA: Simply navigate to any unclaimed tile inside Kerala, click it, input your custom club or fan lobby label, and click 'Lock Fan Territory'!\n\nQ: Does caching affect my claims?\nA: Yes! This is a client-side sandbox platform, meaning all coordinates and messages are cached locally inside your browser's index database. Clearing cache resets claims.\n\nQ: Is this real or simulated?\nA: This is a 100% simulated GIS sandbox honoring Kerala's beautiful grassroots sports culture! No real payment or billing systems exist in this application.\n\nQ: Can I collaborate with friends?\nA: Absolutely! Share your deep links or copy sector IDs so other local fans can find and claim neighboring tiles to build a large Fan Union.`;
    } else if (type === 'contact') {
      title = `📨 Contact Fan Support`;
      content = `Have a question, feedback, or custom municipal stadium coordinates to suggest?\n\nConnect with our simulated monitoring desk or send an inquiry to contact@keralafootballmap.com. Our virtual field monitors are active round the clock to keep Kerala's ultimate football map running beautifully!`;
    }

    setActiveFooterModal({ type, title, content });
  };

  // ==========================================
  // INTERACTIVE SPORTS ARENA GAMES LOGIC
  // ==========================================

  // --- 1. KERALA PENALTY HERO GAME CONTROLLERS ---
  const handleSelectPenaltyDirection = (dir: 'left' | 'center' | 'right' | 'top_left' | 'top_right') => {
    if (penaltyStatus === 'kick') return;
    setPenaltyDirection(dir);
    setPenaltyStatus('aiming');
    setPenaltyCommentary(`Aim set to ${dir.replace('_', ' ').toUpperCase()}. Choose kick power and let fly!`);
  };

  const handleSelectPenaltyPower = (pow: 'low' | 'medium' | 'high') => {
    if (penaltyStatus === 'kick') return;
    setPenaltyPower(pow);
    setPenaltyCommentary(`Aiming with ${pow.toUpperCase()} shot power. Click "SHOOT!" to take the pledge penalty.`);
  };

  const triggerTakePenalty = () => {
    if (!penaltyDirection) {
      setPenaltyCommentary("⚠️ Select your penalty corner target first!");
      return;
    }
    const power = penaltyPower || 'medium';
    setPenaltyStatus('kick');
    setPenaltyCommentary(`⚽ Taking the run-up... under massive stadium noise...`);

    // Simulated rival opponent selection
    const rivals: TeamChoice[] = ['Argentina', 'Brazil', 'France', 'Portugal', 'Germany', 'Spain'];
    const activeTeam = tempTeam !== 'None' ? tempTeam : 'Argentina';
    const otherTeams = rivals.filter(r => r !== activeTeam);
    const opponent = otherTeams[Math.floor(Math.random() * otherTeams.length)];
    setPenaltyOpponent(opponent);

    setTimeout(() => {
      // Choose random goalkeeper dive direction
      const diveOptions: ('left' | 'center' | 'right' | 'top_left' | 'top_right')[] = [
        'left', 'center', 'right', 'top_left', 'top_right'
      ];
      const gkDive = diveOptions[Math.floor(Math.random() * diveOptions.length)];

      const isAimedHigh = penaltyDirection === 'top_left' || penaltyDirection === 'top_right';

      if (gkDive === penaltyDirection) {
        // SAVED! Guarded target matched
        setPenaltyStatus('saved');
        setPenaltyCommentary(`🧤 SAVED! Exceptional reflex dive by the ${opponent} keeper to deny your shot to the ${penaltyDirection.replace('_', ' ')}!`);
        setPenaltyStreak(0);
        setPenaltyAttempts(prev => prev + 1);
      } else if (power === 'high' && isAimedHigh && Math.random() < 0.35) {
        // MISSED! High-power shot over-shot
        setPenaltyStatus('missed');
        setPenaltyCommentary(`💥 CLANG! Your blast power rattles the crossbar! The ball flies out into the spectacular crowd in Kozhikode!`);
        setPenaltyStreak(0);
        setPenaltyAttempts(prev => prev + 1);
      } else if (power === 'low' && penaltyDirection === 'center' && Math.random() < 0.5) {
        // Caught because it was too soft and center
        setPenaltyStatus('saved');
        setPenaltyCommentary(`🧤 CAUGHT! A soft chip straight down the middle was easily contained by the lazy goalkeeper.`);
        setPenaltyStreak(0);
        setPenaltyAttempts(prev => prev + 1);
      } else {
        // GOAL!
        setPenaltyStatus('goal');
        const goalCommentaries = [
          `⚽ GOOOAAALLL!!! You absolute wizard! You fired a stunning screamer into the ${penaltyDirection.replace('_', ' ')} corner!`,
          `⚽ GOAL! You completely sent the ${opponent} keeper the wrong way! Splendid spot kick!`,
          `⚽ IT'S A GOAL! The pitch erupts! That belongs in local Malappuram legends!`
        ];
        setPenaltyCommentary(goalCommentaries[Math.floor(Math.random() * goalCommentaries.length)]);
        setPenaltyScore(prev => prev + 1);
        setPenaltyStreak(prev => prev + 1);
        setPenaltyAttempts(prev => prev + 1);

        // Praise active supported club and grant a simulated bonus!
        if (tempTeam !== 'None') {
          setToast({
            message: "Goal Scored! ⚽",
            description: `Earned +25 stadium points for ${tempTeam}! Check current leaderboards.`,
            type: "success"
          });
        }
      }
    }, 1100);
  };

  const handleResetPenaltySession = () => {
    setPenaltyStatus('idle');
    setPenaltyDirection(null);
    setPenaltyPower(null);
    setPenaltyCommentary('Step up to the spot! Claim your district glory.');
  };

  // --- 2. MALABAR TRIVIA CUP CONTROLLERS ---
  const handleSelectTriviaOption = (optionIndex: number) => {
    if (triviaHasAnswered) return;
    setTriviaSelectedOption(optionIndex);
    setTriviaHasAnswered(true);

    const question = TRIVIA_QUESTIONS[triviaIndex];
    if (optionIndex === question.answerIndex) {
      setTriviaScore(prev => prev + 1);
      setTriviaFeedback(`✅ CORRECT! ${question.explanation}`);
    } else {
      setTriviaFeedback(`❌ INCORRECT! The correct answer was: ${question.options[question.answerIndex]}. ${question.explanation}`);
    }
  };

  const handleNextTriviaQuestion = () => {
    if (triviaIndex < TRIVIA_QUESTIONS.length - 1) {
      setTriviaIndex(prev => prev + 1);
      setTriviaSelectedOption(null);
      setTriviaHasAnswered(false);
      setTriviaFeedback('');
    }
  };

  const handleResetTriviaCup = () => {
    setTriviaIndex(0);
    setTriviaSelectedOption(null);
    setTriviaHasAnswered(false);
    setTriviaScore(0);
    setTriviaFeedback('');
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim();
    if (!query) return;

    // Check if it's a Tile ID format (e.g., K000085)
    const tileIdRegex = /^K\d+$/i;
    if (tileIdRegex.test(query)) {
      const cleanId = query.toUpperCase();
      let targetCell = null;
      if (cleanId.startsWith('K')) {
        const idx = parseInt(cleanId.substring(1), 10) - 1;
        if (idx >= 0 && idx < allCellsRef.current.length) {
          targetCell = allCellsRef.current[idx];
        }
      }

      if (targetCell) {
        if (mapRef.current) {
          mapRef.current.setView([targetCell.lat, targetCell.lng], 14, { animate: true });
        }

        const existData = tiles[cleanId] || {
          id: cleanId,
          team: 'None',
          photo: '',
          chats: []
        };

        triggerTileSelection(cleanId, existData);
      } else {
        setToast({
          message: "Sector Not Found",
          description: `Sector ${cleanId} does not exist in our grid. (Try e.g., K000085 or enter a city name like Kochi)`,
          type: "warning"
        });
      }
    } else {
      // It's a geographic physical location search!
      setToast({
        message: "Searching Location...",
        description: `Looking up details for "${query}"...`,
        type: "info"
      });

      // Query Nominatim OpenStreetMap API
      // Append Kerala if not explicitly in search, to ground results beautifully
      const searchQuery = query.toLowerCase().includes("kerala") || query.toLowerCase().includes("india")
        ? query 
        : `${query}, Kerala, India`;

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const latitude = parseFloat(data[0].lat);
            const longitude = parseFloat(data[0].lon);
            const displayName = data[0].display_name.split(',').slice(0, 3).join(',');

            const mapInstance = mapRef.current;
            if (mapInstance) {
              // Smooth fly to search location
              mapInstance.flyTo([latitude, longitude], 15, {
                animate: true,
                duration: 1.5
              });

              // Put coordinates marker
              if (userMarkerRef.current) {
                try {
                  mapInstance.removeLayer(userMarkerRef.current);
                } catch (err) {
                  console.warn("Failed to remove old user marker", err);
                }
              }

              const searchIcon = (window as any).L.divIcon({
                className: 'user-location-marker',
                html: `
                  <div class="relative flex flex-col items-center justify-center">
                    <span class="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-violet-400/40"></span>
                    <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 border-violet-400 shadow-xl shadow-violet-950/40">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-violet-400 animate-bounce">
                        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5zM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                `,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
              });

              const searchMarker = (window as any).L.marker([latitude, longitude], { 
                icon: searchIcon,
                draggable: false 
              })
                .addTo(mapInstance)
                .bindTooltip(`<div class="bg-slate-950 text-violet-300 font-mono text-[10px] px-2 py-1 rounded border border-violet-800">📍 Match: ${displayName}</div>`, {
                  permanent: false,
                  direction: 'top',
                  opacity: 0.95
                });
              userMarkerRef.current = searchMarker;

              // Grid matching
              const closestResult = findClosestCell(latitude, longitude);
              const closestCell = closestResult ? closestResult.cell : null;
              const minDistance = closestResult ? closestResult.distance : Infinity;

              const isOutsideKeralaBoundaries = minDistance > 1.44;

              if (closestCell) {
                const cellId = closestCell.id;
                const cellData = tiles[cellId] || { id: cellId, team: 'None', photo: '', chats: [] };
                
                triggerTileSelection(cellId, cellData);

                if (isOutsideKeralaBoundaries) {
                  setToast({
                    message: "Location Found! 🌍",
                    description: `Located "${displayName}". Nearest Kerala boundary sector is ${cellId}!`,
                    type: "success"
                  });
                } else {
                  setToast({
                    message: "Location Found! 📍",
                    description: `Successfully jumped to "${displayName}", closest sector: ${cellId}!`,
                    type: "success"
                  });
                }
              } else {
                setToast({
                  message: "Location Located",
                  description: `Centered on coordinates: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
                  type: "success"
                });
              }
            }
          } else {
            setToast({
              message: "Location Not Found",
              description: `Could not determine coordinates for query "${query}". Try searching a popular Kerala city like Kochi, Thrissur, etc.`,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.error("Geocoding fetch error:", err);
          setToast({
            message: "Search Error",
            description: "Failed to connect to location services or search rate limit exceeded.",
            type: "warning"
          });
        });
    }
  };

  // Synchronizes the user location marker dragging action in real-time
  const handleMarkerDragEnd = (e: any) => {
    const newLatLng = e.target.getLatLng();
    const newLat = newLatLng.lat;
    const newLng = newLatLng.lng;

    const closestResult = findClosestCell(newLat, newLng);
    const closestCell = closestResult ? closestResult.cell : null;

    if (closestCell) {
      const cellId = closestCell.id;
      const cellData = tiles[cellId] || { id: cellId, team: 'None', photo: '', chats: [] };
      triggerTileSelection(cellId, cellData);

      setToast({
        message: "Location Refined! 🎯",
        description: `Coordinates adjusted manually. Linked to nearest sector: ${cellId}!`,
        type: "success"
      });
    }
  };

  // Allows user to manually pin their home position directly onto the selected tile coordinates
  const handleSetCustomLocationToSelectedTile = () => {
    if (!selectedTileId) return;
    
    // Find matching cell
    let targetCell = null;
    if (selectedTileId && selectedTileId.startsWith('K')) {
      const idx = parseInt(selectedTileId.substring(1), 10) - 1;
      if (idx >= 0 && idx < allCellsRef.current.length) {
        targetCell = allCellsRef.current[idx];
      }
    }
    if (!targetCell) return;

    const mapInstance = mapRef.current;
    if (mapInstance) {
      const latitude = targetCell.lat;
      const longitude = targetCell.lng;

      // Clean up old location pin if exists
      if (userMarkerRef.current) {
        try {
          mapInstance.removeLayer(userMarkerRef.current);
        } catch (err) {
          console.warn("Failed to remove old user marker", err);
        }
      }

      const userIcon = (window as any).L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex flex-col items-center justify-center">
            <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400/40 opacity-75"></span>
            <span class="animate-pulse absolute inline-flex h-6 w-6 rounded-full bg-emerald-500/20"></span>
            <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-xl shadow-emerald-950/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-emerald-400">
                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = (window as any).L.marker([latitude, longitude], { 
        icon: userIcon,
        draggable: false 
      })
        .addTo(mapInstance)
        .bindTooltip(`<div class="bg-slate-950 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded border border-emerald-800">🏡 Selected Fan Location</div>`, {
          permanent: false,
          direction: 'top',
          opacity: 0.95
        });

      userMarkerRef.current = userMarker;

      setToast({
        message: "Home Location Set! 🏠",
        description: `Marked Sector ${selectedTileId} as your local physical coordinates base.`,
        type: "success"
      });
    }
  };

  // Update user's GPS coords marker, line connection, nearest tile selection, and toast indicators
  const handleUpdateGPSTrackedLocation = (latitude: number, longitude: number, accuracy: number | null, customLabel?: string, forceFly: boolean = true) => {
    // Nearest tile grid matcher using spatial grid lookup
    const closestResult = findClosestCell(latitude, longitude);
    const closestCell = closestResult ? closestResult.cell : null;
    const minDistance = closestResult ? closestResult.distance : Infinity;

    const isOutsideKerala = minDistance > 1.44; // Kerala boundary threshold
    let finalLat = latitude;
    let finalLng = longitude;
    let locationSource = customLabel || 'Fan Location';

    if (isOutsideKerala && closestCell) {
      finalLat = closestCell.lat;
      finalLng = closestCell.lng;
      locationSource = `${locationSource} (Aligned inside Kerala)`;
    }

    setCurrentGPSCoords({ lat: finalLat, lng: finalLng, accuracy });
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    // Clean up old location pin if exists
    if (userMarkerRef.current) {
      try {
        mapInstance.removeLayer(userMarkerRef.current);
      } catch (err) {
        console.warn("Failed to remove old user marker", err);
      }
    }

    // Clean up old connection lines if any
    if (overlayLayersRef.current && overlayLayersRef.current.length > 0) {
      overlayLayersRef.current.forEach((layer: any) => {
        try {
          mapInstance.removeLayer(layer);
        } catch (e) {
          console.warn("Could not clean old line", e);
        }
      });
      overlayLayersRef.current = [];
    }

    // Place the user location marker EXACTLY at coordinates
    const userIcon = (window as any).L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="relative flex flex-col items-center justify-center">
          <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400/40 opacity-75"></span>
          <span class="animate-pulse absolute inline-flex h-6 w-6 rounded-full bg-emerald-500/20"></span>
          <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-xl shadow-emerald-950/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-emerald-400">
              <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const userMarker = (window as any).L.marker([finalLat, finalLng], { 
      icon: userIcon,
      draggable: false 
    })
      .addTo(mapInstance)
      .bindTooltip(`<div class="bg-slate-950 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded border border-emerald-800">🏡 ${locationSource} (±${accuracy ? Math.round(accuracy) : '?'}m)</div>`, {
        permanent: false,
        direction: 'top',
        opacity: 0.95
      });
    userMarkerRef.current = userMarker;

    if (forceFly) {
      mapInstance.flyTo([finalLat, finalLng], 14, { animate: true, duration: 1.5 });
    }

    if (closestCell) {
      const cellId = closestCell.id;
      const cellData = tiles[cellId] || { id: cellId, team: 'None', photo: '', chats: [] };
      triggerTileSelection(cellId, cellData);

      if (isOutsideKerala) {
        setToast({
          message: "Matched inside Kerala! ⚽⛰️",
          description: `Telemetry adjusted: since your location is outside Kerala, we matched you to nearest Sector ${cellId}!`,
          type: "success"
        });
      } else {
        setToast({
          message: "Located successfully! 📍",
          description: `Matched to Sector ${cellId}! GPS accuracy: ${accuracy ? Math.round(accuracy) : '?'}m`,
          type: "success"
        });
      }
    }
  };

  // Toggle Live continuous watchPosition stream
  const toggleLiveGPSTracking = () => {
    if (isGPSTrackingActive) {
      // Deactivate
      if (gpsWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      setIsGPSTrackingActive(false);
      setUsingSimulatedGPS(false);
      setCurrentGPSCoords(null);
      setToast({
        message: "Live GPS Blocked 📡",
        description: "Continuous real-time tracking has been successfully paused.",
        type: "info"
      });
    } else {
      // Activate
      if (!navigator.geolocation) {
        setToast({
          message: "GPS Offline",
          description: "Your browser doesn't support HTML5 Geolocation API.",
          type: "warning"
        });
        return;
      }

      setIsGPSTrackingActive(true);
      setUsingSimulatedGPS(false);
      triedLowAccuracyRef.current = false;
      
      setToast({
        message: "Live Geolocation Tracker Active 📡",
        description: "Establishing real-time high-precision physical coordinates feed...",
        type: "info"
      });

      const startWatching = (highAccuracy: boolean) => {
        if (gpsWatchIdRef.current !== null) {
          navigator.geolocation.clearWatch(gpsWatchIdRef.current);
          gpsWatchIdRef.current = null;
        }

        const onWatchSuccess = (position: GeolocationPosition) => {
          const { latitude, longitude, accuracy } = position.coords;
          // Continuous updates directly stream to map
          handleUpdateGPSTrackedLocation(latitude, longitude, accuracy, "Live physical GPS feed", true);
        };

        const onWatchError = (error: GeolocationPositionError) => {
          console.warn(`Live GPS Watch (highAccuracy=${highAccuracy}) got error:`, error);
          
          if (highAccuracy && !triedLowAccuracyRef.current) {
            triedLowAccuracyRef.current = true;
            console.log("Retrying clean tracking stream with low accuracy geolocation...");
            startWatching(false);
            return;
          }

          let errorMsg = "Physical location signal is unavailable.";
          if (error && error.code === error.PERMISSION_DENIED) {
            errorMsg = "Coordinates blocked. Enable GPS permissions in address bar.";
          } else if (error && error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = "Location sensor error.";
          } else if (error && error.code === error.TIMEOUT) {
            errorMsg = "GPS signal query timed out.";
          }

          setToast({
            message: "Live GPS Signal Sandboxed 📡",
            description: `${errorMsg} Transitioning to precise network IP localization bypass...`,
            type: "warning"
          });

          // Failover once to IP location
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(ipData => {
              if (ipData && typeof ipData.latitude === 'number' && typeof ipData.longitude === 'number') {
                handleUpdateGPSTrackedLocation(ipData.latitude, ipData.longitude, 5000, "Network Resolved IP Proxy", true);
              } else {
                throw new Error();
              }
            })
            .catch(() => {
              // Try backup ipinfo
              fetch('https://ipinfo.io/json')
                .then(res => {
                  if (!res.ok) throw new Error();
                  return res.json();
                })
                .then(ipInfoData => {
                  if (ipInfoData && ipInfoData.loc) {
                    const parts = ipInfoData.loc.split(',');
                    const lat = parseFloat(parts[0]);
                    const lng = parseFloat(parts[1]);
                    handleUpdateGPSTrackedLocation(lat, lng, 8000, "Network Resolved IP Proxy (Backup)", true);
                  } else {
                    throw new Error();
                  }
                })
                .catch(() => {
                  // Precise stadium center
                  handleUpdateGPSTrackedLocation(10.4505, 76.2711, 10000, "Simulated Kerala Stadium Center", true);
                });
            });
        };

        gpsWatchIdRef.current = navigator.geolocation.watchPosition(
          onWatchSuccess,
          onWatchError,
          {
            enableHighAccuracy: highAccuracy,
            timeout: highAccuracy ? 5000 : 10000,
            maximumAge: highAccuracy ? 0 : 30000
          }
        );
      };

      // Try with high accuracy first
      startWatching(true);
    }
  };

  // Safe manual GPS Simulation Hotspot override for cloud testing environments
  const handleSimulateGPSCoordinates = (latitude: number, longitude: number, name: string) => {
    // Stop raw hardware GPS watch to prevent overriding
    if (gpsWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      gpsWatchIdRef.current = null;
    }
    
    setIsGPSTrackingActive(true);
    setUsingSimulatedGPS(true);

    handleUpdateGPSTrackedLocation(latitude, longitude, 5, `Simulated Match GPS: ${name}`, true);

    setToast({
      message: "GPS Simulated 🏟️",
      description: `Warped simulated player coordinates to ${name}!`,
      type: "success"
    });
  };

  // Locate User (Quick button action - triggers live streaming watch)
  const handleLocateUser = () => {
    toggleLiveGPSTracking();
  };

  // Team claim submission triggers slot deduction or simulated slot checkout
  const handleTeamClaimRequest = (chosenTeam: TeamChoice) => {
    if (chosenTeam === 'None') {
      // Revert/free up the tile
      const activeData = tiles[selectedTileId!];
      if (activeData) {
        updateTileInState(selectedTileId!, {
          ...activeData,
          team: 'None',
          claimedBy: undefined
        });
        setTempTeam('None');
        setToast({
          message: "Stake Released! 🏳️",
          description: `Sector ${selectedTileId!} set back to Neutral.`,
          type: "info"
        });
      }
      return;
    }

    const activeData = tiles[selectedTileId!] || { id: selectedTileId!, team: 'None', photo: '', chats: [] };
    const isMine = activeData.claimedBy === (loggedInUser ? loggedInUser.username : 'Guest');

    if (isMine) {
      // If it's already mine, I can freely change support country for free!
      const allMergedIds = (activeData.mergedWith && activeData.mergedWith.length > 0) ? activeData.mergedWith : [selectedTileId!];
      const bulk: Record<string, TileData> = {};
      allMergedIds.forEach(id => {
        const orig = tiles[id] || { id, team: 'None', photo: '', chats: [] };
        bulk[id] = {
          ...orig,
          team: chosenTeam
        };
      });
      updateTilesBatch(bulk);

      setTempTeam(chosenTeam);
      setToast({
        message: "Support Country Switched! 🚩",
        description: `Successfully updated your region's support allegiance to ${chosenTeam}!`,
        type: "success"
      });
    } else {
      // Keep track of what we are claiming
      setPendingTeam(chosenTeam);
      const allMergedIds = (activeData.mergedWith && activeData.mergedWith.length > 0) ? activeData.mergedWith : [selectedTileId!];
      const isMulti = allMergedIds.length > 1;
      setIsMultiSelectCheckout(isMulti);
      
      if (isMulti) {
        setSlotPurchaseCount(allMergedIds.length);
      } else {
        if (freeSlots > 0) {
          setSlotPurchaseCount(0);
        } else {
          setSlotPurchaseCount(1);
        }
      }
      setShowPaymentModal(true);
    }
  };

  // Success Mock Payment handler - processes simulated cash/Rupee tile purchases!
  const executeSimulatedPayment = () => {
    const qty = slotPurchaseCount || 1;
    const basePrice = qty * 10;
    const discountPct = qty > 10 ? 10 : 0;
    const discountVal = basePrice * (discountPct / 100);
    const finalPrice = basePrice - discountVal;

    // If it was a multi-selected checkout, immediately complete the batch simulated payment and close the modal!
    if (isMultiSelectCheckout && pendingTeam !== 'None') {
      executeBatchSimulatedPayment(pendingTeam);
      setShowPaymentModal(false);
      setSelectedTileId(null);
      setIsMultiSelectMode(false);
      setMultiSelectedTileIds([]);
      return;
    }

    // Otherwise, claim the single tile directly using Simulated Cash
    if (pendingTeam !== 'None' && selectedTileId) {
      const activeData = tiles[selectedTileId] || {
        id: selectedTileId,
        team: 'None',
        photo: '',
        chats: []
      };

      const ownerName = loggedInUser ? loggedInUser.username : 'Guest';
      const botMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        user: 'System Referee 📣',
        text: `Claimed tile for ${TEAM_STYLES[pendingTeam]?.flagEmoji || '🏳️'} ${pendingTeam} using Simulated Payment of ₹${finalPrice.toFixed(2)}! ⚡ (Owner: @${ownerName})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      updateTileInState(selectedTileId, {
        ...activeData,
        team: pendingTeam,
        claimedBy: ownerName,
        chats: [...(activeData.chats || []), botMessage],
        lastClaimedAt: new Date().toLocaleString()
      });

      setTempTeam(pendingTeam);

      setToast({
        message: "Territory Secured! 🗺️💳",
        description: `Sector ${selectedTileId} claimed! Simulated transaction of ₹${finalPrice.toFixed(2)} complete.${qty > 10 ? ' (Includes 10% bulk discount!)' : ''}`,
        type: "success"
      });
    }

    setShowPaymentModal(false);
    setSelectedTileId(null);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
  };

  // Claim multi-selected tiles using earned predictions Gift Tiles
  const executeBatchGiftTileClaim = (targetTeam: TeamChoice) => {
    const activeData = selectedTileId ? tiles[selectedTileId] : null;
    const targetTileIds = (isMultiSelectMode && multiSelectedTileIds.length > 0)
      ? multiSelectedTileIds
      : (activeData && activeData.mergedWith && activeData.mergedWith.length > 0)
        ? activeData.mergedWith
        : (selectedTileId ? [selectedTileId] : []);
    const N = targetTileIds.length;
    const cost = N;

    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';

    let next: Record<string, TileData> = {};
    setTiles(prev => {
      const copy = { ...prev };
      targetTileIds.forEach(id => {
        const currentData = copy[id] || { id, team: 'None', photo: '', chats: [] };
        
        const botMessage: ChatMessage = {
          id: `sys-batch-${Date.now()}-${id}`,
          user: 'System Referee 📣',
          text: `Claimed in batch/merged for ${TEAM_STYLES[targetTeam]?.flagEmoji || '🏳️'} ${targetTeam} using Gift Tiles! 🚀 (Owner: @${ownerName})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        copy[id] = {
          ...currentData,
          team: targetTeam,
          claimedBy: ownerName,
          chats: [...(currentData.chats || []), botMessage],
          lastClaimedAt: new Date().toLocaleString()
        };
      });

      next = copy;
      latestTilesRef.current = copy;
      saveClaimedTiles(copy);

      // Sync gift tile claims to Supabase
      targetTileIds.forEach(id => {
        if (copy[id]) {
          dbSaveTile(id, copy[id]);
        }
      });

      // Log batch claim to Audit Trail
      dbAddActivityLog({
        username: ownerName,
        action_type: 'claim',
        description: `Batch gifted-claimed ${N} Sectors for ${targetTeam} (${targetTileIds.slice(0, 5).join(', ')}${N > 5 ? '...' : ''})`
      }).then(() => { if (showAdminPanel) reloadActivityLogs(); });

      return copy;
    });

    setToast({
      message: `${N} Sectors Secured! 🎉`,
      description: `Successfully claimed all ${N} selected sectors for ${targetTeam}! Deducted ${cost.toFixed(1)} Gift Tiles.`,
      type: "success"
    });

    setTempTeam(targetTeam);
    setSelectedTileId(null);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
    if (isMobile) {
      setMobileSheetState('expanded');
    }
    updateVisibleGrid(next);
  };

  // Claim Tile using earned prediction Gift Tiles
  const executeGiftTilePayment = () => {
    const cost = isMultiSelectCheckout ? slotPurchaseCount : 1;
    if (giftTiles < cost) {
      setToast({
        message: "Insufficient Gift Tiles! ⚠️",
        description: `You need ${cost} Gift Tiles but only have ${giftTiles.toFixed(1)} Tiles left. Play Daily Predictions to earn more!`,
        type: "warning"
      });
      return;
    }

    const nextGiftTiles = parseFloat((giftTiles - cost).toFixed(2));
    setGiftTiles(nextGiftTiles);
    localStorage.setItem('kerala_gift_tiles_balance', nextGiftTiles.toString());

    if (isMultiSelectCheckout && pendingTeam !== 'None') {
      executeBatchGiftTileClaim(pendingTeam);
      setShowPaymentModal(false);
      setSelectedTileId(null);
      setIsMultiSelectMode(false);
      setMultiSelectedTileIds([]);
      return;
    }

    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';
    const activeData = tiles[selectedTileId!] || {
      id: selectedTileId!,
      team: 'None',
      photo: '',
      chats: []
    };
    
    const botMessage: ChatMessage = {
      id: `sys-${Date.now()}`,
      user: 'System Referee 📣',
      text: `Claimed tile for ${TEAM_STYLES[pendingTeam]?.flagEmoji || '🏳️'} ${pendingTeam} using ${cost.toFixed(1)} Gift Tiles! 🔥 (Owner: @${ownerName})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = [...(activeData.chats || []), botMessage];

    updateTileInState(selectedTileId!, {
      ...activeData,
      team: pendingTeam,
      claimedBy: ownerName,
      chats: updatedChats,
      lastClaimedAt: new Date().toLocaleString()
    });

    setTempTeam(pendingTeam);

    setToast({
      message: "Sector Claimed! 🎉",
      description: `Sector ${selectedTileId} claimed! Deducted ${cost.toFixed(1)} Gift Tiles. Remaining balance: ${nextGiftTiles.toFixed(1)} Tiles.`,
      type: "success"
    });
    setShowPaymentModal(false);
    setSelectedTileId(null);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
  };

  // Claim Tile using earned prediction slots
  const executeFreeSlotPayment = () => {
    if (freeSlots <= 0) return;
    const nextFreeSlots = freeSlots - 1;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    const activeData = tiles[selectedTileId!] || {
      id: selectedTileId!,
      team: 'None',
      photo: '',
      chats: []
    };
    
    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';
    const botMessage: ChatMessage = {
      id: `sys-${Date.now()}`,
      user: 'System Referee 📣',
      text: `Claimed tile for ${TEAM_STYLES[pendingTeam]?.flagEmoji || '🏳️'} ${pendingTeam} for FREE using a Daily Prediction Slot! 🔥 VALE! (Owner: @${ownerName})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = [...(activeData.chats || []), botMessage];

    updateTileInState(selectedTileId!, {
      ...activeData,
      team: pendingTeam,
      claimedBy: ownerName,
      chats: updatedChats,
      lastClaimedAt: new Date().toLocaleString()
    });

    setTempTeam(pendingTeam);

    setToast({
      message: "Slot Redeemed! 🎉",
      description: `Sector ${selectedTileId} claimed using 1 Slot! It now belongs to you. You have ${nextFreeSlots} slots left.`,
      type: "success"
    });
    setShowPaymentModal(false);
  };

  // Claim multi-selected tiles using earned prediction slots
  const executeBatchFreeSlotPayment = (targetTeam: TeamChoice) => {
    const activeData = selectedTileId ? tiles[selectedTileId] : null;
    const targetTileIds = (isMultiSelectMode && multiSelectedTileIds.length > 0)
      ? multiSelectedTileIds
      : (activeData && activeData.mergedWith && activeData.mergedWith.length > 0)
        ? activeData.mergedWith
        : (selectedTileId ? [selectedTileId] : []);
    const N = targetTileIds.length;
    if (freeSlots < N) {
      setToast({
        message: "Insufficient Slots! ⚠️",
        description: `You need ${N} slots but only have ${freeSlots} slots left. Play trivia or prediction to earn more!`,
        type: "warning"
      });
      return;
    }

    const nextFreeSlots = freeSlots - N;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';

    let next: Record<string, TileData> = {};
    setTiles(prev => {
      const copy = { ...prev };
      targetTileIds.forEach(id => {
        const currentData = copy[id] || { id, team: 'None', photo: '', chats: [] };
        
        const botMessage: ChatMessage = {
          id: `sys-batch-${Date.now()}-${id}`,
          user: 'System Referee 📣',
          text: `Claimed in batch/merged for ${TEAM_STYLES[targetTeam]?.flagEmoji || '🏳️'} ${targetTeam} using a Daily Prediction Slot! 🚀 (Owner: @${ownerName})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        copy[id] = {
          ...currentData,
          team: targetTeam,
          claimedBy: ownerName,
          chats: [...(currentData.chats || []), botMessage],
          lastClaimedAt: new Date().toLocaleString()
        };
      });

      next = copy;
      latestTilesRef.current = copy;
      saveClaimedTiles(copy);

      // Sync prediction slot batch claims to Supabase
      targetTileIds.forEach(id => {
        if (copy[id]) {
          dbSaveTile(id, copy[id]);
        }
      });

      return copy;
    });

    setToast({
      message: `${N} Sectors Secured! 🎉`,
      description: `Successfully claimed all ${N} selected sectors for ${targetTeam}! Used ${N} slot tokens.`,
      type: "success"
    });

    setTempTeam(targetTeam);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
    if (isMobile) {
      setMobileSheetState('expanded');
    }
    updateVisibleGrid(next);
  };

  // Simulated cash checkout for multiple selected tiles
  const executeBatchSimulatedPayment = (targetTeam: TeamChoice) => {
    const activeData = selectedTileId ? tiles[selectedTileId] : null;
    const targetTileIds = (isMultiSelectMode && multiSelectedTileIds.length > 0)
      ? multiSelectedTileIds
      : (activeData && activeData.mergedWith && activeData.mergedWith.length > 0)
        ? activeData.mergedWith
        : (selectedTileId ? [selectedTileId] : []);
    const N = targetTileIds.length;
    const basePrice = N * 10;
    const bulkDiscountPct = N > 10 ? 10 : 0;
    const bulkDiscountVal = basePrice * (bulkDiscountPct / 100);
    const finalBatchPrice = basePrice - bulkDiscountVal;

    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';

    let next: Record<string, TileData> = {};
    setTiles(prev => {
      const copy = { ...prev };
      targetTileIds.forEach(id => {
        const currentData = copy[id] || { id, team: 'None', photo: '', chats: [] };
        
        const botMessage: ChatMessage = {
          id: `sys-batch-${Date.now()}-${id}`,
          user: 'System Referee 📣',
          text: `Secured in batch/merged for ${TEAM_STYLES[targetTeam]?.flagEmoji || '🏳️'} ${targetTeam}! Simulated payment of ₹${(finalBatchPrice / N).toFixed(2)} completed. 🚀 (Owner: @${ownerName})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        copy[id] = {
          ...currentData,
          team: targetTeam,
          claimedBy: ownerName,
          chats: [...(currentData.chats || []), botMessage],
          lastClaimedAt: new Date().toLocaleString()
        };
      });

      next = copy;
      latestTilesRef.current = copy;
      saveClaimedTiles(copy);

      // Sync cash transaction claims to Supabase
      targetTileIds.forEach(id => {
        if (copy[id]) {
          dbSaveTile(id, copy[id]);
        }
      });

      // Log batch claim to Audit Trail
      dbAddActivityLog({
        username: ownerName,
        action_type: 'claim',
        description: `Batch payment-claimed ${N} Sectors for ${targetTeam} (${targetTileIds.slice(0, 5).join(', ')}${N > 5 ? '...' : ''})`
      }).then(() => { if (showAdminPanel) reloadActivityLogs(); });

      return copy;
    });

    setToast({
      message: "Batch Payment Successful! 💳✨",
      description: `Simulated checkout completed! Claimed ${N} sectors for ${targetTeam} for ₹${finalBatchPrice}.00.`,
      type: "success"
    });

    setTempTeam(targetTeam);
    setSelectedTileId(null);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
    if (isMobile) {
      setMobileSheetState('expanded');
    }
    updateVisibleGrid(next);
  };

  // Forcefully reclaim sector from other user using 1 slot
  const handleReclaimTerritory = (tileId: string) => {
    if (freeSlots <= 0) {
      // Trigger payment dialog to purchase 1 slot to allow reclamation
      setPendingTeam(loggedInUser ? (loggedInUser.favoriteClub as TeamChoice) : 'Argentina');
      setIsMultiSelectCheckout(false);
      setSlotPurchaseCount(1);
      setShowPaymentModal(true);
      setToast({
        message: "No Slots Available! 🪙",
        description: "Purchase 1 Slot to initiate territory reclamation!",
        type: "info"
      });
      return;
    }

    const nextFreeSlots = freeSlots - 1;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    const activeData = tiles[tileId] || { id: tileId, team: 'None', photo: '', chats: [] };
    const userTeam = loggedInUser ? (loggedInUser.favoriteClub as TeamChoice) : 'Argentina';
    const ownerName = loggedInUser ? loggedInUser.username : 'Guest';

    const botMessage: ChatMessage = {
      id: `sys-reclaim-${Date.now()}`,
      user: 'System Referee 📣',
      text: `@${ownerName} has forcefully CONQUERED this territory using 1 Claim Slot! Previous allegiance overthrown! ⚔️`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateTileInState(tileId, {
      ...activeData,
      team: userTeam,
      claimedBy: ownerName,
      chats: [...(activeData.chats || []), botMessage],
      lastClaimedAt: new Date().toLocaleString()
    });

    setTempTeam(userTeam);

    setToast({
      message: "Territory Overthrown! ⚔️🏁",
      description: `Sector ${tileId} successfully captured! You can now edit its support country and photos.`,
      type: "success"
    });
  };

  // Confirm match outcome prediction and trigger simulated review
  const handleConfirmPrediction = (matchId: string, choice: string) => {
    setIsVerifyingPrediction(matchId);

    // Initialise simulation status
    const initialPred = { ...predictions, [matchId]: { choice, status: 'simulating' as 'simulating' } };
    setPredictions(initialPred);
    localStorage.setItem('kerala_submitted_predictions_v3', JSON.stringify(initialPred));
    
    setTimeout(() => {
      // Simulate outcome - High win-rate (80%) for fun engagement
      const isWinner = Math.random() < 0.8;
      const finalStatus = isWinner ? ('won' as const) : ('lost' as const);

      const finalPred = { ...predictions, [matchId]: { choice, status: finalStatus } };
      setPredictions(finalPred);
      localStorage.setItem('kerala_submitted_predictions_v3', JSON.stringify(finalPred));

      setIsVerifyingPrediction(null);
      setToast({
        message: isWinner ? "Prediction Successful! 🎯" : "Prediction Missed! ⚽",
        description: isWinner
          ? `Your prediction for ${choice} was correct! Press 'Claim Free Slot' to secure your reward!`
          : `That was close! The match simulated in another favor. Try another fixture!`,
        type: isWinner ? "success" : "info"
      });
    }, 1500);
  };

  // Claim earned reward slots from successful predictions
  const handleClaimPredictionReward = (matchId: string) => {
    const pred = predictions[matchId];
    if (!pred || pred.status !== 'won') return;

    // Update status to claimed
    const nextPredictions = {
      ...predictions,
      [matchId]: { ...pred, status: 'claimed' as 'claimed' }
    };
    setPredictions(nextPredictions);
    localStorage.setItem('kerala_submitted_predictions_v3', JSON.stringify(nextPredictions));

    // Base Reward: 0.2 Tiles per correct guess
    let tilesAwarded = 0.2;
    let message = "Gift Tiles Claimed! 🎁";
    let description = "Successfully claimed +0.2 Gift Tiles! Use them to pay for your next sector claim.";

    // Check if 100% of the day's matches (match1, match2, match3) are guessed correctly (won or claimed)
    // Daily Bonus: 0.5 Tiles if 100% of the day's matches are guessed correctly.
    const m1 = nextPredictions['match1'];
    const m2 = nextPredictions['match2'];
    const m3 = nextPredictions['match3'];

    const allCorrect = 
      m1 && (m1.status === 'won' || m1.status === 'claimed') &&
      m2 && (m2.status === 'won' || m2.status === 'claimed') &&
      m3 && (m3.status === 'won' || m3.status === 'claimed');

    let dailyBonusAwarded = false;
    if (allCorrect) {
      const bonusKey = 'kerala_daily_bonus_applied_v3';
      const alreadyClaimedBonus = localStorage.getItem(bonusKey) === 'true';
      if (!alreadyClaimedBonus) {
        tilesAwarded += 0.5;
        dailyBonusAwarded = true;
        localStorage.setItem(bonusKey, 'true');
      }
    }

    const nextGiftTiles = parseFloat((giftTiles + tilesAwarded).toFixed(2));
    setGiftTiles(nextGiftTiles);
    localStorage.setItem('kerala_gift_tiles_balance', nextGiftTiles.toString());

    // Keep freeSlots as secondary/legacy claim token
    const nextFreeSlots = freeSlots + 1;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    if (dailyBonusAwarded) {
      message = "🎉 100% Daily Bonus Achieved! 🏆";
      description = `Earned +0.2 Base Reward +0.5 Daily Bonus! Total +0.7 Gift Tiles added to your wallet. Balance: ${nextGiftTiles.toFixed(1)} Tiles.`;
    } else {
      description = `Earned +0.2 Gift Tiles! Current Balance: ${nextGiftTiles.toFixed(1)} Tiles.`;
    }

    setToast({
      message,
      description,
      type: "success"
    });
  };

  // Submit Login Credential Flow (Simulated Sandbox Auth)
  const handleUserLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    let delayLoadingDismissal = false;
    try {
      // Small simulated latency for realistic authentication interface feedback
      await new Promise(resolve => setTimeout(resolve, 20));
      const cleanEmail = loginEmail.trim();
      const cleanUsername = loginUsername.trim();
      const passwordInput = loginPassword.trim();

      if (!cleanEmail) {
        setToast({
          message: "Login Failed! ⚠️",
          description: "Please specify your registered Fan Email address.",
          type: "error"
        });
        return;
      }

      if (blockedUserEmails.includes(cleanEmail.toLowerCase())) {
        setToast({
          message: "Access Blocked! 🚫",
          description: "This email address is blocked by a Super Admin.",
          type: "error"
        });
        return;
      }

      // Check for Super Admin
      if (cleanEmail.toLowerCase() === 'admin@footballmap.com') {
        if (passwordInput === 'admin123') {
          const adminUser = {
            username: "SuperAdmin 👑",
            email: "admin@footballmap.com",
            favoriteClub: "None" as TeamChoice,
            isAdmin: true
          };
          setLoggedInUser(adminUser);
          localStorage.setItem('kerala_logged_in_user', JSON.stringify(adminUser));
          setShowLoginModal(false);
          setToast({
            message: "Super Admin Authenticated! 👑",
            description: "Welcome to the central moderator terminal. You now have full access to manage predictions, review images, delete claims, and block accounts.",
            type: "success"
          });
          return;
        } else {
          setToast({
            message: "Access Denied! ❌",
            description: "Incorrect password for the Super Admin account.",
            type: "error"
          });
          return;
        }
      }

      // If Supabase is configured, use real Auth
      if (isSupabaseConfigured) {
        setToast({
          message: "Authenticating with Supabase... 🔑",
          description: "Verifying credentials against cloud database...",
          type: "info"
        });

        const { user, error } = await dbSignIn(cleanEmail, passwordInput);
        if (error) {
          setToast({
            message: "Authentication Failed! ⚠️",
            description: error.message || "Incorrect email or password.",
            type: "error"
          });
          return;
        } else if (user) {
          setLoggedInUser(user);
          localStorage.setItem('kerala_logged_in_user', JSON.stringify(user));
          
          // Sync registration list locally
          const updatedList = registeredUsers.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
          const withCurrent = [...updatedList, { username: user.username, email: user.email, favoriteClub: user.favoriteClub, picture: user.picture }];
          setRegisteredUsers(withCurrent);
          localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(withCurrent));
          
          setShowLoginModal(false);
          setToast({
            message: `Welcome back, @${user.username}! ⚽`,
            description: "Your session and territories are synced with Supabase cloud auth.",
            type: "success"
          });
          return;
        }
      }

      // Standard User lookup
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (foundUser) {
        if (foundUser.password && foundUser.password !== passwordInput) {
          setToast({
            message: "Authentication Failed! ⚠️",
            description: "Incorrect security PIN or password.",
            type: "error"
          });
          return;
        }

        // Check if email verification is required
        if (foundUser.emailVerified === false) {
          setVerificationEmail(foundUser.email);
          delayLoadingDismissal = true;
          setShowVerificationPopup(true);
          setShowLoginModal(false);
          setToast({
            message: "Verification Required! ✉️",
            description: "Please check your inbox to verify your account address.",
            type: "warning"
          });
          setTimeout(() => {
            setIsAuthLoading(false);
          }, 500); // Loader persists until popup is fully rendered on screen
          return;
        }

        const sessionUser = {
          username: foundUser.username,
          email: foundUser.email,
          favoriteClub: foundUser.favoriteClub as TeamChoice,
          picture: foundUser.picture
        };
        setLoggedInUser(sessionUser);
        localStorage.setItem('kerala_logged_in_user', JSON.stringify(sessionUser));
        dbUpsertUser(sessionUser); // Sync standard login update to Supabase
        setShowLoginModal(false);
        setToast({
          message: `Welcome back, @${foundUser.username}! ⚽`,
          description: "Your session and territories are synced.",
          type: "success"
        });
      } else {
        // Auto register on first login fallback if password set
        const generatedUsername = cleanUsername || (cleanEmail.split('@')[0] + "_fan");
        const newUser = {
          username: generatedUsername,
          email: cleanEmail,
          password: passwordInput || 'user123',
          favoriteClub: loginFavClub,
          picture: '',
          emailVerified: false // Unverified upon auto registration
        };

        const nextUsersList = [...registeredUsers, newUser];
        setRegisteredUsers(nextUsersList);
        localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
        dbUpsertUser(newUser); // Register auto-fallback user in Supabase

        setVerificationEmail(cleanEmail);
        delayLoadingDismissal = true;
        setShowVerificationPopup(true);
        setShowLoginModal(false);
        setToast({
          message: "New Fan Registered! 🎉✉️",
          description: `Fan profile created for @${generatedUsername}. Please verify your email to log in.`,
          type: "info"
        });
        setTimeout(() => {
          setIsAuthLoading(false);
        }, 500); // Loader persists until popup is fully rendered on screen
      }
    } finally {
      if (!delayLoadingDismissal) {
        setIsAuthLoading(false);
      }
    }
  };

  // Submit Register Credential Flow
  const handleUserRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    let delayLoadingDismissal = false;
    try {
      // Small simulated network latency for premium interactive visual feedback
      await new Promise(resolve => setTimeout(resolve, 20));
      const cleanEmail = loginEmail.trim();
      const cleanUsername = loginUsername.trim();
      const passwordInput = loginPassword.trim();

      if (!cleanEmail || !cleanUsername || !passwordInput) {
        setToast({
          message: "Registration Failed! ⚠️",
          description: "Please provide a valid username, email, and security password/PIN.",
          type: "error"
        });
        return;
      }

      if (blockedUserEmails.includes(cleanEmail.toLowerCase())) {
        setToast({
          message: "Registration Blocked! 🚫",
          description: "This email address is banned.",
          type: "error"
        });
        return;
      }

      const emailExists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (emailExists) {
        setToast({
          message: "Account Already Exists! ⚠️",
          description: "A fan profile already exists with this email address. Please login instead.",
          type: "error"
        });
        return;
      }

      // Register with Supabase Auth if configured
      if (isSupabaseConfigured) {
        setToast({
          message: "Signing Up on Supabase... 🛡️",
          description: "Creating secure account in cloud backend...",
          type: "info"
        });

        const { user, error } = await dbSignUp(cleanEmail, passwordInput, cleanUsername, loginFavClub);
        if (error) {
          setToast({
            message: "Supabase Registration Failed! ⚠️",
            description: error.message || "An error occurred. Make sure your password has at least 6 characters.",
            type: "error"
          });
          return;
        }

        // Show secure email verification popup instructions
        setVerificationEmail(cleanEmail);
        delayLoadingDismissal = true;
        setShowVerificationPopup(true);
        setShowLoginModal(false);
        setTimeout(() => {
          setIsAuthLoading(false);
        }, 500); // Loader persists until popup is fully rendered on screen
        return;
      }

      const newUser = {
        username: cleanUsername,
        email: cleanEmail,
        password: passwordInput,
        favoriteClub: loginFavClub,
        picture: '',
        emailVerified: false // Required sandbox email verification
      };

      const nextUsersList = [...registeredUsers, newUser];
      setRegisteredUsers(nextUsersList);
      localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
      dbUpsertUser(newUser); // Synchronize new signup user profile to Supabase

      // Registration Rewards: 1 Free Slot is credited to their sandbox state balances config
      const nextFreeSlots = freeSlots + 1;
      setFreeSlots(nextFreeSlots);
      localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

      setVerificationEmail(cleanEmail);
      delayLoadingDismissal = true;
      setShowVerificationPopup(true);
      setShowLoginModal(false);
      setToast({
        message: "Verify Your Email! 📩⚽",
        description: `Fan profile built for @${cleanUsername}! Please check the verification prompt to verify.`,
        type: "info"
      });
      setTimeout(() => {
        setIsAuthLoading(false);
      }, 500); // Loader persists until popup is fully rendered on screen
    } finally {
      if (!delayLoadingDismissal) {
        setIsAuthLoading(false);
      }
    }
  };

  // User Sign Out Handler
  const handleUserLogout = async () => {
    if (isSupabaseConfigured) {
      await dbSignOut();
    }
    setLoggedInUser(null);
    localStorage.removeItem('kerala_logged_in_user');
    setToast({
      message: "Fan Logged Out! 👋",
      description: "You have returned to Guest mode. Your map actions are preserved.",
      type: "info"
    });
  };

  // Simulate verification confirmation for sandbox logs
  const handleSimulateVerification = async (email: string) => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 80));
      
      const stored = localStorage.getItem('kerala_registered_users_list_v4');
      let currentUsers = registeredUsers;
      if (stored) {
        try {
          currentUsers = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }

      const cleanEmail = email.trim().toLowerCase();
      const found = currentUsers.some(u => u.email.toLowerCase() === cleanEmail);
      
      let updatedUsersList;
      if (!found) {
        const fallbackUser = {
          username: email.split('@')[0] + "_fan",
          email: email.trim(),
          password: loginPassword.trim() || 'user123',
          favoriteClub: loginFavClub || 'None',
          picture: '',
          emailVerified: true
        };
        updatedUsersList = [...currentUsers, fallbackUser];
      } else {
        updatedUsersList = currentUsers.map(u => {
          if (u.email.toLowerCase() === cleanEmail) {
            return { ...u, emailVerified: true };
          }
          return u;
        });
      }

      setRegisteredUsers(updatedUsersList);
      localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(updatedUsersList));
      
      const verifiedUser = updatedUsersList.find(u => u.email.toLowerCase() === cleanEmail);
      if (verifiedUser) {
        dbUpsertUser(verifiedUser);
        
        // Log them in directly to enter maps/dashboard smoothly!
        const sessionUser = {
          username: verifiedUser.username,
          email: verifiedUser.email,
          favoriteClub: verifiedUser.favoriteClub as TeamChoice,
          picture: verifiedUser.picture || ''
        };
        setLoggedInUser(sessionUser);
        localStorage.setItem('kerala_logged_in_user', JSON.stringify(sessionUser));
        
        setToast({
          message: "Account Verified & Connected! 🏆✅",
          description: `Welcome @${verifiedUser.username}! Your profile has been activated and you are logged in successfully!`,
          type: "success"
        });
        
        setShowVerificationPopup(false);
        setIsRegisterMode(false);
        setShowLoginModal(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Quick Instant Sandbox Login
  const handleInstantDemoLogin = () => {
    const newUser = {
      username: "Simulated_Champion 🏆",
      email: "demo_champion@soccer.in",
      favoriteClub: "Argentina"
    };
    setLoggedInUser(newUser);
    localStorage.setItem('kerala_logged_in_user', JSON.stringify(newUser));

    // Gift 3 free slots if they were 0 to make demo fully testable
    if (freeSlots === 0) {
      setFreeSlots(3);
      localStorage.setItem('kerala_claimed_free_slots_count', '3');
    }

    setShowLoginModal(false);
    setToast({
      message: "Mock Demo Account Live! 🚀",
      description: "Instant access loaded with active Gift Tiles balance! Enjoy testing.",
      type: "success"
    });
  };

  // Google OAuth popup trigger with fallback sandbox support
  const handleGoogleSignInTrigger = async () => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 80));
      const rawClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
      const isSandbox = !rawClientId || rawClientId.trim() === '';
      
      const googleClientId = isSandbox
        ? '1089297833503-simulatedwebclient.apps.googleusercontent.com'
        : rawClientId.trim();
      
      const callbackPath = '/oauth-callback.html';
      const redirectUri = `${window.location.origin}${callbackPath}`;
      const scope = encodeURIComponent('openid email profile');
      const state = 'kerala_soccer';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&state=${state}`;
      
      if (isSandbox) {
        setToast({
          message: "Activating Google Sandbox 🧪",
          description: "Google Client ID is not specified in .env. Falling back to the popup simulator handler.",
          type: "info"
        });
      }

      setIsAuthLoading(false); // End loader when Google Sign In window/popup is triggered
      const authWindow = window.open(
        authUrl,
        'google_oauth_popup',
        'width=550,height=650,status=no,resizable=yes,scrollbars=yes'
      );
      
      if (!authWindow) {
        setToast({
          message: "Popup Blocked! ⚠️",
          description: "Please enable popups in your browser layout to run Google authentication.",
          type: "error"
        });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Release user tile from map coordinates registry
  const releaseUserTile = (tileId: string) => {
    const activeData = tiles[tileId];
    if (activeData) {
      updateTileInState(tileId, {
        ...activeData,
        team: 'None',
        claimedBy: undefined,
        customText: undefined,
        photo: ''
      });
      setToast({
        message: "Territory Vacated! 🏳️",
        description: `Sector ${tileId} has been returned to neutral status.`,
        type: "success"
      });
    }
  };

  // Chat message submission
  const postChatMessage = () => {
    const activeData = tiles[selectedTileId!];
    const textStr = chatInput.trim();
    if (!textStr || !activeData) return;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      user: customUser.trim() || 'SuperFan ⚽',
      text: textStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateTileInState(selectedTileId!, {
      ...activeData,
      chats: [...activeData.chats, newMsg]
    });

    setChatInput('');
  };

  // Photo uploading callback converting to base64 with automatic client-side compression under 100 KB
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear input value so selecting the same photo again triggers onChange event
    const targetInput = e.target;
    
    const activeData = tiles[selectedTileId!] || {
      id: selectedTileId!,
      team: 'None',
      photo: '',
      chats: []
    };

    // Try uploading to Supabase Storage if configured
    if (isSupabaseConfigured) {
      setToast({
        message: "Storing on Supabase... ☁️",
        description: "Uploading high-quality image to Supabase Storage cloud system...",
        type: "info"
      });

      const publicUrl = await dbUploadImage(file);
      if (publicUrl) {
        updateTileInState(selectedTileId!, {
          ...activeData,
          photo: publicUrl
        });

        setToast({
          message: "Uploaded to Cloud! 📸☁️",
          description: "Your map sector image overlay was saved securely to Supabase Storage.",
          type: "success"
        });
        targetInput.value = '';
        return;
      }
      
      console.log("[Supabase Sandbox]: Storage upload unconfigured or missing bucket, falling back to local base64 compression.");
    }

    try {
      const originalSizeKB = (file.size / 1024).toFixed(1);
      
      // If original is under 100 KB, just read with FileReader directly as requested
      if (file.size <= 100 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            updateTileInState(selectedTileId!, {
              ...activeData,
              photo: event.target.result as string
            });
            setToast({
              message: "Image Uploaded! 📸",
              description: `Loaded originally small image (${originalSizeKB} KB) under the 100 KB threshold.`,
              type: "success"
            });
          }
        };
        reader.readAsDataURL(file);
        targetInput.value = '';
        return;
      }

      // Otherwise, compress it on client-side
      setToast({
        message: "Optimizing Image... ⚙️",
        description: `Original size is ${originalSizeKB} KB. Compressing below 100 KB...`,
        type: "info"
      });

      const compressedBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          
          // CRITICAL: Register event handlers BEFORE assigning src to prevent synch-load race issues
          img.onload = () => {
            // Target dimensions max limit 1024px to ensure under 100 KB without excessive visual quality loss
            let width = img.width;
            let height = img.height;
            const maxDimension = 1024;
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(event.target?.result as string);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Step down quality or scaling to hit the 100 KB target limit
            let quality = 0.82;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            const targetBytes = 100 * 1024;

            // Approximate base64 string length to actual bytes:
            // base64 length is roughly 4/3 of the binary bytes. 
            // So target string length is about (100 * 1024) * 4 / 3 = 139,810 characters.
            const maxBase64Length = Math.round((targetBytes * 4) / 3);

            while (dataUrl.length > maxBase64Length && quality > 0.1) {
              quality -= 0.15;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            // If still too large, downscale canvas dimensions recursively as a safety fallback
            if (dataUrl.length > maxBase64Length) {
              const miniCanvas = document.createElement('canvas');
              miniCanvas.width = Math.round(width * 0.6);
              miniCanvas.height = Math.round(height * 0.6);
              const miniCtx = miniCanvas.getContext('2d');
              if (miniCtx) {
                miniCtx.drawImage(canvas, 0, 0, miniCanvas.width, miniCanvas.height);
                quality = 0.7;
                dataUrl = miniCanvas.toDataURL('image/jpeg', quality);
                while (dataUrl.length > maxBase64Length && quality > 0.1) {
                  quality -= 0.15;
                  dataUrl = miniCanvas.toDataURL('image/jpeg', quality);
                }
              }
            }

            resolve(dataUrl);
          };
          img.onerror = () => reject(new Error("Failed to load image element for compression"));
          
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read original uploading file"));
        reader.readAsDataURL(file);
      });

      // Calculate compressed estimated size in KB
      const compressedSizeKB = ((compressedBase64.length * 3) / (4 * 1024)).toFixed(1);

      updateTileInState(selectedTileId!, {
        ...activeData,
        photo: compressedBase64
      });

      setToast({
        message: "Image Compressed! 📸✨",
        description: `Successfully optimized size: ${originalSizeKB} KB ➔ ${compressedSizeKB} KB (Limit < 100 KB).`,
        type: "success"
      });
    } catch (error) {
      console.error("Compression error:", error);
      // Fallback: load normal file in case of canvas failure
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateTileInState(selectedTileId!, {
            ...activeData,
            photo: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
      setToast({
        message: "Upload Successful 📍",
        description: "Your map marker image overlay was saved with default parameters.",
        type: "success"
      });
    } finally {
      targetInput.value = '';
    }
  };

  // Global calculations for Leadboard statistics
  const getLeaderboardStats = () => {
    const tallies: Record<string, number> = {};
    WORLD_CUP_TEAMS.forEach(t => { tallies[t] = 0; });

    let claimedCount = 0;
    Object.values(tiles).forEach((item) => {
      const t = item as TileData;
      // Skip merged children to prevent double-counting
      if (t.isMergedChild) {
        return;
      }

      if (t.team !== 'None' && tallies[t.team] !== undefined) {
        // If it's a merged master, we count all of its constituent merged components
        const meshSize = (t.mergedWith && t.mergedWith.length > 0) ? t.mergedWith.length : 1;
        tallies[t.team] += meshSize;
        claimedCount += meshSize;
      }
    });

    return {
      tallies: Object.entries(tallies).sort((a, b) => b[1] - a[1]),
      tallyMap: tallies,
      claimedCount
    };
  };

  const getUserRankings = () => {
    const userTally: Record<string, number> = {};
    
    Object.values(tiles).forEach((item) => {
      const t = item as TileData;
      if (t.isMergedChild) {
        return;
      }
      if (t.team !== 'None') {
        const owner = t.claimedBy || 'Guest';
        const meshSize = (t.mergedWith && t.mergedWith.length > 0) ? t.mergedWith.length : 1;
        userTally[owner] = (userTally[owner] || 0) + meshSize;
      }
    });

    // Seeded local community players representing Kerala fandom
    const seededPlayers: Record<string, number> = {
      "Malabar_Maestro ⚽": 42,
      "Kochi_Kingpin 👑": 35,
      "Neymar_Senior_KL": 28,
      "Messi_Fan_Boyz": 24,
      "CR7_Almighty": 22,
      "Chembada_Capitano": 19,
      "Samba_Shouter": 15,
      "Selecao_Soldier": 12,
      "TikiTaka_Thampi": 10,
      "Kozhikode_Ultras 📣": 8,
    };

    const combined: Record<string, number> = { ...seededPlayers };
    Object.entries(userTally).forEach(([user, count]) => {
      combined[user] = (combined[user] || 0) + count;
    });

    const avatars = ["⚽", "🏃", "🏆", "🔥", "⚡", "🌟", "📣", "🦁", "👑", "🎯", "💫", "⚔️", "🛡️"];

    return Object.entries(combined)
      .map(([username, tilesCount]) => {
        let sum = 0;
        for (let i = 0; i < username.length; i++) {
          sum += username.charCodeAt(i);
        }
        const avatarEmoji = avatars[sum % avatars.length];
        return {
          username,
          tiles: tilesCount,
          avatarEmoji
        };
      })
      .sort((a, b) => b.tiles - a.tiles);
  };

  const { tallies, tallyMap, claimedCount } = getLeaderboardStats();

  return (
    <div className="relative w-full h-screen bg-[#0b0f19] text-white font-sans overflow-hidden select-none">
      
      {/* Dynamic Popup Notification Toast removed as requested */}

      {/* 1. Left Immersive Map Container */}
      <div 
        ref={mapContainerRef} 
        id="map" 
        className={`w-full h-full z-0 transition-opacity duration-300 absolute inset-0 ${activePage === 'map' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${isMultiSelectMode && multiSelectTool === 'box' ? 'multi-select-box-tool-active' : ''}`}
        style={{ opacity: isLoading ? 0.3 : 1 }}
      />

      {/* Loading Overlay spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0f19]/80 z-40 backdrop-blur-md">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute border-4 border-emerald-500/20 border-t-emerald-500 rounded-full w-full h-full animate-spin" />
            <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
          </div>
          <h2 className="mt-6 text-xl font-semibold tracking-wide text-white">Mapping Football Passion...</h2>
          <p className="text-gray-400 text-sm mt-2 font-mono">Generating regional fan mesh indices (242,827 high-resolution tiles)</p>
        </div>
      )}

      {/* Wrap map overlay containers inside condition */}
      {activePage === 'map' && (
        <>
          {/* 2. Top-Left Floating Branding Header */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-auto z-10 max-w-full md:max-w-md pointer-events-none">
        <div className={`pointer-events-auto bg-slate-950/60 border border-slate-800/40 rounded-2xl shadow-[0_12px_45px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl ring-1 ring-white/5 flex flex-col transition-all duration-300 ${isHeaderCollapsed ? 'p-3 md:p-3.5 gap-0' : 'p-4 md:p-5 gap-3'}`}>
          
          {/* Animated Soccer Joggle Rivalry Loop */}
          {!isHeaderCollapsed && (
            <div className="w-full mb-1">
              <CharacterAnimationLoop />
            </div>
          )}

          {/* Dynamic Unified Header with Login Option */}
          <div 
            onClick={() => setIsHeaderCollapsed(prev => !prev)}
            className={`flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
              isHeaderCollapsed ? 'pb-0' : 'border-b border-slate-900 pb-3'
            }`}
            title="Click or tap to expand details"
          >
            <div>
              <h1 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                Football Map
                {isHeaderCollapsed ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </h1>
              <span className="text-[10px] md:text-[11px] text-emerald-400 font-mono tracking-wider uppercase font-semibold block mt-1">
                Fan Grid Territory
              </span>
            </div>

            {/* Account Status Badge & My Tiles section */}
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMyTerritoriesModal(true);
                }}
                className="px-2.5 py-1.5 btn-interactive bg-gradient-to-tr from-amber-500/10 to-amber-500/20 hover:from-amber-500/20 hover:to-amber-500/30 text-[10px] text-amber-400 font-extrabold rounded-xl border border-amber-500/30 hover:border-amber-400/50 cursor-pointer flex items-center gap-1 transition-all uppercase font-mono tracking-wide shrink-0"
                title="View my claimed tiles and go to their location"
                id="my-tiles-header-btn"
              >
                <Map className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span>My Tiles ({Object.values(tiles).filter((t: any) => t.claimedBy === (loggedInUser?.username || 'Guest') && !t.isMergedChild).length})</span>
              </button>

              {loggedInUser ? (
                <div 
                  className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 pl-2 pr-1 py-1 rounded-xl shrink-0 animate-fade-in"
                >
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-slate-200 leading-none truncate max-w-[80px]" title={loggedInUser.username}>
                      {loggedInUser.username}
                    </div>
                    <div className="text-[8px] text-teal-400 font-mono leading-none mt-0.5 font-bold uppercase font-semibold">
                      {freeSlots} Slots
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserLogout();
                    }}
                    className="p-1 btn-interactive bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                    title="Log Out of Fan Club"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRegisterMode(false);
                      setShowLoginModal(true);
                    }}
                    className="px-2.5 py-1.5 btn-interactive bg-slate-900 hover:bg-slate-850 text-[10px] text-amber-400 hover:text-amber-300 font-extrabold rounded-xl border border-slate-800 cursor-pointer flex items-center gap-1 transition-all uppercase font-mono tracking-wide shrink-0"
                    title="Log In to activate fan slots"
                  >
                    <User className="w-3 h-3 text-amber-400 shrink-0" /> Login
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRegisterMode(true);
                      setShowLoginModal(true);
                    }}
                    className="px-2.5 py-1.5 btn-interactive bg-amber-500 hover:bg-amber-400 text-[10px] text-slate-950 font-extrabold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all uppercase font-mono tracking-wide shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:scale-[1.02] transform"
                    title="Sign up to get 1 Free Slot"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isHeaderCollapsed && (
            <>
              {/* Unified Free Slots Panel / Admin tools if Logged In */}
              {loggedInUser && (
                <div className="mt-3 flex flex-col gap-2 bg-slate-950/60 border border-slate-900/60 rounded-xl p-2.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      {loggedInUser.isAdmin ? (
                        <Shield className="w-4 h-4 text-rose-450 shrink-0 animate-pulse text-amber-500" />
                      ) : (
                        <Gamepad2 className="w-4 h-4 text-teal-400 shrink-0" />
                      )}
                      <span>{loggedInUser.isAdmin ? 'Role: Central Admin' : 'Tile claim slots:'}</span>
                    </span>
                    <span className={`font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                      loggedInUser.isAdmin 
                        ? 'text-amber-400 bg-amber-955/40 border-amber-500/30' 
                        : 'text-teal-300 bg-teal-955/40 border-teal-500/35'
                    }`}>
                      {loggedInUser.isAdmin ? 'SUPER ADMIN 👑' : `${freeSlots} Available`}
                    </span>
                  </div>

                  {loggedInUser.isAdmin ? (
                    <button
                      onClick={() => setShowAdminPanel(true)}
                      className="w-full py-1.5 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-lg text-[10px] font-extrabold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                      id="open-super-admin-panel-btn"
                    >
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>Admin Control Panel</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                      <button
                        onClick={() => setShowBuySlotsModal(true)}
                        className="py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 font-extrabold rounded-lg text-[10px] uppercase font-mono tracking-wide border border-teal-500/20 hover:border-teal-400/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        id="buy-slots-nav-btn"
                      >
                        <Plus className="w-3 h-3 shrink-0" />
                        <span>Buy Slots</span>
                      </button>
                      <button
                        onClick={() => setShowMyTerritoriesModal(true)}
                        className="py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold rounded-lg text-[10px] uppercase font-mono tracking-wide border border-slate-800 hover:border-slate-705 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        id="my-territories-nav-btn"
                      >
                        <Map className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Territories ({Object.values(tiles).filter((t: any) => t.claimedBy === loggedInUser.username).length})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-0 mt-3">
                <button
                  onClick={() => {
                    setActivePage('arena');
                    setToast({
                      message: "Arena Leaderboard! 🏅",
                      description: "Review current team standings and total district claims.",
                      type: "success"
                    });
                  }}
                  className="py-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 font-bold font-mono text-[10px] uppercase tracking-wider"
                  title="Click to view Football Religion Leaderboard"
                  id="toggle-arena-trophy-btn"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowPredictionModal(true);
                  }}
                  className="py-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-xl shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 font-bold font-mono text-[10px] uppercase tracking-wider relative animate-pulse"
                  title="Make Predictions to Earn Free Slot Tokens!"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Earn Slots</span>
                    <span className="bg-slate-950 text-amber-300 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full font-mono min-w-[16px] text-center">
                      {freeSlots}
                    </span>
                  </span>
                </button>
              </div>

              {/* Quick global tally bar */}
              <div className="mt-0 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-300">
                    Claimed mesh: <strong className="text-emerald-400">{claimedCount}</strong>/{tileCount} tiles
                  </span>
                </div>
                <div className="flex gap-2 text-slate-500 text-[11px] items-center">
                  <button 
                    onClick={() => setShowOnboarding(true)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 underline underline-offset-2 cursor-pointer font-bold"
                  >
                    <Info className="w-3 h-3" /> Info
                  </button>
                  <span>|</span>
                  <button 
                    onClick={() => {
                      setShowTour(true);
                      setTourStep(0);
                      setActivePage('map');
                    }}
                    className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 underline underline-offset-2 cursor-pointer font-bold"
                    id="trigger-tour-header-btn"
                  >
                    <Navigation className="w-3 h-3 text-amber-500 shrink-0" /> Tour Guide 🧭
                  </button>
                </div>
              </div>
            </>
          )}

        </div>


      </div>



      {/* 4. Bottom Global Feed Scrolling Ticker & Page Footer */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none md:max-w-xl md:left-1/2 md:-translate-x-1/2 flex flex-col gap-2.5 bg-transparent border-none shadow-none">
        
        {/* Search Row */}
        <form onSubmit={handleSearch} className="pointer-events-none w-full flex items-center gap-2 bg-transparent border-none shadow-none">
          <div className="relative flex-1 bg-transparent pointer-events-auto">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
            <input 
              type="text" 
              placeholder="Search Kochi, Stadium, or K000085..."
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full bg-transparent border-none pl-9 pr-3 py-2 text-xs text-white placeholder-white/60 focus:outline-none transition-all font-mono shadow-none"
            />
          </div>
          <button 
            type="submit"
            className="p-2.5 bg-transparent border-none hover:text-emerald-300 text-slate-100 transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-none pointer-events-auto"
            title="Search sector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pointer-events-none flex items-center gap-3 overflow-hidden h-11 py-2.5 px-1 bg-transparent border-none shadow-none">
          <div className="flex items-center gap-1.5 shrink-0 bg-transparent border-none text-[10px] uppercase font-bold text-emerald-300 pointer-events-auto">
            <Flame className="w-3 h-3 text-orange-400 animate-pulse" /> Live Talk
          </div>

          <div className="flex-1 overflow-hidden relative pointer-events-auto">
            <div className="w-full flex items-center justify-start flex-nowrap gap-8 animate-pulse-slow">
              {tickerMessages.length > 0 ? (
                <div className="flex gap-12 whitespace-nowrap text-xs text-slate-300 font-mono">
                  {tickerMessages.map((msg, i) => (
                    <span key={i} className="inline-block hover:text-white cursor-pointer" onClick={() => triggerTileSelection(msg.tileId)}>
                      <strong className="text-emerald-400">[{msg.tileId}]</strong> {msg.text}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  No fan claims posted yet. Tap any square block inside Kerala boundaries to declare your lobby!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4.5 Collapsible/Expandable Bottom Corporate Slate Footer */}
        <div className="pointer-events-auto w-full bg-transparent border-none shadow-none transition-all duration-300">
          <button
            type="button"
            onClick={() => setFooterCollapsed(!footerCollapsed)}
            className="w-full flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-emerald-300 cursor-pointer select-none transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Football Map Kerala &copy; 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <span>{footerCollapsed ? "Expand Info" : "Collapse Info"}</span>
              {footerCollapsed ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </div>
          </button>

          {!footerCollapsed && (
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-left animate-fade-in">
              {/* Service Details Section */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono mb-1 flex items-center gap-1">
                  🛡️ Service
                </p>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('features')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Features Specs
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('pricing')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Pricing Plans
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('faqs')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ FAQs & Support
                </button>
              </div>

              {/* Company Details Section */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono mb-1 flex items-center gap-1">
                  💼 Company
                </p>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('blog')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Fans Blog
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('privacy')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Privacy Policy
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('refund')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Refund Rules
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('terms')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Terms of Service
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('contact')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ Contact Desk
                </button>
              </div>
            </div>
          )}
        </div>


      </div>



       {/* 5. Custom Right-Side / Mobile Bottom Panel for Tile Management */}
       <AnimatePresence>
        {selectedTileId && (
          <motion.div
            initial={isMobile ? { y: '100%', x: 0, opacity: 1 } : { x: 280, y: 0, opacity: 0 }}
            animate={isMobile ? (mobileSheetState === 'expanded' ? { y: 0, opacity: 1 } : { y: 'calc(100% - 110px)', opacity: 1 }) : { x: 0, y: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%', x: 0, opacity: 1 } : { x: 280, y: 0, opacity: 0 }}
            transition={isMobile ? { type: 'spring', damping: 32, stiffness: 340, mass: 0.7 } : { type: 'spring', damping: 25, stiffness: 200 }}
            drag={isMobile ? "y" : false}
            dragConstraints={isMobile ? { top: 0, bottom: 800 } : false}
            dragElastic={isMobile ? 0.08 : 0}
            dragMomentum={false}
            dragDirectionLock
            onDragEnd={(event, info) => {
              if (!isMobile) return;
              const swipeThreshold = 50;
              const velocityThreshold = 150;
              // Snapping check considering both displacement distance and sweep velocity for ultra-responsive feel
              if (mobileSheetState === 'expanded') {
                if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
                  setMobileSheetState('collapsed');
                }
              } else if (mobileSheetState === 'collapsed') {
                if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
                  setMobileSheetState('expanded');
                }
              }
            }}
            onClick={() => {
              if (isMobile && mobileSheetState === 'collapsed') {
                setMobileSheetState('expanded');
              }
            }}
            className={`fixed md:absolute bottom-0 md:bottom-[5.5rem] left-0 md:left-auto right-0 md:right-4 top-auto md:top-[8.5rem] z-30 md:z-20 w-full md:w-[340px] max-w-full md:max-w-[340px] max-h-[82vh] md:max-h-none bg-slate-950/65 border-t md:border border-slate-800/40 rounded-t-[2.5rem] md:rounded-3xl p-5 pb-8 md:pb-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl ring-1 ring-white/5 flex flex-col justify-between overflow-hidden cursor-default select-none ${isMobile && mobileSheetState === 'collapsed' ? 'cursor-pointer active:bg-slate-900/40 transition-colors' : ''}`}
          >
            {/* Mobile Grabber Drag Handle */}
            {isMobile && (
              <div className="w-full pt-1 pb-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none" id="mobile-sheet-drag-handle-wrapper">
                <div className="w-14 h-1.5 bg-slate-700/80 hover:bg-slate-600 rounded-full transition-colors" />
                {mobileSheetState === 'collapsed' && (
                  <span className="text-[9px] text-amber-500/80 font-mono tracking-widest mt-1.5 uppercase animate-pulse flex items-center gap-1 font-bold">
                    <ChevronUp className="w-3 h-3 text-amber-400" />
                    {isMultiSelectMode
                      ? `Swipe Up to Secure Slots (${multiSelectedTileIds.length} Selected) ➔`
                      : 'Swipe Up or Tap to edit territory'}
                  </span>
                )}
              </div>
            )}

            {/* Scrollable Upper Section */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4.5 mb-3 scrollbar-none">
              
              {/* Header info with Merge / Standalone state */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400 font-mono text-xs font-bold">
                      {selectedTileId}
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      {tiles[selectedTileId]?.mergedWith ? 'Merged Sector 🧩' : 'Grid Territory 📍'}
                    </h3>
                  </div>

                  {/* Tile or Merged Tiles Value Badge */}
                  {(() => {
                    const activeTileData = tiles[selectedTileId!];
                    let tileCount = 1;
                    let coinValue = 15;

                    if (isMultiSelectMode && multiSelectedTileIds.length > 0) {
                      tileCount = multiSelectedTileIds.length;
                      coinValue = tileCount * 15;
                    } else if (activeTileData) {
                      const isMerged = activeTileData.mergedWith && activeTileData.mergedWith.length > 0;
                      tileCount = isMerged ? activeTileData.mergedWith.length : 1;
                      coinValue = isMerged ? activeTileData.mergedWith.length * 15 + 10 : 15;
                    }

                    return (
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/15 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-amber-400 shrink-0" id="tile-value-badge">
                        <span>💎 {tileCount} {tileCount === 1 ? 'Tile' : 'Tiles'}</span>
                        <span className="text-amber-500/40">•</span>
                        <span className="text-slate-300">₹{coinValue}</span>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-1.5">
                    {/* Expand/Collapse Chevron Indicator */}
                    {isMobile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileSheetState(mobileSheetState === 'expanded' ? 'collapsed' : 'expanded');
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer flex items-center justify-center border border-slate-900/80"
                        title={mobileSheetState === 'expanded' ? "Collapse Panel" : "Expand Panel"}
                      >
                        {mobileSheetState === 'expanded' ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTileId(null);
                        setMultiSelectedTileIds([]);
                        setIsMultiSelectMode(false);
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* If merged parent: show Dissolve button */}
                {tiles[selectedTileId]?.mergedWith && (
                  <div className="mt-2.5">
                    <button
                      onClick={handleSplitAction}
                      className="w-full py-1.5 bg-red-950/40 hover:bg-red-950/70 border border-red-900/60 hover:border-red-500 text-red-200 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer"
                    >
                      🔓 Dissolve / Split Merged Region
                    </button>
                  </div>
                )}




              </div>


              <div className="flex flex-col gap-2.5">
                {/* Multi-select toggle (add more slots) */}
                <div>
                  {isMultiSelectMode ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 shadow-inner">
                      <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold">
                        <span className="flex items-center gap-1">
                          {multiSelectTool === 'brush' ? '🖌️ Brush Select Mode' : '📐 Drag Box Mode'}
                        </span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full text-[9px]">
                          {multiSelectedTileIds.length} Selected
                        </span>
                      </div>

                      {/* Selector Tool Switcher tab-row */}
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 my-0.5">
                        <button
                          type="button"
                          onClick={() => setMultiSelectTool('brush')}
                          className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all tracking-wide flex items-center justify-center gap-1 cursor-pointer ${
                            multiSelectTool === 'brush'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm font-extrabold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                          }`}
                        >
                          <span>🖌️ Brush</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMultiSelectTool('box')}
                          className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all tracking-wide flex items-center justify-center gap-1 cursor-pointer ${
                            multiSelectTool === 'box'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm font-extrabold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                          }`}
                        >
                          <span>📐 Drag Box</span>
                        </button>
                      </div>

                      <p className="text-[9px] text-slate-400 font-mono leading-relaxed">
                        {multiSelectTool === 'brush' 
                          ? 'Tap grids individually or drag/paint your cursor/finger over cells to highlight them!'
                          : 'Click anywhere on the map, hold and drag a rectangle box, then release to select multiple grids at once!'
                        }
                      </p>
                      {multiSelectedTileIds.length > 0 && (
                        <div className="text-[10px] font-mono text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-850/50 leading-normal flex flex-col gap-0.5 mt-0.5">
                          <div className="flex justify-between">
                            <span>Sectors Highlighted:</span>
                            <span className="text-white font-bold">{multiSelectedTileIds.length} Tiles</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gift Tiles Cost:</span>
                            <span className="text-amber-400 font-bold">
                              {multiSelectedTileIds.length.toFixed(1)} Tiles
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Interactive Selection Action buttons place below brush selector enabled element */}
                      <div className="flex gap-1.5 mt-1">
                        <button
                          onClick={() => setMultiSelectedTileIds([])}
                          className="w-1/3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-mono font-bold rounded-xl text-[9px] uppercase tracking-wider cursor-pointer border border-slate-800"
                          title="Clear Highlights"
                        >
                          Clear Selection
                        </button>

                        <button
                          disabled={multiSelectedTileIds.length < 2}
                          onClick={handleMergeAction}
                          className={`w-2/3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1 ${
                            multiSelectedTileIds.length >= 2
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold shadow-md hover:scale-[1.01]'
                              : 'bg-slate-950 text-slate-600 border border-slate-850/40 cursor-not-allowed'
                          }`}
                          title="Merge highlighted grids into a single fansite region"
                        >
                          🧩 Merge Region ({multiSelectedTileIds.length})
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setIsMultiSelectMode(false);
                          setMultiSelectedTileIds([]);
                          if (isMobile) {
                            setMobileSheetState('expanded');
                          }
                        }}
                        className="py-1 px-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold rounded-lg text-[9px] uppercase font-mono transition-all cursor-pointer text-center w-full mt-0.5"
                      >
                        Cancel Multi-Select
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMultiSelectMode(true);
                        setMultiSelectedTileIds([selectedTileId!]);
                        setMultiSelectTargetTeam(tempTeam !== 'None' ? tempTeam : 'None');
                        if (isMobile) {
                          setMobileSheetState('collapsed');
                        }
                        setToast({
                          message: "Multi-Select Mode Active! 🖌️",
                          description: "Tap other tiles on the map to add them to your selection.",
                          type: "success"
                        });
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-[10px] uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                      title="Add more slots starting with this sector"
                    >
                      <span>🧩 Add More Slots</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Country Selection Grids, Hyperlink and Photo Area with Ownership Check */}
              {(() => {
                const activeData = tiles[selectedTileId!];
                const isTileOwnedByMe = !activeData?.claimedBy || activeData?.claimedBy === (loggedInUser ? loggedInUser.username : 'Guest') || activeData?.team === 'None';
                if (!isTileOwnedByMe) {
                  return (
                    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-center flex flex-col items-center gap-2 animate-fade-in my-2">
                      <Lock className="w-8 h-8 text-slate-500 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">🔒 Reserved Fan Territory</h4>
                        <p className="text-[10px] font-mono text-slate-450 uppercase mt-0.5 tracking-wider font-extrabold select-all">
                          Owned by: @{activeData?.claimedBy || 'Guest'}
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <>
                    {drawerActiveWindow === 'team_select' ? (
                      <>
                        {/* Country Selection with Search Bar above Horizontal Scrolling Section */}
                        <div className="flex flex-col gap-2 my-2 bg-slate-900/10 border border-slate-850 p-3 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Select Active Country</label>
                            {teamSearchQuery && (
                              <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Filtering list</span>
                            )}
                          </div>

                          {/* Search Bar Input */}
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 animate-pulse" />
                            <input
                              type="text"
                              value={teamSearchQuery}
                              onChange={(e) => setTeamSearchQuery(e.target.value)}
                              placeholder="Search country team name..."
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-8.5 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 font-mono transition-all"
                            />
                            {teamSearchQuery && (
                              <button
                                onClick={() => setTeamSearchQuery('')}
                                className="absolute right-3 top-1.8 text-slate-400 hover:text-white bg-slate-850 p-0.5 rounded cursor-pointer transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Horizontal Scrolling Section */}
                          <div className="flex overflow-x-auto gap-2 py-1.5 scrollbar-thin scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/50 scroll-smooth snap-x">
                            {[...WORLD_CUP_TEAMS]
                              .filter(team => team.toLowerCase().includes(teamSearchQuery.toLowerCase()))
                              .sort((a, b) => {
                                const countA = tallyMap[a] || 0;
                                const countB = tallyMap[b] || 0;
                                if (countB !== countA) {
                                  return countB - countA;
                                }
                                return a.localeCompare(b);
                              })
                              .map(team => {
                                const style = TEAM_STYLES[team];
                                const isActive = tempTeam === team;
                                const claimCount = tallyMap[team] || 0;
                                return (
                                  <button
                                    key={team}
                                    onClick={() => {
                                      setTempTeam(team as TeamChoice);
                                      setHasSelectedTeamInSession(true);
                                      if (isMultiSelectMode) {
                                        setMultiSelectTargetTeam(team as TeamChoice);
                                      }
                                    }}
                                    className={`flex-none w-[112px] p-3 rounded-xl flex flex-col items-center justify-center gap-1 snap-start cursor-pointer transition-all duration-200 relative border ${
                                      isActive
                                        ? 'bg-slate-950 text-white scale-102 shadow-lg z-10'
                                        : 'bg-slate-950/40 hover:bg-slate-900 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-205'
                                    }`}
                                    style={{
                                      borderColor: isActive ? style.color : '',
                                      boxShadow: isActive ? `0 0 10px ${style.color}25` : '',
                                    }}
                                  >
                                    <span className="text-2xl filter drop-shadow-md leading-none">{style.flagEmoji}</span>
                                    <span className="text-[10px] font-bold font-sans tracking-tight mt-1">{team}</span>
                                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">{claimCount} 💪support</span>
                                    {isActive && (
                                      <span
                                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-ping"
                                        style={{ backgroundColor: style.color }}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            {WORLD_CUP_TEAMS.filter(team => team.toLowerCase().includes(teamSearchQuery.toLowerCase())).length === 0 && (
                              <div className="text-center py-3 text-slate-500 text-[10px] font-mono w-full">
                                No team matches "{teamSearchQuery}"
                              </div>
                            )}
                          </div>

                          {/* Option to clear/relinquish */}

                        </div>

                        {/* Next Button aligned bottom-right */}
                        <div className="flex justify-end mt-4 border-t border-slate-900 pt-3">
                          <button
                            id="btn-drawer-next-step"
                            onClick={() => {
                              if (tempTeam === 'None') {
                                setToast({
                                  message: "Select Support Country! 🚩",
                                  description: "Please select one of the support country teams below before clicking Next.",
                                  type: "info"
                                });
                                return;
                              }
                              setDrawerActiveWindow('addons_and_payment');
                            }}
                            className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Next ➔
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3.5 animate-fadeIn">
                        {/* Title page header row with Back button */}
                        <div className="flex items-center justify-between bg-slate-900/10 p-2 rounded-xl border border-slate-900">
                          <button
                            id="btn-drawer-prev-step"
                            onClick={() => setDrawerActiveWindow('team_select')}
                            className="py-1 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors"
                          >
                            ← Back
                          </button>
                          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider font-extrabold">
                            Add-ons & Checkout 🛠️
                          </span>
                        </div>

                        {/* Territory Hyperlink Option */}
                        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-3 flex flex-col gap-3 animate-fadeIn">
                          <div>
                            <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1 font-bold">Territory Hyperlink URL</label>
                            <input
                              type="text"
                              placeholder="e.g. keralasoccer.com"
                              value={hyperlinkInput}
                              onChange={e => {
                                setHyperlinkInput(e.target.value);
                                saveDesignSettings({ hyperlink: e.target.value });
                              }}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 font-mono"
                            />
                            {hyperlinkInput && (
                              <div className="mt-1.5">
                                <a
                                  href={hyperlinkInput.startsWith('http') ? hyperlinkInput : `https://${hyperlinkInput}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-1 text-center shrink-0 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                                >
                                  Visit Attached Link 🔗
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Photo Area */}
                        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-3 flex flex-col gap-3 animate-fadeIn">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Region Image Overlay</label>
                          {tiles[selectedTileId!]?.photo ? (() => {
                            const activeTeam = tiles[selectedTileId!]?.team || 'None';
                            const activeStyle = TEAM_STYLES[activeTeam] || TEAM_STYLES['None'];
                            return (
                              <div className="flex flex-col gap-2">
                                <div 
                                  className="relative group rounded-xl overflow-hidden aspect-video border-[4px] transition-all shadow-md"
                                  style={{ borderColor: activeStyle.color || '#475569' }}
                                >
                                  <img 
                                    src={tiles[selectedTileId!].photo} 
                                    alt="Fan snap" 
                                    className="w-full h-full object-cover" 
                                  />
                                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4 text-center">
                                    <label className="cursor-pointer w-full max-w-[140px] bg-slate-900 border border-slate-700 text-slate-100 py-1.5 rounded-xl text-xs hover:bg-slate-800 transition-all font-bold flex items-center justify-center gap-1.5 shadow-lg">
                                      <Camera className="w-3.5 h-3.5" /> Replace Image
                                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    </label>
                                    <button
                                      onClick={() => {
                                        saveDesignSettings({ photo: '' });
                                        setToast({
                                          message: "Image Removed! 🗑️",
                                          description: "The visual overlay of the mapped grid region has been deleted.",
                                          type: "info"
                                        });
                                      }}
                                      className="w-full max-w-[140px] bg-red-950/80 border border-red-900/60 hover:border-red-500 text-red-200 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition-all font-bold cursor-pointer flex items-center justify-center gap-1 shadow-lg font-mono"
                                    >
                                      Remove Image
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400 font-mono">🎨 Country Outline:</span>
                                  <span 
                                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                                    style={{ color: activeStyle.color, backgroundColor: `${activeStyle.color}15` }}
                                  >
                                    {activeStyle.flagEmoji} {activeTeam === 'None' ? 'Neutral Grid' : activeTeam} Color
                                  </span>
                                </div>
                              </div>
                            );
                          })() : (
                            <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-emerald-500/80 rounded-xl p-4 cursor-pointer bg-slate-900/20 hover:bg-slate-900/40 transition-all text-center">
                              <Camera className="w-5 h-5 text-slate-400 mb-1.5" />
                              <span className="text-xs text-slate-300 font-medium">Add Image Overlay Snap</span>
                              <span className="text-[9px] text-slate-500 font-mono mt-0.5">JPEG, PNG fits mapped regions</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                          )}
                        </div>

                        {/* Interactive Inline Payment Checkout options details */}
                        {(() => {
                          const activeData = tiles[selectedTileId!];
                          const isMergedRegion = activeData && activeData.mergedWith && activeData.mergedWith.length > 0;
                          const isMulti = (isMultiSelectMode && multiSelectedTileIds.length > 0) || isMergedRegion;
                          const activeCount = (isMultiSelectMode && multiSelectedTileIds.length > 0)
                            ? multiSelectedTileIds.length
                            : (isMergedRegion ? activeData.mergedWith!.length : 1);

                          return (
                            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-3 flex flex-col gap-2.5 mt-1 animate-fadeIn">
                              {/* Header named: Claim Tile */}
                              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <div>
                                  <span className="text-[9px] text-amber-500 font-mono uppercase tracking-wider font-bold">Checkout Process</span>
                                  <h5 className="text-[11px] text-white font-extrabold font-sans mt-0.5">
                                    Claim Tile
                                  </h5>
                                </div>
                                <span className="text-[9px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded">
                                  {isMulti ? `${activeCount} Sectors` : 'Single'}
                                </span>
                              </div>

                              {/* Total calculation of the tile */}
                              <div className="flex flex-col gap-2 text-[9px] font-mono text-slate-400 mt-0.5">
                                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                                  <div className="text-[8px] text-amber-400 uppercase font-bold border-b border-slate-900 pb-1 mb-1 flex items-center gap-1">
                                    <Coins className="w-3 h-3 text-amber-400" /> Gift Tiles Method (Free)
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Required:</span>
                                    <span className="text-slate-300 font-bold">{activeCount.toFixed(1)} Tile(s)</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Wallet Balance:</span>
                                    <span className="text-amber-300 font-bold">{giftTiles.toFixed(2)} Tiles</span>
                                  </div>
                                </div>

                                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                                  <div className="text-[8px] text-emerald-400 uppercase font-bold border-b border-slate-900 pb-1 mb-1 flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-emerald-400" /> INR Cash Method (₹)
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Base Rate:</span>
                                    <span className="text-slate-300">₹10.00 / Tile</span>
                                  </div>
                                  {activeCount > 10 && (
                                    <div className="flex justify-between text-emerald-300 text-[8px]">
                                      <span>Bulk Discount:</span>
                                      <span>10% Off (&gt;10 Tiles)</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold text-emerald-400 mt-1 pt-1 border-t border-dashed border-slate-900">
                                    <span>Total Price:</span>
                                    <span>₹{(() => {
                                      const base = activeCount * 10;
                                      const discountVal = activeCount > 10 ? base * 0.10 : 0;
                                      return (base - discountVal).toFixed(2);
                                    })()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Unified Payment Options - Opens next window modal */}
                              <div className="flex flex-col gap-1.5 mt-1 font-mono">
                                <button
                                  id="btn-drawer-confirm-pay-inline"
                                  onClick={() => {
                                    setPendingTeam(tempTeam);
                                    setIsMultiSelectCheckout(isMulti);
                                    setSlotPurchaseCount(activeCount);
                                    setShowPaymentModal(true);
                                  }}
                                  className="w-full py-2 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-[10px] transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider font-sans"
                                >
                                  💳 Secure Sector(s) ({activeCount > 10 ? '10% Off' : `₹${(activeCount * 10).toFixed(0)}`})
                                </button>
                              </div>

                              <p className="text-[8px] text-slate-500 font-mono text-center">
                                Claim using free Gift Tiles or secure via simulated checkout!
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>



          </motion.div>
        )}
      </AnimatePresence>

        </>
      )}

      {/* 4.5 SEPARATE ARENA: LEADERBOARD & INTERACTIVE FOOTBALL GAMES PAGE */}
      {activePage === 'arena' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 z-20 w-full h-full bg-[#070b13] text-white overflow-y-auto px-4 md:px-8 pt-24 pb-16 scrollbar-thin flex flex-col items-center"
        >
          {/* Main Container */}
          <div className="w-full max-w-5xl flex flex-col gap-6 mt-4">
            
            {/* Page Title & Back Button Anchor */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md gap-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-extrabold block">🏆 THE SOCCER SANCTUARY</span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  Football Religion Arena
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
                  Compete against rival club blocks, showcase your support, and review regional standings from fans in local boundaries.
                </p>
              </div>
              <button
                onClick={() => setActivePage('map')}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0 select-none"
              >
                ← Back to Map
              </button>
            </div>

            {/* Main Arena Content */}
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
              
              {/* 1. Club territory stats card */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" /> Arena Leaderboards
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {leaderboardTab === 'clubs' ? `${claimedCount} Mapped Pledges` : 'Top Fan Conquerors'}
                  </span>
                </div>

                {/* Tab layout selectors */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/40 rounded-xl mb-4 border border-slate-900/60">
                  <button
                    onClick={() => setLeaderboardTab('clubs')}
                    className={`py-2 text-xs font-mono rounded-lg transition-all text-center select-none cursor-pointer ${
                      leaderboardTab === 'clubs'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    🛡️ Club Territories
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('players')}
                    className={`py-2 text-xs font-mono rounded-lg transition-all text-center select-none cursor-pointer ${
                      leaderboardTab === 'players'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    👑 Tile Capture Rankings
                  </button>
                </div>

                {leaderboardTab === 'clubs' ? (
                  <div className="flex flex-col gap-3.5 max-h-[450px] overflow-y-auto pr-1.5">
                    {getLeaderboardStats().tallies.map(([team, val], idx) => {
                      const style = TEAM_STYLES[team] || TEAM_STYLES['None'];
                      const pct = tileCount > 0 ? (val / tileCount) * 100 : 0;
                      return (
                        <div key={team} className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 flex flex-col gap-1.5 hover:border-slate-800/80 transition-all">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-100 flex items-center gap-2">
                              <span className="text-slate-500 font-mono text-[10px]">{idx+1}.</span>
                              <span className="text-sm">{style.flagEmoji}</span>
                              <span>{team} Support</span>
                            </span>
                            <span className="font-mono text-slate-350 text-[11px] font-bold">
                              {val} <span className="text-[9px] text-slate-500 font-normal">grids claimed</span>
                            </span>
                          </div>
                          
                          {/* Gauge and metrics */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                              <div 
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${Math.max(pct, 1.5)}%`, backgroundColor: style.color }}
                              />
                            </div>
                            <span className="font-mono text-[9px] text-slate-400 w-10 text-right">{pct.toFixed(2)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1.5">
                    {getUserRankings().map((player, idx) => {
                      const isMe = loggedInUser ? player.username === loggedInUser.username : player.username === 'Guest';
                      return (
                        <div 
                          key={player.username} 
                          className={`border rounded-xl p-2.5 flex items-center justify-between transition-all ${
                            isMe 
                              ? 'bg-emerald-950/20 border-emerald-500/45' 
                              : 'bg-slate-900/40 border-slate-900 hover:border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-slate-500 w-5 text-right font-bold">{idx + 1}.</span>
                            <div className="text-sm w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                              {player.avatarEmoji}
                            </div>
                            <span className={`text-xs font-mono font-bold ${isMe ? 'text-emerald-300' : 'text-slate-200'}`}>
                              @{player.username} {isMe && <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 py-0.5 rounded ml-1 border border-emerald-500/20 font-sans">YOU</span>}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-emerald-400 text-xs font-bold">
                              {player.tiles} <span className="text-[9px] text-slate-500 font-normal">tiles captured</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>



            </div>

          </div>
        </motion.div>
      )}

      {/* Invalid Shape Alert Modal */}
      <AnimatePresence>
        {showInvalidShapeModal && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none z-50"
            >
              <button 
                onClick={() => setShowInvalidShapeModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-amber-500/15 rounded-2xl flex items-center justify-center mb-2 border border-amber-500/30 shadow-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Invalid Shape
                </h3>

                {/* Visual helper row comparing Allowed vs Not Allowed shapes */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Left Side (Not Allowed) */}
                  <div className="bg-slate-950/50 border border-red-950/50 rounded-2xl p-2.5 flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-700/20 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                      Not Allowed
                    </span>
                    <div className="relative w-16 h-16 bg-slate-900/40 rounded-lg border border-slate-800/80 p-1 flex items-center justify-center">
                      {/* L-shape grids (highlighted selects) */}
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                        {/* Row 1 */}
                        <div className="bg-red-500/30 border border-red-500/40 rounded-sm"></div>
                        <div className="bg-slate-800/40 border border-slate-700/10 rounded-sm"></div>
                        <div className="bg-slate-800/40 border border-slate-700/10 rounded-sm"></div>
                        {/* Row 2 */}
                        <div className="bg-red-500/30 border border-red-500/40 rounded-sm"></div>
                        <div className="bg-slate-800/40 border border-slate-700/10 rounded-sm"></div>
                        <div className="bg-slate-800/40 border border-slate-700/10 rounded-sm"></div>
                        {/* Row 3 */}
                        <div className="bg-red-500/30 border border-red-500/40 rounded-sm"></div>
                        <div className="bg-red-500/30 border border-red-500/40 rounded-sm"></div>
                        <div className="bg-slate-800/40 border border-slate-700/10 rounded-sm"></div>
                      </div>
                      
                      {/* Large red X overlay */}
                      <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-slate-950/40 rounded-lg">
                        <svg className="w-10 h-10 text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Right Side (Allowed) */}
                  <div className="bg-slate-950/50 border border-emerald-950/50 rounded-2xl p-2.5 flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-700/20 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Allowed
                    </span>
                    <div className="relative w-16 h-16 bg-slate-900/40 rounded-lg border border-slate-800/80 p-1 flex items-center justify-center">
                      {/* Perfect solid 3x3 square grid */}
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                        {/* Row 1 */}
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        {/* Row 2 */}
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        {/* Row 3 */}
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                        <div className="bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                      </div>

                      {/* Large green checkmark overlay */}
                      <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-slate-950/40 rounded-lg">
                        <svg className="w-10 h-10 text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-normal max-w-sm mx-auto mb-5">
                  Please select a proper square or rectangular shape to merge. Make sure there are no missing tiles inside the area and no extra tiles sticking out!
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowInvalidShapeModal(false)}
                    className="px-5 py-2 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer transition-all shadow-md"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Onboarding Info Modal Card */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              {/* background gradient accent */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-md">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                  Kerala Football Fan Club Grid
                </h2>
                <p className="text-sm text-slate-350 leading-relaxed max-w-sm mx-auto mb-6">
                  In Kerala, soccer isn't a sport—it's an absolute religion. We have divided the map of Kerala into a customized grid of sectors. Assert control for your team!
                </p>

                {/* Instructions */}
                <div className="text-left bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3.5 mb-6">
                  <div className="flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-300 font-mono text-xs">1</div>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Select any block</strong> on the map of Kerala. Unclaimed tiles remain slate gray.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-300 font-mono text-xs">2</div>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Pledge to claim:</strong> Support your favorite team with simulated claims on selected tiles.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-300 font-mono text-xs">3</div>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Post local photos and comments</strong> inside your tile's board to rally fellow supporters, as you trigger colors across the whole state!
                    </p>
                  </div>
                  <div className="flex gap-3 border-t border-slate-900 pt-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">4</div>
                    <p className="text-xs text-slate-300 leading-normal">
                      <strong>3-Second Long Press:</strong> Press & hold down on any single tile for 3 seconds to automatically lock map panning and activate the <strong>Smart painting brush</strong> to instantly highlight dozens of squares!
                    </p>
                  </div>
                </div>

                {/* Confirm actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      setShowTour(true);
                      setTourStep(0);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer font-bold"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-950 shrink-0" /> Take Guided Tour 🧭
                  </button>
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all border border-slate-700/60 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Start Claiming!
                  </button>
                </div>

                <p className="text-[10px] text-slate-600 font-mono mt-3">
                  Pledges are 100% simulated for testing. Sandbox session persistence is stored in local storage.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6.5 Interactive Tactical Guided Tour Overlay */}
      <AnimatePresence>
        {showTour && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end md:justify-center items-center p-4 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none">
            {/* Glowing Spotlight Indicator for highlights */}
            {tourSteps[tourStep]?.highlight === 'map' && (
              <div className="absolute inset-0 border-[6px] border-amber-500/30 rounded-3xl pointer-events-none animate-pulse z-40 shadow-[inset_0_0_80px_rgba(245,158,11,0.15)]" />
            )}
            
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="pointer-events-auto bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.85)] relative overflow-hidden z-50 text-left mr-0 md:mr-10 md:mb-10"
            >
              {/* background design accents */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3.5 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner">
                      {getTourStepIcon(tourSteps[tourStep]?.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase font-black block">
                        ⚽ TACTICS ROADMAP
                      </span>
                      <h4 className="text-xs font-bold text-slate-350 font-mono">
                        Step {tourStep + 1} of {tourSteps.length}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Skip Cross button */}
                  <button 
                    onClick={() => {
                      setShowTour(false);
                      setToast({
                        message: "Tour Skipped! 🧭",
                        description: "You can restart the Tour anytime from the Information Guide panel.",
                        type: "info"
                      });
                    }}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-colors"
                    title="Skip Guided Tour"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 mb-4 overflow-hidden border border-slate-800/60 p-[1px]">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
                  />
                </div>

                {/* Main Content Area */}
                <div className="mb-5">
                  <h3 className="text-lg font-black text-white leading-tight mb-2 flex items-center gap-1.5">
                    {tourSteps[tourStep]?.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans mb-3.5">
                    {tourSteps[tourStep]?.description}
                  </p>

                  <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800/60 rounded-xl px-3 py-2 text-[10px] text-slate-400 font-mono">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Focus turf: <strong>{tourSteps[tourStep]?.targetLabel}</strong></span>
                  </div>
                </div>

                {/* Controls Footer */}
                <div className="flex items-center justify-between pt-1">
                  {/* Skip Text */}
                  <button
                    onClick={() => {
                      setShowTour(false);
                      setToast({
                        message: "Tour Completed! ⚽",
                        description: "Explore the Kerala Fan Grid and take active command of your target sector!",
                        type: "success"
                      });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-350 transition-colors cursor-pointer font-bold font-mono uppercase tracking-widest"
                  >
                    Skip Tour
                  </button>

                  <div className="flex gap-2">
                    {/* Back Button */}
                    <button
                      disabled={tourStep === 0}
                      onClick={() => setTourStep(prev => Math.max(0, prev - 1))}
                      className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-950 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-mono uppercase tracking-wide"
                    >
                      Back
                    </button>

                    {/* Next / Finish Button */}
                    {tourStep < tourSteps.length - 1 ? (
                      <button
                        onClick={() => setTourStep(prev => prev + 1)}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-mono uppercase tracking-wider font-bold"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowTour(false);
                          setToast({
                            message: "Tactics Ready! ⚽",
                            description: "You have completed the tour. Kick-off now and secure your team's glory!",
                            type: "success"
                          });
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 font-mono uppercase tracking-widest font-bold"
                      >
                        <span>Kick Off ⚽</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Mock Payment checkout modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md w-full h-full">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-amber-500/15 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/40 shadow-lg">
                  <Coins className="w-6 h-6 text-amber-400" />
                </div>

                <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider font-extrabold block mb-1">
                  {isMultiSelectCheckout ? 'Bulk Claim Checkout' : `Secure sector: Index ${selectedTileId}`}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isMultiSelectCheckout ? 'Bulk Sector Verification' : 'Claim Sector Verification'}
                </h3>

                {/* Cost Breakdown Panels */}
                {(() => {
                  const qty = isMultiSelectCheckout ? slotPurchaseCount : 1;
                  const baseCash = qty * 10;
                  const cashDiscount = qty > 10 ? baseCash * 0.10 : 0;
                  const finalCash = baseCash - cashDiscount;

                  return (
                    <>
                      <div className="grid grid-cols-1 gap-2.5 mb-4 font-mono">
                        {/* Option A: Gift Tiles Panel */}
                        <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-3 select-none">
                          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1 mb-1.5 justify-between">
                            <span className="flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span className="text-[8px] text-slate-400 tracking-wider">OPTION A: GIFT TILES</span>
                            </span>
                            <span className="text-[9px] text-amber-300 font-bold bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900">
                              Free!
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-450 leading-tight flex flex-col gap-0.5">
                            <div className="flex justify-between">
                              <span>Sectors to Claim:</span>
                              <span className="text-slate-300 font-bold">{qty} Sector(s)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost per Sector:</span>
                              <span className="text-slate-300">1.0 Gift Tile</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your Balance:</span>
                              <span className="text-slate-300">{giftTiles.toFixed(2)} Tiles</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-900 pt-1 mt-1 font-bold text-amber-400">
                              <span>Total Gift Tiles:</span>
                              <span>{qty.toFixed(1)} Tiles</span>
                            </div>
                          </div>
                        </div>

                        {/* Option B: INR Cash Panel */}
                        <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-3 select-none">
                          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1 mb-1.5 justify-between">
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[8px] text-slate-400 tracking-wider">OPTION B: INR CHECKOUT</span>
                            </span>
                            {qty > 10 && (
                              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900">
                                10% OFF
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-450 leading-tight flex flex-col gap-0.5">
                            <div className="flex justify-between">
                              <span>Sectors to Claim:</span>
                              <span className="text-slate-300 font-bold">{qty} Sector(s)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price per Sector:</span>
                              <span className="text-slate-300">₹10.00</span>
                            </div>
                            {qty > 10 && (
                              <div className="flex justify-between text-emerald-400">
                                <span>Bulk Discount:</span>
                                <span>-₹{cashDiscount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-slate-900 pt-1 mt-1 font-bold text-emerald-400">
                              <span>Total Cash Price:</span>
                              <span>₹{finalCash.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verified Action and Wallet checks */}
                      <div className="flex flex-col gap-2.5 mb-4">
                        {giftTiles >= qty ? (
                          <button
                            onClick={executeGiftTilePayment}
                            className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/50 font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-mono shadow-md"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                            Secure with Gift Tiles ({qty.toFixed(1)})
                          </button>
                        ) : (
                          <div className="p-2.5 bg-amber-950/10 border border-amber-500/20 rounded-xl text-left font-mono">
                            <span className="text-[8px] text-amber-400 font-extrabold uppercase block mb-0.5">💡 Tip: Prediction Rewards</span>
                            <span className="text-[9px] text-slate-400 block leading-normal">
                              Enter match results in the Arena page to claim Gift Tiles and secure sectors for free!
                            </span>
                          </div>
                        )}

                        <button
                          onClick={executeSimulatedPayment}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-mono text-[10px] border border-emerald-400/20"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay with Simulated Cash (₹{finalCash.toFixed(2)})
                        </button>
                      </div>
                    </>
                  );
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] transition-colors cursor-pointer uppercase tracking-wider font-mono text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7.5 Daily Match Predictions Modal */}
      <AnimatePresence>
        {showPredictionModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-[2rem] max-w-md w-full p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] relative overflow-y-auto max-h-[92vh] scrollbar-none ring-1 ring-white/5 flex flex-col gap-0 before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-500/50 before:to-transparent"
              id="prediction-arena-modal"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowPredictionModal(false)}
                className="absolute right-5 top-5 text-slate-450 hover:text-white p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all duration-200 hover:rotate-90 shadow-sm"
                id="close-prediction-arena-btn"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-slate-850/80 pb-5 mb-5">
                <div className="w-11 h-11 bg-gradient-to-tr from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/25 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(245,158,11,0.12)] animate-pulse">
                  <Gamepad2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight leading-none" id="prediction-title text-slate-100 italic">
                    Earn Slots Hub
                  </h3>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase font-extrabold mt-1.5 block">
                    ⚡ Unlock Free Map Sectors
                  </span>
                </div>
              </div>

              {/* TABS SELECTOR */}
              <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-850 mb-5 relative z-10" id="earn-slots-hub-tabs">
                <button
                  type="button"
                  onClick={() => setEarnSlotsTab('predictions')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-mono font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    earnSlotsTab === 'predictions'
                      ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md'
                      : 'text-slate-400 hover:text-slate-350'
                  }`}
                >
                  🔮 Prediction Arena
                </button>
                <button
                  type="button"
                  id="referrals-tab-btn"
                  onClick={() => setEarnSlotsTab('referrals')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-mono font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    earnSlotsTab === 'referrals'
                      ? 'bg-gradient-to-r from-teal-500/10 to-teal-500/20 text-teal-400 border border-teal-500/30 shadow-md'
                      : 'text-slate-400 hover:text-slate-350'
                  }`}
                >
                  ⚡ Refer & Earn
                </button>
              </div>

              <div className="mb-5 flex-1">
                {earnSlotsTab === 'predictions' ? (
                  <>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Tap on any team below to place your match verdict. Our system referee simulates instant regional alignment predictions! Correct predictions unlock <strong>Gift Tiles</strong> directly for you to claim!
                    </p>

                    {/* Rules Section */}
                    <div className="bg-slate-900/40 border border-slate-850/80 rounded-2xl p-4 mb-4 flex flex-col gap-2.5 shadow-sm text-[10px] font-mono text-slate-400 leading-snug" id="prediction-rules-panel">
                      <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[9px] mb-0.5 block border-b border-slate-850 pb-1 w-fit">
                        🏆 Prediction Reward Rules:
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">⚡ <span className="text-slate-350">Base Reward:</span></span>
                        <span className="text-emerald-400 font-extrabold bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-500/10">+0.2 Gift Tiles / correct</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">🔥 <span className="text-slate-350">Daily 100% Bonus:</span></span>
                        <span className="text-emerald-400 font-extrabold bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-500/10">+0.5 Gift Tiles if all correct</span>
                      </div>
                    </div>

                    {/* Balance Progress Section */}
                    <div className="bg-slate-900/65 border border-slate-800/50 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-5" id="prediction-balance-indicator">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                          <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                        </div>
                        <span className="text-xs text-slate-200 font-sans font-semibold">Your Gift Tile Balance</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {/* Sleek Progress Ring Tracking up to 1.0 Tile */}
                        {(() => {
                          const progress = Math.min(1.0, Math.max(0, giftTiles % 1.0));
                          const percent = progress * 100;
                          const radius = 7;
                          const circumference = 2 * Math.PI * radius; // ~43.98
                          const strokeDashoffset = circumference * (1 - progress);
                          const isCapped = giftTiles >= 1.0;
                          
                          return (
                            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-850 px-3 py-1.5 rounded-xl select-none" title={`${percent.toFixed(0)}% towards next whole tile`}>
                              {/* SVG progress ring */}
                              <div className="relative w-4 h-4 flex items-center justify-center">
                                <svg className="w-4 h-4 -rotate-90 transform" viewBox="0 0 18 18">
                                  {/* Track */}
                                  <circle
                                    cx="9"
                                    cy="9"
                                    r={radius}
                                    className="stroke-slate-800"
                                    strokeWidth="2.2"
                                    fill="transparent"
                                  />
                                  {/* Progress element */}
                                  <circle
                                    cx="9"
                                    cy="9"
                                    r={radius}
                                    className={`transition-all duration-300 ease-out ${
                                      isCapped ? 'stroke-emerald-400 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]' : 'stroke-amber-400 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]'
                                    }`}
                                    strokeWidth="2.2"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                              
                              {/* Balance indicator */}
                              <span className="font-mono text-xs font-black text-amber-300">
                                {giftTiles.toFixed(2)} Tiles
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3.5">
                      <h4 className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.15em] font-extrabold flex items-center gap-1.5">
                        ⚽ Today's Hot Fixtures
                      </h4>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Arena</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-3.5">
                      {[
                        {
                          id: 'match1',
                          title: '🏆 Kozhikode Riverbank Superclásico',
                          teamH: 'Argentina Fan Alliance',
                          teamA: 'Brazil Samba FC',
                          emojiH: '🇦🇷',
                          emojiA: '🇧🇷',
                          time: 'Tonight, 8:00 PM'
                        },
                        {
                          id: 'match2',
                          title: '⚓ Malabar Beach Sevens Derby',
                          teamH: 'Portugal Fan Block',
                          teamA: 'France Blues Block',
                          emojiH: '🇵🇹',
                          emojiA: '🇫🇷',
                          time: 'Tomorrow, 9:30 PM'
                        },
                        {
                          id: 'match3',
                          title: '⚡ Malappuram Sevens Final KO',
                          teamH: 'Malappuram Giants FC',
                          teamA: 'Gokulam Beach Rovers',
                          emojiH: '🟢',
                          emojiA: '🟡',
                          time: 'Sunday, 7:00 PM'
                        }
                      ].map(match => {
                        const chosenObj = predictions[match.id];
                        const chosenVal = chosenObj ? chosenObj.choice : undefined;
                        const statusVal = chosenObj ? chosenObj.status : undefined;
                        const isVerifying = isVerifyingPrediction === match.id || statusVal === 'simulating';

                        return (
                           <div key={match.id} id={`match-card-${match.id}`} className="bg-slate-900/55 border border-slate-850 hover:border-slate-800/85 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden group shadow-md hover:shadow-lg hover:shadow-slate-950/20">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold leading-tight text-white group-hover:text-amber-300 transition-colors duration-250">{match.title}</span>
                              <span className="text-[8px] text-slate-500 font-mono font-bold uppercase bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded-md shrink-0">{match.time}</span>
                            </div>

                            {isVerifying ? (
                              <div id={`match-verifying-${match.id}`} className="flex flex-col items-center justify-center py-4 bg-slate-950/80 rounded-xl border border-slate-900 gap-2.5">
                                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest font-extrabold animate-pulse">Referee simulating outcome...</span>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { label: `${match.emojiH} ${match.teamH.split(' ')[0]}`, val: 'Home' },
                                  { label: '🤝 Draw Match', val: 'Draw' },
                                  { label: `${match.emojiA} ${match.teamA.split(' ')[0]}`, val: 'Away' }
                                ].map(opt => {
                                  const isSelected = chosenVal === opt.val;
                                  return (
                                    <button
                                      key={opt.val}
                                      id={`match-${match.id}-opt-${opt.val}`}
                                      disabled={!!chosenVal}
                                      onClick={() => handleConfirmPrediction(match.id, opt.val)}
                                      className={`py-2 rounded-xl text-[10px] font-mono border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 leading-tight ${
                                        isSelected 
                                          ? 'bg-gradient-to-tr from-amber-950/50 to-amber-900/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/10' 
                                          : chosenVal 
                                            ? 'bg-slate-950/10 border-slate-950/80 text-slate-650 cursor-not-allowed opacity-35'
                                            : 'bg-slate-950/50 border-slate-850 hover:border-slate-700/80 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                      {isSelected && (
                                        <span className="text-[7px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black uppercase mt-0.5 tracking-wider animate-pulse">
                                          Predicted
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {chosenObj && statusVal === 'won' && (
                              <div id={`match-result-won-${match.id}`} className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2.5 animate-fade-in shadow-inner">
                                <div className="text-[10px] text-emerald-400 font-mono font-bold text-center flex items-center justify-center gap-1.5">
                                  🎯 Correct Prediction! The Referee has verified your champion choice.
                                </div>
                                <button
                                  onClick={() => handleClaimPredictionReward(match.id)}
                                  id={`claim-reward-btn-${match.id}`}
                                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-lg text-[9px] font-mono uppercase tracking-widest cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                                >
                                  🎁 Claim +0.2 Gift Tiles!
                                </button>
                              </div>
                            )}

                            {chosenObj && statusVal === 'lost' && (
                              <div id={`match-result-lost-${match.id}`} className="bg-red-950/15 border border-red-500/20 rounded-xl p-2.5 text-[10px] text-red-300 font-mono text-center">
                                ❌ Simulation Result: Prediction missed this match. Stay tuned for fresh regional fixtures!
                              </div>
                            )}

                            {chosenObj && statusVal === 'claimed' && (
                              <div id={`match-result-claimed-${match.id}`} className="bg-teal-900/10 border border-teal-500/15 rounded-xl p-2.5 text-[10px] text-teal-300 font-mono text-center flex items-center justify-center gap-1.5 shadow-inner">
                                <span>✅ Verified Reward Claimed! <strong>+0.2 Gift Tiles</strong> added.</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* THE REWARD REFERRALS INTERACTIVE DASHBOARD SECTION */
                  <div className="flex flex-col gap-4 animate-fade-in" id="referral-reward-dashboard">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Invite your community and WhatsApp soccer blocks! For each active fan that clicks your link and registers, we credit <span className="text-teal-400 font-bold">0.1 fractional tiles</span>. Reach 10 to claim a full <strong className="text-teal-400">Claim Slot tile (worth 1 full claim slot)</strong>!
                    </p>

                    {/* High-Fidelity Referral Progress Meter */}
                    <div className="w-full bg-slate-900/40 border border-teal-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shadow-teal-500/5 relative overflow-hidden" id="referrals-progress-container">
                      {/* Top accent glow */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

                      <div className="flex justify-between items-center sm:flex-row flex-col gap-2">
                        <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start">
                          <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                          Progress & Claim Milestones
                        </span>
                        <span className="text-xs text-teal-300 font-mono font-black py-1 px-2.5 bg-teal-950/40 rounded-xl border border-teal-500/10 shrink-0" id="referral-count-label">
                          Total Invites: <strong className="text-white text-sm bg-teal-500 text-slate-950 px-1.5 py-0.5 rounded-md font-sans">{referralData.referredCount}</strong>
                        </span>
                      </div>

                      {/* Dynamic Goal Progress Label */}
                      <div className="text-[11px] font-mono font-bold text-slate-200 bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between shadow-inner">
                        <span className="text-slate-400">Next Target:</span>
                        <span className="text-teal-300">
                          {referralData.referredCount < 10 ? (
                            `Reach 10 to unlock +3 Claim Slots (${referralData.referredCount}/10)`
                          ) : referralData.referredCount < 20 ? (
                            `Reach 20 to unlock +5 Claim Slots (${referralData.referredCount}/20)`
                          ) : referralData.referredCount < 30 ? (
                            `Reach 30 to unlock +7 Claim Slots (${referralData.referredCount}/30)`
                          ) : referralData.referredCount < 40 ? (
                            `Reach 40 to unlock +9 Claim Slots (${referralData.referredCount}/40)`
                          ) : referralData.referredCount < 50 ? (
                            `Reach 50 to unlock +15 Ultimate Slots (${referralData.referredCount}/50)`
                          ) : (
                            `Ultimate milestone achieved! (50/50)`
                          )}
                        </span>
                      </div>

                      {/* Bar Filling Up */}
                      <div className="w-full h-4 bg-slate-950 rounded-full border border-slate-800/80 overflow-hidden relative p-0.5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.min(100, (referralData.referredCount / 50) * 100)}%` 
                          }}
                          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                        />
                      </div>

                      {/* Interactive Visual Milestones checklist requested by user */}
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block border-b border-slate-850 pb-1">
                          🎁 Completed & Upcoming Tiers:
                        </span>
                        
                        {[
                          { count: 10, reward: "3 Tiles / Slots", desc: "Unlock 3 free sector slots", current: referralData.referredCount, label: "10 Invites Milestone" },
                          { count: 20, reward: "5 Tiles / Slots", desc: "Base fans multiplier reward", current: referralData.referredCount, label: "20 Invites Milestone" },
                          { count: 30, reward: "7 Tiles / Slots", desc: "Streak bonus booster reward", current: referralData.referredCount, label: "30 Invites Milestone" },
                          { count: 40, reward: "9 Tiles / Slots", desc: "Mega community champion tier", current: referralData.referredCount, label: "40 Invites Milestone" },
                          { count: 50, reward: "15 Claim Slots", desc: "Ultimate regional server owner slots", current: referralData.referredCount, label: "50 Invites Ultimate Tier" },
                        ].map((m, idx) => {
                          const isAchieved = m.current >= m.count;
                          return (
                            <div 
                              key={idx} 
                              className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-mono transition-all ${
                                isAchieved 
                                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
                                  : 'bg-slate-950/45 border-slate-850/60 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isAchieved ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'}`} />
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-slate-200">{m.label}</span>
                                  <span className="text-[8px] text-slate-550">{m.desc}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                                isAchieved 
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/20' 
                                  : 'bg-slate-900/60 text-slate-500 border border-slate-850'
                              }`}>
                                {isAchieved ? `Claimed ${m.reward}` : m.reward}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1">
                        <span>0 Invites</span>
                        <span className="text-slate-400 bg-teal-900/10 px-2 py-0.5 rounded border border-teal-500/10">
                          Total Referral Progress: {Math.round(Math.min(100, (referralData.referredCount / 50) * 100))}%
                        </span>
                        <span>50 Invites (+15 Slots!)</span>
                      </div>
                    </div>

                    {/* Copy Link Section */}
                    <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl flex flex-col gap-2 shadow-sm">
                      <label className="text-[9px] text-slate-450 font-mono uppercase tracking-widest font-bold">Your Unique Invite URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-300 select-all focus:outline-none focus:border-slate-700"
                          value={`${window.location.protocol}//${window.location.host}/?ref=${loggedInUser?.username || 'Fan'}`}
                        />
                        <button
                          onClick={() => {
                            const link = `${window.location.protocol}//${window.location.host}/?ref=${loggedInUser?.username || 'Fan'}`;
                            navigator.clipboard.writeText(link);
                            setToast({
                              message: "Copied to Clipboard! 📋🎉",
                              description: "Referral URL copied successfully. Send on WhatsApp and group chats!",
                              type: "success"
                            });
                          }}
                          className="px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-mono rounded-xl text-[10px] flex items-center gap-1.5 transition-all active:scale-95 uppercase tracking-wide cursor-pointer border border-teal-400/20 shadow-md shadow-teal-500/5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Simulator Card for Quick Sandboxing */}
                    <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex flex-col gap-2.5">
                      <span className="text-[9px] font-mono text-amber-500 uppercase font-extrabold tracking-wider">🛠️ Play & Verify Developer Sandbox</span>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-mono">
                        Simulate that one of your referred friends clicked the link, registered, and verified their email address to trigger instant tile allocation.
                      </p>
                      <button
                        onClick={() => {
                          const refName = `fc_fan_${Math.floor(100 + Math.random() * 900)}`;
                          processReferral(refName);
                        }}
                        className="py-2.5 bg-gradient-to-r from-teal-500/10 via-teal-500/15 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20 text-teal-300 hover:text-teal-200 border border-teal-500/25 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                      >
                        <span>Simulate Successful Referral Click 🔗⚽</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-850/60 flex justify-end">
                <button
                  onClick={() => setShowPredictionModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                  id="prediction-back-to-map-btn"
                >
                  Back to Map
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7.6 Football Fan Authentication Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-[28px] max-w-[420px] w-full p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              {/* Top ambient color rings */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none opacity-50" />
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none opacity-40" />

              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-xl cursor-pointer transition-all z-10 border border-slate-850/50"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5 relative z-10">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3 border border-amber-500/20 shadow-md">
                  <User className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white leading-none tracking-tight">
                  {isRegisterMode ? 'Register Fan Account' : 'Football Fan Login'}
                </h3>
                <p className="text-[10px] text-slate-450 mt-1 font-mono tracking-wider uppercase">
                  {isRegisterMode ? 'Sign up to unlock +1 FREE slot' : 'Sync your claimed tiles & custom badges'}
                </p>
              </div>

              {/* Db Synchronized Connectivity Pillar */}
              <div className="mb-4 relative z-10 flex flex-col gap-2">
                {isSupabaseConfigured ? (
                  <>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl py-2 px-3 text-[10px] font-mono text-emerald-300 flex items-center gap-2 shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div className="leading-tight flex-1">
                        <span className="font-extrabold block uppercase tracking-wide">Cloud Database Core Active</span>
                        <span className="text-emerald-400/80">Syncing authentication logs & claims with Supabase</span>
                      </div>
                    </div>
                    
                    {missingTables.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-2.5 px-3 text-[10.5px] font-mono text-rose-300 flex flex-col gap-1.5 shadow-inner">
                        <span className="font-extrabold uppercase tracking-wide text-rose-400 flex items-center gap-1.5">
                          ⚠️ Database Tables Missing
                        </span>
                        <p className="text-[10px] text-rose-400/70 leading-normal">
                          Connection successful, but the <span className="font-extrabold underline text-rose-300">{missingTables.join(', ')}</span> table is missing. Falling back gracefully to LocalStorage/Sandbox.
                        </p>
                        <div className="mt-1.5 flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              resetMissingTableCache();
                              setToast({
                                message: "Database Cache Reset! 🧙‍♂️",
                                description: "Refreshing database connections to re-evaluate table schemas...",
                                type: "info"
                              });
                            }}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold uppercase px-2 py-1 rounded text-[8.5px] tracking-wide cursor-pointer transition-colors"
                          >
                            Re-verify Database
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setShowFixSql(!showFixSql)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-205 font-extrabold uppercase px-2 py-1 rounded text-[8.5px] tracking-wide cursor-pointer transition-colors"
                          >
                            {showFixSql ? "Hide SQL Script" : "Fix with SQL Script"}
                          </button>
                        </div>

                        {showFixSql && (() => {
                          const sqlToFix = missingTables
                            .map(name => {
                              if (name === 'users') {
                                return `-- 1. Create Users Table\nCREATE TABLE IF NOT EXISTS public.users (\n  email TEXT PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  password TEXT,\n  favorite_club TEXT DEFAULT 'None',\n  is_admin BOOLEAN DEFAULT false,\n  picture TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);`;
                              }
                              if (name === 'tiles') {
                                return `-- 2. Create Tiles Table\nCREATE TABLE IF NOT EXISTS public.tiles (\n  id TEXT PRIMARY KEY,\n  team TEXT NOT NULL DEFAULT 'None',\n  photo TEXT,\n  claimed_by TEXT,\n  custom_text TEXT,\n  text_background_style TEXT DEFAULT 'none',\n  image_border_style TEXT DEFAULT 'none',\n  hyperlink TEXT,\n  merged_with JSONB,\n  is_merged_child BOOLEAN DEFAULT false,\n  merged_parent_id TEXT,\n  chats JSONB DEFAULT '[]'::jsonb,\n  last_claimed_at TIMESTAMP WITH TIME ZONE\n);`;
                              }
                              if (name === 'blocked_user_emails') {
                                return `-- 3. Create Blocked Emails Table\nCREATE TABLE IF NOT EXISTS public.blocked_user_emails (\n  email TEXT PRIMARY KEY,\n  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);`;
                              }
                              if (name === 'activity_logs') {
                                return `-- 4. Create Activity Logs Table\nCREATE TABLE IF NOT EXISTS public.activity_logs (\n  id BIGSERIAL PRIMARY KEY,\n  username TEXT NOT NULL,\n  action_type TEXT NOT NULL,\n  description TEXT NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);`;
                              }
                              return '';
                            })
                            .filter(Boolean)
                            .join('\n\n');

                          return (
                            <div className="mt-2 text-[10px] border-t border-rose-500/10 pt-2.5 flex flex-col gap-2">
                              <span className="font-bold text-rose-400 capitalize block">
                                SQL to create missing {missingTables.length === 1 ? 'table' : 'tables'}:
                              </span>
                              <pre className="text-[8px] leading-normal font-mono text-slate-350 bg-slate-950/90 p-2 rounded border border-slate-800 overflow-x-auto max-h-[150px] whitespace-pre">
                                {sqlToFix}
                              </pre>
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    navigator.clipboard.writeText(sqlToFix);
                                    setToast({
                                      message: "Copied SQL to Clipboard! 📋",
                                      description: "Now navigate to your Supabase -> SQL Editor, paste the query, run it, and click 'Re-verify'!",
                                      type: "success"
                                    });
                                  } catch (err) {
                                    console.warn("Clipboards access error", err);
                                  }
                                }}
                                className="w-full bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 mt-0.5 border border-rose-500/40 py-1 rounded font-extrabold uppercase text-[9px] tracking-wide cursor-pointer transition-colors text-center"
                              >
                                Copy SQL Code 📋
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {missingBuckets.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl py-2.5 px-3 text-[10.5px] font-mono text-amber-300 flex flex-col gap-1.5 shadow-inner">
                        <span className="font-extrabold uppercase tracking-wide text-amber-400 flex items-center gap-1.5">
                          🪣 Storage Bucket Missing
                        </span>
                        <p className="text-[10px] text-amber-300/70 leading-normal">
                          The required Supabase Storage bucket <span className="font-extrabold underline text-amber-200">'{missingBuckets.join(', ')}'</span> is missing. Uploads will fall back to local base64 compression.
                        </p>
                        <div className="mt-1 bg-slate-950 p-2.5 rounded border border-slate-850 flex flex-col gap-1 text-[9.5px]">
                          <span className="font-extrabold text-amber-300 uppercase block tracking-wider">How to configure in Supabase:</span>
                          <ol className="list-decimal list-inside text-amber-400/80 space-y-0.5 leading-normal">
                            <li>Navigate to your <span className="text-white underline">Supabase Dashboard</span> & select project</li>
                            <li>Click on <span className="font-black text-amber-200">Storage</span> in the left sidebar menu</li>
                            <li>Click <span className="font-black text-amber-200">+ New Bucket</span></li>
                            <li>Name it exactly: <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-extrabold select-all">tile-photos</code></li>
                            <li>Enable the <span className="font-black text-amber-200">Public Bucket</span> toggle switches</li>
                            <li>Save & optional: Add a Policy granting insert/select access.</li>
                          </ol>
                        </div>
                        <div className="mt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              resetMissingTableCache();
                              setToast({
                                message: "Database & Storage Caches Reset! 🧙‍♂️",
                                description: "Refreshing database tables and storage bucket structures...",
                                type: "info"
                              });
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold uppercase px-2 py-1 rounded text-[8.5px] tracking-wide cursor-pointer transition-colors"
                          >
                            Re-verify Assets 🔄
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl py-2 px-3 text-[10px] font-mono text-amber-300 flex items-center gap-2 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <div className="leading-tight">
                      <span className="font-extrabold block uppercase tracking-wide">Offline Local Sandbox Engine</span>
                      <span className="text-amber-400/80">Local demo accounts active. Perfect for sandbox testing.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Styled Tabbed Switcher Row */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850 gap-1 mb-5 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-[10.5px] font-mono font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isRegisterMode
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <span>🔑 Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-[10.5px] font-mono font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    isRegisterMode
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <span>🛡️ Register</span>
                </button>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignInTrigger}
                disabled={isAuthLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-[10.5px] font-bold border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer mb-5 uppercase tracking-wide font-mono shadow-md relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                id="google-oauth-login-btn"
              >
                {isAuthLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-amber-400 rounded-full animate-spin shrink-0" />
                ) : (
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.4-2.865-6.4-6.4 0-3.535 2.865-6.4 6.4-6.4 1.582 0 3.027.574 4.147 1.518l3.12-3.12C19.418 2.3 16.012 1.057 12.24 1.057 6.136 1.057 1.2 5.992 1.2 12c0 6.007 4.936 10.943 11.04 10.943 5.753 0 10.37-4.114 10.37-10.457 0-.585-.052-1.125-.135-1.63L12.24 10.286z" />
                  </svg>
                )}
                <span>{isAuthLoading ? 'Authenticating...' : 'Log in with Google OAuth'}</span>
              </button>

              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="h-px bg-slate-850 flex-1" />
                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">or sign in manually</span>
                <div className="h-px bg-slate-850 flex-1" />
              </div>

              {/* One-Click Quick Demo Access (For lightning fast evaluation) */}
              {!isSupabaseConfigured && (
                <div className="mb-4 p-3 bg-slate-950/40 border border-slate-800 rounded-2xl relative z-10 flex flex-col gap-2 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-teal-400 uppercase font-extrabold tracking-wider">⚡ Quick Sandbox Access:</span>
                    <span className="text-[8px] bg-teal-500/10 text-teal-305 font-mono px-1.5 py-0.5 rounded uppercase border border-teal-500/20 font-bold">Instant Mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleInstantDemoLogin();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-emerald-500/15 hover:from-teal-500/25 hover:to-emerald-500/30 text-teal-300 hover:text-white border border-teal-500/25 hover:border-teal-500/50 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none"
                    id="fast-instant-demo-login-btn"
                  >
                    <span>⚡ Instant Demo Fan (1-Click Login)</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('admin@footballmap.com');
                        setLoginPassword('admin123');
                        setIsRegisterMode(false);
                        setToast({
                          message: "Admin credentials autofilled! 👑",
                          description: "Click 'Log In' below or press enter to proceed instantly.",
                          type: "info"
                        });
                      }}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-amber-500/40 text-[10px] font-mono text-slate-350 hover:text-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      Autofill Admin 👑
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('maestro@kerala.in');
                        setLoginPassword('user123');
                        setIsRegisterMode(false);
                        setToast({
                          message: "Demo Fan credentials autofilled! ⚽",
                          description: "Click 'Log In' below or press enter to proceed instantly.",
                          type: "info"
                        });
                      }}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-amber-500/40 text-[10px] font-mono text-slate-350 hover:text-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      Autofill Fan ⚽
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={isRegisterMode ? handleUserRegisterSubmit : handleUserLoginSubmit} className="flex flex-col gap-4 relative z-10">
                {/* Email input */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1 tracking-wider font-bold">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <input
                      type="email"
                      required
                      disabled={isAuthLoading}
                      placeholder="e.g. keralasuperfan@gmail.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Nickname input */}
                {isRegisterMode && (
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1 tracking-wider font-bold">
                      Create Nickname
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                      <input
                        type="text"
                        required={isRegisterMode}
                        disabled={isAuthLoading}
                        placeholder="e.g. YellowArmyLegend"
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {/* Password input */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1 tracking-wider font-bold">
                    {isSupabaseConfigured ? 'Account Password' : 'Simulated Password / PIN'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <input
                      type={showAuthPassword ? "text" : "password"}
                      required
                      disabled={isAuthLoading}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={isAuthLoading}
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                      title={showAuthPassword ? "Hide password" : "Show password"}
                    >
                      {showAuthPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {isSupabaseConfigured && isRegisterMode && (
                    <p className="text-[9px] text-emerald-450 text-emerald-400/80 font-mono mt-1 leading-normal">
                      🛡️ Needs to be at least 6 characters for cloud registration security.
                    </p>
                  )}
                </div>



                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-2.5 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider font-mono transition-all mt-1 cursor-pointer shadow-md shadow-amber-500/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAuthLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>{isRegisterMode ? 'Create Account & Claim +1 Slot' : 'Log In'}</span>
                  )}
                </button>
              </form>

              {/* Demo Account guidelines in Sandbox mode */}
              {!isSupabaseConfigured && !isRegisterMode && (
                <div className="bg-slate-950/65 border border-slate-850/50 p-2.5 rounded-2xl text-[9px] text-slate-450 leading-normal text-left flex flex-col gap-1 mt-4 font-mono shadow-inner">
                  <div className="font-extrabold text-slate-350 uppercase tracking-wider flex items-center gap-1">
                    <span>💡 Sandbox Demo Credentials:</span>
                  </div>
                  <div>
                    • Admin account: <span className="text-amber-400 select-all">admin@footballmap.com</span> (PIN: <span className="text-amber-400 select-all">admin123</span>)
                  </div>
                  <div>
                    • Demo Fan: <span className="text-amber-400 select-all">maestro@kerala.in</span> (PIN: <span className="text-amber-400 select-all">user123</span>)
                  </div>
                </div>
              )}

              {/* Toggle text footer helper */}
              <div className="text-center mt-5 pt-3.5 border-t border-slate-850 text-[10px] relative z-10 font-sans">
                {isRegisterMode ? (
                  <p className="text-slate-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-400">
                    New to the football religion?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Register & Get 1 Free Slot!
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7.7 Supabase Email Verification Modal */}
      <AnimatePresence>
        {showVerificationPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-3xl max-w-sm w-full p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] relative overflow-hidden text-center animate-fade-in"
              id="email-verification-sent-modal"
            >
              {/* Highlight Ambient Glow */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none opacity-50" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none opacity-50" />

              <button 
                onClick={() => setShowVerificationPopup(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all z-10"
                title="Close popup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20 shadow-md relative z-10">
                <Mail className="w-7 h-7 text-amber-400" />
              </div>

              <h3 className="text-base font-black text-white leading-tight tracking-tight relative z-10">
                Verify Your Fan Identity! ⚽📩
              </h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-mono tracking-widest uppercase font-extrabold block relative z-10">
                Verification Email Dispatched
              </p>

              <div className="my-4 p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-left relative z-10 font-sans">
                <p className="text-[11.5px] text-slate-300 leading-relaxed font-semibold">
                  We've sent a secure login activation link to:
                </p>
                <p className="text-[12px] font-bold font-mono text-amber-400 break-all mt-1 bg-amber-950/40 border border-amber-500/15 px-2.5 py-1.5 rounded-lg select-all">
                  {verificationEmail}
                </p>
                <p className="text-[11px] text-slate-400 leading-normal mt-3">
                  Please click the confirmation button below or check your inbox to activate your credentials in the official database.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 text-[10px] font-mono text-slate-400 leading-normal text-left flex gap-2 items-start mb-5 shadow-inner relative z-10">
                <span className="text-amber-400 shrink-0 select-none">💡</span>
                <div>
                  <span className="font-extrabold text-slate-300">Sandbox Trial:</span> Click "Approve Verification Click" below to immediately confirm verification.
                </div>
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <button
                  onClick={() => handleSimulateVerification(verificationEmail)}
                  disabled={isAuthLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  id="sandbox-email-confirm-btn"
                >
                  {isAuthLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                  )}
                  <span>{isAuthLoading ? 'Verifying Profile...' : 'Approve Verification Click ✅'}</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/u/0/#search/from%3Anoreply+supabase`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-extrabold rounded-xl text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-800/80"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Gmail Inbox
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Footer Policy/Information Modals Overlay */}
      <AnimatePresence>
        {activeFooterModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <button 
                onClick={() => setActiveFooterModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950/60 p-1.5 rounded-full transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left mt-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
                  {activeFooterModal.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-mono mt-4 break-words bg-slate-950/40 p-4 border border-slate-850 rounded-xl whitespace-pre-line">
                  {activeFooterModal.content}
                </p>
                
                <div className="mt-5 flex justify-end">
                  <button 
                    onClick={() => setActiveFooterModal(null)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Alright, Got it!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7.1 Territory Engagement Overlay Dialog */}
      <AnimatePresence>
        {ownerEngagementTile && (() => {
          const ownerName = ownerEngagementTile.claimedBy || 'Guest';
          const rankings = getUserRankings();
          const ownerRanking = rankings.find(r => r.username === ownerName);
          const totalTilesEarned = ownerRanking ? ownerRanking.tiles : 1;
          const tileValue = (ownerEngagementTile.mergedWith && ownerEngagementTile.mergedWith.length > 0) 
            ? ownerEngagementTile.mergedWith.length * 15 + 10 
            : 15;
          const dicebearSeed = encodeURIComponent(ownerName);
          const profilePhotoUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${dicebearSeed}`;
          const teamColorStyle = TEAM_STYLES[ownerEngagementTile.team || 'None'] || TEAM_STYLES['None'];

          return (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden text-left"
              >
                <div 
                  className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500" 
                  style={{ backgroundColor: teamColorStyle.color || '#10b981' }}
                />

                <button 
                  onClick={() => setOwnerEngagementTile(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950/60 p-1.5 rounded-full transition-colors cursor-pointer z-10"
                  title="Close Popup"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ⚔️ Territory Engagement
                  </span>
                  <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mt-3">
                    Sector {ownerEngagementTile.id}
                  </h3>
                </div>

                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 flex flex-col items-center gap-4 text-center relative">
                  <span 
                    className="absolute top-3 right-3 text-[10px] font-mono uppercase font-bold text-white px-2 py-0.5 rounded-lg border flex items-center gap-1 shadow-inner"
                    style={{ 
                      backgroundColor: `${teamColorStyle.color}15`, 
                      borderColor: `${teamColorStyle.color}40`,
                      color: teamColorStyle.color || '#fff'
                    }}
                  >
                    {ownerEngagementTile.team !== 'None' ? `${teamColorStyle.flagEmoji} ${ownerEngagementTile.team}` : 'No Club Allegiance'}
                  </span>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-1 shadow-lg">
                      <img 
                        src={profilePhotoUrl} 
                        alt={`${ownerName} Avatar`} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {ownerRanking?.avatarEmoji && (
                      <span className="absolute -bottom-2 -right-2 text-base bg-slate-900 border border-slate-800 w-6 h-6 rounded-lg flex items-center justify-center shadow-lg">
                        {ownerRanking.avatarEmoji}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Territory Sovereign</span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5 tracking-tight">
                      @{ownerName}
                    </h4>
                  </div>

                  <div className="w-full h-px bg-slate-900" />

                  <div className="grid grid-cols-1 gap-3 w-full">
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-2 text-center">
                      <span className="text-[9px] uppercase font-mono text-slate-500 font-medium block">Total Plot Earned</span>
                      <span className="text-xs font-mono font-extrabold text-emerald-400 block mt-1">
                        ⛰️ {totalTilesEarned} {totalTilesEarned === 1 ? 'Sector' : 'Sectors'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {ownerEngagementTile.customText && (
                    <p className="text-center font-mono text-[10px] text-slate-400 bg-slate-950/20 border border-slate-850 p-2.5 rounded-xl block italic">
                      &ldquo;{ownerEngagementTile.customText}&rdquo;
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setOwnerEngagementTile(null);
                      setSelectedTileId(ownerEngagementTile.id);
                      setToast({
                        message: "Target Locked! 🎯",
                        description: `Focused details on Sector ${ownerEngagementTile.id}. Click 'Forceful Conquering' to reclaim this land!`,
                        type: "info"
                      });
                    }}
                    className="w-full btn-interactive py-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-[10px] font-mono uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                  >
                    <span>⚔️ View Board / Challenge Sector</span>
                  </button>
                  
                  <button
                    onClick={() => setOwnerEngagementTile(null)}
                    className="w-full btn-interactive py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-mono uppercase transition-colors cursor-pointer"
                  >
                    Dismiss Dialog
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Normal User Buy Slots Modal */}
      <AnimatePresence>
        {showBuySlotsModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              <button
                onClick={() => setShowBuySlotsModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-955/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="mx-auto w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-3 border border-teal-500/20 shadow-md">
                  <Coins className="w-6 h-6 text-teal-450 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white leading-none">
                  Simulated Slot Store
                </h3>
                <p className="text-[10px] text-teal-400 mt-1 font-mono tracking-wider uppercase">
                  Expand claim capacity with sandbox tokens
                </p>
              </div>

              <div className="flex flex-col gap-3.5 text-left">
                <label className="text-[10px] font-mono text-slate-450 uppercase block mb-1">Select Claim Slots Bundle</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { count: 1, price: 10, save: 0 },
                    { count: 3, price: 25, save: 5 },
                    { count: 5, price: 40, save: 10 },
                    { count: 10, price: 75, save: 25 }
                  ].map((pkg) => (
                    <button
                      key={pkg.count}
                      onClick={() => setSlotsToBuy(pkg.count)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        slotsToBuy === pkg.count
                          ? 'bg-teal-950/40 border-teal-500 text-white'
                          : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-750'
                      }`}
                    >
                      <div className="text-xs font-bold block">{pkg.count} Claim {pkg.count === 1 ? 'Slot' : 'Slots'}</div>
                      <div className="text-sm font-black font-mono text-teal-450 mt-1">₹{pkg.price}</div>
                      {pkg.save > 0 && (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-450 px-1 py-0.5 rounded uppercase font-bold mt-1 inline-block border border-emerald-500/10">Save ₹{pkg.save}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <label className="text-[10px] font-mono text-slate-450 uppercase block mb-1">Simulated Gateway payment option</label>
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-teal-400 shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white leading-none">Unified Sandbox UPI Payment</div>
                      <div className="text-[9px] text-slate-550 font-mono mt-1">GPay / PhonePe / Credit Simulator</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={purchaseLoading}
                  onClick={() => {
                    setPurchaseLoading(true);
                    setTimeout(() => {
                      setPurchaseLoading(false);
                      const cost = slotsToBuy === 1 ? 10 : slotsToBuy === 3 ? 25 : slotsToBuy === 5 ? 40 : 75;
                      const nextSlotsValue = freeSlots + slotsToBuy;
                      setFreeSlots(nextSlotsValue);
                      localStorage.setItem('kerala_claimed_free_slots_count', nextSlotsValue.toString());
                      setShowBuySlotsModal(false);
                      setToast({
                        message: "Purchase Approved! 🪙",
                        description: `Successfully debited ₹${cost} from sandbox balance. Added +${slotsToBuy} slots to your wallet!`,
                        type: "success"
                      });
                    }, 1200);
                  }}
                  className="w-full py-2.5 bg-gradient-to-tr from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider font-mono transition-all mt-1.5 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {purchaseLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Pay ₹{slotsToBuy === 1 ? 10 : slotsToBuy === 3 ? 25 : slotsToBuy === 5 ? 40 : 75} Now</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Normal User My Territories Modal */}
      <AnimatePresence>
        {showMyTerritoriesModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-y-auto max-h-[88vh] scrollbar-none"
            >
              <button
                onClick={() => setShowMyTerritoriesModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-955/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3 border border-amber-500/20 shadow-md">
                  <Map className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-white leading-none">
                  My Claimed Territories
                </h3>
                <p className="text-[10px] text-amber-400 mt-1 font-mono tracking-wider uppercase font-semibold">
                  Manage sectors owned by @{loggedInUser?.username || 'Guest'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {(() => {
                  const currentUser = loggedInUser?.username || 'Guest';
                  const myTerritories = Object.values(tiles).filter(
                    (tile: any) => tile.claimedBy === currentUser && !tile.isMergedChild
                  );

                  if (myTerritories.length === 0) {
                    return (
                      <div className="text-center py-8 px-4 bg-slate-955/50 rounded-2xl border border-slate-850">
                        <p className="text-xs font-mono text-slate-500">You do not own any sectors yet!</p>
                        <button
                          onClick={() => setShowMyTerritoriesModal(false)}
                          className="mt-4 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase font-mono rounded-lg transition-colors cursor-pointer"
                        >
                          Explore Map Grid
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1.5 scrollbar-thin">
                      {myTerritories.map((tile: any) => {
                        const style = TEAM_STYLES[tile.team] || TEAM_STYLES['None'];
                        const isMergedParent = tile.mergedWith && tile.mergedWith.length > 0;
                        const isMergedChild = tile.isMergedChild;
                        
                        return (
                          <div key={tile.id} className="p-3 bg-slate-955/50 border border-slate-850 rounded-xl flex items-center justify-between text-left gap-2">
                            <div className="text-left min-w-0">
                              <span className="text-[11px] font-extrabold font-mono text-slate-350 flex items-center gap-1.5">
                                <span className="text-amber-500">🎯</span> SECTOR {tile.id}
                              </span>
                              
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono text-white flex items-center gap-1 border border-white/5 bg-slate-900" style={{ borderColor: `${style.color}30` }}>
                                  <span>{style.flagEmoji}</span>
                                  <span style={{ color: style.color || '#fff' }}>{tile.team}</span>
                                </span>
                                {isMergedParent && (
                                  <span className="text-[8px] bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded font-mono font-bold">
                                    🧩 Merged Group ({tile.mergedWith.length})
                                  </span>
                                )}
                                {isMergedChild && (
                                  <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono font-bold">
                                    🔗 Merged Sub-sector
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setShowMyTerritoriesModal(false);
                                  triggerTileSelection(tile.id);
                                }}
                                className="p-1 px-2.5 bg-gradient-to-r from-teal-900/40 to-emerald-900/40 hover:from-teal-550 hover:to-emerald-550 border border-teal-500/30 hover:border-emerald-400 text-teal-400 hover:text-slate-950 font-mono text-[9px] uppercase font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                title="Go directly to this tile location on the map"
                              >
                                <span>Go</span>
                                <Navigation className="w-2.5 h-2.5 rotate-45" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to release sector ${tile.id}?`)) {
                                    releaseUserTile(tile.id);
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-300 bg-red-955/30 border border-red-550/15 hover:border-red-500/40 rounded-lg transition-all cursor-pointer"
                                title="Vacate Territory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Super Admin Control Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAdminPanel(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-955/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left border-b border-slate-800 pb-3.5 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-white">Central Admin Terminal</h3>
                    <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Super Admin Sandbox Controls</p>
                  </div>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-slate-800 mb-4 pb-2 p-0.5 gap-1.5 scrollbar-none overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('derby')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeAdminTab === 'derby'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Derby Match</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('images')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeAdminTab === 'images'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Assets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('users')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeAdminTab === 'users'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Users Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('activity')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeAdminTab === 'activity'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Activity Logs</span>
                </button>
              </div>

              {/* Sub tabs in Admin Panel */}
              <div className="flex flex-col gap-4 max-h-[62vh] overflow-y-auto scrollbar-none">
                {/* 1. Prediction game management */}
                {activeAdminTab === 'derby' && (
                  <div className="p-4 bg-slate-955/40 border border-slate-850 rounded-2xl text-left">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-mono uppercase">
                    <Gamepad2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Prediction Creator & Settlement</span>
                  </h4>
                  <div className="mt-3 flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-450 uppercase block mb-1">Active Derby Title</label>
                      <input
                        type="text"
                        value={adminPredictionMatch.title}
                        onChange={(e) => {
                          const n = { ...adminPredictionMatch, title: e.target.value };
                          setAdminPredictionMatch(n);
                          localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-slate-450 uppercase block mb-1">Rep Team A</label>
                        <select
                          value={adminPredictionMatch.teamA}
                          onChange={(e) => {
                            const n = { ...adminPredictionMatch, teamA: e.target.value };
                            setAdminPredictionMatch(n);
                            localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="Argentina">🇦🇷 Argentina</option>
                          <option value="Brazil">🇧🇷 Brazil</option>
                          <option value="Portugal">🇵🇹 Portugal</option>
                          <option value="France">🇫🇷 France</option>
                          <option value="Germany">🇩🇪 Germany</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-450 uppercase block mb-1">Rep Team B</label>
                        <select
                          value={adminPredictionMatch.teamB}
                          onChange={(e) => {
                            const n = { ...adminPredictionMatch, teamB: e.target.value };
                            setAdminPredictionMatch(n);
                            localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="Argentina">🇦🇷 Argentina</option>
                          <option value="Brazil">🇧🇷 Brazil</option>
                          <option value="Portugal">🇵🇹 Portugal</option>
                          <option value="France">🇫🇷 France</option>
                          <option value="Germany">🇩🇪 Germany</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-905 px-3 py-2 rounded-xl mt-1 border border-slate-850">
                      <span className="text-[10px] font-mono text-slate-400">STATUS:</span>
                      <div className="flex gap-1.5">
                        {['open', 'closed', 'settled'].map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              const n = { ...adminPredictionMatch, status: st as any };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                              setToast({
                                message: `Derby status: ${st.toUpperCase()}!`,
                                description: "Updated configuration in simulation namespace.",
                                type: "info"
                              });
                            }}
                            className={`px-2 py-0.5 rounded text-[8.5px] font-mono uppercase font-extrabold cursor-pointer border ${
                              adminPredictionMatch.status === st
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-slate-950 text-slate-500 border-transparent'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {adminPredictionMatch.status === 'settled' && (
                      <div className="mt-1 bg-slate-900 p-2.5 rounded-xl border border-slate-855 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Winning Side:</span>
                        <select
                          value={adminPredictionMatch.winningTeam}
                          onChange={(e) => {
                            const wt = e.target.value;
                            const n = { ...adminPredictionMatch, winningTeam: wt };
                            setAdminPredictionMatch(n);
                            localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));

                            // Auto settle predictions logic for payout demonstration!
                            const nextPreds = { ...predictions };
                            let settledCount = 0;
                            Object.keys(nextPreds).forEach((pId) => {
                              const pred = nextPreds[pId];
                              if (pred.status === 'simulating' || pred.status === 'won' || pred.status === 'lost') {
                                if (pred.choice === wt) {
                                  nextPreds[pId] = { ...pred, status: 'won' };
                                  settledCount++;
                                } else {
                                  nextPreds[pId] = { ...pred, status: 'lost' };
                                }
                              }
                            });
                            setPredictions(nextPreds);
                            localStorage.setItem('kerala_submitted_predictions_v3', JSON.stringify(nextPreds));

                            setToast({
                              message: "Derby Settlement 💸",
                              description: `Payout processed! ${settledCount} matching picks awarded free slot grants.`,
                              type: "success"
                            });
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-300"
                        >
                          <option value="None">-- Select Winner --</option>
                          <option value={adminPredictionMatch.teamA}>{adminPredictionMatch.teamA}</option>
                          <option value={adminPredictionMatch.teamB}>{adminPredictionMatch.teamB}</option>
                          <option value="Draw">Draw Match</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* 2. Review Images URI list */}
                {activeAdminTab === 'images' && (
                  <div className="p-4 bg-slate-955/40 border border-slate-855 rounded-2xl text-left">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-mono uppercase">
                    <Camera className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Review Uploaded Images & Claims</span>
                  </h4>
                  <div className="mt-3 flex flex-col gap-2 max-h-[35vh] overflow-y-auto pr-1">
                    {(() => {
                      const imageTiles = Object.values(tiles).filter(
                        (t: any) => t.team !== 'None' && (t.photo || t.customText || t.hyperlink)
                      );
                      if (imageTiles.length === 0) {
                        return (
                          <p className="text-[10.5px] font-mono text-slate-500 text-center py-4">No uploaded images, custom text or hyperlinks detected in sandbox.</p>
                        );
                      }

                      return imageTiles.map((tile: any) => (
                        <div key={tile.id} className="p-2.5 bg-slate-955/65 border border-slate-850 rounded-xl flex items-start justify-between gap-3text-left">
                          <div className="flex items-start gap-2.5 text-left min-w-0">
                            {tile.photo ? (
                              <img
                                src={tile.photo}
                                alt="UGC Preview"
                                className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-900 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-[9px] text-slate-500 shrink-0">Text</div>
                            )}
                            <div className="min-w-0">
                              <span className="text-[10px] font-extrabold font-mono text-slate-350 block">SEC-{tile.id} (@{tile.claimedBy || 'Guest'})</span>
                              {tile.customText && (
                                <p className="text-[9.5px] font-mono text-slate-500 leading-none truncate max-w-[150px] mt-0.5">"{tile.customText}"</p>
                              )}
                              {tile.hyperlink && (
                                <a href={tile.hyperlink} target="_blank" className="text-[9px] font-mono text-teal-400 truncate max-w-[150px] hover:underline block leading-none mt-1">{tile.hyperlink}</a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {tile.photo && (
                              <button
                                onClick={() => {
                                  updateTileInState(tile.id, { ...tile, photo: '' });
                                  setToast({
                                    message: "Image Dropped!",
                                    description: `Cleared the UGC banner picture URL from Sector ${tile.id}.`,
                                    type: "success"
                                  });
                                }}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-500 rounded-md border border-slate-800 hover:border-amber-500/25 transition-colors cursor-pointer"
                                title="Remove Image URI Only"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                updateTileInState(tile.id, {
                                  ...tile,
                                  team: 'None',
                                  claimedBy: undefined,
                                  customText: undefined,
                                  photo: ''
                                });
                                setToast({
                                  message: "Clear Land Claim 🗑️",
                                  description: `Revoked owner claim and normalized Sector ${tile.id} back to neutral.`,
                                  type: "success"
                                });
                              }}
                              className="p-1.5 bg-rose-955/40 hover:bg-red-900/40 text-red-405 hover:text-red-350 rounded-md border border-red-500/20 transition-colors cursor-pointer"
                              title="Revoke Territory Block Claim"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                 )}
 
                {/* 3. Block and delete Option */}
                {activeAdminTab === 'users' && (
                  <div className="p-4 bg-slate-955/40 border border-slate-855 rounded-2xl text-left">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-mono uppercase">
                    <User className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Fan Accounts Directory ({registeredUsers.length})</span>
                  </h4>
                  <div className="mt-3 flex flex-col gap-2 max-h-[30vh] overflow-y-auto pr-1">
                    {registeredUsers.map((usr) => {
                      const isBanned = blockedUserEmails.includes(usr.email.toLowerCase());
                      const isMe = loggedInUser?.email.toLowerCase() === usr.email.toLowerCase();
                      const claimsCount = Object.values(tiles).filter((t: any) => t.claimedBy === usr.username).length;

                      return (
                        <div key={usr.email} className="p-2.5 bg-slate-955/65 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[11px] font-black text-slate-200 truncate font-mono">@{usr.username}</span>
                              {usr.isAdmin && (
                                <span className="text-[8px] bg-amber-500/10 text-amber-450 px-1 py-0.5 rounded font-mono font-bold border border-amber-500/20">ADMIN</span>
                              )}
                              {isBanned && (
                                <span className="text-[8px] bg-red-500/15 text-red-400 px-1 py-0.5 rounded font-mono font-bold border border-red-500/20">BANNED</span>
                              )}
                            </div>
                            <span className="text-[8.5px] font-mono text-slate-500 block">{usr.email}</span>
                            <span className="text-[8.5px] font-mono text-emerald-450 block font-semibold">Allegiance: {usr.favoriteClub} • {claimsCount} grid claims</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {!usr.isAdmin && (
                              <button
                                onClick={() => {
                                  let nextBans = [...blockedUserEmails];
                                  if (isBanned) {
                                    nextBans = nextBans.filter((em) => em.toLowerCase() !== usr.email.toLowerCase());
                                    dbSetUserBanned(usr.email, false); // Unban in Supabase backend
                                    setToast({
                                      message: "User Restored! 🟢",
                                      description: `Account @${usr.username} has been successfully unblocked.`,
                                      type: "success"
                                    });
                                  } else {
                                    nextBans.push(usr.email.toLowerCase());
                                    dbSetUserBanned(usr.email, true); // Ban in Supabase backend
                                    setToast({
                                      message: "User Suspended! 🚫",
                                      description: `Account @${usr.username} is now strictly blocked.`,
                                      type: "success"
                                    });
                                  }
                                  setBlockedUserEmails(nextBans);
                                  localStorage.setItem('kerala_blocked_user_emails_v4', JSON.stringify(nextBans));
                                }}
                                className={`p-1.5 rounded-md border text-[9px] font-mono border-slate-800 transition-colors uppercase font-bold cursor-pointer flex items-center gap-1 ${
                                  isBanned
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25'
                                    : 'bg-red-950/40 text-red-400 border-red-500/25'
                                }`}
                              >
                                <Ban className="w-3.5 h-3.5" strokeWidth={2.5} />
                                <span>{isBanned ? 'Unban' : 'Ban'}</span>
                              </button>
                            )}

                            {!usr.isAdmin && !isMe && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you absolutely sure you want to permanently delete profile @${usr.username}?`)) {
                                    const nextList = registeredUsers.filter((u) => u.email.toLowerCase() !== usr.email.toLowerCase());
                                    setRegisteredUsers(nextList);
                                    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextList));
                                    dbDeleteUser(usr.email); // Permanently drop profile inside Supabase backend
                                    
                                    // Release all claims belonging to deleted user
                                    const nextTiles = { ...tiles };
                                    Object.keys(nextTiles).forEach((k) => {
                                      if (nextTiles[k].claimedBy === usr.username) {
                                        nextTiles[k] = { ...nextTiles[k], team: 'None', claimedBy: undefined };
                                        updateTileInState(k, nextTiles[k]);
                                      }
                                    });

                                    setToast({
                                      message: "Profile Purged! 💣",
                                      description: `Permanently deleted account and auto vacated their land stakes.`,
                                      type: "success"
                                    });
                                  }
                                }}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-450 hover:text-red-450 border border-slate-800 rounded-md transition-colors cursor-pointer"
                                title="Delete User Profile"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* 4. Activity Logs sub-tab content */}
                {activeAdminTab === 'activity' && (
                  <div className="p-4 bg-slate-955/40 border border-slate-855 rounded-2xl text-left animate-fadeIn">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-mono uppercase">
                        <History className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Interactive Database Audit Trail</span>
                      </h4>
                      <button
                        type="button"
                        onClick={reloadActivityLogs}
                        disabled={logsLoading}
                        className="px-2 py-1 text-[9px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-300 rounded transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        <span className={logsLoading ? "animate-spin inline-block" : ""}>🔄</span>
                        <span>Reload</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal mb-3">
                      Below are the last 50 live user actions (claims, chat posts, image uploads, releases) fetched directly from the database schema:
                    </p>

                    <div className="flex flex-col gap-2 max-h-[35vh] overflow-y-auto pr-1 scrollbar-thin">
                      {activityLogs.length === 0 ? (
                        <div className="text-center py-8 bg-slate-950/60 border border-slate-900 rounded-xl">
                          <p className="text-[10.5px] font-mono text-slate-500">No activity logs recorded yet.</p>
                        </div>
                      ) : (
                        activityLogs.map((log, index) => {
                          const isClaim = log.action_type === 'claim';
                          const isChat = log.action_type === 'chat';
                          const isImage = log.action_type === 'image_upload';
                          const isRelease = log.action_type === 'release';

                          let badgeStyle = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                          if (isClaim) badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                          if (isChat) badgeStyle = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
                          if (isImage) badgeStyle = "bg-teal-500/10 text-teal-400 border border-teal-500/20";
                          if (isRelease) badgeStyle = "bg-rose-500/10 text-rose-400 border border-rose-500/20";

                          return (
                            <div
                              key={log.id || index}
                              className="p-2.5 bg-slate-955/65 border border-slate-850 rounded-xl hover:border-indigo-500/20 transition-all flex flex-col gap-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10.5px] font-bold text-slate-200">
                                  @{log.username}
                                </span>
                                <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${badgeStyle}`}>
                                  {log.action_type}
                                </span>
                              </div>

                              <p className="text-[10px] font-mono text-slate-400 break-words leading-relaxed pl-1 py-1">
                                {log.description}
                              </p>

                              {log.created_at && (
                                <span className="text-[8px] font-mono text-slate-500 self-end">
                                  {new Date(log.created_at).toLocaleString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
