export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface TileData {
  id: string;
  team: string; // "None", "Argentina", "Brazil", "France", "Portugal", "Germany", "Spain", etc.
  photo: string; // Base64 raw image string or empty
  chats: ChatMessage[];
  lastClaimedAt?: string;
  
  // Custom design and merge parameters
  mergedWith?: string[]; // IDs of tiles in this merged group if this is the master tile
  isMergedChild?: boolean; // flag if this is a child within a merged territory
  mergedParentId?: string; // pointer to the parent tile
  customText?: string; // custom overlay text
  textBackgroundStyle?: 'none' | 'team_color'; // country colour background to text
  imageBorderStyle?: 'none' | 'team_color'; // country colour border to image
  hyperlink?: string; // hyperlink associated with this tile
  claimedBy?: string; // username of user who claimed this tile
}

export type TeamChoice = 
  | 'Canada'
  | 'Mexico'
  | 'United States'
  | 'Australia'
  | 'Iraq'
  | 'Iran'
  | 'Japan'
  | 'Jordan'
  | 'South Korea'
  | 'Qatar'
  | 'Saudi Arabia'
  | 'Uzbekistan'
  | 'Algeria'
  | 'Cabo Verde'
  | 'DR Congo'
  | "Côte d'Ivoire"
  | 'Egypt'
  | 'Ghana'
  | 'Morocco'
  | 'Senegal'
  | 'South Africa'
  | 'Tunisia'
  | 'Curaçao'
  | 'Haiti'
  | 'Panama'
  | 'Argentina'
  | 'Brazil'
  | 'Colombia'
  | 'Ecuador'
  | 'Paraguay'
  | 'Uruguay'
  | 'New Zealand'
  | 'Austria'
  | 'Belgium'
  | 'Bosnia and Herzegovina'
  | 'Croatia'
  | 'Czechia'
  | 'England'
  | 'France'
  | 'Germany'
  | 'Netherlands'
  | 'Norway'
  | 'Portugal'
  | 'Scotland'
  | 'Spain'
  | 'Sweden'
  | 'Switzerland'
  | 'Türkiye'
  | 'None';

export interface TeamStyle {
  name: string;
  color: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  flagEmoji: string;
}

export interface UserReferralData {
  referredCount: number;
  pendingFractionalTiles: number; // float representing progress (e.g. 0.1 per referral)
}
