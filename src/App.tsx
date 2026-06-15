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
  Wallet
} from 'lucide-react';
import { TileData, TeamChoice, TeamStyle, ChatMessage } from './types';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingTeam, setPendingTeam] = useState<TeamChoice>('None');
  const [leaderboardCollapsed, setLeaderboardCollapsed] = useState(true);
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

  // User Authentication
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    email: string;
    favoriteClub: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('kerala_logged_in_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFavClub, setLoginFavClub] = useState<TeamChoice>('Argentina');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [showPredictionModal, setShowPredictionModal] = useState(false);
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
  const [isMergePanelCollapsed, setIsMergePanelCollapsed] = useState(true);
  const [multiSelectedTileIds, setMultiSelectedTileIds] = useState<string[]>([]);
  const [slotPurchaseCount, setSlotPurchaseCount] = useState<number>(0);
  const [isMultiSelectCheckout, setIsMultiSelectCheckout] = useState<boolean>(false);
  const [multiSelectTargetTeam, setMultiSelectTargetTeam] = useState<TeamChoice>('Argentina');
  const [activeMultiTab, setActiveMultiTab] = useState<'merge' | 'claim'>('claim');
  const [customTextInput, setCustomTextInput] = useState('');
  const [textBackgroundStyle, setTextBackgroundStyle] = useState<'none' | 'team_color'>('none');
  const [imageBorderStyle, setImageBorderStyle] = useState<'none' | 'team_color'>('none');
  const [hyperlinkInput, setHyperlinkInput] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');

  // Popup notification toast state
  const [toast, setToast] = useState<{ message: string; description?: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Responsive device viewport detection
  const [isMobile, setIsMobile] = useState(false);

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
  const latestMultiSelectTargetTeamRef = useRef<TeamChoice>('Argentina');
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

  // Save changes to localStorage and generate global tickers
  const updateTileInState = (id: string, updatedData: TileData) => {
    let next: Record<string, TileData> = {};
    setTiles(prev => {
      next = { ...prev, [id]: updatedData };
      latestTilesRef.current = next;
      saveClaimedTiles(next);
      return next;
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
            color: !isSelected ? (targetStyle.color || '#eab308') : (existData.team === 'None' || !existData.team ? '#475569' : style.color),
            weight: !isSelected ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5),
            fillColor: !isSelected ? (targetStyle.color || 'transparent') : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
            fillOpacity: !isSelected ? 0.35 : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
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
      triggerTileSelection(ownerId, ownerData);
    }
  };

  // Dedicated drag-over select handler to enable brush painting selection
  const handleTileDragSelect = (id: string) => {
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
            color: targetStyle.color || '#eab308',
            weight: 2.5,
            fillColor: targetStyle.color || 'transparent',
            fillOpacity: 0.35
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

    // Clear previous polygons
    Object.values(polygonLayersRef.current).forEach(layer => mapInstance.removeLayer(layer));
    polygonLayersRef.current = {};

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

      const visibleCells = allCellsRef.current.filter(cell => 
        cell.lat >= padMinLat && cell.lat <= padMaxLat && 
        cell.lng >= padMinLng && cell.lng <= padMaxLng
      );

      // Slice to a safe rendering limit (max 1500 polygons)
      renderList = visibleCells.slice(0, 1500);
    }

    const tempLayers: Record<string, any> = {};
    const dLat = dLatRef.current;
    const dLng = dLngRef.current;

    renderList.forEach(cell => {
      const id = cell.id;
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
        color: isSec ? (targetStyle.color || '#eab308') : (existData.team === 'None' ? '#475569' : style.color),
        weight: isSec ? 2.5 : (existData.team === 'None' ? 0.5 : 1.5),
        fillColor: isSec ? (targetStyle.color || 'transparent') : ((existData.team === 'None' || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? 0.35 : ((existData.team === 'None' || existData.photo) ? 0 : 0.4),
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

      const memberCells = allCellsRef.current.filter(c => memberIds.includes(c.id));
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

      const memberCells = allCellsRef.current.filter(c => memberIds.includes(c.id));
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
        color: isSec ? (targetStyle.color || '#eab308') : (existData.team === 'None' || !existData.team ? '#475569' : style.color),
        weight: isSec ? 2.5 : (existData.team === 'None' || !existData.team ? 0.5 : 1.5),
        fillColor: isSec ? (targetStyle.color || 'transparent') : ((existData.team === 'None' || !existData.team || existData.photo) ? 'transparent' : style.color),
        fillOpacity: isSec ? 0.35 : ((existData.team === 'None' || !existData.team || existData.photo) ? 0 : 0.4),
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
    // 1. Load claims from localStorage
    try {
      const saved = localStorage.getItem('kerala_claimed_tiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTiles(parsed);
        latestTilesRef.current = parsed;
      }
    } catch (e) {
      console.error("Failed to load initial claimed tiles", e);
    }

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
        maxBoundsViscosity: 0.8
      }).setView([10.4505, 76.2711], 8);

      (window as any).L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors',
        maxZoom: 19,
        noWrap: true,
        bounds: worldBounds
      }).addTo(map);

      mapRef.current = map;
    }

    const mapInstance = mapRef.current;

    // Draw boundary state of Kerala in background
    fetch('/Kerala.geojson')
      .then(res => res.json())
      .then(keralaData => {
        const turfObj = (window as any).turf;
        let renderFeature = keralaData;

        // Dissolve district features into a unified single outline to fix internal green borders
        if (keralaData && keralaData.features && keralaData.features.length > 0 && turfObj) {
          try {
            let unioned = keralaData.features[0];
            for (let i = 1; i < keralaData.features.length; i++) {
              const u = turfObj.union(unioned, keralaData.features[i]);
              if (u) unioned = u;
            }
            if (unioned) {
              renderFeature = unioned;
            }
          } catch (e) {
            console.warn("Could not dissolve boundary, using standard outline fallback:", e);
            renderFeature = keralaData;
          }
        }

        const boundaryLayer = (window as any).L.geoJSON(renderFeature, {
          style: {
            color: '#10b981', // Emerald pristine boundary
            weight: 2,
            fillColor: '#10b981',
            fillOpacity: 0.04
          },
          interactive: false
        }).addTo(mapInstance);
        boundaryLayerRef.current = boundaryLayer;

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

            const intersections: number[] = [];
            rings.forEach(ring => {
              for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const x1 = ring[i][0], y1 = ring[i][1];
                const x2 = ring[j][0], y2 = ring[j][1];

                if ((y1 > lat && y2 <= lat) || (y2 > lat && y1 <= lat)) {
                  if (y1 !== y2) {
                    const x_intersect = x1 + (lat - y1) * (x2 - x1) / (y2 - y1);
                    intersections.push(x_intersect);
                  }
                }
              }
            });

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

    const memberCells = allCellsRef.current.filter(c => memberIds.includes(c.id));
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
        // Pan to center of merged bounds
        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLng + maxLng) / 2;
        if (window.innerWidth < 768) {
          // On mobile, offset slightly south so the marked cell is clearly visible above the bottom sheet
          const latRange = (maxLat - minLat) || dLatRef.current;
          const offsetLat = latRange * 0.15 + 0.0055;
          mapInstance.panTo([midLat - offsetLat, midLng]);
        } else {
          mapInstance.panTo([midLat, midLng]);
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
      content = `Welcome to the official Kerala Football Map blog network! Here we report on the ultimate grassroots football wars from Kozhikode and Malappuram, to Kochi and Greenfield. Fans have pledged massive simulated flags, built merged super-grids, and shared real-time coordinates. Stay tuned as more communities assert their soccer religion!`;
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
      title = `ℹ️ About Kerala Football Map`;
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
      const targetCell = allCellsRef.current.find(c => c.id === cleanId);
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
                draggable: true 
              })
                .addTo(mapInstance)
                .bindTooltip(`<div class="bg-slate-950 text-violet-300 font-mono text-[10px] px-2 py-1 rounded border border-violet-800">📍 Match: ${displayName} (Drag pin to adjust)</div>`, {
                  permanent: false,
                  direction: 'top',
                  opacity: 0.95
                });

              searchMarker.on('dragend', handleMarkerDragEnd);
              userMarkerRef.current = searchMarker;

              // Grid matching
              let closestCell: any = null;
              let minDistance = Infinity;

              if (allCellsRef.current && allCellsRef.current.length > 0) {
                allCellsRef.current.forEach((cell: any) => {
                  const dLat = cell.lat - latitude;
                  const dLng = cell.lng - longitude;
                  const dist = dLat * dLat + dLng * dLng;
                  if (dist < minDistance) {
                    minDistance = dist;
                    closestCell = cell;
                  }
                });
              }

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

    let closestCell: any = null;
    let minDistance = Infinity;

    if (allCellsRef.current && allCellsRef.current.length > 0) {
      allCellsRef.current.forEach((cell: any) => {
        const dLat = cell.lat - newLat;
        const dLng = cell.lng - newLng;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDistance) {
          minDistance = dist;
          closestCell = cell;
        }
      });
    }

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
    const targetCell = allCellsRef.current.find(c => c.id === selectedTileId);
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
        draggable: true 
      })
        .addTo(mapInstance)
        .bindTooltip(`<div class="bg-slate-950 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded border border-emerald-800">🏡 Selected Fan Location (Drag pin to adjust position)</div>`, {
          permanent: false,
          direction: 'top',
          opacity: 0.95
        });

      userMarker.on('dragend', handleMarkerDragEnd);
      userMarkerRef.current = userMarker;

      setToast({
        message: "Home Location Set! 🏠",
        description: `Marked Sector ${selectedTileId} as your local physical coordinates base. Drag the marker to fine-tune!`,
        type: "success"
      });
    }
  };

  // Update user's GPS coords marker, line connection, nearest tile selection, and toast indicators
  const handleUpdateGPSTrackedLocation = (latitude: number, longitude: number, accuracy: number | null, customLabel?: string, forceFly: boolean = true) => {
    setCurrentGPSCoords({ lat: latitude, lng: longitude, accuracy });
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

    const userMarker = (window as any).L.marker([latitude, longitude], { 
      icon: userIcon,
      draggable: true 
    })
      .addTo(mapInstance)
      .bindTooltip(`<div class="bg-slate-950 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded border border-emerald-800">🏡 ${customLabel || 'Fan Location'} (±${accuracy ? Math.round(accuracy) : '?'}m) (Drag to adjust)</div>`, {
        permanent: false,
        direction: 'top',
        opacity: 0.95
      });

    userMarker.on('dragend', handleMarkerDragEnd);
    userMarkerRef.current = userMarker;

    // Nearest tile grid matcher
    let closestCell: any = null;
    let minDistance = Infinity;

    if (allCellsRef.current && allCellsRef.current.length > 0) {
      allCellsRef.current.forEach((cell: any) => {
        const dLat = cell.lat - latitude;
        const dLng = cell.lng - longitude;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDistance) {
          minDistance = dist;
          closestCell = cell;
        }
      });
    }

    const isOutsideKerala = minDistance > 1.44; // Kerala boundary threshold

    if (isOutsideKerala) {
      if (closestCell && minDistance < 36.0) {
        if (forceFly) {
          const bounds = (window as any).L.latLngBounds([
            [latitude, longitude],
            [closestCell.lat, closestCell.lng]
          ]);
          mapInstance.fitBounds(bounds, { padding: [80, 80], animate: true });
        }

        // Draw laser tie connection line
        const connectionLine = (window as any).L.polyline([[latitude, longitude], [closestCell.lat, closestCell.lng]], {
          color: '#10b981',
          weight: 2,
          dashArray: '6, 10',
          opacity: 0.65
        }).addTo(mapInstance);

        overlayLayersRef.current.push(connectionLine);
      } else {
        if (forceFly) {
          if (closestCell) {
            mapInstance.flyTo([closestCell.lat, closestCell.lng], 13, { animate: true, duration: 1.5 });
          } else {
            mapInstance.flyTo([latitude, longitude], 15, { animate: true, duration: 1.5 });
          }
        }
      }

      if (closestCell) {
        const cellId = closestCell.id;
        const cellData = tiles[cellId] || { id: cellId, team: 'None', photo: '', chats: [] };
        triggerTileSelection(cellId, cellData);

        setToast({
          message: "Located successfully! ⚽🌍",
          description: `Exact GPS: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]. Connected to nearest Kerala sector ${cellId}!`,
          type: "success"
        });
      }
    } else {
      if (forceFly) {
        mapInstance.flyTo([latitude, longitude], 17, { animate: true, duration: 1.5 });
      }

      if (closestCell) {
        const cellId = closestCell.id;
        const cellData = tiles[cellId] || { id: cellId, team: 'None', photo: '', chats: [] };
        triggerTileSelection(cellId, cellData);

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

  // Success Mock Payment handler - processes simulated slot purchases!
  const executeSimulatedPayment = () => {
    // If it was a multi-selected checkout, immediately complete the batch simulated payment and close the modal!
    if (isMultiSelectCheckout && pendingTeam !== 'None') {
      executeBatchSimulatedPayment(pendingTeam);
      setShowPaymentModal(false);
      return;
    }

    const qty = slotPurchaseCount || 1;
    const price = qty * 50;

    // Credit purchased slots directly to their account
    const nextFreeSlots = freeSlots + qty;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    setToast({
      message: "Payment Successful! 💳✨",
      description: `Simulated transaction complete! Purchased +${qty} Claim Slot(s) for ₹${price}.00. Slots credited to your fan profile!`,
      type: "success"
    });

    // If it was a single checkout and we had a pending team, we can auto-apply 1 slot to claim right away!
    if (!isMultiSelectCheckout && pendingTeam !== 'None' && selectedTileId) {
      // Auto-claim the tile using 1 of the newly purchased slots
      const finalFreeSlots = (freeSlots + qty) - 1;
      setFreeSlots(finalFreeSlots);
      localStorage.setItem('kerala_claimed_free_slots_count', finalFreeSlots.toString());

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
        text: `Claimed tile for ${TEAM_STYLES[pendingTeam]?.flagEmoji || '🏳️'} ${pendingTeam} using a brand new Slot! 🚀 (Owner: @${ownerName})`,
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
        message: "Territory Secured! 🗺️🎁",
        description: `Sector ${selectedTileId} is now securely yours! Claim slot auto-applied.`,
        type: "success"
      });
    }

    setShowPaymentModal(false);
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
    const basePrice = N * 50;
    const bulkDiscountPct = N >= 5 ? 15 : (N >= 3 ? 10 : 0);
    const bulkDiscountVal = Math.round(basePrice * (bulkDiscountPct / 100));
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

      return copy;
    });

    setToast({
      message: "Batch Payment Successful! 💳✨",
      description: `Simulated checkout completed! Claimed ${N} sectors for ${targetTeam} for ₹${finalBatchPrice}.00.`,
      type: "success"
    });

    setTempTeam(targetTeam);
    setIsMultiSelectMode(false);
    setMultiSelectedTileIds([]);
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

    const nextPredictions = {
      ...predictions,
      [matchId]: { ...pred, status: 'claimed' as 'claimed' }
    };
    setPredictions(nextPredictions);
    localStorage.setItem('kerala_submitted_predictions_v3', JSON.stringify(nextPredictions));

    const nextFreeSlots = freeSlots + 1;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    setToast({
      message: "Slot Token Claimed! 🎁",
      description: "Successfully added +1 Free Claim Slot! Tap any grid tile to secure your territory.",
      type: "success"
    });
  };

  // Submit Login Credential Flow (Simulated Sandbox Auth)
  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim();
    let cleanUsername = loginUsername.trim();

    if (!cleanEmail) {
      setToast({
        message: "Login Failed! ⚠️",
        description: "Please specify your registered Fan Email address.",
        type: "error"
      });
      return;
    }

    if (!cleanUsername) {
      // Auto fallback if username empty
      const parts = cleanEmail.split('@');
      cleanUsername = parts[0] ? `${parts[0]}_fan` : 'SuperFan';
    }

    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      favoriteClub: loginFavClub
    };

    setLoggedInUser(newUser);
    localStorage.setItem('kerala_logged_in_user', JSON.stringify(newUser));
    setShowLoginModal(false);

    setToast({
      message: "Club Fan Authenticated! ⚽",
      description: `Welcome back, ${cleanUsername}! Your prediction slots are now fully synced.`,
      type: "success"
    });
  };

  // Submit Register Credential Flow
  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim();
    const cleanUsername = loginUsername.trim();

    if (!cleanEmail || !cleanUsername) {
      setToast({
        message: "Registration Failed! ⚠️",
        description: "Please provide a valid username and contact email address.",
        type: "error"
      });
      return;
    }

    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      favoriteClub: loginFavClub
    };

    setLoggedInUser(newUser);
    localStorage.setItem('kerala_logged_in_user', JSON.stringify(newUser));

    // Registration Rewards: 3 Free Slots!
    const nextFreeSlots = freeSlots + 3;
    setFreeSlots(nextFreeSlots);
    localStorage.setItem('kerala_claimed_free_slots_count', nextFreeSlots.toString());

    setShowLoginModal(false);
    setToast({
      message: "Registration Success! 🎉",
      description: `Welcome to Kerala Soccer Map! We credited +3 Claim Slots straight to your account.`,
      type: "success"
    });
  };

  // User Sign Out Handler
  const handleUserLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('kerala_logged_in_user');
    setToast({
      message: "Fan Logged Out! 👋",
      description: "You have returned to Guest mode. Your map actions are preserved.",
      type: "info"
    });
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
      description: "Instant access loaded with ₹500 balance and active slot tokens! Enjoy testing.",
      type: "success"
    });
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

  // Photo uploading callback converting to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const activeData = tiles[selectedTileId!];
    if (!file || !activeData) return;

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

  const { tallies, tallyMap, claimedCount } = getLeaderboardStats();

  return (
    <div className="relative w-full h-screen bg-[#0b0f19] text-white font-sans overflow-hidden select-none">
      
      {/* Dynamic Popup Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto"
          >
            <div className="bg-slate-950/95 border-2 border-emerald-500/40 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3.5">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                <Paintbrush className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold font-mono uppercase tracking-wide text-emerald-300">
                  {toast.message}
                </p>
                {toast.description && (
                  <p className="text-[10px] text-slate-300 leading-normal mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg shrink-0 cursor-pointer"
                id="close-toast-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className={`pointer-events-auto bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col transition-all duration-300 ${isHeaderCollapsed ? 'p-3 md:p-3.5 gap-0' : 'p-4 md:p-5 gap-3'}`}>
          
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
                Kerala Football Map
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

            {/* Account Status Badge */}
            {loggedInUser ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 pl-2 pr-1 py-1 rounded-xl shrink-0 animate-fade-in"
              >
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-200 leading-none truncate max-w-[80px]" title={loggedInUser.username}>
                    {loggedInUser.username}
                  </div>
                  <div className="text-[8px] text-teal-400 font-mono leading-none mt-0.5 font-bold uppercase">
                    {freeSlots} Slots
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserLogout();
                  }}
                  className="p-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                  title="Sign Out of Fan Club"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRegisterMode(false);
                  setShowLoginModal(true);
                }}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-[10px] text-amber-400 hover:text-amber-300 font-extrabold rounded-xl border border-slate-850 cursor-pointer flex items-center gap-1 transition-all uppercase font-mono tracking-wide"
                title="Log In to activate fan slots"
              >
                <User className="w-3 h-3 text-amber-400 shrink-0" /> Login
              </button>
            )}
          </div>

          {!isHeaderCollapsed && (
            <>
              {/* Unified Free Slots Panel if Logged In */}
              {loggedInUser && (
                <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-mono uppercase text-slate-350 animate-fade-in mt-3">
                  <span className="flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
                    <span>My Claim Slots:</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-teal-300 bg-teal-950/45 border border-teal-500/20 px-2 leading-none py-1 rounded-lg">
                    {freeSlots} Available
                  </span>
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
                <button 
                  onClick={() => setShowOnboarding(true)}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 underline underline-offset-2"
                >
                  <Info className="w-3 h-3" /> Info Guide
                </button>
              </div>
            </>
          )}

        </div>


      </div>



      {/* 4. Bottom Global Feed Scrolling Ticker & Page Footer */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none md:max-w-xl md:left-1/2 md:-translate-x-1/2 flex flex-col gap-2.5">
        
        {/* Search Row */}
        <form onSubmit={handleSearch} className="pointer-events-auto w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Kochi, Stadium, or K000085..."
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 backdrop-blur-md transition-all font-mono"
            />
          </div>
          <button 
            type="submit"
            className="p-2.5 bg-slate-950/90 border border-slate-800 hover:border-emerald-500 hover:text-emerald-300 text-slate-300 rounded-xl transition-colors backdrop-blur-md shadow-lg cursor-pointer flex items-center justify-center shrink-0"
            title="Search sector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleLocateUser}
            className="p-2.5 bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/20 text-emerald-400 rounded-xl transition-all backdrop-blur-md shadow-lg cursor-pointer flex items-center justify-center shrink-0"
            title="Locate nearest sector using physical GPS coordinates"
          >
            <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
          </button>
          <button 
            type="button"
            onClick={() => {
              const nextMode = !isMultiSelectMode;
              setIsMultiSelectMode(nextMode);
              if (nextMode) {
                setSelectedTileId(null);
                setToast({
                  message: "Brush Selector Active! 🎨",
                  description: "Touch/click and drag over grid squares on the map to paint multiple tiles together!",
                  type: "success"
                });
              } else {
                setMultiSelectedTileIds([]);
              }
            }}
            className={`p-2.5 bg-slate-950/90 border rounded-xl transition-all backdrop-blur-md shadow-lg cursor-pointer flex items-center justify-center shrink-0 ${
              isMultiSelectMode 
                ? 'border-yellow-500/75 text-yellow-400 bg-yellow-950/20 animate-pulse' 
                : 'border-slate-800 hover:border-yellow-500/40 text-slate-300 hover:text-yellow-400'
            }`}
            title="Toggle Brush Multi-Select Mode"
          >
            <Paintbrush className="w-4 h-4 shrink-0" />
          </button>
        </form>

        <div className="pointer-events-auto bg-slate-950/85 border border-slate-800/80 rounded-2xl py-2.5 px-4 shadow-xl backdrop-blur-md flex items-center gap-3 overflow-hidden h-11">
          <div className="flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px] uppercase font-bold text-emerald-300">
            <Flame className="w-3 h-3 text-orange-400 animate-pulse" /> Live Talk
          </div>

          <div className="flex-1 overflow-hidden relative">
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

        {/* Brand & Policy Interactive Footer Card */}
        <div className="pointer-events-auto w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-lg flex flex-col gap-2.5 text-left animate-fade-in transition-all duration-300">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-extrabold flex items-center gap-1.5">
              🏆 Kerala Fan Map <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 lowercase tracking-normal font-mono font-normal block">sandbox info</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Grassroots Pledge Initiative</span>
          </div>
          <div className="text-[9px] text-slate-650 font-mono pt-2 border-t border-slate-900/40">
            © 2026 Kerala Football Map, LLC. All pledges, claims, transactions, and live maps are 100% simulated sandbox mockups. Soccer is Kerala's true religion.
          </div>
        </div>
      </div>



       {/* 5. Custom Right-Side / Mobile Bottom Panel for Tile Management */}
       <AnimatePresence>
        {selectedTileId && (
          <motion.div
            initial={isMobile ? { y: '100%', x: 0, opacity: 1 } : { x: 280, y: 0, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%', x: 0, opacity: 1 } : { x: 280, y: 0, opacity: 0 }}
            transition={isMobile ? { type: 'tween', duration: 0.3 } : { type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed md:absolute bottom-0 md:bottom-[5.5rem] left-0 md:left-auto right-0 md:right-4 top-auto md:top-[8.5rem] z-30 md:z-20 w-full md:w-[340px] max-w-full md:max-w-[340px] max-h-[82vh] md:max-h-none bg-slate-950/95 border-t md:border border-slate-800 rounded-t-[2.5rem] md:rounded-3xl p-5 pb-8 md:pb-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden"
          >
            {/* Mobile grabber handle */}
            {isMobile && (
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-4 shrink-0" />
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
                  <button 
                    onClick={() => setSelectedTileId(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                        <span className="flex items-center gap-1">🖌️ Brush Selector Enabled</span>
                        <span className="bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full text-[9px]">
                          {multiSelectedTileIds.length} Selected
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-mono leading-tight">
                        Tap other grids or drag-brush over cells on the map to add them to your selection!
                      </p>
                      {multiSelectedTileIds.length > 0 && (
                        <div className="text-[10px] font-mono text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-850/50 leading-normal flex flex-col gap-0.5 mt-0.5">
                          <div className="flex justify-between">
                            <span>Sectors Highlighted:</span>
                            <span className="text-white font-bold">{multiSelectedTileIds.length} Tiles</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="text-emerald-400 font-bold">
                              ₹{(() => {
                                const count = multiSelectedTileIds.length;
                                const base = count * 50;
                                const dPct = count >= 5 ? 15 : (count >= 3 ? 10 : 0);
                                return (base - Math.round(base * (dPct / 100))).toFixed(2);
                              })()}
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
                        setMultiSelectTargetTeam(tempTeam !== 'None' ? tempTeam : 'Argentina');
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
                    <div className="bg-slate-950/90 border border-teal-500/30 rounded-2xl p-4 text-center flex flex-col items-center gap-2.5 animate-fade-in my-2">
                      <Lock className="w-8 h-8 text-teal-400 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">🔒 Reserved Fan Territory</h4>
                        <p className="text-[10px] font-mono text-teal-400 uppercase mt-0.5 tracking-wider font-extrabold select-all">
                          Owned by: @{activeData?.claimedBy || 'Guest'}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        This sector belongs to another active fan alliance. You can use <strong className="text-teal-400 font-extrabold">1 Claim Slot</strong> to forcefully reclaim and convert this territory to your own!
                      </p>
                      <button
                        onClick={() => handleReclaimTerritory(selectedTileId!)}
                        className="w-full py-2.5 bg-gradient-to-tr from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-[10px] uppercase tracking-wider font-sans cursor-pointer shadow-lg transition-all"
                      >
                        ⚔️ Reclaim Territory (Uses 1 Slot)
                      </button>
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
                          {tempTeam !== 'None' && (
                            <button
                              onClick={() => {
                                handleTeamClaimRequest('None');
                              }}
                              className="w-full py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-900 text-red-300 rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer mt-1"
                            >
                              🏳️ Relinquish Stake / Set Unclaimed
                            </button>
                          )}
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

                          // cost calculations:
                          const basePrice = activeCount * 50;
                          const discountPct = activeCount >= 5 ? 15 : (activeCount >= 3 ? 10 : 0);
                          const discountVal = Math.round(basePrice * (discountPct / 100));
                          const finalPrice = basePrice - discountVal;

                          const alreadyClaimedUnderThisTeam = !isMulti && activeData?.team === tempTeam && activeData?.claimedBy === (loggedInUser ? loggedInUser.username : 'Guest');

                          if (alreadyClaimedUnderThisTeam) {
                            return (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 text-center mt-1">
                                <span className="text-[11px] font-bold text-emerald-400 block font-sans">✓ Fan District Active Owner</span>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Your updates to hyperlinking maps and photos are completely live now!</p>
                              </div>
                            );
                          }

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
                              <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-400 mt-0.5">
                                <div className="flex justify-between">
                                  <span>{isMulti ? `${activeCount}× District Sectors:` : '1× District Sector:'}</span>
                                  <span className="text-slate-300">₹{basePrice.toFixed(2)}</span>
                                </div>
                                {discountVal > 0 && (
                                  <div className="flex justify-between text-emerald-400">
                                    <span>Bulk Discount ({discountPct}% Off):</span>
                                    <span>-₹{discountVal.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Sponsorship Tax & Ingress:</span>
                                  <span className="text-slate-300">₹0.00</span>
                                </div>
                                <div className="flex justify-between font-bold text-amber-400 border-t border-dashed border-slate-800 pt-1 mt-1 text-[10px]">
                                  <span>Total Amount:</span>
                                  <span>₹{finalPrice.toFixed(2)}</span>
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
                                  💳 Pay ₹{finalPrice.toFixed(2)}
                                </button>
                              </div>

                              <p className="text-[8px] text-slate-500 font-mono text-center">
                                Simulated secure checkout sandboxed via Kerala Fan District.
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
                  Compete against rival club blocks, showcase your Kerala local tournament trivia knowledge, and support your nation's pride in our sandbox games room.
                </p>
              </div>
              <button
                onClick={() => setActivePage('map')}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0 select-none"
              >
                ← Back to Map
              </button>
            </div>

            {/* Main Arena Columns: Left (Leaderboards), Right (Games) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: LEADERBOARDS & CLUBS STATS (5 Cohort Slots) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* 1. Club territory stats card */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-400" /> Club Territories Tally
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{claimedCount} Mapped Pledges</span>
                  </div>

                  <div className="flex flex-col gap-3.5">
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

                  {/* Cheering simulator button */}
                  <div className="mt-5 pt-4 border-t border-slate-900 flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">🪄 Crowd Noise Cheering Simulator</span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Select your active support team and cast a free passion cheer to boost stadium sound:
                    </p>
                    
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {WORLD_CUP_TEAMS.map(team => {
                        const style = TEAM_STYLES[team];
                        return (
                          <button
                            key={team}
                            onClick={() => {
                              setTempTeam(team);
                              setToast({
                                message: `Cheer Casted! ${style.flagEmoji}`,
                                description: `You generated a massive acoustic boost for ${team} fans in the arena.`,
                                type: "success"
                              });
                            }}
                            className={`px-2 py-1 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/50 border rounded-lg text-[9px] font-mono text-slate-200 transition-all text-center select-none cursor-pointer ${
                              tempTeam === team ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20 font-bold' : 'border-slate-800'
                            }`}
                          >
                            {style.flagEmoji} {team.slice(0, 5)}...
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. District Standings Information */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 shadow-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-3">
                    ⚽ Top Shouting Districts
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono leading-normal mb-3">
                    Calculated by regional activity logs from fans in local Kerala boundaries.
                  </p>

                  <div className="flex flex-col gap-2 font-mono text-xs text-slate-300">
                    <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-xl border border-slate-905 hover:bg-slate-900/50 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">❶</span> Malappuram (Malabar Core)
                      </span>
                      <span className="text-emerald-400 font-bold font-mono text-[11px]">88.5K claims</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-xl border border-slate-905 hover:bg-slate-900/50 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">❷</span> Kozhikode (EMS Hub)
                      </span>
                      <span className="text-emerald-400 font-bold font-mono text-[11px]">74.1K claims</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-xl border border-slate-905 hover:bg-slate-900/50 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="text-stone-500 font-bold">❸</span> Ernakulam (Kochi JN)
                      </span>
                      <span className="text-emerald-400 font-bold font-mono text-[11px]">59.2K claims</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-xl border border-slate-905 hover:bg-slate-900/50 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold">❹</span> Thrissur (Round Battle)
                      </span>
                      <span className="text-emerald-505 text-emerald-400/80 font-mono text-[11px]">41.3K claims</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* RIGHT COLUMN: INTERACTIVE MINI-GAMES (7 Cohort Slots) */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* GAME 1: KERALA PENALTY HERO SPOT KICK CHAMPIONSHIP */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative faint background element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Game header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-905 pb-4 mb-4 gap-2.5">
                    <div>
                      <span className="text-[9px] bg-amber-550/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-extrabold">INTERACTIVE GAME 1</span>
                      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-1">
                        ⚽ Kerala Penalty Hero
                      </h2>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Kicking representing <strong className="text-amber-400">{tempTeam === 'None' ? 'Any Free Club' : tempTeam} fans</strong>!
                      </p>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-3.5 font-mono text-xs">
                      <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">Goals</span>
                        <strong className="text-sm font-extrabold text-emerald-400">{penaltyScore}</strong>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-center">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">Kicks</span>
                        <strong className="text-sm font-extrabold text-slate-300">{penaltyAttempts}</strong>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-center">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">Streak</span>
                        <strong className="text-sm font-extrabold text-amber-400">{penaltyStreak}🔥</strong>
                      </div>
                    </div>
                  </div>

                  {/* VIRTUAL GOALPOST PORTAL SIMULATOR */}
                  <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 flex flex-col items-center gap-4 relative">
                    
                    {/* Crossbar & Goal Post outline */}
                    <div className="w-full max-w-[340px] border-t-8 border-x-8 border-slate-100 rounded-t-xl h-[120px] relative bg-slate-950/80 flex flex-col justify-end p-2 border-dashed overflow-hidden">
                      {/* Grid background net */}
                      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                      
                      {/* Keeper simulated position */}
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-14 w-12 flex flex-col items-center justify-end transition-all duration-700 ${
                        penaltyStatus === 'kick' ? 'animate-bounce' : ''
                      } ${
                        penaltyStatus === 'saved' ? 'translate-y-[-20px] scale-110 rotate-12 text-amber-400' : ''
                      } ${
                        penaltyStatus === 'goal' ? 'translate-x-[-80px] rotate-[-45deg] scale-90 opacity-60 text-red-155 text-red-400' : ''
                      }`}>
                        <span className="text-[9px] bg-slate-905 text-white font-mono px-1 py-0.5 rounded leading-none border border-slate-800 shrink-0 font-bold mb-1 block">Rival GK</span>
                        <span className="text-3xl select-none">🧤🏃</span>
                      </div>

                      {/* Goal corner target hot buttons */}
                      <div className="absolute inset-x-2 top-2 bottom-1 grid grid-cols-3 grid-rows-2 gap-3 z-10">
                        {/* Top Left */}
                        <button
                          onClick={() => handleSelectPenaltyDirection('top_left')}
                          className={`flex items-center justify-center rounded-lg text-[10px] font-mono border hover:border-emerald-400 transition-all cursor-pointer ${
                            penaltyDirection === 'top_left' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          ↖️ Top Left
                        </button>
                        {/* Empty spacing for center top */}
                        <div className="flex items-center justify-center text-[10px] font-mono text-slate-700 select-none">
                          🥅 Net
                        </div>
                        {/* Top Right */}
                        <button
                          onClick={() => handleSelectPenaltyDirection('top_right')}
                          className={`flex items-center justify-center rounded-lg text-[10px] font-mono border hover:border-emerald-400 transition-all cursor-pointer ${
                            penaltyDirection === 'top_right' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          ↗️ Top Right
                        </button>
                        {/* Bottom Left */}
                        <button
                          onClick={() => handleSelectPenaltyDirection('left')}
                          className={`flex items-center justify-center rounded-lg text-[10px] font-mono border hover:border-emerald-400 transition-all cursor-pointer ${
                            penaltyDirection === 'left' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          ⬅️ Low Left
                        </button>
                        {/* Low Center */}
                        <button
                          onClick={() => handleSelectPenaltyDirection('center')}
                          className={`flex items-center justify-center rounded-lg text-[10px] font-mono border hover:border-emerald-400 transition-all cursor-pointer ${
                            penaltyDirection === 'center' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          ⬆️ Low Center
                        </button>
                        {/* Bottom Right */}
                        <button
                          onClick={() => handleSelectPenaltyDirection('right')}
                          className={`flex items-center justify-center rounded-lg text-[10px] font-mono border hover:border-emerald-400 transition-all cursor-pointer ${
                            penaltyDirection === 'right' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          ➡️ Low Right
                        </button>
                      </div>
                    </div>

                    {/* Kicking controls & Power Select */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
                      
                      {/* Shot Power */}
                      <div className="flex flex-col gap-1.5 w-full md:w-auto">
                        <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">🎯 Shot Power</span>
                        <div className="flex gap-1.5">
                          {['low', 'medium', 'high'].map(pow => (
                            <button
                              key={pow}
                              onClick={() => handleSelectPenaltyPower(pow as any)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer capitalize ${
                                penaltyPower === pow || (pow === 'medium' && !penaltyPower)
                                  ? 'bg-amber-500 text-slate-950 border-amber-350 font-bold'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {pow === 'low' ? '🎯 Placed' : pow === 'medium' ? '⚡ Normal' : '💥 Blast'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shoot button trigger */}
                      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                        {penaltyStatus !== 'idle' && (
                          <button
                            onClick={handleResetPenaltySession}
                            className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-450 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none"
                            title="Reset Spots Kicker Setup"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          onClick={triggerTakePenalty}
                          disabled={penaltyStatus === 'kick'}
                          className={`px-6 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 cursor-pointer select-none ${
                            penaltyStatus === 'kick'
                              ? 'bg-slate-800 text-slate-500 border border-slate-700 pointer-events-none'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border border-emerald-300 font-extrabold shadow-emerald-500/25'
                          }`}
                        >
                          {penaltyStatus === 'kick' ? (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-650 border-t-slate-300 animate-spin" />
                              <span>Charging...</span>
                            </>
                          ) : (
                            <span>🎯 SHOOT PENALTY!</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Commentator Audio Commentary feed block */}
                  <div className="mt-4 bg-slate-900/40 border border-slate-905 rounded-2xl p-4 flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">📢 Local Commentator</span>
                      <p className="text-xs font-mono text-slate-200 leading-relaxed mt-1 scrollbar-none break-words">
                        "{penaltyCommentary}"
                      </p>
                    </div>
                  </div>
                </div>


                {/* GAME 2: MALABAR FOOTBALL TRIVIA CUP */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative faint background element */}
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Trivia Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-905 pb-4 mb-4 gap-2.5">
                    <div>
                      <span className="text-[9px] bg-teal-550/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-extrabold">INTERACTIVE GAME 2</span>
                      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-1">
                        🏆 Malabar Trivia Cup
                      </h2>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Verify your grassroots knowledge to boost community prestige!
                      </p>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-3.5 font-mono text-xs shrink-0 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                      <span className="text-[9px] text-slate-550 block uppercase font-bold tracking-tight">Quiz Score:</span>
                      <strong className="text-sm font-extrabold text-teal-400">{triviaScore} / {TRIVIA_QUESTIONS.length}</strong>
                    </div>
                  </div>

                  {/* State logic of trivia */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Trivia question text */}
                    <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold leading-none">
                          QUESTION {triviaIndex + 1} OF {TRIVIA_QUESTIONS.length}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Grassroots Quiz</span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-100 leading-relaxed font-sans">
                        {TRIVIA_QUESTIONS[triviaIndex].question}
                      </h3>
                    </div>

                    {/* Multi choice grid option list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TRIVIA_QUESTIONS[triviaIndex].options.map((option, idx) => {
                        const isCorrectAnswer = idx === TRIVIA_QUESTIONS[triviaIndex].answerIndex;
                        const isSelectedBySelf = idx === triviaSelectedOption;

                        let styleProps = 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 hover:border-slate-750 text-slate-200';
                        
                        if (triviaHasAnswered) {
                          if (isCorrectAnswer) {
                            styleProps = 'bg-emerald-950/35 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isSelectedBySelf) {
                            styleProps = 'bg-red-950/20 border-red-500/60 text-red-300';
                          } else {
                            styleProps = 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-50';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectTriviaOption(idx)}
                            disabled={triviaHasAnswered}
                            className={`w-full p-4 text-left text-xs font-mono border rounded-xl transition-all flex items-center justify-between cursor-pointer ${styleProps}`}
                          >
                            <span>{option}</span>
                            {triviaHasAnswered && isCorrectAnswer && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {triviaHasAnswered && !isCorrectAnswer && isSelectedBySelf && <X className="w-4 h-4 text-red-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation board */}
                    {triviaHasAnswered && (
                      <div className="bg-slate-900/70 border border-slate-850/80 p-4 rounded-xl flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-slate-300 leading-relaxed">
                            {triviaFeedback}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action button row to next question or restart */}
                    <div className="flex justify-end gap-3.5 pt-2 border-t border-slate-905 mt-2">
                      <button
                        onClick={handleResetTriviaCup}
                        className="px-4 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer select-none"
                      >
                        Restart Quiz
                      </button>

                      {triviaHasAnswered && triviaIndex < TRIVIA_QUESTIONS.length - 1 && (
                        <button
                          onClick={handleNextTriviaQuestion}
                          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-mono font-extrabold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none shadow-md shadow-emerald-500/10"
                        >
                          Next Question →
                        </button>
                      )}

                      {triviaHasAnswered && triviaIndex === TRIVIA_QUESTIONS.length - 1 && (
                        <div className="flex flex-col items-end gap-2 text-right">
                          <p className="text-[10px] text-amber-400 font-mono uppercase font-bold animate-pulse leading-none">
                            🏆 Challenge Finished!
                          </p>
                          <button
                            onClick={() => {
                              try {
                                const clipMsg = `I just scored ${triviaScore}/${TRIVIA_QUESTIONS.length} on the Kerala Football Smart Trivia Cup! Can you beat my record score? Join the territory war here: ${window.location.origin}`;
                                navigator.clipboard.writeText(clipMsg).then(() => {
                                  setToast({
                                    message: "Record Copied! 🏆",
                                    description: "Deep link shared copy success. Post with friends!",
                                    type: "success"
                                  });
                                });
                              } catch (e) {
                                setToast({
                                  message: "Copy Unreleased",
                                  description: "Failed to load clipboard API.",
                                  type: "warning"
                                });
                              }
                            }}
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-extrabold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none shadow-md shadow-amber-500/10"
                          >
                            Share Record Draft 📢
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      )}

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
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start Claiming Grid!
                </button>

                <p className="text-[10px] text-slate-600 font-mono mt-3">
                  Pledges are 100% simulated for testing. Sandbox session persistence is stored in local storage.
                </p>
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
                
                {isMultiSelectCheckout ? (
                  <p className="text-xs text-slate-300 leading-normal max-w-xs mx-auto mb-5">
                    Confirm securing all <strong>{slotPurchaseCount} District Sectors</strong> for <strong>{TEAM_STYLES[pendingTeam]?.flagEmoji} {pendingTeam}</strong> in our sandbox canvas.
                  </p>
                ) : (
                  <p className="text-xs text-slate-350 leading-normal max-w-xs mx-auto mb-5">
                    Confirm securing this sector for <strong>{TEAM_STYLES[pendingTeam]?.flagEmoji} {pendingTeam}</strong>. Requires <strong>1 Claim Slot</strong> or a simulated transaction below.
                  </p>
                )}

                {/* Mock Card Form Details */}
                <div className="text-left bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 mb-5 select-none font-mono">
                  <div className="flex items-center gap-1.5 border-b border-slate-905 pb-2">
                    <CreditCard className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider">INTENT MOCK GATEWAY</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 leading-normal">
                    {isMultiSelectCheckout ? (
                      <>
                        <div className="flex justify-between mb-1">
                          <span>Purchase Sectors:</span> <span className="text-amber-400 font-bold">{slotPurchaseCount} District Sectors</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Base Cost:</span> <span className="text-slate-400">₹{(slotPurchaseCount * 50).toFixed(2)}</span>
                        </div>
                        {slotPurchaseCount >= 3 && (
                          <div className="flex justify-between mb-1 text-emerald-400">
                            <span>Bulk Discount ({slotPurchaseCount >= 5 ? 15 : 10}% Off):</span>
                            <span>-₹{(() => {
                              const baseM = slotPurchaseCount * 50;
                              const dPct = slotPurchaseCount >= 5 ? 15 : 10;
                              return Math.round(baseM * (dPct / 100)).toFixed(2);
                            })()}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-900 pt-1.5 font-bold text-emerald-400 mt-1">
                          <span>Total Simulated Bill:</span> <span>₹{(() => {
                            const baseM = slotPurchaseCount * 50;
                            const dPct = slotPurchaseCount >= 5 ? 15 : (slotPurchaseCount >= 3 ? 10 : 0);
                            return (baseM - Math.round(baseM * (dPct / 100))).toFixed(2);
                          })()}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between mb-1">
                          <span>Sector Target:</span> <span className="text-slate-200">Index {selectedTileId}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Selected Support:</span> <span className={`${TEAM_STYLES[pendingTeam]?.textColor || 'text-slate-200'} font-bold`}>{pendingTeam}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Quantity Required:</span> <span className="text-slate-200">1 Claim Slot Token</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-900 pt-1.5 font-bold text-emerald-400 mt-1">
                          <span>Cost (or apply 1 Token):</span> <span>₹50.00</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Redeem Option for Single Checkout */}
                {!isMultiSelectCheckout && freeSlots > 0 && (
                  <div className="mb-4 bg-amber-500/5 border border-amber-500/25 p-2 rounded-2xl animate-fade-in">
                    <button
                      onClick={executeFreeSlotPayment}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-[11px] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <span>🎁 Apply 1 Slot Token</span>
                      <span className="bg-slate-950 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono font-mono">
                        {freeSlots} Available
                      </span>
                    </button>
                    <div className="text-[9px] text-slate-500 font-mono mt-1">
                      — OR buy 1 slot below for simulated ₹50.00 —
                    </div>
                  </div>
                )}

                {/* Redeem Option for Multi-Select Checkout */}
                {isMultiSelectCheckout && freeSlots >= slotPurchaseCount && (
                  <div className="mb-4 bg-emerald-500/5 border border-emerald-500/25 p-2 rounded-2xl animate-fade-in">
                    <button
                      onClick={() => {
                        executeBatchFreeSlotPayment(pendingTeam);
                        setShowPaymentModal(false);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-550 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-[11px] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <span>🎁 Apply {slotPurchaseCount} Slot Tokens</span>
                      <span className="bg-slate-950 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                        {freeSlots} Available
                      </span>
                    </button>
                    <div className="text-[9px] text-slate-500 font-mono mt-1">
                      — OR pay simulated ₹{(() => {
                        const baseM = slotPurchaseCount * 50;
                        const dPct = slotPurchaseCount >= 5 ? 15 : (slotPurchaseCount >= 3 ? 10 : 0);
                        return (baseM - Math.round(baseM * (dPct / 100))).toFixed(2);
                      })()} below —
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider font-mono text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeSimulatedPayment}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[10px]"
                  >
                    <Check className="w-4 h-4" /> 
                    {isMultiSelectCheckout ? `Pay ₹${(() => {
                      const baseM = slotPurchaseCount * 50;
                      const dPct = slotPurchaseCount >= 5 ? 15 : (slotPurchaseCount >= 3 ? 10 : 0);
                      return (baseM - Math.round(baseM * (dPct / 100))).toFixed(2);
                    })()}` : `Pay ₹50.00`}
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
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowPredictionModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-850 pb-4 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-center shrink-0 animate-bounce">
                  <Gamepad2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 italic font-sans flex items-center gap-1.5 leading-none">
                    Daily Prediction Arena
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-semibold">
                    Earn free slots every single day
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Tap on any team below to place your match verdict. Our system referee simulates instant regional alignment predictions! Correct predictions unlock a <strong>🎁 Free Claim Slot</strong> directly for you to claim!
                </p>

                <div className="bg-slate-950/65 rounded-xl p-3 border border-slate-850 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-teal-400 animate-pulse" />
                    <span className="text-xs text-slate-350 font-sans font-medium">Your Free Claim Spots:</span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-teal-300 bg-teal-950/40 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                    {freeSlots} Slots Saved
                  </span>
                </div>

                <h4 className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold mb-2.5">Today's Hot Fixtures</h4>
                
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
                       <div key={match.id} className="bg-slate-950/40 border border-slate-850 rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-200">{match.title}</span>
                          <span className="text-[9px] text-slate-500 font-mono font-semibold uppercase">{match.time}</span>
                        </div>

                        {isVerifying ? (
                          <div className="flex flex-col items-center justify-center py-4 bg-slate-950/80 rounded-xl border border-slate-900 gap-2">
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider font-bold animate-pulse">Referee simulating outcome...</span>
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
                                  disabled={!!chosenVal}
                                  onClick={() => handleConfirmPrediction(match.id, opt.val)}
                                  className={`py-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 leading-tight ${
                                    isSelected 
                                      ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/5' 
                                      : chosenVal 
                                        ? 'bg-slate-950/10 border-slate-905 text-slate-600 cursor-not-allowed'
                                        : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                  {isSelected && (
                                    <span className="text-[8px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-extrabold uppercase mt-0.5 animate-pulse">
                                      Predicted
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {chosenObj && statusVal === 'won' && (
                          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-2.5 flex flex-col gap-2 animate-fade-in">
                            <div className="text-[10px] text-emerald-400 font-mono font-bold text-center">
                              🎯 Correct Prediction! The Referee simulation has declared you the champion.
                            </div>
                            <button
                              onClick={() => handleClaimPredictionReward(match.id)}
                              className="w-full py-1.5 bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-lg text-[10px] font-sans uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
                            >
                              🎁 Claim Free Slot Token!
                            </button>
                          </div>
                        )}

                        {chosenObj && statusVal === 'lost' && (
                          <div className="bg-red-950/15 border border-red-500/20 rounded-xl p-2 text-[10px] text-red-400 font-mono text-center">
                            ❌ Simulation Result: Predication missed this match. Stay tuned for fresh regional fixtures!
                          </div>
                        )}

                        {chosenObj && statusVal === 'claimed' && (
                          <div className="bg-teal-950/20 border border-teal-500/20 rounded-xl p-2 text-[10px] text-teal-400 font-mono text-center flex items-center justify-center gap-1.5 shadow-inner">
                            <span>✅ Verified Reward Claimed! <strong>+1 Free Slot</strong> added to your fan account.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => setShowPredictionModal(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
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
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-y-auto max-h-[92vh] scrollbar-none"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3 border border-amber-500/20 shadow-md">
                  <User className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white leading-none">
                  {isRegisterMode ? 'Register Fan Account' : 'Club Fan Authentication'}
                </h3>
                <p className="text-[10px] text-emerald-450 mt-1 font-mono tracking-wider uppercase text-emerald-400 block">
                  {isRegisterMode ? 'Sign up to get +3 FREE Slots!' : 'Save free slots, favorite team & custom badges'}
                </p>
              </div>

              {/* Demo Quick Button */}
              <button
                type="button"
                onClick={handleInstantDemoLogin}
                className="w-full py-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-[10.5px] transition-colors shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mb-5 uppercase tracking-wide font-mono"
              >
                <Sparkles className="w-4 h-4" /> Instant Demo Fan Login (Quick Test)
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[9.5px] uppercase font-mono text-slate-500 tracking-wider">or sign in manually</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <form onSubmit={isRegisterMode ? handleUserRegisterSubmit : handleUserLoginSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Fan Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. keralasuperfan@gmail.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    {isRegisterMode ? 'Create Nickname' : 'Nickname / Username (Optional)'}
                  </label>
                  <input
                    type="text"
                    required={isRegisterMode}
                    placeholder="e.g. YellowArmyLegend"
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Simulated PIN / Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Loyal National Club</label>
                  <select
                    value={loginFavClub}
                    onChange={e => setLoginFavClub(e.target.value as TeamChoice)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
                  >
                    <option value="Argentina">🇦🇷 Argentina Fan Alliance</option>
                    <option value="Brazil">🇧🇷 Brazil Samba FC</option>
                    <option value="Portugal">🇵🇹 Portugal Fan Block</option>
                    <option value="France">🇫🇷 France Blues Block</option>
                    <option value="Germany">🇩🇪 Germany Eagle Alliance</option>
                    <option value="Spain">🇪🇸 Spain La Furia Team</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider font-mono transition-all mt-1 cursor-pointer"
                >
                  {isRegisterMode ? 'Create Account & Claim +3 Slots' : 'Log In & Sync Fan Account'}
                </button>
              </form>

              <div className="text-center mt-5 pt-3.5 border-t border-slate-850 text-[10px]">
                {isRegisterMode ? (
                  <p className="text-slate-450 font-mono">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-450 font-mono">
                    New to the football religion?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Register & Get 3 Free Slots!
                    </button>
                  </p>
                )}
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
                <p className="text-xs text-slate-300 leading-relaxed font-mono mt-4 break-words bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
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

    </div>
  );
}
