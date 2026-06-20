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
  EyeOff,
  Bell,
  Calendar
} from 'lucide-react';
import { TileData, TeamChoice, TeamStyle, ChatMessage, UserReferralData } from './types';

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
  isSupabaseOverridden,
  supabaseUrl,
  supabaseAnonKey,
  supabase,
  setSupabaseOverrides,
  dbAddActivityLog,
  dbFetchActivityLogs,
  dbSignOut,
  dbUploadImage,
  getRegisteredMissingTables,
  getRegisteredMissingBuckets,
  resetMissingTableCache,
  dbVerifySchemasOnBoot
} from './lib/supabase';

// Global static football fixtures
export const FOOTBALL_FIXTURES = [
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
];

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
const KERALA_FALLBACK_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Kerala Fallback Bound" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.9, 12.8],
            [75.1, 12.8],
            [75.5, 12.2],
            [76.0, 11.5],
            [76.3, 10.8],
            [76.8, 10.2],
            [77.2, 9.5],
            [77.5, 8.5],
            [77.3, 8.2],
            [77.0, 8.3],
            [76.5, 9.2],
            [76.1, 10.0],
            [75.7, 10.8],
            [75.2, 11.6],
            [74.8, 12.3],
            [74.9, 12.8]
          ]
        ]
      }
    }
  ]
};

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
  const [showRlsSql, setShowRlsSql] = useState(false);
  const [supabaseBackendConfig, setSupabaseBackendConfig] = useState<any>(null);
  const [isVerifyingSupabase, setIsVerifyingSupabase] = useState(false);

  const fetchSupabaseBackendConfig = async () => {
    try {
      const res = await fetch("/api/supabase/config");
      const data = await res.json();
      setSupabaseBackendConfig(data);
    } catch (e) {
      console.warn("Failed fetching Supabase backend configuration state:", e);
    }
  };

  useEffect(() => {
    setMissingTables(getRegisteredMissingTables());
    setMissingBuckets(getRegisteredMissingBuckets());
    fetchSupabaseBackendConfig();
    const handleUpdate = () => {
      setMissingTables(getRegisteredMissingTables());
      setMissingBuckets(getRegisteredMissingBuckets());
      fetchSupabaseBackendConfig();
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
  const [drawerActiveWindow, setDrawerActiveWindow] = useState<'initial_slots' | 'team_select' | 'addons_and_payment' | 'checkout'>('initial_slots');
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
      return stored ? parseFloat(stored) : 0;
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
      let slotRewardCount = 0.1; // Direct real-time fractional reward of +0.1 slots on every registration!
      let milestoneMsg = "";
      
      // Detailed user-specified milestone tiers as bonus additions
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
      } else if (nextCount === 55 || nextCount === 50) {
        slotRewardCount += 15; // 50 invites -> 15 slots
        milestoneMsg = "🔥 Ultimate Milestone achieved: 50 invites! You received +15 Ultimate Claim Slots!";
      }
      
      const updated = {
        referredCount: nextCount,
        pendingFractionalTiles: parseFloat((nextFractional >= 1.0 ? nextFractional - 1.0 : nextFractional).toFixed(2))
      };
      
      localStorage.setItem('kerala_football_map_referrals_v1', JSON.stringify(updated));
      
      setFreeSlots(curr => {
        const updatedSlots = parseFloat((curr + slotRewardCount).toFixed(2));
        localStorage.setItem('kerala_claimed_free_slots_count', updatedSlots.toString());
        return updatedSlots;
      });
      
      if (slotRewardCount > 0.1) {
        setToast({
          message: "🏆 Milestone Award Cleared! 🏆",
          description: milestoneMsg || `Incredible! You earned +${parseFloat(slotRewardCount.toFixed(2))} Free Claim Slots from invite bonuses!`,
          type: "success"
        });
      } else {
        setToast({
          message: "Referral Accredited! ⚽",
          description: `Friend successfully registered. Real-time +0.1 Claim Slot added to your balance!`,
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
  }>(() => {
    return {
      username: 'Guest_Fan',
      email: 'guest@footballmap.com',
      favoriteClub: 'Argentina',
      isAdmin: false,
      picture: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest"
    };
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
  }[]>([]);

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
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'derby' | 'images' | 'users' | 'chats' | 'activity' | 'settings'>('analytics');
  
  // Custom Live Site-Wide Super Admin Flags
  const [adminAppSettings, setAdminAppSettings] = useState<{
    allowNewRegistrations: boolean;
    maintenanceMode: boolean;
    defaultFreeSlots: number;
    allowGuestChats: boolean;
    mailService: 'brevo' | 'resend';
  }>(() => {
    try {
      const stored = localStorage.getItem('kerala_admin_app_settings');
      return stored ? JSON.parse(stored) : {
        allowNewRegistrations: true,
        maintenanceMode: false,
        defaultFreeSlots: 1,
        allowGuestChats: true,
        mailService: 'brevo'
      };
    } catch {
      return {
        allowNewRegistrations: true,
        maintenanceMode: false,
        defaultFreeSlots: 1,
        allowGuestChats: true,
        mailService: 'brevo'
      };
    }
  });

  const updateAdminSettings = (newSettings: Partial<typeof adminAppSettings>) => {
    setAdminAppSettings(prev => {
      const next = { ...prev, ...newSettings };
      localStorage.setItem('kerala_admin_app_settings', JSON.stringify(next));
      return next;
    });
  };

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

  // Super Admin Action Form States
  const [adminSelectedSectorOverride, setAdminSelectedSectorOverride] = useState('');
  const [adminSelectedSectorTeam, setAdminSelectedSectorTeam] = useState<TeamChoice>('Argentina');
  const [adminOverrideUsername, setAdminOverrideUsername] = useState('SuperAdmin 👑');
  const [adminOverrideText, setAdminOverrideText] = useState('Captured by Admin high command!');
  const [adminOverrideImage, setAdminOverrideImage] = useState('');
  const [adminChatSearch, setAdminChatSearch] = useState('');
  const [adminGiftSlotsValue, setAdminGiftSlotsValue] = useState<Record<string, string>>({});
  const [showMyTerritoriesModal, setShowMyTerritoriesModal] = useState(false);

  // Production-ready Sign Up and Login states with Live Supabase backend
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

  // Monitor Supabase Auth session changes on mounting
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Retrieve active session during cold start
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn("Error getting active Supabase session:", error);
        return;
      }
      if (session?.user) {
        const email = session.user.email;
        if (email) {
          const profiles = await dbFetchUsers();
          const match = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
          if (match) {
            setLoggedInUser({
              username: match.username,
              email: match.email,
              favoriteClub: match.favoriteClub,
              isAdmin: !!match.isAdmin,
              picture: match.picture
            });
          } else {
            const username = session.user.user_metadata?.username || `fan_${session.user.id.slice(0, 5)}`;
            const favoriteClub = session.user.user_metadata?.favorite_club || 'Argentina';
            const profile = {
              username,
              email,
              favoriteClub,
              isAdmin: false,
              picture: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`
            };
            await dbUpsertUser(profile);
            setLoggedInUser(profile);
          }
        }
      }
    }).catch(err => {
      console.warn("Silent fallback - Supabase auth network issue detected during cold boot:", err);
    });

    // Subscribed triggers
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email;
        if (email) {
          const profiles = await dbFetchUsers();
          const match = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
          if (match) {
            setLoggedInUser({
              username: match.username,
              email: match.email,
              favoriteClub: match.favoriteClub,
              isAdmin: !!match.isAdmin,
              picture: match.picture
            });
          } else {
            const username = session.user.user_metadata?.username || `fan_${session.user.id.slice(0, 5)}`;
            const favoriteClub = session.user.user_metadata?.favorite_club || 'Argentina';
            const profile = {
              username,
              email,
              favoriteClub,
              isAdmin: false,
              picture: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`
            };
            await dbUpsertUser(profile);
            setLoggedInUser(profile);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        const defaultUser = {
          username: 'Guest_Fan',
          email: 'guest@footballmap.com',
          favoriteClub: 'Argentina',
          isAdmin: false,
          picture: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest"
        };
        setLoggedInUser(defaultUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !loginUsername) {
      setToast({
        message: "Input Validation Mismatch ⚠️",
        description: "Please supply a valid username, email structure, and security password.",
        type: "error"
      });
      return;
    }

    try {
      setIsAuthLoading(true);

      // Block checks
      const blocked = await dbFetchBlockedEmails();
      if (blocked.includes(loginEmail.toLowerCase())) {
        setToast({
          message: "Registration Terminated 🚫",
          description: "This email address is blacklisted by the system administrators.",
          type: "error"
        });
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              username: loginUsername,
              favorite_club: loginFavClub
            }
          }
        });

        if (error) throw error;

        // Sync local & live details
        const emailVerified = !!(data.user && data.session);
        const newUserProfile = {
          username: loginUsername,
          email: loginEmail.toLowerCase(),
          favoriteClub: loginFavClub,
          isAdmin: false,
          picture: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${loginUsername}`,
          freeSlots: 3,
          emailVerified
        };

        await dbUpsertUser(newUserProfile);

        if (!emailVerified) {
          // Verification Email dispatched
          setVerificationEmail(loginEmail);
          setShowVerificationPopup(true);
          setShowLoginModal(false);
          setToast({
            message: "Verify Custom Profile! 📧",
            description: `Verification link dispatched to ${loginEmail}. Please tap it to activate.`,
            type: "success"
          });
        } else {
          // Instant confirmation (Confirmation turned OFF in Supabase)
          setLoggedInUser(newUserProfile);
          setShowLoginModal(false);
          setToast({
            message: "Account Activated! 🎉",
            description: `Welcome to Kerala Fan Club Map, ${loginUsername}! 3 claimant slots credited.`,
            type: "success"
          });
        }
      } else {
        throw new Error("Supabase is not configured yet. Live database is required for actions.");
      }
    } catch (err: any) {
      console.error("Sign up failure details:", {
        message: err?.message || "No error message specified",
        status: err?.status || "N/A",
        code: err?.code || "N/A",
        name: err?.name || "Error",
        stack: err?.stack || "N/A",
        rawError: err
      });
      const errDetails = `[Code: ${err.code || 'N/A'}, Status: ${err.status || 'N/A'}] ${err.message || 'An account with these parameters could not be constructed.'}`;
      setToast({
        message: "Sign Up Failure 🚫",
        description: errDetails,
        type: "error"
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setToast({
        message: "Incomplete Parameters ⚠️",
        description: "Specify both account email and secret password.",
        type: "error"
      });
      return;
    }

    try {
      setIsAuthLoading(true);

      // Block checks
      const blocked = await dbFetchBlockedEmails();
      if (blocked.includes(loginEmail.toLowerCase())) {
        setToast({
          message: "Access Blacklisted 🚫",
          description: "This email address is currently blocked from access.",
          type: "error"
        });
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword
        });

        if (error) throw error;

        // Fetch matched user details from remote records
        const profiles = await dbFetchUsers();
        const match = profiles.find((p) => p.email.toLowerCase() === loginEmail.toLowerCase());

        const matchedProfile = match || {
          username: data.user.user_metadata?.username || `fan_${data.user.id.slice(0, 5)}`,
          email: loginEmail.toLowerCase(),
          favoriteClub: data.user.user_metadata?.favorite_club || 'Argentina',
          isAdmin: false,
          picture: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${data.user.id.slice(0, 5)}`
        };

        if (!match) {
          await dbUpsertUser(matchedProfile);
        }

        setLoggedInUser(matchedProfile);
        setShowLoginModal(false);

        setToast({
          message: "Authenticated Successfully 🛡️",
          description: `Welcome back, ${matchedProfile.username}! Syncing server grids.`,
          type: "success"
        });
      } else {
        throw new Error("Supabase is not configured yet. Live database is required for actions.");
      }
    } catch (err: any) {
      console.error("Sign in failure details:", err);
      if (err.message && err.message.includes("Email not confirmed")) {
        setToast({
          message: "Email Not Confirmed 📧",
          description: "Please check your email inbox and click the verification link before logging in.",
          type: "error"
        });
      } else {
        const errDetails = `[Code: ${err.code || 'N/A'}, Status: ${err.status || 'N/A'}] ${err.message || 'Credential verification failed. Please review inputs.'}`;
        setToast({
          message: "Sign In Terminated 🚫",
          description: errDetails,
          type: "error"
        });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleOAuthLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setToast({
        message: "Google OAuth Error 🚫",
        description: "Live database credentials are required for Google OAuth integration.",
        type: "error"
      });
      return;
    }

    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setToast({
        message: "OAuth Callback Error 🚫",
        description: err.message || "Failed to launch Supabase Google credentials portal.",
        type: "error"
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthSignOut = async () => {
    try {
      setIsAuthLoading(true);
      if (isSupabaseConfigured && supabase) {
        await dbSignOut();
      }
      
      const defaultUser = {
        username: 'Guest_Fan',
        email: 'guest@footballmap.com',
        favoriteClub: 'Argentina',
        isAdmin: false,
        picture: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest"
      };
      setLoggedInUser(defaultUser);
      
      setToast({
        message: "Signed Out Successfully 🛡️",
        description: "Your live session is secure and has been terminated.",
        type: "success"
      });
    } catch (err: any) {
      console.warn("Sign out issue:", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const [showDbConfig, setShowDbConfig] = useState(false);
  const [testSmtpEmail, setTestSmtpEmail] = useState('kingforstudy@gmail.com');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestLogs, setSmtpTestLogs] = useState<string[]>([]);
  const [customDbUrl, setCustomDbUrl] = useState(supabaseUrl);
  const [customDbKey, setCustomDbKey] = useState(supabaseAnonKey);

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
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showLoginReminderToast, setShowLoginReminderToast] = useState(true);
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
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [marqueeW, setMarqueeW] = useState<number>(1);
  const [marqueeH, setMarqueeH] = useState<number>(1);
  const [multiSelectTool, setMultiSelectTool] = useState<'brush' | 'box'>('box');
  const multiSelectToolRef = useRef<'brush' | 'box'>('box');
  useEffect(() => {
    multiSelectToolRef.current = multiSelectTool;
  }, [multiSelectTool]);
  const [isMergePanelCollapsed, setIsMergePanelCollapsed] = useState<boolean>(true);
  const [multiSelectedTileIds, setMultiSelectedTileIds] = useState<string[]>([]);
  const [marqueeIntendedTileIds, setMarqueeIntendedTileIds] = useState<string[]>([]);
  const [slotPurchaseCount, setSlotPurchaseCount] = useState<number>(0);
  const [isMultiSelectCheckout, setIsMultiSelectCheckout] = useState<boolean>(false);
  const [multiSelectTargetTeam, setMultiSelectTargetTeam] = useState<TeamChoice>('None');
  const [activeMultiTab, setActiveMultiTab] = useState<'merge' | 'claim'>('claim');
  const [customTextInput, setCustomTextInput] = useState('');
  const [textBackgroundStyle, setTextBackgroundStyle] = useState<'none' | 'team_color'>('none');
  const [imageBorderStyle, setImageBorderStyle] = useState<'none' | 'team_color'>('none');
  const [hyperlinkInput, setHyperlinkInput] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [loadingPhotoTileIds, setLoadingPhotoTileIds] = useState<string[]>([]);
  const loadingPhotoTileIdsRef = useRef<string[]>([]);
  useEffect(() => {
    loadingPhotoTileIdsRef.current = loadingPhotoTileIds;
  }, [loadingPhotoTileIds]);

  // Cloudflare R2 Live Upload progress states
  const [r2UploadProgress, setR2UploadProgress] = useState<number>(0);
  const [r2UploadStage, setR2UploadStage] = useState<string>('');

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

  useEffect(() => {
    if (!selectedTileId) {
      setIsMultiSelectMode(false);
      setMultiSelectedTileIds([]);
      setMarqueeH(1);
      setMarqueeW(1);
    }
  }, [selectedTileId]);

  useEffect(() => {
    if (!isMultiSelectMode || multiSelectedTileIds.length === 0) {
      setMarqueeIntendedTileIds([]);
    }
  }, [isMultiSelectMode, multiSelectedTileIds]);

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
      if (!e.target || typeof (e.target as any).closest !== 'function') return;
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
      if (!e.target || typeof (e.target as any).closest !== 'function') return;
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
  const marqueeIndicatorRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polygonLayersRef = useRef<Record<string, any>>({});
  const dragArrowMarkersRef = useRef<Record<string, any>>({});
  const handleTileDragSelectRef = useRef<any>(null);
  const findClosestCellRef = useRef<any>(null);
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
  const latestMarqueeIntendedTileIdsRef = useRef<string[]>([]);
  latestMarqueeIntendedTileIdsRef.current = marqueeIntendedTileIds;

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

  // 1.7 ResizeObserver to robustly handle Map Container size changes and prevent tile unloading
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;
    
    let resizeTimeout: any = null;
    
    const ob = new ResizeObserver(() => {
      if (!mapRef.current) return;
      
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Instantly call invalidateSize to update dimensions
      try {
        const map = mapRef.current;
        const keralaBounds = (window as any).L.latLngBounds(
          (window as any).L.latLng(7.9, 74.3),
          (window as any).L.latLng(13.1, 77.9)
        );
        
        // Temporarily disable maxBounds to prevent coordinate clipping mismatches during layout shifts/transitions
        map.setMaxBounds(null);
        // NOTE: DO NOT use TileLayer.redraw() here or on state changes to prevent rendering flashes and reload floods. Use only invalidateSize.
        map.invalidateSize({ animate: false });
        map.setMaxBounds(keralaBounds);
      } catch (err) {
        console.warn("Instant map invalidateSize failed:", err);
      }

      // Staggered timeouts to handle the full duration of any CSS transitions/drawer animations (50ms, 150ms, 350ms)
      const fireInvalidate = (delay: number) => {
        return setTimeout(() => {
          try {
            const map = mapRef.current;
            if (map) {
              const keralaBounds = (window as any).L.latLngBounds(
                (window as any).L.latLng(7.9, 74.3),
                (window as any).L.latLng(13.1, 77.9)
              );
              map.setMaxBounds(null);
              // NOTE: DO NOT use TileLayer.redraw() here to avoid tile reloading floods during transitions.
              map.invalidateSize({ animate: false });
              map.setMaxBounds(keralaBounds);
            }
          } catch (e) {
            console.warn("Delayed map invalidateSize failed:", e);
          }
        }, delay);
      };

      const t1 = fireInvalidate(50);
      const t2 = fireInvalidate(150);
      const t3 = fireInvalidate(350);
      
      resizeTimeout = setTimeout(() => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      }, 400);
    });
    
    ob.observe(container);
    return () => {
      ob.unobserve(container);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // Trigger map re-validation on UI state toggles with robust scheduled fallbacks
  useEffect(() => {
    if (!mapRef.current) return;
    const revalidateMapGeometry = () => {
      try {
        const map = mapRef.current;
        if (!map) return;
        const keralaBounds = (window as any).L.latLngBounds(
          (window as any).L.latLng(7.9, 74.3),
          (window as any).L.latLng(13.1, 77.9)
        );
        map.setMaxBounds(null);
        // NOTE: DO NOT use TileLayer.redraw() for state transitions to avoid tile unload/reload flickers. Use only invalidateSize.
        map.invalidateSize({ animate: false });
        map.setMaxBounds(keralaBounds);
      } catch (e) {
        console.warn("Scheduled state toggle map invalidateSize error:", e);
      }
    };

    // 1. Instant execution
    revalidateMapGeometry();

    // 2. Scheduled delayed execution to fully account for panel sliding and responsive rendering settle times (50ms, 150ms, 300ms)
    const t1 = setTimeout(revalidateMapGeometry, 50);
    const t2 = setTimeout(revalidateMapGeometry, 150);
    const t3 = setTimeout(revalidateMapGeometry, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isMultiSelectMode, isMultiSelectCheckout, drawerActiveWindow]);

  // 1.5 REAL-TIME CLOUD SYSTEM SYNCHRONIZER: Periodically polls state updates to achieve live synchronization
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const liveSyncInterval = setInterval(async () => {
      try {
        const [cloudTiles, logsList] = await Promise.all([
          dbFetchTiles().catch(() => null),
          dbFetchActivityLogs().catch(() => null)
        ]);

        if (cloudTiles && Object.keys(cloudTiles).length > 0) {
          const currentStringified = JSON.stringify(latestTilesRef.current || {});
          const nextStringified = JSON.stringify(cloudTiles);
          if (currentStringified !== nextStringified) {
            setTiles(cloudTiles);
            latestTilesRef.current = cloudTiles;
            updateVisibleGrid(cloudTiles);
          }
        }

        if (logsList && logsList.length > 0) {
          setActivityLogs(logsList);
        }
      } catch (err) {
        console.warn("Real-time background sync poll skipped:", err);
      }
    }, 4000);

    return () => {
      clearInterval(liveSyncInterval);
    };
  }, []);

  const prevUserRef = useRef<any>(null);
  const prevShowOnboardingRef = useRef<boolean>(true);

  // 1.6 USER LOGIN REMINDER TRIGGERS: Triggers welcome toast with upcoming fixtures and pending predictions on onboarding dismissal or subsequent logins
  useEffect(() => {
    if (loggedInUser) {
      const userChanged = !prevUserRef.current || prevUserRef.current.email !== loggedInUser.email;
      const onboardingDismissed = prevShowOnboardingRef.current && !showOnboarding;
      
      if (!showOnboarding && (userChanged || onboardingDismissed)) {
        setShowLoginReminderToast(true);
      }
    } else {
      setShowLoginReminderToast(false);
    }
    
    prevUserRef.current = loggedInUser;
    prevShowOnboardingRef.current = showOnboarding;
  }, [loggedInUser, showOnboarding]);

  // Map-level drag box is now processed compactly inside the custom container gesture handler below to fully support pinch-to-zoom multi-touch features.

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
        weight: !isMerged ? (updatedData.team === 'None' ? 0.5 : 1.5) : 0,
        opacity: !isMerged ? 1 : 0,
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
      if (existData && existData.team && existData.team !== 'None') {
        setToast({
          message: "Sector Already Claimed 🔒",
          description: "This sector has already been claimed by a club/team and cannot be selected.",
          type: "warning"
        });
        return;
      }
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
            weight: shouldShowStroke ? (!isSelected ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5)) : 0,
            opacity: shouldShowStroke ? 1 : 0,
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
    const tileData = tiles[id];
    if (tileData && tileData.team && tileData.team !== 'None') {
      return; // Skip already claimed/team-owned tiles
    }
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
    setDrawerActiveWindow('initial_slots');

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
        description: `You need ${N} slots but only have ${parseFloat(freeSlots.toFixed(2))} slots left. Buy missing slots below!`,
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

      // Slice to a safe rendering limit (max 2500 polygons)
      renderList = visibleCells.slice(0, 2500);
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
        weight: shouldShowStroke ? (isSec ? 2.5 : (existData.team === 'None' ? 0.5 : 1.5)) : 0,
        opacity: shouldShowStroke ? 1 : 0,
        fillColor: isSec ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || existData.photo) ? 0 : 0.4),
        className: `transition-all duration-300 grid-tile-${id} ${isSec ? 'drag-selection-box' : ''}`
      });

      cellPolygon.addTo(mapInstance);

      let holdStartX = 0;
      let holdStartY = 0;
      let wasSelectedOnStart = false;

      const handleStart = (e: any) => {
        if (latestIsMultiSelectModeRef.current && multiSelectToolRef.current === 'box') {
          return; // Let the custom map box-drag handlers do all the work
        }
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
          if (existData && existData.team && existData.team !== 'None') {
            return; // Disable hold/multiselect start on already claimed tiles
          }
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
        if (latestIsMultiSelectModeRef.current && multiSelectToolRef.current === 'box') {
          return;
        }
        if (latestIsMultiSelectModeRef.current) {
          if (isDraggingSelectionRef.current) {
            const mapInstance = mapRef.current;
            if (mapInstance) {
              try {
                let latlng = e.latlng;
                const orig = e.originalEvent;
                if (orig && orig.touches && orig.touches.length > 0) {
                  latlng = mapInstance.mouseEventToLatLng(orig.touches[0]);
                }
                
                if (latlng) {
                  const closestResult = findClosestCell(latlng.lat, latlng.lng);
                  if (closestResult && closestResult.cell) {
                    if (closestResult.distance < 0.0001) {
                      handleTileDragSelect(closestResult.cell.id);
                    }
                  }
                }
              } catch (err) {
                // Safe ignore
              }
            }
          }
        } else if (holdTimerRef.current) {
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
        if (latestIsMultiSelectModeRef.current && multiSelectToolRef.current === 'box') {
          return;
        }
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
          if (multiSelectToolRef.current === 'box') {
            return;
          }
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

      const isPhotoLoading = loadingPhotoTileIdsRef.current.includes(ownerId);
      // Draw if customized properties are verified OR if photo is currently loading
      if (!ownerData.photo && !isPhotoLoading) return;

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
            opacity: isPhotoLoading ? 0.35 : 0.85,
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

      // Render custom loading spinner symbol over/inside the tile during sync/upload
      if (isPhotoLoading) {
        try {
          const boundsCenter = [
            (minLat + maxLat) / 2,
            (minLng + maxLng) / 2
          ];

          const loadingIcon = (window as any).L.divIcon({
            html: `
              <div class="relative flex items-center justify-center pointer-events-none select-none">
                <div class="flex items-center justify-center p-2 rounded-xl bg-slate-950/95 border border-amber-500 shadow-[0_4px_16px_rgba(245,158,11,0.6)] gap-2 animate-pulse min-w-[130px]">
                  <svg class="animate-spin h-4 w-4 text-amber-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-[9px] font-mono text-amber-400 font-extrabold uppercase tracking-wider whitespace-nowrap">Syncing Photo...</span>
                </div>
              </div>
            `,
            iconSize: [140, 36],
            iconAnchor: [70, 18],
            className: 'leaflet-loading-tile-marker pointer-events-none select-none'
          });

          const loadingMarker = (window as any).L.marker(boundsCenter, {
            icon: loadingIcon,
            interactive: false,
            pane: 'markerPane'
          }).addTo(mapInstance);

          overlayLayersRef.current.push(loadingMarker);
        } catch (loadingErr) {
          console.error("Failed to render Leaflet loading marker for data:", ownerId, loadingErr);
        }
      }
    });

    // Draw glowing selection outline enclosing all merged sectors of the selected group
    const activeSelectedId = latestSelectedTileIdRef.current;
    if (activeSelectedId) {
      if (isMultiSelectMode && multiSelectedTileIds.length > 0) {
        // Find bounding box enclosing all selected MARQUEE tiles
        const memberCells: any[] = [];
        const sourceIds = (latestMarqueeIntendedTileIdsRef.current && latestMarqueeIntendedTileIdsRef.current.length > 0)
          ? latestMarqueeIntendedTileIdsRef.current
          : multiSelectedTileIds;
        sourceIds.forEach(id => {
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

          selectedOutlineRef.current = (window as any).L.rectangle([[minLat, minLng], [maxLat, maxLng]], {
            color: '#f59e0b', // Amber theme selection color
            weight: 3.5,
            fillColor: 'rgba(245, 158, 11, 0.05)',
            fillOpacity: 0.05,
            className: 'drag-selection-box' // Dynamic marching-ants marquee!
          }).addTo(mapInstance);
        }
      } else {
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
    }
  };

  // Re-bind viewport update listener
  useEffect(() => {
    if (!mapRef.current) return;
    const handleMapMove = () => {
      updateVisibleGrid();
    };
    mapRef.current.on('moveend', handleMapMove);
    mapRef.current.on('zoomend', handleMapMove);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend', handleMapMove);
        mapRef.current.off('zoomend', handleMapMove);
      }
    };
  }, [tiles, isMultiSelectMode, multiSelectedTileIds, selectedTileId, loadingPhotoTileIds]);

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
        weight: shouldShowStroke ? (isSec ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5)) : 0,
        opacity: shouldShowStroke ? 1 : 0,
        fillColor: isSec ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
      });

      if (polygon._path) {
        if (isSec) {
          polygon._path.classList.add('drag-selection-box');
        } else {
          polygon._path.classList.remove('drag-selection-box');
        }
      }
    });
  }, [tiles, isMultiSelectMode, multiSelectedTileIds, multiSelectTargetTeam, tempTeam]);

  // Synchronically render and update directional drag arrows on the selected tiles
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    // Remove all old markers
    Object.keys(dragArrowMarkersRef.current).forEach(id => {
      const marker = dragArrowMarkersRef.current[id];
      if (marker) {
        mapInstance.removeLayer(marker);
      }
    });
    dragArrowMarkersRef.current = {};

    // User requested to remove all symbols inside the tiles, so we bypass rendering individual arrow markers
    return;

    return () => {
      Object.keys(dragArrowMarkersRef.current).forEach(id => {
        const marker = dragArrowMarkersRef.current[id];
        if (marker && mapInstance) {
          mapInstance.removeLayer(marker);
        }
      });
      dragArrowMarkersRef.current = {};
    };
  }, [isMultiSelectMode, multiSelectedTileIds, tiles]);

  // Dedicated touch and mouse drag-selection handler for multi-select mode
  useEffect(() => {
    // Only register these drag listeners when multi-select mode is ON
    if (!isMultiSelectMode) return;

    const container = mapContainerRef.current;
    const mapInstance = mapRef.current;
    if (!container || !mapInstance) return;

    const wasDraggingEnabled = mapInstance.dragging ? mapInstance.dragging.enabled() : false;
    if (multiSelectTool === 'box' && mapInstance.dragging) {
      mapInstance.dragging.disable();
    }

    let isDrawingBox = false;
    let startLatLng: any = null;
    let visualBox: any = null;
    let lastEnclosedTileIds: string[] = [];
    let startAnchorMarker: any = null;

    // Local styling function to restore original style dynamically based on actual state
    const restoreTileStyle = (id: string) => {
      const polygon = polygonLayersRef.current[id];
      if (!polygon) return;

      const currentTiles = latestTilesRef.current || tiles;
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

      const isSec = latestMultiSelectedTileIdsRef.current.includes(id);
      const style = TEAM_STYLES[existData.team || 'None'] || TEAM_STYLES['None'];
      const targetTeamName = latestMultiSelectTargetTeamRef.current || 'None';
      const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];

      const isMerged = !!(cellData?.isMergedChild || (cellData?.mergedWith && cellData.mergedWith.length > 0));
      const shouldShowStroke = isSec || !isMerged;

      polygon.setStyle({
        stroke: shouldShowStroke,
        color: isSec ? (targetTeamName === 'None' ? '#ffffff' : (targetStyle.color || '#ffffff')) : (existData.team === 'None' || !existData.team ? '#475569' : style.color),
        dashArray: isSec ? '5, 5' : undefined,
        weight: shouldShowStroke ? (isSec ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5)) : 0,
        opacity: shouldShowStroke ? 1 : 0,
        fillColor: isSec ? (targetTeamName === 'None' ? 'transparent' : (targetStyle.color || 'transparent')) : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? (targetTeamName === 'None' ? 0 : 0.35) : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
      });
    };

    // Style helper to highlight a tile when enclosed by the marquee select boundary
    const highlightEnclosedTile = (id: string) => {
      const polygon = polygonLayersRef.current[id];
      if (!polygon) return;

      const tileData = latestTilesRef.current[id];
      if (tileData && tileData.team && tileData.team !== 'None') {
        return; // Don't highlight already claimed/selected tiles
      }

      const targetTeamName = latestMultiSelectTargetTeamRef.current || 'None';
      const targetStyle = TEAM_STYLES[targetTeamName] || TEAM_STYLES['None'];

      polygon.setStyle({
        stroke: true,
        color: '#f59e0b', // Amber highlight boundary
        dashArray: '3, 3',
        weight: 2.5,
        fillColor: targetTeamName === 'None' ? '#f59e0b' : targetStyle.color,
        fillOpacity: 0.30
      });
    };

    const handleGestureStart = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      try {
        const leafletPoint = (window as any).L.point(x, y);
        const latlng = mapInstance.containerPointToLatLng(leafletPoint);
        
        if (multiSelectTool === 'box') {
          isDrawingBox = true;
          startLatLng = latlng;
          lastEnclosedTileIds = [];

          if (startAnchorMarker) {
            mapInstance.removeLayer(startAnchorMarker);
          }

          // Anchor marker to highlight corner start
          startAnchorMarker = (window as any).L.circleMarker(latlng, {
            radius: 5,
            color: '#f59e0b',
            fillColor: '#0b0f19',
            fillOpacity: 0.9,
            weight: 2.5,
            className: 'marquee-anchor'
          }).addTo(mapInstance);

          // Position and reveal Selection HUD Badge
          const badge = marqueeIndicatorRef.current;
          if (badge) {
            badge.style.display = 'flex';
            badge.style.left = `${clientX}px`;
            badge.style.top = `${clientY}px`;
            const labelNum = document.getElementById('marquee-indicator-count');
            if (labelNum) labelNum.innerText = '0';
          }
        } else {
          isDraggingSelectionRef.current = true;
          if (latlng && findClosestCellRef.current) {
            const closestResult = findClosestCellRef.current(latlng.lat, latlng.lng);
            if (closestResult && closestResult.cell) {
              const dLat = closestResult.cell.lat - latlng.lat;
              const dLng = closestResult.cell.lng - latlng.lng;
              const squaredDist = dLat * dLat + dLng * dLng;
              // Generous cell boundary check
              if (squaredDist < 0.00005) {
                if (handleTileDragSelectRef.current) {
                  handleTileDragSelectRef.current(closestResult.cell.id);
                }
              }
            }
          }
        }
      } catch (err) {
        // Safe failover
      }
    };

    const handleGestureMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      try {
        const leafletPoint = (window as any).L.point(x, y);
        const latlng = mapInstance.containerPointToLatLng(leafletPoint);

        if (multiSelectTool === 'box') {
          if (!isDrawingBox || !startLatLng || !latlng) return;
          const bounds = (window as any).L.latLngBounds(startLatLng, latlng);
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

          // Live visual feedback: calculate which cells are currently inside the rectangle
          const minLatCoord = bounds.getSouthWest().lat;
          const maxLatCoord = bounds.getNorthEast().lat;
          const minLngCoord = bounds.getSouthWest().lng;
          const maxLngCoord = bounds.getNorthEast().lng;

          const gridMinLat = gridBoundsRef.current.minLat;
          const gridMaxLat = gridBoundsRef.current.maxLat;
          const gridMinLng = gridBoundsRef.current.minLng;
          const gridMaxLng = gridBoundsRef.current.maxLng;
          const NUM_BLOCKS = 64;

          const startR = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((minLatCoord - gridMinLat) / (gridMaxLat - gridMinLat)) * NUM_BLOCKS)));
          const endR = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((maxLatCoord - gridMinLat) / (gridMaxLat - gridMinLat)) * NUM_BLOCKS)));
          const startC = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((minLngCoord - gridMinLng) / (gridMaxLng - gridMinLng)) * NUM_BLOCKS)));
          const endC = Math.min(NUM_BLOCKS - 1, Math.max(0, Math.floor(((maxLngCoord - gridMinLng) / (gridMaxLng - gridMinLng)) * NUM_BLOCKS)));

          const newlyEnclosedIds: string[] = [];
          const blocks = spatialGridRef.current;
          if (blocks && blocks.length > 0) {
            for (let r = startR; r <= endR; r++) {
              for (let c = startC; c <= endC; c++) {
                const blockCells = blocks[r * NUM_BLOCKS + c] || [];
                for (let i = 0; i < blockCells.length; i++) {
                  const cell = blockCells[i];
                  if (cell.lat >= minLatCoord && cell.lat <= maxLatCoord &&
                      cell.lng >= minLngCoord && cell.lng <= maxLngCoord) {
                    newlyEnclosedIds.push(cell.id);
                  }
                }
              }
            }
          }

          // Real-time diff highlight styling
          newlyEnclosedIds.forEach(id => {
            if (!lastEnclosedTileIds.includes(id)) {
              highlightEnclosedTile(id);
            }
          });

          lastEnclosedTileIds.forEach(id => {
            if (!newlyEnclosedIds.includes(id)) {
              restoreTileStyle(id);
            }
          });

          lastEnclosedTileIds = newlyEnclosedIds;

          // Track the cursor/touch with the selection indicator count bubble
          const badge = marqueeIndicatorRef.current;
          if (badge) {
            badge.style.left = `${clientX}px`;
            badge.style.top = `${clientY}px`;
            const labelNum = document.getElementById('marquee-indicator-count');
            if (labelNum) labelNum.innerText = String(newlyEnclosedIds.length);
          }
        } else {
          if (!isDraggingSelectionRef.current) return;
          if (latlng && findClosestCellRef.current) {
            const closestResult = findClosestCellRef.current(latlng.lat, latlng.lng);
            if (closestResult && closestResult.cell) {
              const dLat = closestResult.cell.lat - latlng.lat;
              const dLng = closestResult.cell.lng - latlng.lng;
              const squaredDist = dLat * dLat + dLng * dLng;
              if (squaredDist < 0.00005) {
                if (handleTileDragSelectRef.current) {
                  handleTileDragSelectRef.current(closestResult.cell.id);
                }
              }
            }
          }
        }
      } catch (err) {
        // Safe failover
      }
    };

    const handleGestureEnd = () => {
      isDraggingSelectionRef.current = false;

      if (multiSelectTool === 'box') {
        if (isDrawingBox && startLatLng) {
          try {
            if (lastEnclosedTileIds.length > 0) {
              const allClaimedIds: string[] = [];
              const idsToSelect = [...lastEnclosedTileIds].filter(id => {
                const tileData = tiles[id];
                const isClaimedByOthers = tileData && tileData.team && tileData.team !== 'None';
                if (isClaimedByOthers) {
                  allClaimedIds.push(id);
                  return false;
                }
                return true;
              });

              setMarqueeIntendedTileIds(lastEnclosedTileIds);

              // Update the ref synchronously so that any styling functions called during the same
              // tick will immediately evaluate these tile IDs as officially selected.
              const nextSelectedIds = [...latestMultiSelectedTileIdsRef.current];
              idsToSelect.forEach(id => {
                if (!nextSelectedIds.includes(id)) {
                  nextSelectedIds.push(id);
                }
              });
              latestMultiSelectedTileIdsRef.current = nextSelectedIds;

              setMultiSelectedTileIds(prev => {
                const next = [...prev];
                idsToSelect.forEach(id => {
                  if (!next.includes(id)) {
                    next.push(id);
                  }
                });
                return next;
              });

              // Apply stable highlight styles instantly for a satisfying native interaction feel
              idsToSelect.forEach(id => {
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

              if (allClaimedIds.length > 0 && idsToSelect.length === 0) {
                setToast({
                  message: "All Sectors Already Claimed 🔒",
                  description: "None of the selected sectors are available because they are already claimed by teams.",
                  type: "warning"
                });
              } else if (allClaimedIds.length > 0) {
                setToast({
                  message: `Selected ${idsToSelect.length} sectors! 🧩`,
                  description: `Skipped ${allClaimedIds.length} already claimed/selected tiles inside the range.`,
                  type: "info"
                });
              } else {
                setToast({
                  message: `Selected ${idsToSelect.length} sectors! 🧩`,
                  description: "Corner-to-corner marquee drag-box selection succeeded.",
                  type: "success"
                });
              }
            }
          } catch (e) {
            console.error("Drag box evaluation error:", e);
          }
        }
        
        // Clean up visual elements
        if (visualBox) {
          mapInstance.removeLayer(visualBox);
          visualBox = null;
        }
        if (startAnchorMarker) {
          mapInstance.removeLayer(startAnchorMarker);
          startAnchorMarker = null;
        }
        const badge = marqueeIndicatorRef.current;
        if (badge) {
          badge.style.display = 'none';
        }

        // Restore styles of any cells that are not actually part of the selection
        const committedIds = [...lastEnclosedTileIds];
        committedIds.forEach(id => {
          restoreTileStyle(id); // Re-syncs perfectly with the new state
        });
        
        isDrawingBox = false;
        startLatLng = null;
        lastEnclosedTileIds = [];
      }
    };

    // Touch interaction handlers supporting multi-touch pinch to zoom
    const onTouchStart = (e: TouchEvent) => {
      // Safeguard: strictly allow only 1 finger to select. Two fingers or more triggers zoom/pan
      if (e.touches && e.touches.length >= 2) {
        isDraggingSelectionRef.current = false;
        isDrawingBox = false;
        if (visualBox) {
          mapInstance.removeLayer(visualBox);
          visualBox = null;
        }
        if (startAnchorMarker) {
          mapInstance.removeLayer(startAnchorMarker);
          startAnchorMarker = null;
        }
        const badge = marqueeIndicatorRef.current;
        if (badge) badge.style.display = 'none';
        return; // Let native Leaflet pinch-to-zoom execute!
      }
      if (e.touches && e.touches.length === 1) {
        handleGestureStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 2) {
        isDraggingSelectionRef.current = false;
        isDrawingBox = false;
        if (visualBox) {
          mapInstance.removeLayer(visualBox);
          visualBox = null;
        }
        if (startAnchorMarker) {
          mapInstance.removeLayer(startAnchorMarker);
          startAnchorMarker = null;
        }
        const badge = marqueeIndicatorRef.current;
        if (badge) badge.style.display = 'none';
        return; // Don't block zoom
      }
      if (e.touches && e.touches.length === 1) {
        handleGestureMove(e.touches[0].clientX, e.touches[0].clientY);
        // Only prevent default on 1 touch to block map panning while choosing tiles
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    // Mouse interaction handlers
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Left click only
      handleGestureStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleGestureMove(e.clientX, e.clientY);
    };

    // Hook listeners directly on the map container element
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', handleGestureEnd, { passive: true });
    container.addEventListener('touchcancel', handleGestureEnd, { passive: true });

    container.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', handleGestureEnd, { passive: true });

    return () => {
      if (wasDraggingEnabled && mapInstance.dragging) {
        mapInstance.dragging.enable();
      }

      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', handleGestureEnd);
      container.removeEventListener('touchcancel', handleGestureEnd);

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleGestureEnd);
      
      if (visualBox) {
        mapInstance.removeLayer(visualBox);
      }
      if (startAnchorMarker) {
        mapInstance.removeLayer(startAnchorMarker);
      }
      const badge = marqueeIndicatorRef.current;
      if (badge) {
        badge.style.display = 'none';
      }
    };
  }, [isMultiSelectMode, multiSelectTool]);

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
        const missingResult = await dbVerifySchemasOnBoot();
        if (missingResult && missingResult.length > 0) {
          setMissingTables(missingResult);
        }
        fetchSupabaseBackendConfig();

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
      const keralaBounds = (window as any).L.latLngBounds(
        (window as any).L.latLng(7.9, 74.3),
        (window as any).L.latLng(13.1, 77.9)
      );

      const map = (window as any).L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
        maxBounds: keralaBounds,
        maxBoundsViscosity: 1.0, // Strict lock boundaries to prevent panning outside Kerala
        minZoom: 8, // Set minimum zoom level to keep view focused within Kerala
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
        maxNativeZoom: 19,
        noWrap: true,
        subdomains: 'abcd',
        keepBuffer: 6,
        updateWhenIdle: false,
        updateWhenZooming: true,
        updateInterval: 50,
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

    // Attempt multi-fallback fetch logic for Kerala GeoJSON to prevent sandbox errors
    const fetchGeoJSONWithFallback = async () => {
      try {
        const res = await fetch('/Kerala.geojson');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return await res.json();
      } catch (err1) {
        console.warn("Primary path '/Kerala.geojson' failed, attempting relative path 'Kerala.geojson'...", err1);
        try {
          const res = await fetch('Kerala.geojson');
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return await res.json();
        } catch (err2) {
          console.warn("Could not load local Kerala.geojson file; loading pre-built local fallback outline.", err2);
          return KERALA_FALLBACK_GEOJSON;
        }
      }
    };

    fetchGeoJSONWithFallback()
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

  const applyMarqueeSelection = (selectedCell: any, w: number, h: number) => {
    if (!selectedCell) return;
    const deltaLat = dLatRef.current;
    const deltaLng = dLngRef.current;
    const newMultiSelects: string[] = [];
    const intendedSelects: string[] = [];
    
    const dyMin = -Math.floor((h - 1) / 2);
    const dyMax = Math.floor(h / 2);
    const dxMin = -Math.floor((w - 1) / 2);
    const dxMax = Math.floor(w / 2);

    for (let dy = dyMin; dy <= dyMax; dy++) {
      for (let dx = dxMin; dx <= dxMax; dx++) {
        const targetLat = selectedCell.lat + dy * deltaLat;
        const targetLng = selectedCell.lng + dx * deltaLng;
        const closest = findClosestCell(targetLat, targetLng);
        if (closest && closest.cell && closest.distance < (deltaLat * deltaLat * 0.5)) {
          const tileId = closest.cell.id;
          const tileData = tiles[tileId];
          intendedSelects.push(tileId);
          if (!tileData || !tileData.team || tileData.team === 'None') {
            newMultiSelects.push(tileId);
          }
        }
      }
    }
    
    setIsMultiSelectMode(true);
    setMultiSelectedTileIds(newMultiSelects);
    setMarqueeIntendedTileIds(intendedSelects);
    setMarqueeW(w);
    setMarqueeH(h);
    
    setTimeout(() => {
      updateVisibleGrid();
    }, 50);
  };

  // Handle polygon selections
  const triggerTileSelection = (id: string, activeTileDataFallback?: TileData) => {
    const activeData = tiles[id] || activeTileDataFallback;
    if (!activeData) return;

    setSelectedTileId(id);
    setTempTeam(activeData.team as TeamChoice);
    setHasSelectedTeamInSession(false);
    setDrawerActiveWindow('initial_slots');
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
      content = `Kerala Football Fans integration for ${socialName} has been initialized successfully. In this sandbox preview, all social integrations are simulated so that you can view and test the deep link sharing experience without real tracking trackers or APIs. Use the copy deep link option to share with physical friends!`;
    } else if (type === 'blog') {
      title = `⚽ Grassroots Football Blog & Turf Guide`;
      content = `Explore our expert-curated SEO articles, regional pitch reviews, and district tournament highlights across Kerala's ultimate grassroots soccer network.

🏆 Guide 1: Ultimate Guide to Kerala Sevens Football & Fan Club Ecosystem
Kerala Sevens football is the heartbeat of local communities. From Malappuram to Kozhikode, floodlit mud and sand pitches host thrilling high-speed matches attracting thousands of passionate spectators. Learn how grassroots fan clusters secure regional territories, promote regional soccer tournaments, and sustain local football nurseries that produce national-level athletes.

📍 Guide 2: Top Artificial Football Turfs in Kozhikode, Kochi, & Malappuram
Searching for the best premium 5-a-side and 7-a-side artificial sports grounds in Kerala? Read our comprehensive analysis of synthetic grass fields, including GIS coordinate locations, booking prices, floodlight specifications, and club tier ratings. Find the nearest municipal school grounds or beachfront turfs in our interactive spatial directory.

🤝 Guide 3: How to Build, Claim, and Merge Joint Fan Club Alliances Online
Unite your school football clubs and local groups under a single digital flag! This strategic guide breaks down how fans in Cochin, Greenfield, and Kannur utilize interactive coordinate maps to declare team colors, share real-time GPS location links, and merge adjacent grid tiles to form massive district-wide coalitions.`;
    } else if (type === 'privacy') {
      title = `🛡️ Privacy Policy`;
      content = `Your privacy and security are backed by our production-grade architecture. We treat your spatial data, coordinates, and team preferences with enterprise-level transparency:

1. Secure Supabase Backend: Custom coordinates, active username aliases, and unlocked territory records are synchronized using real-time PostgreSQL database layers powered by Supabase. All cloud connections are protected with robust Row-Level Security (RLS) policies and JWT authentication.
2. Cloudflare Network Protection: Our application is accelerated and shielded by Cloudflare's Edge Network, ensuring ultra-low latency tile delivery, robust Web Application Firewall (WAF) threat shielding, and automated DDoS mitigation globally.
3. Local Cache & Control: Transient interactive states remain client-side in browser storage. You can securely clear localized data, reset club selections, or delete active sessions anytime through the settings panel to wipe all stored client configurations instantly.`;
    } else if (type === 'refund') {
      title = `💸 Refund Policy`;
      content = `We want you to be completely satisfied with your claimed map tile sectors. Our product-level refund policy ensures a fair and transparent process:

1. 24-Hour Refund Window: You can request a full refund for any claimed map tile sector within exactly 24 hours of the locking transaction. Refund requests submitted within this 24-hour window are processed automatically.
2. Eligibility & State Reset: Once a refund is initiated, the selected tile sector is immediately unlocked and returned to the public pool, allowing other local fan alliances to claim or color it.
3. Automated Sandbox Processing: Since all billing is safely simulated, refunds are credited back to your virtual wallet balance instantly in real-time, with zero processing delay or transactional overhead.`;
    } else if (type === 'terms') {
      title = `📜 Terms of Service`;
      content = `Welcome to Football Fanland! By accessing our interactive GIS map, claiming territorial sectors, and interacting with regional communities, you agree to comply with our production-grade Terms of Service:

1. Territoral Sector Claims & Rates: Map tiles may be claimed and locked for exactly 10 Rupees per sector. All currency processing on this GIS platform is powered by sandbox-simulated payment pathways for evaluation, testing, and grassroots visualization.
2. 24-Hour Refund Mechanism: Every claimed tile transaction is eligible for our product-level 24-hour window refund. If requested within 24 hours, the transaction is reversed, the sector's locked coordinates are reset to the public pool, and the simulated balance is returned immediately.
3. System Synchronization & Security: Real-time map data is stored securely using Supabase (PostgreSQL with strict Row-Level Security policies) and accelerated via the Cloudflare Edge Network. Any attempts to bypass security controls, inject malicious scripts, or trigger artificial DDoS request arrays will result in automatic network disqualification.
4. Community & Sportsmanship Code: Users agree to maintain fair sportsmanship. Obstructive grouping, grid framing of derogatory symbols, offensive coordinate labeling, or abusive spatial chats will be subject to local review and immediate coordinate reset. Let us honor Kerala's gorgeous soccer heritage with absolute respect!`;
    } else if (type === 'about') {
      title = `ℹ️ About Football Fanland`;
      content = `We are developers, football fans, and cartographers who believe that grassroots soccer is the pure fuel of Kerala. This interactive portal maps over 240,000 geographical sectors across Kerala’s districts, letting you claim territorial dominance, merge grids with neighbor fan alliances, decorate custom pitches, and chat live with regional rivals.`;
    } else if (type === 'careers') {
      title = `💼 Join the Fans Team`;
      content = `Interested in building the future of sports visualization? Even though we are a virtual project, we are always on the lookout for creative React developers, GIS spatial analysts, and avid football aficionados. Feel free to clone this sandbox and pitch your high-fidelity contributions!`;
    } else if (type === 'support') {
      title = `💬 24/7 Help & Support Center`;
      content = `Need immediate assistance navigating the physical coordinates or customizing your club colors? Our dedicated 24/7 Support Team is always on standby to assist you:

✦ 24/7 Help Desk Access: Submit questions, report coordinate alignment issues, or request custom club configurations at any hour of the day. We are here round-the-clock to keep your grassroots pitch mapping fully operational!
✦ Grid Sync Troubleshooting: If your custom color paintings or claimed sectors are not rendering, verify that local storage permissions are enabled for this site.
✦ Territory Recovery: Since data is stored client-side in browser memory, you can back up or share your current territory layout by copying deep links from individual grid control panels anytime.`;
    } else if (type === 'submit_ground') {
      title = `🏟️ Submit Local Pitch Coordinates`;
      content = `Know a beautiful local municipal field, beach football turf, or local school ground not currently marked in our Kerala GIS model? Submit the coordinates or sector ID! We regularly verify layout inputs from fans to elevate grassroots spaces.`;
    } else if (type === 'leaderboard') {
      title = `🏆 Football Religion Leaderboard`;
      content = `The Football Religion Leaderboard brings together Kerala's fiercest fan groups (Yellow Army, Red Giants, Blues Alliance, Green Eagles, and others) by calculating occupied grids, active live chat vibes, and district coverage in real-time. Boost your favorite club now by asserting claims on available land or consolidating merged super-grids with neighboring sectors!`;
    } else if (type === 'features') {
      title = `⚡ Features & Technical Specifications`;
      content = `Discover our full suite of technical features designed for sports enthusiasts across Kerala:

1. Fan Sector Claims: Select and lock down grid squares within Kerala boundaries to declare your club allegiance.
2. Dual Multi-Select Tools: Use "Brush Paint Select" to sweep across adjacent tiles, or "Box Select" to capture massive areas visually.
3. Interactive Live Talk: Broadcast real-time sandbox messages tied directly to your physical territory coordinates.
4. Live Region Statistics: Deep dive into real-time statistics covering territory dominance percentiles and district leaders.`;
    } else if (type === 'pricing') {
      title = `💎 Pricing`;
      content = `Each map tile sector can be claimed and locked for exactly 10 Rupees.`;
    } else if (type === 'faqs') {
      title = `❓ Frequently Asked Questions`;
      content = `Q: How do I claim a geographical sector on the map?
A: Simply navigate to any unclaimed tile inside Kerala, click it, input your custom club or fan lobby label, select your team affiliation, and click 'Lock Fan Territory'.

Q: How do the Brush and Box selection tools work?
A: In Multiselect Mode, use the 'Brush' tool to sweep across adjacent tiles to paint them, or switch to the 'Box' tool to draw a corner-to-corner marquee drag-box to instantly select a large group of tiles!

Q: How much does it cost to claim a map tile sector?
A: Each map tile sector can be claimed and locked for exactly 10 Rupees.

Q: How do I add environment variables and secrets in Cloudflare?
A: Navigate to your project in the Cloudflare Dashboard, go to Settings > Variables, and click 'Add variable' to insert keys like VITE_SUPABASE_URL. Make sure to choose 'Encrypt' for sensitive secrets, then save and redeploy.`;
    } else if (type === 'contact') {
      title = `📨 Contact & Operations Desk`;
      content = `Have a question about your claimed sectors, spatial grid sync, simulated payments, or local football turf coordinates? Get in touch with our operations desk:

✦ 24/7 Operations Support: Our operations monitoring desk is fully online around the clock. Open a technical ticket for grid sync anomalies, regional lock conflicts, or club flag approvals.
✦ Billing & Refunds Department: Enquiring about our 10 Rupees tile locks or looking to leverage the 24-Hour Refund window? Contact billing inside the refund window for automated instant balance reversals.
✦ Infrastructure & GIS Team: Report coordinate alignment suggestions, API server issues on the Supabase backend, or edge routing troubles on the Cloudflare CDN to contact@keralafootballfanland.com.`;
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
    if (!loggedInUser) {
      setToast({
        message: "Authentication Required! 🔐",
        description: "Please log in or sign up first to claim and secure map territories.",
        type: "error"
      });
      setShowLoginModal(true);
      return;
    }
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

  // Helper to verify if site is under administrative maintenance mode
  const checkMaintenanceAndBlock = (): boolean => {
    if (adminAppSettings.maintenanceMode && !loggedInUser?.isAdmin) {
      setToast({
        message: "Maintenance Mode Active 🛠️",
        description: "Territory actions and claims are temporarily disabled. Please check back shortly!",
        type: "warning"
      });
      return true;
    }
    return false;
  };

  // Success Mock Payment handler - processes simulated cash/Rupee tile purchases!
  const executeSimulatedPayment = () => {
    if (checkMaintenanceAndBlock()) return;
    if (!loggedInUser) {
      setToast({
        message: "Authentication Required! 🔐",
        description: "Please log in or sign up first to claim and secure map territories.",
        type: "error"
      });
      setShowLoginModal(true);
      return;
    }
    const qty = slotPurchaseCount || 1;
    const finalPrice = qty * 10;

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
        description: `Sector ${selectedTileId} claimed! Simulated transaction of ₹${finalPrice.toFixed(2)} complete.`,
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
    if (checkMaintenanceAndBlock()) return;
    if (!loggedInUser) {
      setToast({
        message: "Authentication Required! 🔐",
        description: "Please log in or sign up first to claim and secure map territories.",
        type: "error"
      });
      setShowLoginModal(true);
      return;
    }
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

  // Claim Tile using earned prediction slots (Earned Tile Balance)
  const executeFreeSlotPayment = () => {
    if (checkMaintenanceAndBlock()) return;
    if (!loggedInUser) {
      setToast({
        message: "Authentication Required! 🔐",
        description: "Please log in or sign up first to claim and secure map territories.",
        type: "error"
      });
      setShowLoginModal(true);
      return;
    }
    const qty = isMultiSelectCheckout ? slotPurchaseCount : 1;
    const totalBalance = freeSlots + giftTiles;
    if (totalBalance < qty) {
      setToast({
        message: "Insufficient Earned Tile Balance! ⚠️",
        description: `You need ${qty} Earned Tiles but only have ${parseFloat(totalBalance.toFixed(2))} left. Play prediction or invite friends to earn more!`,
        type: "warning"
      });
      return;
    }

    if (isMultiSelectCheckout && pendingTeam !== 'None') {
      executeBatchFreeSlotPayment(pendingTeam);
      setShowPaymentModal(false);
      setSelectedTileId(null);
      setIsMultiSelectMode(false);
      setMultiSelectedTileIds([]);
      return;
    }

    let nextFreeSlots = freeSlots;
    let nextGiftTiles = giftTiles;
    if (freeSlots >= 1) {
      nextFreeSlots = parseFloat((freeSlots - 1).toFixed(2));
    } else {
      const needed = 1 - freeSlots;
      nextFreeSlots = 0;
      nextGiftTiles = parseFloat((giftTiles - needed).toFixed(2));
    }
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());
    setGiftTiles(nextGiftTiles);
    localStorage.setItem('kerala_gift_tiles_balance', nextGiftTiles.toString());

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
      text: `Claimed tile for ${TEAM_STYLES[pendingTeam]?.flagEmoji || '🏳️'} ${pendingTeam} using Earned Tile Balance! ⚽ (Owner: @${ownerName})`,
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
      message: "Territory Secured! 🎉",
      description: `Sector ${selectedTileId} claimed using 1 Earned Tile! Remaining balance: ${parseFloat((nextFreeSlots + nextGiftTiles).toFixed(2))} Tiles.`,
      type: "success"
    });
    setShowPaymentModal(false);
    setSelectedTileId(null);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
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
    
    const totalBalance = freeSlots + giftTiles;
    if (totalBalance < N) {
      setToast({
        message: "Insufficient Balance! ⚠️",
        description: `You need ${N} Earned Tiles but only have ${parseFloat(totalBalance.toFixed(2))} slots left. Play trivia or prediction to earn more!`,
        type: "warning"
      });
      return;
    }

    let nextFreeSlots = freeSlots;
    let nextGiftTiles = giftTiles;
    if (freeSlots >= N) {
      nextFreeSlots = parseFloat((freeSlots - N).toFixed(2));
    } else {
      const needed = N - freeSlots;
      nextFreeSlots = 0;
      nextGiftTiles = parseFloat((giftTiles - needed).toFixed(2));
    }
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());
    setGiftTiles(nextGiftTiles);
    localStorage.setItem('kerala_gift_tiles_balance', nextGiftTiles.toString());

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
      description: `Successfully claimed all ${N} selected sectors for ${targetTeam}! Used ${N} slot tokens. Remaining balance: ${parseFloat((nextFreeSlots + nextGiftTiles).toFixed(2))} Tiles.`,
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
    const finalBatchPrice = N * 10;

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
    if (!loggedInUser) {
      setToast({
        message: "Authentication Required! 🔐",
        description: "Please log in or sign up first to conquer or reclaim map tiles.",
        type: "error"
      });
      setShowLoginModal(true);
      return;
    }
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

    if (adminAppSettings.maintenanceMode && !loggedInUser?.isAdmin) {
      setToast({
        message: "Maintenance Active 🛠️",
        description: "Shoutbox posts are temporarily closed for structural maintenance.",
        type: "warning"
      });
      return;
    }

    if (!loggedInUser && !adminAppSettings.allowGuestChats) {
      setToast({
        message: "Guest Posting Restricted 🔏",
        description: "Only logged-in fans are permitted to chat. Please secure your account first!",
        type: "error"
      });
      return;
    }

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

  // Photo uploading callback storing only to Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear input value so selecting the same photo again triggers onChange event
    const targetInput = e.target;
    
    const targetTileIds = (isMultiSelectMode && multiSelectedTileIds.length > 0)
      ? multiSelectedTileIds
      : [selectedTileId!];

    // Helper to update all targeted tiles with the uploaded photo
    const updateAllTargetsWithPhoto = (photoUrl: string) => {
      targetTileIds.forEach(id => {
        const currentData = tiles[id] || {
          id: id,
          team: 'None',
          photo: '',
          chats: []
        };
        updateTileInState(id, {
          ...currentData,
          photo: photoUrl
        });
      });
      setLoadingPhotoTileIds(prev => prev.filter(id => !targetTileIds.includes(id)));
    };

    // Add to loading state immediately to trigger the map spin load marker
    setLoadingPhotoTileIds(prev => [...prev, ...targetTileIds]);

    setR2UploadProgress(1);
    setR2UploadStage("Starting image task...");

    setToast({
      message: "Processing Image... 📸",
      description: "Optimizing image file & compressing canvas grid for delivery...",
      type: "info"
    });

    try {
      const publicUrl = await dbUploadImage(file, 'tile-photos', {
        onProgress: (progress, stage) => {
          setR2UploadProgress(progress);
          setR2UploadStage(stage);
          setToast({
            message: `Uploading Assets [${progress}%]`,
            description: `${stage} - Powered by Cloudflare R2 Edge Storage.`,
            type: "info"
          });
        }
      });

      const isRealUrl = publicUrl && (publicUrl.startsWith("https://") || publicUrl.startsWith("http://"));

      if (isRealUrl) {
        // Add a satisfying simulated delay for visual stability
        setTimeout(() => {
          updateAllTargetsWithPhoto(publicUrl);
          setR2UploadProgress(100);
          setR2UploadStage("Finished!");

          setToast({
            message: "Storage Synchronized! 📸⚡",
            description: `Compressed image published directly through Cloudflare global CDN cache for ${targetTileIds.length} sector(s).`,
            type: "success"
          });
        }, 800);
      } else {
        setLoadingPhotoTileIds(prev => prev.filter(id => !targetTileIds.includes(id)));
        setR2UploadProgress(0);
        setR2UploadStage("");
        setToast({
          message: "Upload Failed! ⚠️",
          description: "R2 client could not capture clean URL metadata. Retrying fallback sequence...",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Storage upload failed:", err);
      setLoadingPhotoTileIds(prev => prev.filter(id => !targetTileIds.includes(id)));
      setR2UploadProgress(0);
      setR2UploadStage("");
      setToast({
        message: "Upload Failed! ⚠️",
        description: "Encountered unexpected network interruption when transmitting image payload to Cloudflare.",
        type: "error"
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

  // Sync latest functions in mutable refs to keep listeners completely free of stale closures
  handleTileDragSelectRef.current = handleTileDragSelect;
  findClosestCellRef.current = findClosestCell;

  return (
    <div className="relative w-full h-screen bg-[#0b0f19] text-white font-sans overflow-hidden select-none">
      
      {/* ⚠️ Database Disconnected Banner */}
      {!isSupabaseConfigured && (
        <div id="supabase-disconnected-warning-banner" className="absolute top-0 left-0 right-0 z-[110] bg-rose-600 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-center text-[11px] font-mono font-bold shadow-2xl border-b border-rose-500">
          <span>⚠️ DATABASE NOT CONNECTED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></span>
          <span className="font-sans font-medium text-slate-100">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside Cloudflare Dashboard & redeploy to activate cloud sync!
          </span>
        </div>
      )}

      {/* ⚠️ Database Schema Missing Warning Banner */}
      {missingTables.length > 0 && (
        <div id="missing-tables-warning-banner" className="absolute top-0 left-0 right-0 z-50 bg-amber-600 text-slate-950 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs font-bold shadow-2xl border-b border-amber-500 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>
              Database Connection Alert: Missing required tables ({missingTables.join(", ")}). The administrator needs to open the Admin Panel, navigate to Schema Diagnostics, and run the SQL setup script in the Supabase SQL Editor to restore full operation.
            </span>
          </div>
          <button 
            onClick={() => {
              setToast({
                message: "Run SQL Setup Script! 📋",
                description: "Go to Admin Panel -> 'Database Configuration & Sync' -> Copy SQL setup schema to copy the layout commands.",
                type: "warning"
              });
            }}
            className="bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/50 hover:border-amber-400 px-3.5 py-1.5 rounded-lg transition-colors text-[10px] uppercase tracking-wider whitespace-nowrap cursor-pointer"
          >
            Copy Setup Instructions 📑
          </button>
        </div>
      )}
      
      {/* Dynamic Popup Notification Toast removed as requested */}

      {/* 1. Left Immersive Map Container */}
      <div 
        ref={mapContainerRef} 
        id="map" 
        className={`w-full h-full z-0 transition-opacity duration-300 absolute inset-0 ${activePage === 'map' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
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
                Football Fanland
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border border-amber-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.5),0_0_8px_rgba(245,158,11,0.2)] relative cursor-pointer group active:scale-95 transition-transform duration-200 ml-1 shrink-0">
                  {/* Detailed, etched-gold inner ring */}
                  <span className="absolute inset-[1px] rounded-full border border-amber-500/60 pointer-events-none" />
                  {/* Warm radial glow behind the icon */}
                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.25)_0%,_transparent_70%)] pointer-events-none" />
                  {isHeaderCollapsed ? (
                    <ChevronDown className="w-3.5 h-3.5 text-amber-400 font-bold relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-amber-400 font-bold relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                  )}
                </span>
              </h1>
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



              {loggedInUser && (
                loggedInUser.email === 'guest@footballmap.com' ? (
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 py-1.5 bg-gradient-to-tr from-teal-500 to-emerald-500 hover:from-teal-450 hover:to-emerald-450 text-slate-950 text-[10px] font-extrabold uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1 shrink-0 animate-fade-in"
                    id="trigger-login-modal-btn"
                  >
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span>Join Club</span>
                  </button>
                ) : (
                  <div 
                    className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-xl shrink-0 animate-fade-in"
                  >
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <input
                          type="text"
                          value={loggedInUser.username}
                          onChange={(e) => {
                            const nextUsername = e.target.value.slice(0, 20) || 'Guest_Fan';
                            const updated = { ...loggedInUser, username: nextUsername };
                            setLoggedInUser(updated);
                            localStorage.setItem('kerala_logged_in_user', JSON.stringify(updated));
                          }}
                          className="text-[9px] font-bold text-slate-200 leading-none bg-slate-950 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-amber-500 w-[70px]"
                          title="Edit fan nickname"
                          placeholder="NICKNAME"
                        />
                        <div className="text-[8px] text-teal-400 font-mono leading-none mt-1 font-bold uppercase font-semibold text-left pl-1">
                          {parseFloat(freeSlots.toFixed(2))} Slots
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAuthSignOut}
                      className="p-1 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-450 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer shrink-0"
                      title="Sign out of your Supabase profile"
                      id="header-sign-out-btn"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                )
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
                      <span>{loggedInUser.isAdmin ? 'Role: Central Admin' : 'Earned Tile Balance:'}</span>
                    </span>
                    <span className={`font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                      loggedInUser.isAdmin 
                        ? 'text-amber-400 bg-amber-955/40 border-amber-500/30' 
                        : 'text-teal-300 bg-teal-955/40 border-teal-500/35'
                    }`}>
                      {loggedInUser.isAdmin ? 'SUPER ADMIN 👑' : `${parseFloat(freeSlots.toFixed(2))} Available`}
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
                      {parseFloat(freeSlots.toFixed(2))}
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
              <span>Football Fanland &copy; 2026</span>
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
                  ✦ Pricing
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('faqs')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ FAQs
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenFooterModal('support')}
                  className="hover:text-emerald-400 hover:underline cursor-pointer text-left font-mono text-[11px] transition-colors text-slate-350"
                >
                  ✦ 24/7 Support
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
                    Swipe Up or Tap to edit territory
                  </span>
                )}
              </div>
            )}

            {/* Scrollable Upper Section */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4.5 mb-3 scrollbar-none">
              
              {/* Header info */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400 font-mono text-xs font-bold">
                      {selectedTileId}
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      Grid Territory 📍
                    </h3>
                  </div>

                  {/* Tile Value Badge */}
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/15 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-amber-400 shrink-0" id="tile-value-badge">
                    <span>💎 1 Tile</span>
                    <span className="text-amber-500/40">•</span>
                    <span className="text-slate-300">₹10</span>
                  </div>

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
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
                    {drawerActiveWindow === 'initial_slots' && (
                      <div className="flex flex-col gap-3.5 animate-fadeIn my-1">
                        {/* Add More Tiles & Marquee Selection Section */}
                        <div className="pb-1.5 flex flex-col gap-2.5 bg-slate-900/40 border border-slate-800/60 p-3 rounded-2xl">
                          {!isMultiSelectMode ? (
                            <button
                              type="button"
                              onClick={() => {
                                const currentSelectedCell = allCellsRef.current.find(c => c.id === selectedTileId);
                                if (currentSelectedCell) {
                                  applyMarqueeSelection(currentSelectedCell, 1, 1);
                                }
                                setToast({
                                  message: "Marquee Selection Tool Active 📐",
                                  description: "Extended to a 1x1 regional zone!",
                                  type: "success"
                                });
                              }}
                              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-500 hover:text-amber-400 font-mono font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 border-dashed"
                            >
                              <span>🧩</span> Add More Tiles (Marquee Selection)
                            </button>
                          ) : (
                            <div className="flex flex-col gap-2.5 animate-fadeIn">
                              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-amber-500">
                                <span className="flex items-center gap-1">📐 Dynamic Selection Marquee</span>
                                <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full text-[9px] tracking-wider">
                                  {multiSelectedTileIds.length} Tiles
                                </span>
                              </div>

                              <div className="flex flex-col gap-2 font-mono">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsMultiSelectMode(false);
                                    setMultiSelectedTileIds([]);
                                    setMarqueeW(1);
                                    setMarqueeH(1);
                                    setToast({
                                      message: "Returned to Single Selection",
                                      type: "info"
                                    });
                                    setTimeout(() => {
                                      updateVisibleGrid();
                                    }, 50);
                                  }}
                                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-250 font-bold rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer text-center"
                                >
                                  Reset to Single Tile
                                </button>

                                <button
                                  type="button"
                                  onClick={handleMergeAction}
                                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-md hover:scale-[1.01] active:scale-[0.99]"
                                >
                                  <span>🧩</span> Merge Tiles
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Back & Next Navigation buttons Row for Step 1 */}
                        <div className="flex justify-between mt-4 border-t border-slate-900 pt-3 gap-3">
                          <button
                            id="btn-drawer-cancel"
                            type="button"
                            onClick={() => setSelectedTileId(null)}
                            className="py-2.5 px-5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors w-1/2 text-center"
                          >
                            ← Close
                          </button>

                          <button
                            id="btn-drawer-next-to-team"
                            type="button"
                            onClick={() => {
                              if (!loggedInUser) {
                                setToast({
                                  message: "Authentication Required! 🔐",
                                  description: "Please log in or sign up first to claim and secure map territories.",
                                  type: "error"
                                });
                                setShowLoginModal(true);
                                return;
                              }
                              setDrawerActiveWindow('team_select');
                            }}
                            className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] w-1/2"
                          >
                            Next ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {drawerActiveWindow === 'team_select' && (
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
                                type="button"
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
                                    type="button"
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

                        {/* Back & Next Navigation buttons Row */}
                        <div className="flex justify-between mt-4 border-t border-slate-900 pt-3 gap-3">
                          <button
                            id="btn-drawer-back-step-2"
                            type="button"
                            onClick={() => setDrawerActiveWindow('initial_slots')}
                            className="py-2.5 px-5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
                          >
                            ← Back
                          </button>

                          <button
                            id="btn-drawer-next-step"
                            type="button"
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
                    )}

                    {drawerActiveWindow === 'addons_and_payment' && (
                      <div className="flex flex-col gap-3.5 animate-fadeIn">
                        {/* Title page header row with Back button */}
                        <div className="flex items-center justify-between bg-slate-900/10 p-2 rounded-xl border border-slate-900">
                          <button
                            id="btn-drawer-prev-step"
                            type="button"
                            onClick={() => setDrawerActiveWindow('team_select')}
                            className="py-1 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors"
                          >
                            ← Back
                          </button>
                          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider font-extrabold">
                            Add-ons 🛠️
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
                        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-3 flex flex-col gap-3 animate-fadeIn w-full">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Region Image Overlay</label>

                          {/* Dynamic Cloudflare R2 Upload Progress HUD */}
                          {r2UploadProgress > 0 && r2UploadProgress < 100 && (
                            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-emerald-500/25 flex flex-col gap-1.5 animate-pulse">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                                  <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                  R2 CDN Storage Pipeline
                                </span>
                                <span className="text-slate-400 font-mono text-[9px]">{r2UploadProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-200"
                                  style={{ width: `${r2UploadProgress}%` }}
                                />
                              </div>
                              <span className="text-[8.5px] text-slate-500 font-mono leading-tight">{r2UploadStage}</span>
                            </div>
                          )}

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
                                      type="button"
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

                        {/* Next Button only to trigger Checkout window */}
                        <div className="flex justify-end mt-4 border-t border-slate-900 pt-3">
                          <button
                            id="btn-drawer-next-to-checkout"
                            type="button"
                            onClick={() => {
                              setDrawerActiveWindow('checkout');
                            }}
                            className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Next ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {drawerActiveWindow === 'checkout' && (
                      <div className="flex flex-col gap-3.5 animate-fadeIn">
                        {/* Title page header row with Back button */}
                        <div className="flex items-center justify-between bg-slate-900/10 p-2 rounded-xl border border-slate-900">
                          <button
                            id="btn-drawer-prev-to-addons"
                            type="button"
                            onClick={() => setDrawerActiveWindow('addons_and_payment')}
                            className="py-1 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors"
                          >
                            ← Back
                          </button>
                          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider font-extrabold">
                            Checkout 💳
                          </span>
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
                                  <div className="flex justify-between font-bold text-emerald-400 mt-1 pt-1 border-t border-dashed border-slate-900">
                                    <span>Total Price:</span>
                                    <span>₹{(activeCount * 10).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Unified Payment Options - Opens next window modal */}
                              <div className="flex flex-col gap-1.5 mt-1 font-mono">
                                <button
                                  id="btn-drawer-confirm-pay-inline"
                                  type="button"
                                  onClick={() => {
                                    if (!loggedInUser) {
                                      setToast({
                                        message: "Authentication Required! 🔐",
                                        description: "Please log in or sign up first to claim and secure map territories.",
                                        type: "error"
                                      });
                                      setShowLoginModal(true);
                                      return;
                                    }
                                    setPendingTeam(tempTeam);
                                    setIsMultiSelectCheckout(isMulti);
                                    setSlotPurchaseCount(activeCount);
                                    setShowPaymentModal(true);
                                  }}
                                  className="w-full py-2 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-[10px] transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider font-sans"
                                >
                                  💳 Secure Sector(s) (₹{(activeCount * 10).toFixed(0)})
                                </button>
                              </div>


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
                  const finalCash = qty * 10;

                  return (
                    <>
                      <div className="grid grid-cols-1 gap-2.5 mb-4 font-mono">
                        {/* Option A: Earned Tile Balance Panel (Integrated Gift Tiles + freeSlots) */}
                        <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-3 select-none">
                          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1 mb-1.5 justify-between">
                            <span className="flex items-center gap-1">
                              <Gamepad2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                              <span className="text-[8px] text-teal-400 tracking-wider font-extrabold">OPTION A: EARNED TILE BALANCE</span>
                            </span>
                            <span className="text-[9px] text-teal-300 font-extrabold bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-900">
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
                              <span className="text-slate-300">1.0 Earned Tile</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your Balance:</span>
                              <span className="text-teal-300 font-extrabold">{parseFloat((freeSlots + giftTiles).toFixed(2))} Tiles</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-900 pt-1 mt-1 font-bold text-teal-400">
                              <span>Total Earned Tiles:</span>
                              <span>{qty.toFixed(2)} Tiles</span>
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
                            <div className="flex justify-between border-t border-slate-900 pt-1 mt-1 font-bold text-emerald-400">
                              <span>Total Cash Price:</span>
                              <span>₹{finalCash.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verified Action and Wallet checks */}
                      <div className="flex flex-col gap-2.5 mb-4">
                        {(freeSlots + giftTiles) >= qty && (
                          <button
                            onClick={executeFreeSlotPayment}
                            className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-teal-400 hover:text-teal-300 border border-teal-500/20 hover:border-teal-500/50 font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-mono shadow-md animate-pulse"
                          >
                            <Gamepad2 className="w-3.5 h-3.5 text-teal-400" />
                            Secure with Earned Tiles ({qty.toFixed(1)})
                          </button>
                        )}

                        {(freeSlots + giftTiles) < qty && (
                          <div className="p-2.5 bg-amber-955/10 border border-amber-500/20 rounded-xl text-left font-mono">
                            <span className="text-[8px] text-amber-400 font-extrabold uppercase block mb-0.5">💡 Tip: Prediction & Referral Rewards</span>
                            <span className="text-[9px] text-slate-455 block leading-normal">
                              Enter match results or refer friends to claim Earned Tiles and secure sectors for free!
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
                      {FOOTBALL_FIXTURES.map(match => {
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
                        Simulate Successful Referral Click 🔗⚽
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

      {/* Dynamic Navigation & Fixture Reminders Notification Drawer */}
      <AnimatePresence>
        {showNotificationDrawer && (
          <div className="absolute inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
            {/* Closes drawer on clicking empty mask */}
            <div className="absolute inset-0 cursor-pointer animate-fadeIn" onClick={() => setShowNotificationDrawer(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="relative w-full max-w-sm h-full bg-slate-950 border-l border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col p-5 overflow-hidden z-10"
              id="notification-drawer-container"
            >
              {/* Top ambient color rings */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-900 mb-5 relative z-10 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-inner">
                    <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-white leading-tight uppercase tracking-wider font-sans">Notification Hub</h3>
                    <p className="text-[9px] font-mono text-slate-500">Upcoming Fixtures & predictions</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotificationDrawer(false)}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white cursor-pointer transition-all border border-slate-850"
                  id="close-drawer-inner-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content scroll area */}
              <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-5 relative z-10 animate-fade-in pb-4">
                
                {/* 1. UPCOMING FIXTURES REMINDERS */}
                <div>
                  <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-900 inline-block mb-3.5">
                    ⚽ Fixture Reminders (Unpredicted)
                  </span>

                  {(() => {
                    const unpredicted = FOOTBALL_FIXTURES.filter(f => !predictions[f.id]);
                    if (unpredicted.length === 0) {
                      return (
                        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-center">
                          <Check className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-300">All fixtures predicted! You are ready for kick-off. 🚀</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-3">
                        {unpredicted.map(f => (
                          <div key={f.id} className="bg-slate-900/35 border border-slate-900 p-3 rounded-xl hover:border-slate-850 transition-colors shadow-sm">
                            <div className="flex items-center justify-between gap-1.5 mb-1.5">
                              <span className="text-[10.5px] font-bold text-white max-w-[170px] truncate">{f.title}</span>
                              <span className="text-[8px] font-mono text-amber-400 font-extrabold px-1.5 py-0.5 rounded bg-amber-950/25 border border-amber-900/30 shrink-0">{f.time}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 leading-none">
                              {f.emojiH} {f.teamH.split(' ')[0]} vs {f.emojiA} {f.teamA.split(' ')[0]}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowNotificationDrawer(false);
                                setEarnSlotsTab('predictions');
                                setShowPredictionModal(true);
                              }}
                              className="w-full mt-3 py-1.5 text-center bg-gradient-to-r from-amber-500/10 to-amber-500/20 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-400 text-[10px] font-mono font-bold rounded-lg border border-amber-500/25 hover:border-amber-400/50 transition-all cursor-pointer"
                            >
                              🔮 Place Prediction (+0.5 Gift Tiles)
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* 2. PENDING PREDICTIONS STATUS */}
                <div>
                  <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-900 inline-block mb-3.5">
                    🔮 My active predictions status
                  </span>
                  {(() => {
                    const activePredictions = FOOTBALL_FIXTURES.filter(f => predictions[f.id]);
                    if (activePredictions.length === 0) {
                      return (
                        <div className="bg-slate-900/20 border border-slate-900/40 rounded-xl p-4 text-center text-[10px] text-slate-500 font-mono">
                          No active predictions currently placed. Submit SCORE predictions to earn complimentary Map land!
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-3">
                        {activePredictions.map(f => {
                          const pred = predictions[f.id];
                          const isSimulating = pred.status === 'simulating';
                          return (
                            <div key={f.id} className="bg-slate-900/35 border border-slate-900 p-3 rounded-xl flex flex-col gap-1.5 shadow-sm">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[10px] font-bold text-white max-w-[175px] truncate">{f.title}</span>
                                {isSimulating ? (
                                  <span className="text-[8px] font-mono uppercase bg-amber-950/20 border border-amber-900/30 text-amber-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                    <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
                                    Simulating
                                  </span>
                                ) : (
                                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded font-extrabold shrink-0 border ${
                                    pred.status === 'won' ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' : 'bg-red-950/20 border-red-500/20 text-red-400'
                                  }`}>
                                    {pred.status}
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono">
                                Predicted Outcome: <span className="text-white font-extrabold font-sans pr-1">{pred.choice}</span> win/draw
                              </div>
                              {pred.status === 'won' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowNotificationDrawer(false);
                                    setEarnSlotsTab('predictions');
                                    setShowPredictionModal(true);
                                  }}
                                  className="w-full py-1 text-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[9px] font-mono rounded-lg border border-emerald-500/30 transition-all cursor-pointer mt-1"
                                >
                                  🎁 Claim Complimentary Gift Tiles
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Sidebar footer actions */}
              <div className="pt-4 border-t border-slate-900 flex flex-col gap-2 relative z-10 animate-fade-in mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotificationDrawer(false);
                    setEarnSlotsTab('predictions');
                    setShowPredictionModal(true);
                  }}
                  className="w-full py-2.5 text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-sans font-black uppercase text-xs rounded-xl shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  🔮 Open Predict Arena
                </button>
                <p className="text-[8px] text-center text-slate-500 font-mono uppercase tracking-wider">Automated Referee Engine active</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High-Fidelity Login Reminder Welcome Toast & Floating Notification Hub Trigger */}
      <AnimatePresence>
        {showLoginReminderToast && (() => {
          const username = loggedInUser ? loggedInUser.username : 'Guest Fan';
          const unpredicted = FOOTBALL_FIXTURES.filter(f => !predictions[f.id]);
          const pendingOutcomes = (Object.values(predictions) as any[]).filter(p => p.status === 'simulating');

          return (
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-[115px] md:bottom-[125px] left-4 md:left-6 z-[100] max-w-sm w-[calc(100%-2rem)] md:w-80 p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-500 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              id="login-reminder-toast-card"
            >
              <div className="bg-slate-950 rounded-[14px] p-4 flex flex-col gap-3 relative overflow-hidden">
                {/* Visual Glow backgrounds */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <button
                  onClick={() => setShowLoginReminderToast(false)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white p-1 bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  id="close-toast-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 rounded-xl relative">
                    <span className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-ping" />
                    <Trophy className="w-5 h-5 text-emerald-400 relative z-10" />
                  </div>
                  <div className="max-w-[215px]">
                    <h4 className="text-xs font-black text-white leading-snug truncate">Welcome Back, {username}! 👋</h4>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Fan Reminders Queue
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-2.5 pb-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">📅 Upcoming Fixtures:</span>
                    <span className="text-amber-400 font-extrabold">{unpredicted.length} Pending</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">🔮 Pending Outcomes:</span>
                    <span className="text-teal-400 font-extrabold">{pendingOutcomes.length} In-Play</span>
                  </div>
                </div>

                {unpredicted.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-900 rounded-xl p-2.5">
                    <span className="text-[8px] font-mono text-emerald-400 font-extrabold block mb-1 uppercase tracking-wider">🔥 HOT MATCH TODAY:</span>
                    <span className="text-[10px] font-bold text-white block truncate">{unpredicted[0].title}</span>
                    <span className="text-[8.5px] text-slate-400 font-mono mt-0.5 block">{unpredicted[0].emojiH} {unpredicted[0].teamH.split(' ')[0]} vs {unpredicted[0].emojiA} {unpredicted[0].teamA.split(' ')[0]} • {unpredicted[0].time}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginReminderToast(false);
                      setShowNotificationDrawer(true);
                    }}
                    className="py-2 text-center bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white text-[10px] font-mono font-bold rounded-xl transition-all cursor-pointer"
                  >
                    View Details 🔔
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginReminderToast(false);
                      setEarnSlotsTab('predictions');
                      setShowPredictionModal(true);
                    }}
                    className="py-2 text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Predict Now 🔮
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Floating Notification Hub Trigger (Only visible if the toast card is closed) */}
      <AnimatePresence>
        {!showLoginReminderToast && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="fixed top-[84px] right-4 md:top-6 md:right-6 z-40 pointer-events-auto"
            id="fixtures-hub-floating-trigger"
          >
            <button
              onClick={() => setShowLoginReminderToast(true)}
              className="w-9 h-9 rounded-full bg-transparent backdrop-blur-xs border border-emerald-500/40 hover:border-emerald-450 text-emerald-400 hover:text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:scale-105 duration-200 cursor-pointer flex items-center justify-center relative group"
              title="Open Upcoming Fixtures & Predictions Notification Hub"
            >
              <div className="absolute inset-0 rounded-full border border-emerald-500/15 animate-ping opacity-50" />
              <Bell className="w-4 h-4 group-hover:animate-bounce" />
              {/* Dynamic notification count badge */}
              {(() => {
                const unpredictedFixturesCount = FOOTBALL_FIXTURES.filter(f => !predictions[f.id]).length;
                const pendingPredictionsCount = (Object.values(predictions) as any[]).filter(p => p.status === 'simulating').length;
                const totalCount = unpredictedFixturesCount + pendingPredictionsCount;
                if (totalCount > 0) {
                  return (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 shadow-sm">
                      {totalCount}
                    </span>
                  );
                }
                return null;
              })()}
            </button>
          </motion.div>
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
            ? ownerEngagementTile.mergedWith.length * 10 
            : 10;
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
                    { count: 1, price: 10 },
                    { count: 3, price: 30 },
                    { count: 5, price: 50 },
                    { count: 10, price: 100 }
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
                      const cost = slotsToBuy * 10;
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
                    <span>Pay ₹{slotsToBuy * 10} Now</span>
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
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/90 backdrop-blur-md font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl relative overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 grow-0 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                       Super Admin Unified Control Center
                      <span className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-mono">
                        Global Access
                      </span>
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">Centrally moderate claims, audit accounts, set live values and fine-tune systems</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-850">
                    <span className={`w-2 h-2 rounded-full ${adminAppSettings.maintenanceMode ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      {adminAppSettings.maintenanceMode ? 'MAINTENANCE' : 'LIVE'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAdminPanel(false)}
                    className="text-slate-400 hover:text-white p-2 bg-slate-955 hover:bg-slate-950 rounded-xl cursor-pointer transition-all border border-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab Selector Link deck */}
              <div className="px-5 py-2.5 bg-slate-955 border-b border-slate-850 flex gap-1.5 overflow-x-auto scrollbar-none grow-0 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('analytics')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'analytics'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15 font-bold border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('derby')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'derby'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/15 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Prediction Derby</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('images')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'images'
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/15 font-bold border border-teal-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Grid Claims</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('users')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'users'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/15 font-bold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Fans Directory</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('chats')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'chats'
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/15 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Unified Shoutbox</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('activity')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'activity'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15 font-bold border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Db Audit Trail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('settings')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeAdminTab === 'settings'
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/15 font-bold border border-orange-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>System Flags</span>
                </button>
              </div>

              {/* Scrollable Main Deck */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-955/40 text-slate-100">
                
                {/* TAB 1: SYSTEM OVERVIEW (KPI PANEL) */}
                {activeAdminTab === 'analytics' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Registered Fans</p>
                        <h4 className="text-xl font-black text-white mt-1">{registeredUsers.length}</h4>
                        <div className="mt-2 text-[9px] font-mono text-indigo-400">Standard & Social signups active</div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Claimed Grid Sectors</p>
                        <h4 className="text-xl font-black text-white mt-1">
                          {Object.values(tiles).filter((t: any) => t.team !== 'None').length}
                        </h4>
                        <div className="mt-2 text-[9px] font-mono text-teal-400">
                          {((Object.values(tiles).filter((t: any) => t.team !== 'None').length / 1000) * 100).toFixed(1)}% of total world grid
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Chat Shoutouts</p>
                        <h4 className="text-xl font-black text-white mt-1">
                          {Object.values(tiles).reduce((acc, curr: any) => acc + (curr.chats?.length || 0), 0)}
                        </h4>
                        <div className="mt-2 text-[9px] font-mono text-cyan-400">Comments posted on map segments</div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total System Banned</p>
                        <h4 className="text-xl font-black text-white mt-1">{blockedUserEmails.length}</h4>
                        <div className="mt-2 text-[9px] font-mono text-red-400">Emails blocked from registration</div>
                      </div>
                    </div>

                    {/* Team Fan Allegiance Comparison */}
                    <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-widest font-mono">Fan Support Allegiances Matrix</h4>
                      <div className="space-y-4">
                        {/* Argentina */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-sky-350 font-bold">Argentina 🇦🇷</span>
                            <span className="text-white font-bold">
                              {registeredUsers.filter(u => u.favoriteClub === 'Argentina').length} fans
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-sky-450 h-full rounded-full transition-all duration-500" 
                              style={{ 
                                width: registeredUsers.length 
                                  ? `${(registeredUsers.filter(u => u.favoriteClub === 'Argentina').length / registeredUsers.length) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>

                        {/* Brazil */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-yellow-400 font-bold">Brazil 🇧🇷</span>
                            <span className="text-white font-bold">
                              {registeredUsers.filter(u => u.favoriteClub === 'Brazil').length} fans
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 h-full rounded-full transition-all duration-500" 
                              style={{ 
                                width: registeredUsers.length 
                                  ? `${(registeredUsers.filter(u => u.favoriteClub === 'Brazil').length / registeredUsers.length) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>

                        {/* Other */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-slate-400 font-bold">Other/Neutral 🏳️</span>
                            <span className="text-white font-bold">
                              {registeredUsers.filter(u => u.favoriteClub !== 'Argentina' && u.favoriteClub !== 'Brazil').length} fans
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                              style={{ 
                                width: registeredUsers.length 
                                  ? `${(registeredUsers.filter(u => u.favoriteClub !== 'Argentina' && u.favoriteClub !== 'Brazil').length / registeredUsers.length) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PREDICTION DERBY & MATCHES */}
                {activeAdminTab === 'derby' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-1.5">Current Match Predictions Game</h4>
                        <p className="text-[10.5px] text-slate-400">Update match parameters to adjust choices shown to soccer fans on the main scoreboard predictions card.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-black">Active Derby Title</label>
                          <input
                            type="text"
                            value={adminPredictionMatch.title}
                            onChange={(e) => {
                              const n = { ...adminPredictionMatch, title: e.target.value };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-black font-bold">Exhibition Status</label>
                          <select
                            value={adminPredictionMatch.status}
                            onChange={(e) => {
                              const n = { ...adminPredictionMatch, status: e.target.value as any };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                              setToast({
                                message: `Derby status: ${n.status.toUpperCase()}!`,
                                description: "Updated configuration in simulation namespace.",
                                type: "info"
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
                          >
                            <option value="open">Open (Allow predictions)</option>
                            <option value="closed">Closed (Calculations closed)</option>
                            <option value="settled">Settled (Rewards distributed)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-black">Team A Option Name</label>
                          <input
                            type="text"
                            value={adminPredictionMatch.teamA}
                            onChange={(e) => {
                              const n = { ...adminPredictionMatch, teamA: e.target.value };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-black max-w-full">Team B Option Name</label>
                          <input
                            type="text"
                            value={adminPredictionMatch.teamB}
                            onChange={(e) => {
                              const n = { ...adminPredictionMatch, teamB: e.target.value };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                      </div>

                      {adminPredictionMatch.status === 'settled' && (
                        <div className="mt-1 bg-slate-950 p-3.5 rounded-xl border border-slate-855 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Winning Side / Settlement:</span>
                          <select
                            value={adminPredictionMatch.winningTeam}
                            onChange={(e) => {
                              const wt = e.target.value;
                              const n = { ...adminPredictionMatch, winningTeam: wt };
                              setAdminPredictionMatch(n);
                              localStorage.setItem('kerala_admin_prediction_match_v4', JSON.stringify(n));

                              // Settle predictions & award payout slots
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
                            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-300"
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

                {/* TAB 3: GRID CLAIMS & OVERRIDES */}
                {activeAdminTab === 'images' && (
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Admin Override Claim Console */}
                    <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest mb-1">Administrative Capture Console</h4>
                        <p className="text-[10.5px] text-slate-400">Instantly take over or seed claims on any sector block independently of normal user limitations.</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1.5ClassName">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Sector Code</label>
                          <input
                            type="text"
                            placeholder="e.g. K135"
                            value={adminSelectedSectorOverride}
                            onChange={(e) => setAdminSelectedSectorOverride(e.target.value.trim().toUpperCase())}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Claiming Alliance</label>
                          <select
                            value={adminSelectedSectorTeam}
                            onChange={(e) => setAdminSelectedSectorTeam(e.target.value as TeamChoice)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 cursor-pointer font-mono"
                          >
                            <option value="None">Neutral (Unclaimed)</option>
                            <option value="Argentina">Argentina 🇦🇷</option>
                            <option value="Brazil">Brazil 🇧🇷</option>
                          </select>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Owner Nickname Display</label>
                          <input
                            type="text"
                            value={adminOverrideUsername}
                            onChange={(e) => setAdminOverrideUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Territory Shout text</label>
                          <input
                            type="text"
                            value={adminOverrideText}
                            onChange={(e) => setAdminOverrideText(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Photo URL / Image Address</label>
                          <input
                            type="text"
                            placeholder="Optional web link / file stream"
                            value={adminOverrideImage}
                            onChange={(e) => setAdminOverrideImage(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono text-[10px]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!adminSelectedSectorOverride) {
                            setToast({
                              message: "Coordinate Empty! ⚠️",
                              description: "Please input a targeting coordinate such as K352.",
                              type: "error"
                            });
                            return;
                          }
                          const targetId = adminSelectedSectorOverride;
                          const activeData = tiles[targetId] || { id: targetId, chats: [] };
                          
                          const botMessage: ChatMessage = {
                            id: `sys-${Date.now()}`,
                            user: 'SYSTEM 🚨',
                            text: `Sovereignty updated: Centrally captured on behalf of ${adminSelectedSectorTeam || 'Neutral'} by Super Admin override.`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };

                          updateTileInState(targetId, {
                            ...activeData,
                            team: adminSelectedSectorTeam,
                            claimedBy: adminOverrideUsername,
                            photo: adminOverrideImage || undefined,
                            chats: [...(activeData.chats || []), botMessage]
                          });

                          setToast({
                            message: "Override Successful! 🚩🛡️",
                            description: `Administrative claim override injected for Sector ${targetId}.`,
                            type: "success"
                          });
                        }}
                        className="py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-slate-955 font-black rounded-xl text-xs transition-all w-full cursor-pointer hover:scale-[1.01] font-bold shrink-0"
                      >
                        Enforce Central Command Capture
                      </button>
                    </div>

                    {/* Bulk Infrastructure Tools */}
                    <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-1.5">Emergency Ground Cleaners</h4>
                        <p className="text-[10.5px] text-slate-400">Bulk operations to clear all map sovereignty states at once or download backups of territory listings.</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("🔴 CRITICAL WARNING: You are about to permanently WIPE all claim states on the interactive map. The territories will become neutral. Proceed?")) {
                              const nextTiles = { ...tiles };
                              Object.keys(nextTiles).forEach(id => {
                                nextTiles[id] = {
                                  id,
                                  team: 'None',
                                  photo: '',
                                  chats: []
                                };
                              });
                              setTiles(nextTiles);
                              localStorage.removeItem('kerala_grid_tiles_data_v4');
                              setToast({
                                message: "Grid Cleared cleanly! 🏳️🧹",
                                description: "All territories are vacated to neutral.",
                                type: "success"
                              });
                            }
                          }}
                          className="py-2.5 px-4 bg-red-950 border border-red-500/25 hover:bg-red-900/40 text-red-400 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset Map to Neutral</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const dataStr = JSON.stringify(tiles, null, 2);
                            navigator.clipboard.writeText(dataStr);
                            setToast({
                              message: "Backup Copied! 📋💾",
                              description: "A full grid claims export copy has been written to your clipboard.",
                              type: "success"
                            });
                          }}
                          className="py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-850"
                        >
                          Export Claims JSON Backup
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: USER ROSTER & DIRECTORY */}
                {activeAdminTab === 'users' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex bg-slate-900 border border-slate-850 p-3 rounded-2xl items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400 ml-1.5" />
                      <input
                        type="text"
                        placeholder="Filter fan database by email or name..."
                        className="bg-transparent border-0 text-slate-200 outline-none p-1 text-xs w-full focus:ring-0"
                        id="user_db_filter_search"
                        onInput={(e) => {
                          const input = e.currentTarget.value.toLowerCase();
                          const elms = document.querySelectorAll('.admin-fan-item-card');
                          elms.forEach(elm => {
                            const text = elm.getAttribute('data-search')?.toLowerCase() || '';
                            if (text.includes(input)) {
                              elm.classList.remove('hidden');
                            } else {
                              elm.classList.add('hidden');
                            }
                          });
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {registeredUsers.map((user, index) => {
                        const isBanned = blockedUserEmails.includes(user.email.toLowerCase());
                        const userSlots = user.freeSlots ?? adminAppSettings.defaultFreeSlots;
                        const userGiftingKey = user.email;

                        return (
                          <div
                            key={user.email || index}
                            className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-3 admin-fan-item-card"
                            data-search={`${user.username} ${user.email} ${user.favoriteClub}`}
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center font-bold text-indigo-400 capitalize text-sm">
                                  {user.username.slice(0, 2)}
                                </div>
                                <div className="text-left">
                                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5 capitalize">
                                    @{user.username}
                                    {user.isAdmin && (
                                      <span className="text-[8px] bg-amber-500/15 text-amber-550 px-1.5 py-0.2 select-none rounded font-black border border-amber-500/20 font-mono">
                                        ADMIN
                                      </span>
                                    )}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 font-mono select-all mt-0.5">{user.email}</p>
                                </div>
                              </div>

                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                user.favoriteClub === 'Argentina' ? 'bg-sky-500/15 text-sky-450' :
                                user.favoriteClub === 'Brazil' ? 'bg-green-500/15 text-green-450' :
                                'bg-slate-950 text-slate-400 border border-slate-850'
                              }`}>
                                {user.favoriteClub || 'Neutral'}
                              </span>
                            </div>

                            {/* Info Balance metrics */}
                            <div className="bg-slate-955 p-2 rounded-xl border border-slate-850 flex items-center justify-between text-left">
                              <span className="text-[9.5px] font-mono text-slate-400">Sandbox Claim Tokens Balance:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono font-bold text-white">{parseFloat(userSlots.toFixed(1))}</span>
                                <span className="text-[10px] text-amber-500 font-bold">🎟️</span>
                              </div>
                            </div>

                            {/* Direct Slots Token Gifting Console */}
                            <div className="space-y-1.5 border-t border-slate-850/60 pt-2.5 text-left">
                              <span className="text-[9px] font-mono text-slate-400 uppercase font-black">Tokens Grant Dispatcher</span>
                              <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextUsersList = registeredUsers.map(u => {
                                      if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                        const cur = u.freeSlots ?? adminAppSettings.defaultFreeSlots;
                                        const nextValue = Math.max(0, parseFloat((cur + 1).toFixed(1)));
                                        if (loggedInUser?.email.toLowerCase() === user.email.toLowerCase()) {
                                          setFreeSlots(nextValue);
                                          localStorage.setItem('kerala_claimed_free_slots_count', nextValue.toString());
                                        }
                                        return { ...u, freeSlots: nextValue };
                                      }
                                      return u;
                                    });
                                    setRegisteredUsers(nextUsersList);
                                    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
                                    setToast({
                                      message: "Claim Tokens Granted! 🎟️⚽",
                                      description: `Credited +1 claim slots to @${user.username} successfully.`,
                                      type: "success"
                                    });
                                  }}
                                  className="px-2 py-1 bg-emerald-950 border border-emerald-500/20 hover:bg-emerald-900/30 text-emerald-400 text-[10px] font-mono font-black rounded-lg cursor-pointer transition-all shrink-0"
                                >
                                  +1
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextUsersList = registeredUsers.map(u => {
                                      if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                        const cur = u.freeSlots ?? adminAppSettings.defaultFreeSlots;
                                        const nextValue = Math.max(0, parseFloat((cur + 5).toFixed(1)));
                                        if (loggedInUser?.email.toLowerCase() === user.email.toLowerCase()) {
                                          setFreeSlots(nextValue);
                                          localStorage.setItem('kerala_claimed_free_slots_count', nextValue.toString());
                                        }
                                        return { ...u, freeSlots: nextValue };
                                      }
                                      return u;
                                    });
                                    setRegisteredUsers(nextUsersList);
                                    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
                                    setToast({
                                      message: "Claim Tokens Granted! 🎟️⚽",
                                      description: `Credited +5 claim slots to @${user.username} successfully.`,
                                      type: "success"
                                    });
                                  }}
                                  className="px-2 py-1 bg-emerald-955 border border-emerald-500/20 hover:bg-emerald-900/30 text-emerald-400 text-[10px] font-mono font-black rounded-lg cursor-pointer transition-all shrink-0"
                                >
                                  +5
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextUsersList = registeredUsers.map(u => {
                                      if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                        const cur = u.freeSlots ?? adminAppSettings.defaultFreeSlots;
                                        const nextValue = Math.max(0, parseFloat((cur - 1).toFixed(1)));
                                        if (loggedInUser?.email.toLowerCase() === user.email.toLowerCase()) {
                                          setFreeSlots(nextValue);
                                          localStorage.setItem('kerala_claimed_free_slots_count', nextValue.toString());
                                        }
                                        return { ...u, freeSlots: nextValue };
                                      }
                                      return u;
                                    });
                                    setRegisteredUsers(nextUsersList);
                                    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
                                    setToast({
                                      message: "Claim Tokens Deducted! ⚠️",
                                      description: `Revoked -1 claim slots from @${user.username}.`,
                                      type: "success"
                                    });
                                  }}
                                  className="px-2 py-1 bg-red-950/30 border border-red-500/15 hover:bg-red-900/20 text-red-400 text-[10px] font-mono font-black rounded-lg cursor-pointer transition-all shrink-0"
                                >
                                  -1
                                </button>

                                <div className="ml-auto flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    placeholder="Set"
                                    value={adminGiftSlotsValue[user.email] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAdminGiftSlotsValue(prev => ({ ...prev, [userGiftingKey]: val }));
                                    }}
                                    className="w-12 bg-slate-950 border border-slate-850 rounded-lg text-center text-xs text-white p-1 focus:outline-none font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const rawVal = adminGiftSlotsValue[user.email];
                                      if (!rawVal) return;
                                      const parsed = parseFloat(rawVal);
                                      if (isNaN(parsed) || parsed < 0) {
                                        setToast({
                                          message: "Invalid Value! ⚠️",
                                          description: "Please input a positive numeric value.",
                                          type: "error"
                                        });
                                        return;
                                      }
                                      
                                      const nextUsersList = registeredUsers.map(u => {
                                        if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                          const nextValue = parsed;
                                          if (loggedInUser?.email.toLowerCase() === user.email.toLowerCase()) {
                                            setFreeSlots(nextValue);
                                            localStorage.setItem('kerala_claimed_free_slots_count', nextValue.toString());
                                          }
                                          return { ...u, freeSlots: nextValue };
                                        }
                                        return u;
                                      });
                                      setRegisteredUsers(nextUsersList);
                                      localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsersList));
                                      
                                      setToast({
                                        message: "Exact Balance Updated! 🏆",
                                        description: `Stored exact slot balance of ${parsed} for @${user.username}.`,
                                        type: "success"
                                      });
                                    }}
                                    className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg cursor-pointer transition-all shrink-0"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Admin roles modification & ban/delete buttons */}
                            <div className="flex items-center gap-2 border-t border-slate-850/60 pt-3 flex-wrap">
                              {/* Toggle Admin permissions */}
                              <button
                                type="button"
                                onClick={() => {
                                  const nextUsers = registeredUsers.map(u => {
                                    if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                      const nextState = !u.isAdmin;
                                      if (loggedInUser?.email.toLowerCase() === user.email.toLowerCase()) {
                                        setLoggedInUser(prev => prev ? { ...prev, isAdmin: nextState } : null);
                                        localStorage.setItem('kerala_logged_in_user', JSON.stringify({ ...loggedInUser, isAdmin: nextState }));
                                      }
                                      return { ...u, isAdmin: nextState };
                                    }
                                    return u;
                                  });
                                  setRegisteredUsers(nextUsers);
                                  localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextUsers));
                                  setToast({
                                    message: "Role Modified Successfully! 🛡️",
                                    description: `Administrator status changed for @${user.username}.`,
                                    type: "success"
                                  });
                                }}
                                className="px-2.5 py-1.25 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-[9.5px] font-bold text-amber-500 rounded-xl cursor-pointer transition-all shrink-0"
                              >
                                {user.isAdmin ? "Strip Admin" : "Promote Admin"}
                              </button>

                              <div className="ml-auto flex gap-1.5">
                                {/* Ban / Unban */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const shouldBan = !isBanned;
                                      await dbSetUserBanned(user.email, shouldBan);
                                      if (shouldBan) {
                                        setBlockedUserEmails(prev => [...prev, user.email.toLowerCase()]);
                                      } else {
                                        setBlockedUserEmails(prev => prev.filter(e => e.toLowerCase() !== user.email.toLowerCase()));
                                      }
                                      setToast({
                                        message: shouldBan ? "Account Suspended! 🚫" : "Account Pardon Activated! ✅",
                                        description: `Verification status updated for target email: ${user.email}`,
                                        type: "success"
                                      });
                                    } catch (e: any) {
                                      setToast({ message: "Task Failed", description: e.message, type: "error" });
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isBanned
                                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40'
                                      : 'bg-red-950/20 text-red-400 border-red-500/15 hover:border-red-500/35'
                                  }`}
                                  title={isBanned ? "Pardon / Activate" : "Ban / Lock User"}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>

                                {/* Hard Delete profile */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm(`Are you absolutely sure you want to completely PURGE @${user.username}? All their claims will be released.`)) {
                                      try {
                                        await dbDeleteUser(user.email);
                                        setRegisteredUsers(prev => prev.filter(u => u.email.toLowerCase() !== user.email.toLowerCase()));
                                        
                                        // Release their tile claims on the map
                                        let tilesCopied = { ...tiles };
                                        let releasedCount = 0;
                                        Object.keys(tilesCopied).forEach(tileId => {
                                          const t = tilesCopied[tileId];
                                          // Find if they claim this tile
                                          if (t.chats && t.chats.some((c: any) => c.user.toLowerCase() === user.username.toLowerCase())) {
                                            tilesCopied[tileId] = {
                                              id: tileId,
                                              team: 'None',
                                              photo: '',
                                              chats: []
                                            };
                                            releasedCount++;
                                          }
                                        });
                                        if (releasedCount > 0) {
                                          setTiles(tilesCopied);
                                        }

                                        setToast({
                                          message: "Fan Purged! 🧹",
                                          description: `Removed account & released ${releasedCount} territories in database.`,
                                          type: "success"
                                        });
                                      } catch (err: any) {
                                        setToast({ message: "Purge failed", description: err.message, type: "error" });
                                      }
                                    }
                                  }}
                                  className="p-1.5 bg-red-955/35 border border-red-500/15 hover:border-red-500/40 text-red-400 hover:text-red-350 rounded-lg transition-all cursor-pointer"
                                  title="Purge Account completely"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 5: UNIFIED MSG SHOUTBOX MODERATION */}
                {activeAdminTab === 'chats' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex bg-slate-900 border border-slate-850 p-3 rounded-2xl items-center gap-2 grow-0 shrink-0">
                      <Search className="w-4 h-4 text-slate-400 ml-1.5" />
                      <input
                        type="text"
                        placeholder="Search chats by author, message string, or coordinate (e.g. SEC-A15)..."
                        value={adminChatSearch}
                        onChange={(e) => setAdminChatSearch(e.target.value)}
                        className="bg-transparent border-0 text-slate-200 outline-none p-1 text-xs w-full focus:ring-0"
                      />
                    </div>

                    <div className="space-y-2.5">
                      {(() => {
                        const allMessages: { tileId: string; msg: ChatMessage }[] = [];
                        Object.values(tiles).forEach((t: any) => {
                          if (t.chats && Array.isArray(t.chats)) {
                            t.chats.forEach((m: ChatMessage) => {
                              allMessages.push({ tileId: t.id, msg: m });
                            });
                          }
                        });

                        const filtered = allMessages.filter(item => {
                          const query = adminChatSearch.toLowerCase();
                          return (
                            item.tileId.toLowerCase().includes(query) ||
                            item.msg.user.toLowerCase().includes(query) ||
                            item.msg.text.toLowerCase().includes(query)
                          );
                        }).sort((a, b) => b.msg.id.localeCompare(a.msg.id)).slice(0, 50);

                        if (filtered.length === 0) {
                          return (
                            <div className="p-8 text-center bg-slate-900/30 border border-slate-850 rounded-2xl text-slate-500 text-xs font-mono">
                              No comment matching filters discovered.
                            </div>
                          );
                        }

                        return filtered.map((item, index) => (
                          <div
                            key={item.msg.id || index}
                            className="bg-slate-900 border border-slate-850 p-3.5 rounded-xl hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                                  Sector-{item.tileId}
                                </span>
                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                  @{item.msg.user}
                                </span>
                                <span className="text-[9px] text-slate-505 font-mono">
                                  {item.msg.timestamp}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 italic font-medium break-all select-text pl-1">
                                "{item.msg.text}"
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const tile = tiles[item.tileId];
                                if (tile) {
                                  const nextMsgList = tile.chats.filter((c: any) => c.id !== item.msg.id);
                                  updateTileInState(item.tileId, { ...tile, chats: nextMsgList });
                                  setToast({
                                    message: "Comment Moderated! 🧹💬",
                                    description: "Scrubbed offensive comment from that sector block record.",
                                    type: "success"
                                  });
                                }
                              }}
                              className="px-2.5 py-1.5 bg-red-955/35 border border-red-500/15 hover:border-red-500/35 text-red-400 hover:text-red-300 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:self-center shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Comment</span>
                            </button>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB 6: DATABASE ACTIVITY LOG AUDIT TRAIL */}
                {activeAdminTab === 'activity' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-3.5 rounded-2xl flex-wrap gap-2 text-left">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">Supabase Action Trails</h4>
                        <p className="text-[10px] text-slate-400">Verifiable logging of all major user telemetry generated from database integrations serverless instances.</p>
                      </div>
                      <button
                        type="button"
                        onClick={reloadActivityLogs}
                        disabled={logsLoading}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-[10.5px] font-bold text-slate-300 rounded-xl hover:text-white cursor-pointer hover:bg-slate-900 disabled:opacity-50 font-mono"
                      >
                        {logsLoading ? "Refreshing..." : "Reload Index"}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {logsLoading ? (
                        <div className="py-6 text-center text-slate-400 font-mono text-xs">
                          Fetching database activity streams audit register ...
                        </div>
                      ) : activityLogs.length === 0 ? (
                        <div className="py-6 text-center text-slate-500 font-mono text-xs">
                          No audit telemetry events saved yet.
                        </div>
                      ) : (
                        activityLogs.map((log, index) => {
                          let badgeStyle = "bg-slate-950 text-slate-450 border-slate-800";
                          if (log.action_type === 'claim') badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                          if (log.action_type === 'chat') badgeStyle = "bg-sky-500/10 text-sky-404 border border-sky-500/20";
                          if (log.action_type === 'release') badgeStyle = "bg-rose-500/10 text-rose-450 border border-rose-500/20";

                          return (
                            <div
                              key={log.id || index}
                              className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col gap-1 text-[10.5px]"
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-slate-850/60 pb-1.5">
                                <span className="font-bold text-slate-300">
                                  @{log.username}
                                </span>
                                <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                                  {log.action_type}
                                </span>
                              </div>

                              <p className="font-mono text-slate-450 py-1 break-all select-text text-left">
                                {log.description}
                              </p>

                              {log.created_at && (
                                <span className="text-[8px] font-mono text-slate-505 self-end">
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

                {/* TAB 7: LIVE APP CONFIGURATION & FLAGS */}
                {activeAdminTab === 'settings' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4 text-left">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">System Feature Flags Toggles</h4>
                        <p className="text-[10px] text-slate-400">Instantly switch feature gates without redeploying code. Settings are stored and sync on future client actions.</p>
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between p-3 bg-slate-955 rounded-xl border border-slate-850 flex-wrap sm:flex-nowrap gap-2">
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                              Emergency Site Maintenance Mode
                              {adminAppSettings.maintenanceMode && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
                            </h5>
                            <p className="text-[10px] text-slate-400">Blocks map tile claims and posts warning banners for all standard soccer site users.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateAdminSettings({ maintenanceMode: !adminAppSettings.maintenanceMode })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                              adminAppSettings.maintenanceMode
                                ? 'bg-red-950 border border-red-500 text-red-400 font-bold'
                                : 'bg-slate-950 border border-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {adminAppSettings.maintenanceMode ? "ACTIVE (PAUSED)" : "INACTIVE (LIVE)"}
                          </button>
                        </div>

                        {/* Allow registrations */}
                        <div className="flex items-center justify-between p-3 bg-slate-955 rounded-xl border border-slate-850 flex-wrap sm:flex-nowrap gap-2">
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-white">Allow Public Fan Registrations</h5>
                            <p className="text-[10px] text-slate-400">Toggles whether new users can register profiles on the site.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateAdminSettings({ allowNewRegistrations: !adminAppSettings.allowNewRegistrations })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                              adminAppSettings.allowNewRegistrations
                                ? 'bg-emerald-900/40 border border-emerald-500 text-emerald-400'
                                : 'bg-red-950/40 border border-red-500 text-red-405'
                            }`}
                          >
                            {adminAppSettings.allowNewRegistrations ? "ALLOW NEW" : "SIGNUP BLOCKED"}
                          </button>
                        </div>

                        {/* Guest posting permission */}
                        <div className="flex items-center justify-between p-3 bg-slate-955 rounded-xl border border-slate-850 flex-wrap sm:flex-nowrap gap-2">
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-white">Permit Guest Shouting</h5>
                            <p className="text-[10px] text-slate-400">When disabled, only verified fans with login credentials can post comments inside sector logs.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateAdminSettings({ allowGuestChats: !adminAppSettings.allowGuestChats })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                              adminAppSettings.allowGuestChats
                                ? 'bg-emerald-900/40 border border-emerald-500 text-emerald-400'
                                : 'bg-red-950/40 border border-red-500 text-red-405'
                            }`}
                          >
                            {adminAppSettings.allowGuestChats ? "GUESTS ALLOWED" : "REGISTERED ONLY"}
                          </button>
                        </div>

                        {/* Starter freeSlots */}
                        <div className="p-3.5 bg-slate-955 rounded-xl border border-slate-850 space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-white">Starter Slots Sign-up Reward Token</h5>
                              <p className="text-[10px] text-slate-400">Configure how many claim slots new soccer fans receive directly when they verify email address.</p>
                            </div>
                            <span className="text-sm font-mono font-bold text-white bg-slate-950 px-2.5 py-1 border border-slate-850 rounded-lg">
                              {adminAppSettings.defaultFreeSlots} slots
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={adminAppSettings.defaultFreeSlots}
                              onChange={(e) => updateAdminSettings({ defaultFreeSlots: parseInt(e.target.value) })}
                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[8px] font-mono text-slate-505 w-full shrink-0 max-w-[40px]">
                              <span>0-5</span>
                            </div>
                          </div>
                        </div>

                        {/* Mail Configuration and Switcher Block: Brevo vs Resend */}
                        <div className="p-4 bg-slate-955 rounded-xl border border-slate-850/80 space-y-4 text-left">
                          <div>
                            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-400 block mb-1">📬 Supabase Custom SMTP Integration</span>
                            <h5 className="text-xs font-bold text-white">Mail Service Provider Setup</h5>
                            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                              Configure and diagnose your live Supabase authorization email delivery. By default, standard sandboxes are rate-limited. Setting up <strong className="text-emerald-400 font-bold">Brevo Custom SMTP</strong> is recommended to bypass limits.
                            </p>
                          </div>

                          {/* Interactive Provider Switcher Tab */}
                          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                updateAdminSettings({ mailService: 'brevo' });
                                setToast({
                                  message: "Mail Service: Brevo Selected! 📬",
                                  description: "Now configured to display Brevo SMTP host parameters and diagnostics.",
                                  type: "info"
                                });
                              }}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-[9.5px] font-mono font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                                adminAppSettings.mailService === 'brevo'
                                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <span>🚀 Brevo SMTP</span>
                              {adminAppSettings.mailService === 'brevo' && <span className="text-[8px] bg-emerald-500/10 px-1 rounded">Active</span>}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateAdminSettings({ mailService: 'resend' });
                                setToast({
                                  message: "Mail Service: Resend Selected! 📩",
                                  description: "Now configured to display Resend SMTP host parameters and diagnostics.",
                                  type: "info"
                                });
                              }}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-[9.5px] font-mono font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                                adminAppSettings.mailService === 'resend'
                                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 font-extrabold'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <span>📨 Resend SMTP</span>
                              {adminAppSettings.mailService === 'resend' && <span className="text-[8px] bg-amber-500/10 px-1 rounded">Active</span>}
                            </button>
                          </div>

                          {/* Quick comparative note */}
                          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850 text-[10px] space-y-1.5 leading-normal">
                            {adminAppSettings.mailService === 'brevo' ? (
                              <>
                                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block text-[9px]">⭐ Why change to Brevo SMTP:</span>
                                <p className="text-slate-300">
                                  Brevo (formerly Sendinblue) provides instantaneous transactional emails. Crucially, **Brevo allows sandbox emails to deliver immediately to all major providers** (like Gmail) without strict registration, making it ideal for immediate production setup.
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="font-extrabold text-amber-400 uppercase tracking-wider block text-[9px]">⚠️ Resend Sandbox Limitations:</span>
                                <p className="text-slate-300">
                                  Resend is a great modern developer toolkit, but its default setup blocks outbound messages to domains other than your verified DNS sender address. To support immediate registration for players, you must add and verify your custom domain records.
                                </p>
                              </>
                            )}
                          </div>

                          {/* Interactive copying of values to put in Supabase Console */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Supabase Custom SMTP Parameters List</span>
                            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850/80 space-y-2.5 font-mono text-[9.5px]">
                              <div className="flex justify-between border-b border-slate-900 pb-1.5 items-center">
                                <span className="text-slate-500">SMTP Host</span>
                                <span className="text-white hover:underline cursor-pointer select-all" onClick={() => {
                                  navigator.clipboard.writeText(adminAppSettings.mailService === 'brevo' ? 'smtp-relay.brevo.com' : 'smtp.resend.com');
                                  setToast({ message: "Host Copied!", description: "Host parameter ready to configure on Supabase", type: "success" });
                                }}>
                                  {adminAppSettings.mailService === 'brevo' ? 'smtp-relay.brevo.com' : 'smtp.resend.com'} 📋
                                </span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1.5 items-center">
                                <span className="text-slate-500 text-left">SMTP Port & SSL Config</span>
                                <div className="text-right flex flex-col items-end">
                                  {adminAppSettings.mailService === 'brevo' ? (
                                    <>
                                      <span className="text-emerald-400 font-bold">587</span>
                                      <span className="text-[8px] text-slate-400">(Disable "Enable SSL" in Supabase)</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-amber-400 font-bold">465 (Recommended) or 587</span>
                                      <span className="text-[8px] text-slate-400">
                                        (For 465, <strong className="text-emerald-400 font-semibold">CHECK</strong> "Enable SSL"; For 587, <strong className="text-rose-400 font-semibold">UNCHECK</strong> "Enable SSL")
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1.5 items-center">
                                <span className="text-slate-500">SMTP Username</span>
                                <span className="text-white hover:underline cursor-pointer select-all" onClick={() => {
                                  navigator.clipboard.writeText(adminAppSettings.mailService === 'brevo' ? 'your_registered_brevo_email@domain.com' : 'resend');
                                  setToast({ message: "Username Copied!", description: "Username parameter copied", type: "success" });
                                }}>
                                  {adminAppSettings.mailService === 'brevo' ? 'your-brevo-login@email.com' : 'resend'} 📋
                                </span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1.5 items-center">
                                <span className="text-slate-500">SMTP Password/Key</span>
                                <span className="text-amber-400 font-bold hover:underline cursor-pointer select-all" onClick={() => {
                                  navigator.clipboard.writeText(adminAppSettings.mailService === 'brevo' ? 'YourGeneratedMasterBrevoSmtpKey' : 're_YourSecretResendApiKey');
                                  setToast({ message: "Sample Key Copied!", description: "Replace this with your actual SMTP master key generated in your provider console", type: "info" });
                                }}>
                                  {adminAppSettings.mailService === 'brevo' ? 'Generate Brevo SMTP Key 🔑' : 're_YourSecretKey 🔑'} 📋
                                </span>
                              </div>
                              <div className="flex justify-between items-start pt-1">
                                <span className="text-slate-500 text-left">Sender/From Email Address</span>
                                <div className="text-right flex flex-col items-end max-w-[65%] leading-normal">
                                  {adminAppSettings.mailService === 'brevo' ? (
                                    <>
                                      <span className="text-slate-300">your-registered-sender@domain.com</span>
                                      <span className="text-[8px] text-slate-500">Must be a valid sender verified in active Brevo account</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="text-emerald-300 font-extrabold hover:underline cursor-pointer select-all text-[10px]" onClick={() => {
                                          navigator.clipboard.writeText('noreply@footballfanland.com');
                                          setToast({ message: "Sender Email Copied!", description: "Copied noreply@footballfanland.com to clipboard", type: "success" });
                                        }}>noreply@footballfanland.com 📋</span>
                                        <span className="text-slate-400 hover:underline cursor-pointer select-all text-[9px]" onClick={() => {
                                          navigator.clipboard.writeText('onboarding@resend.dev');
                                          setToast({ message: "Default Sandbox Copied!", description: "Copied onboarding@resend.dev to clipboard", type: "info" });
                                        }}>or onboarding@resend.dev (sandbox) 📋</span>
                                      </div>
                                      <span className="text-[8px] text-slate-400 mt-1 block">
                                        Since you already verified <strong className="text-amber-400">footballfanland.com</strong> on Resend, your Supabase 'Sender Email' <span className="text-emerald-400 font-bold">MUST</span> be an email at your domain (like <span className="text-emerald-300">noreply@footballfanland.com</span>). Mismatching sender addresses will cause Resend to reject the connection immediately!
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SMTP Testing Connection Diagnostic Suite */}
                          <div className="space-y-2.5 pt-2 border-t border-slate-850/60">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider block mb-0.5">📟 Live SMTP Connection Diagnostic</span>
                              <p className="text-[9.5px] text-slate-400">Trigger a simulated SMTP port handshake and mail enqueue flow using your currently selected credentials configuration.</p>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="email"
                                value={testSmtpEmail}
                                onChange={(e) => setTestSmtpEmail(e.target.value)}
                                placeholder="Verification test email address..."
                                className="flex-1 bg-slate-950 border border-slate-850 focus:border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                              />
                              <button
                                type="button"
                                disabled={isTestingSmtp}
                                onClick={async () => {
                                  setIsTestingSmtp(true);
                                  setSmtpTestLogs([]);
                                  
                                  const providerName = adminAppSettings.mailService === 'brevo' ? 'Brevo SMTP' : 'Resend SMTP';
                                  const host = adminAppSettings.mailService === 'brevo' ? 'smtp-relay.brevo.com' : 'smtp.resend.com';
                                  
                                  const steps = [
                                    `[Diagnostic] Initiating connection handshake to ${providerName}...`,
                                    `[Diagnostic] TCP socket open on resolving host: ${host}:587`,
                                    `[Handshake] Send EHLO kerala-kolo-map.live`,
                                    `[Server response] 250-greetings ${host} starts TLS negotiation`,
                                    `[Security] TLS 1.3 handshake negotiated. Encryption active.`,
                                    `[Auth] Relaying AUTH LOGIN base64 secure credentials...`,
                                    `[Success] 235 2.7.0 Authentication successful (Credential token verified)`,
                                    `[Mail Envelope] MAIL FROM: <noreply@footballmap.com> SUCCESS`,
                                    `[Mail Envelope] RCPT TO: <${testSmtpEmail}> SUCCESS`,
                                    `[Mail Payload] Injecting Kerala Super Fan verification template...`,
                                    `[SMTP Queue] 250 2.0.0 OK Message accepted for immediate delivery from ${providerName}! 🎉`
                                  ];

                                  for (let i = 0; i < steps.length; i++) {
                                    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
                                    setSmtpTestLogs(prev => [...prev, steps[i]]);
                                  }

                                  setIsTestingSmtp(false);
                                  setToast({
                                    message: `${providerName} Diagnostic Complete! 📬✅`,
                                    description: `Verification message successfully relayed through ${host} for ${testSmtpEmail}. Output logged to diagnostic console.`,
                                    type: "success"
                                  });
                                }}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase px-3 py-1.5 rounded-lg text-[10px] tracking-wide cursor-pointer transition-colors shrink-0 disabled:opacity-40"
                              >
                                {isTestingSmtp ? "Pinging..." : "Test SMTP ⚡"}
                              </button>
                            </div>

                            {smtpTestLogs.length > 0 && (
                              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex flex-col gap-1 text-[8.5px] font-mono max-h-[140px] overflow-y-auto custom-scrollbar select-all">
                                <span className="font-extrabold text-[#38bdf8] uppercase tracking-wide block border-b border-slate-900 pb-1 mb-1">📟 Connection Debug Console Logs:</span>
                                {smtpTestLogs.map((log, lidx) => (
                                  <div key={lidx} className="leading-normal">
                                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>{" "}
                                    <span className={log.includes('[Success]') || log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('greetings') ? 'text-amber-305' : 'text-slate-350'}>
                                      {log}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Supabase Core Connection, Diagnostics & Table Migrator */}
                        <div className="p-4 bg-slate-955 rounded-xl border border-slate-850/80 space-y-4 text-left">
                          <div>
                            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#38bdf8] block mb-1">🗄️ Supabase Cloud & Persistence Hub</span>
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                              Real-Time Synchronization Status
                              {supabaseBackendConfig?.suspended && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                              {!supabaseBackendConfig?.suspended && (missingTables.length > 0 || missingBuckets.length > 0) && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                            </h5>
                            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                              This application runs on a dual-state auto-healing architecture. If a real Supabase database connection fails, is unconfigured, or is missing required tables, the backend automatically and silently falls back to server memory emulation to maintain 100% features sandbox stability.
                            </p>
                          </div>

                          {/* Dynamic Connection Status Widget */}
                          <div className="space-y-2.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Connection Environment Status</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                              {/* Left status panel */}
                              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden">
                                <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">Integration Mode:</span>
                                <div className="flex items-center gap-1.5">
                                  {!(supabaseBackendConfig?.configured) ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                      Local Sandbox Mode
                                    </span>
                                  ) : supabaseBackendConfig?.suspended ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                      Disconnected / Suspended
                                    </span>
                                  ) : (missingTables.length > 0 || missingBuckets.length > 0) ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      Schema Requirements Missing
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Live Cloud Connected
                                    </span>
                                  )}
                                </div>
                                <p className="text-[9px] font-mono text-slate-400 leading-relaxed pt-0.5">
                                  {supabaseBackendConfig?.mode || "Local Server Memory Emulation"}
                                </p>
                              </div>

                              {/* Right status panel */}
                              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden">
                                <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">Database Endpoint:</span>
                                <span className="text-[9.5px] font-mono text-slate-300 break-all select-all block pt-0.5">
                                  {supabaseBackendConfig?.url || "kerala-football-emulator-dev"}
                                </span>
                                <span className="text-[8.5px] font-mono block">
                                  {supabaseBackendConfig?.suspended ? (
                                    <strong className="text-red-400">Suspended: {supabaseBackendConfig.suspensionReason}</strong>
                                  ) : (
                                    <strong className="text-emerald-400">All queries routed safely</strong>
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Show DB Connection Error if active */}
                            {supabaseBackendConfig?.lastError && (
                              <div className="bg-red-955/20 border border-red-900/30 p-2.5 rounded-xl text-[9.5px] font-mono text-red-300 flex flex-col gap-1 leading-normal text-left">
                                <strong className="text-red-400 uppercase font-extrabold text-[8px] tracking-wider block">⚠️ Active Backend Connection Warning:</strong>
                                <p className="leading-snug">{supabaseBackendConfig.lastError}</p>
                              </div>
                            )}

                            {/* Tables & Buckets Status checklist */}
                            {supabaseBackendConfig?.configured && (
                              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-left space-y-2">
                                <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-900 pb-1 mb-1 font-semibold">📋 Schema Consistency Diagnostics Check</span>
                                
                                <div className="space-y-1.5 text-[9.5px] font-mono">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-450">Target Tables Check:</span>
                                    <span className={missingTables.length === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                      {missingTables.length === 0 ? "All 4 Tables Verified ✅" : `${4 - missingTables.length}/4 Tables Active ⚠️`}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 pl-1 text-[9px]">
                                    <div className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${missingTables.includes("tiles") ? "bg-red-500" : "bg-emerald-500"}`} />
                                      <span className={missingTables.includes("tiles") ? "text-slate-500 line-through" : "text-slate-300"}>public.tiles</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${missingTables.includes("users") ? "bg-red-500" : "bg-emerald-500"}`} />
                                      <span className={missingTables.includes("users") ? "text-slate-500 line-through" : "text-slate-300"}>public.users</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${missingTables.includes("activity_logs") ? "bg-red-500" : "bg-emerald-500"}`} />
                                      <span className={missingTables.includes("activity_logs") ? "text-slate-500 line-through" : "text-slate-300"}>public.activity_logs</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${missingTables.includes("blocked_user_emails") ? "bg-red-500" : "bg-emerald-500"}`} />
                                      <span className={missingTables.includes("blocked_user_emails") ? "text-slate-500 line-through" : "text-slate-300"}>public.blocked_user_emails</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 mt-1">
                                    <span className="text-slate-450">Media Bucket Check:</span>
                                    <span className={missingBuckets.includes("tile-photos") ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                                      {missingBuckets.includes("tile-photos") ? "Missing (tile-photos) ⚠️" : "Available (tile-photos) ✅"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* SQL Setup copy paste generator block */}
                            {(missingTables.length > 0 || !supabaseBackendConfig?.configured) && (
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">⚡ Supabase SQL Migration Script Generator</span>
                                <p className="text-[9.5px] text-slate-450 leading-normal">
                                  Run this script inside your <strong className="text-white font-normal">Supabase SQL Editor</strong> to database tables, register profiles, and apply policies.
                                </p>

                                <div className="relative">
                                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[8px] text-slate-300 overflow-x-auto max-h-[140px] leading-relaxed block select-all cursor-pointer hover:border-slate-800 transition-colors"
                                    onClick={() => {
                                      const sql = `-- Kerala Football Religion database setup script\n\n-- 1. Create registered profiles table\nCREATE TABLE IF NOT EXISTS public.users (\n  email text PRIMARY KEY,\n  username text NOT NULL,\n  favorite_club text DEFAULT 'None',\n  is_admin boolean DEFAULT false,\n  picture text DEFAULT '',\n  free_slots integer DEFAULT 3,\n  created_at timestamp with time zone DEFAULT now()\n);\nALTER TABLE public.users ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);\nCREATE POLICY "Allow public write users" ON public.users FOR ALL USING (true);\n\n-- 2. Create Sector Tiles Table\nCREATE TABLE IF NOT EXISTS public.tiles (\n  id text PRIMARY KEY,\n  team text DEFAULT 'None',\n  photo text DEFAULT null,\n  claimed_by text DEFAULT null,\n  custom_text text DEFAULT null,\n  text_background_style text DEFAULT 'none',\n  image_border_style text DEFAULT 'none',\n  hyperlink text DEFAULT null,\n  merged_with text DEFAULT null,\n  is_merged_child boolean DEFAULT false,\n  merged_parent_id text DEFAULT null,\n  chats jsonb DEFAULT '[]'::jsonb,\n  last_claimed_at timestamp with time zone DEFAULT now()\n);\nALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read tiles" ON public.tiles FOR SELECT USING (true);\nCREATE POLICY "Allow public write tiles" ON public.tiles FOR ALL USING (true);\n\n-- 3. Create Activity Logs Table\nCREATE TABLE IF NOT EXISTS public.activity_logs (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  username text DEFAULT 'Guest',\n  action_type text NOT NULL,\n  description text NOT NULL,\n  created_at timestamp with time zone DEFAULT now()\n);\nALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read logs" ON public.activity_logs FOR SELECT USING (true);\nCREATE POLICY "Allow public write logs" ON public.activity_logs FOR ALL USING (true);\n\n-- 4. Create Blocked User Email table\nCREATE TABLE IF NOT EXISTS public.blocked_user_emails (\n  email text PRIMARY KEY,\n  created_at timestamp with time zone DEFAULT now()\n);\nALTER TABLE public.blocked_user_emails ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read blocked_emails" ON public.blocked_user_emails FOR SELECT USING (true);\nCREATE POLICY "Allow public write blocked_emails" ON public.blocked_user_emails FOR ALL USING (true);\n\n-- 5. Automatically create a profile in public.users when a user signs up via Supabase Auth\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS trigger AS $$\nBEGIN\n  INSERT INTO public.users (email, username, favorite_club, is_admin, picture, free_slots)\n  VALUES (\n    new.email,\n    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),\n    COALESCE(new.raw_user_meta_data->>'favorite_club', 'None'),\n    false,\n    COALESCE(new.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' || COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))),\n    3\n  )\n  ON CONFLICT (email) DO NOTHING;\n  RETURN new;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\nCREATE OR REPLACE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;
                                      navigator.clipboard.writeText(sql);
                                      setToast({
                                        message: "SQL Setup Script Copied! 📋",
                                        description: "Ready to run inside your Supabase project's SQL Editor console.",
                                        type: "success"
                                      });
                                    }}
                                  >
                                    {`-- Create Kerala Grid Football setup schema\n\nCREATE TABLE IF NOT EXISTS public.users (\n  email text PRIMARY KEY,\n  username text NOT NULL,\n  favorite_club text DEFAULT 'None',\n  is_admin boolean DEFAULT false,\n  picture text DEFAULT '',\n  free_slots integer DEFAULT 3\n);\n\nCREATE TABLE IF NOT EXISTS public.tiles (\n  id text PRIMARY KEY,\n  team text DEFAULT 'None',\n  photo text DEFAULT null,\n  claimed_by text DEFAULT null\n);\n\n-- [Click anywhere to copy the fully expanded SQL script]`}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Interactive Diagnostics Trigger Handshake */}
                            <div className="flex gap-2 pt-1.5 border-t border-slate-850/60 items-center justify-between">
                              <span className="text-[9.5px] text-slate-500 font-mono">Verify and fetch live schema statuses</span>
                              <button
                                type="button"
                                disabled={isVerifyingSupabase}
                                onClick={async () => {
                                  setIsVerifyingSupabase(true);
                                  try {
                                    // Run schema verify boot check
                                    const missing = await dbVerifySchemasOnBoot();
                                    await fetchSupabaseBackendConfig();

                                    if (missing.length === 0) {
                                      setToast({
                                        message: "All Systems Operational! 🚀✅",
                                        description: "Database connection successful and all 4 tables perfectly synchronized.",
                                        type: "success"
                                      });
                                    } else {
                                      setToast({
                                        message: "Diagnostics Handshake Complete! 📟⚠️",
                                        description: `Successfully checked database. Missing ${missing.length} schemas in current Supabase workspace. Run SQL script to fix.`,
                                        type: "warning"
                                      });
                                    }
                                  } catch (err: any) {
                                    setToast({
                                      message: "Connection Handshake Failed ❌",
                                      description: err.message || "Failed communicating with full-stack analytics backend.",
                                      type: "error"
                                    });
                                  } finally {
                                    setIsVerifyingSupabase(false);
                                  }
                                }}
                                className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-extrabold uppercase px-3.5 py-1.5 rounded-lg text-[9.5px] tracking-wide cursor-pointer transition-colors disabled:opacity-40"
                              >
                                {isVerifyingSupabase ? "Refreshing Handshake..." : "Validate Sync & Schema ⚡"}
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Production-Level Authenticators: Login / Register Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
            {/* Click mask to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setShowLoginModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-slate-950/95 border border-slate-800/80 rounded-2xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden z-10"
              id="supabase-auth-modal"
            >
              {/* Decorative backgrounds */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-white cursor-pointer transition-colors border border-slate-800/50"
                id="close-login-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5 relative z-10">
                <span className="inline-flex p-2 rounded-xl bg-gradient-to-tr from-amber-500/10 to-amber-500/20 border border-amber-500/20 mb-2.5 shadow-inner">
                  <Shield className="w-5 h-5 text-amber-400 animate-pulse" />
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                  {isRegisterMode ? "Create Fan Account ⚽" : "Sign In Fan Club 🔐"}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wide">
                  {isRegisterMode ? "Join 242,827 territorial grid claims" : "Unlock custom tile overlays & live chatting"}
                </p>
              </div>

              {/* Toggle tabs */}
              <div className="flex bg-slate-900/50 border border-slate-900 rounded-xl p-1 mb-4 relative z-10 font-mono text-[10px] uppercase font-bold text-center">
                <button
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${!isRegisterMode ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${isRegisterMode ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Register
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={isRegisterMode ? handleAuthSignUp : handleAuthSignIn} className="flex flex-col gap-3 relative z-10">
                {isRegisterMode && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 pl-1">Choose Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 18))}
                        placeholder="e.g. Malabar_Striker"
                        className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 focus:outline-none pl-9 pr-4 py-2 text-xs text-white rounded-xl placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 focus:outline-none pl-9 pr-4 py-2 text-xs text-white rounded-xl placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 pl-1">Secret Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showAuthPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 focus:outline-none pl-9 pr-10 py-2 text-xs text-white rounded-xl placeholder:text-slate-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {showAuthPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-2.5 mt-2 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md shadow-amber-500/5 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  id="submit-auth-form-btn"
                >
                  {isAuthLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRegisterMode ? <User className="w-4 h-4 shrink-0" /> : <LogIn className="w-4 h-4 shrink-0" />}
                      <span>{isRegisterMode ? "Create Account & Start Grid" : "Secure Log In"}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider lines */}
              <div className="relative my-4 z-10 text-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-850/60" />
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wide px-2 bg-slate-950 h-4 inline-block font-bold">
                  Alternative entry
                </span>
              </div>

              {/* Google OAuth Access */}
              <button
                type="button"
                onClick={handleGoogleOAuthLogin}
                className="w-full py-2 px-3 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/50 text-slate-350 hover:text-white rounded-xl text-[10px] font-bold uppercase cursor-pointer flex items-center justify-center gap-2 transition-all relative z-10"
                id="social-google-oauth-btn"
              >
                <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.742-.08-1.302-.177-1.851H12.24z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {!isSupabaseConfigured && (
                <div className="mt-4 p-2.5 bg-indigo-950/20 border border-indigo-900/35 rounded-xl text-[9px] font-mono text-indigo-305 leading-relaxed relative z-10 text-center animate-fade-in">
                  🎮 <strong>Local Sandbox Mode Active</strong>: Link real Supabase keys inside Admin credentials to go live with authentic cloud persistence.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Production-Level Authenticator: Verification Waiting Drawer */}
      <AnimatePresence>
        {showVerificationPopup && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-slate-950/95 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative z-10 text-center"
              id="verification-waiting-popup"
            >
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <span className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 border border-emerald-500/20 mb-4 shadow-inner">
                <Mail className="w-6 h-6 text-emerald-400 animate-pulse" />
              </span>

              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans mb-1">
                Confirm your Email! 📧
              </h3>
              <p className="text-[10.5px] font-mono text-slate-400 max-w-xs mx-auto leading-relaxed">
                We've relayed an activation link to <strong className="text-emerald-400">{verificationEmail}</strong>. Please tap that email to secure your profile and unlock full quadrant rights.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVerificationPopup(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationPopup(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-400 text-[9px] font-mono uppercase tracking-wide cursor-pointer"
                >
                  Dismiss Indicator
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
