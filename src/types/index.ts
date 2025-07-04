// Core Election Types
export interface Election {
  id: string;
  name: string;
  description: string;
  type: ElectionType;
  startDate: Date;
  endDate: Date;
  status: ElectionStatus;
  constituency: Constituency;
  candidates: Candidate[];
  totalVotes?: number;
  results?: ElectionResult[];
  metadata: ElectionMetadata;
}

export enum ElectionType {
  PARLIAMENTARY = 'parliamentary',
  STATE_ASSEMBLY = 'state_assembly',
  LOCAL_MUNICIPAL = 'local_municipal',
  PANCHAYAT = 'panchayat',
  REFERENDUM = 'referendum'
}

export enum ElectionStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

export interface ElectionMetadata {
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  blockchainTxHash?: string;
  isVerified: boolean;
}

// Constituency and Location Types
export interface Constituency {
  id: string;
  name: string;
  code: string;
  type: ConstituencyType;
  state: IndianState;
  district: string;
  totalVoters: number;
  pollingStations: PollingStation[];
  boundaries: GeographicBounds;
}

export enum ConstituencyType {
  GENERAL = 'general',
  SC = 'sc', // Scheduled Caste
  ST = 'st'  // Scheduled Tribe
}

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  capacity: number;
  accessibility: AccessibilityFeatures;
  hasOfflineCapability: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeographicBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  brailleSupport: boolean;
  audioSupport: boolean;
  signLanguageSupport: boolean;
  largeTextSupport: boolean;
}

// Candidate Types
export interface Candidate {
  id: string;
  name: string;
  party: PoliticalParty;
  symbol: string;
  symbolImage: string;
  age: number;
  education: string;
  criminalCases?: number;
  assets?: number;
  manifesto?: string;
  photoUrl: string;
  isNOTA?: boolean;
}

export interface PoliticalParty {
  id: string;
  name: string;
  abbreviation: string;
  symbol: string;
  type: PartyType;
  registrationNumber?: string;
  founded: Date;
  headquarters: string;
}

export enum PartyType {
  NATIONAL = 'national',
  STATE = 'state',
  REGIONAL = 'regional',
  INDEPENDENT = 'independent'
}

// Voter Types
export interface Voter {
  id: string;
  aadhaarHash: string; // Hashed Aadhaar for privacy
  voterIdNumber: string;
  name: string;
  age: number;
  gender: Gender;
  constituency: string;
  pollingStation: string;
  isVerified: boolean;
  hasVoted: boolean;
  votingHistory: VotingHistoryEntry[];
  preferences: VoterPreferences;
  accessibility: AccessibilityNeeds;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface VotingHistoryEntry {
  electionId: string;
  timestamp: Date;
  method: VotingMethod;
  successful: boolean;
}

export enum VotingMethod {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SMS = 'sms',
  VOICE = 'voice',
  KIOSK = 'kiosk'
}

export interface VoterPreferences {
  language: SupportedLanguage;
  fontSize: FontSize;
  highContrast: boolean;
  screenReader: boolean;
  voiceAssistance: boolean;
  reducedMotion: boolean;
}

export interface AccessibilityNeeds {
  visualImpairment: boolean;
  hearingImpairment: boolean;
  mobilityImpairment: boolean;
  cognitiveImpairment: boolean;
  requiredAssistance: string[];
}

// Vote Types
export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  timestamp: Date;
  method: VotingMethod;
  encryptedVote: string;
  nullifierHash: string;
  zkProof: ZKProof;
  blockchainTxHash?: string;
  isOffline: boolean;
  syncStatus: SyncStatus;
}

export interface ZKProof {
  proof: string;
  publicSignals: string[];
  verificationKey: string;
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCING = 'syncing',
  SYNCED = 'synced',
  FAILED = 'failed'
}

export interface OfflineVote {
  vote: Vote;
  queuedAt: Date;
  retryCount: number;
  lastError?: string;
}

// Authentication Types
export interface AuthSession {
  sessionId: string;
  voterId: string;
  aadhaarVerified: boolean;
  biometricVerified: boolean;
  otpVerified: boolean;
  expiresAt: Date;
  permissions: Permission[];
}

export enum Permission {
  VOTE = 'vote',
  VIEW_RESULTS = 'view_results',
  ADMIN = 'admin',
  AUDIT = 'audit'
}

export interface AadhaarAuth {
  aadhaarNumber: string; // Last 4 digits only
  otp: string;
  biometricData?: BiometricData;
  timestamp: Date;
}

export interface BiometricData {
  fingerprint?: string;
  iris?: string;
  face?: string;
  type: BiometricType;
}

export enum BiometricType {
  FINGERPRINT = 'fingerprint',
  IRIS = 'iris',
  FACE = 'face'
}

// Results Types
export interface ElectionResult {
  candidateId: string;
  candidate: Candidate;
  voteCount: number;
  percentage: number;
  rank: number;
  isWinner: boolean;
}

export interface LiveResults {
  electionId: string;
  totalVotesCast: number;
  totalVotersRegistered: number;
  turnoutPercentage: number;
  results: ElectionResult[];
  lastUpdated: Date;
  isOfficial: boolean;
}

// System Types
export interface SystemStatus {
  isOnline: boolean;
  blockchainConnected: boolean;
  lastSyncTime: Date;
  pendingOfflineVotes: number;
  systemHealth: HealthStatus;
  networkType: NetworkType;
  batteryLevel?: number;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  OFFLINE = 'offline'
}

export enum NetworkType {
  WIFI = 'wifi',
  CELLULAR_4G = 'cellular_4g',
  CELLULAR_3G = 'cellular_3g',
  CELLULAR_2G = 'cellular_2g',
  OFFLINE = 'offline'
}

// UI State Types
export interface UIState {
  currentStep: VotingStep;
  isLoading: boolean;
  error?: string;
  success?: string;
  theme: Theme;
  language: SupportedLanguage;
  accessibility: AccessibilitySettings;
}

export enum VotingStep {
  LANGUAGE_SELECT = 'language_select',
  AUTHENTICATION = 'authentication',
  VOTER_VERIFICATION = 'voter_verification',
  BALLOT_VIEW = 'ballot_view',
  VOTE_SELECTION = 'vote_selection',
  VOTE_CONFIRMATION = 'vote_confirmation',
  VOTE_SUBMISSION = 'vote_submission',
  CONFIRMATION = 'confirmation'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  HIGH_CONTRAST = 'high_contrast',
  SYSTEM = 'system'
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  screenReader: boolean;
  voiceNavigation: boolean;
  gestureNavigation: boolean;
  reducedMotion: boolean;
  colorBlindSupport: boolean;
}

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large'
}

// Language and Localization Types
export enum SupportedLanguage {
  ENGLISH = 'en',
  HINDI = 'hi',
  BENGALI = 'bn',
  TELUGU = 'te',
  TAMIL = 'ta',
  GUJARATI = 'gu',
  URDU = 'ur',
  KANNADA = 'kn',
  MALAYALAM = 'ml',
  ORIYA = 'or',
  PUNJABI = 'pa',
  ASSAMESE = 'as',
  MARATHI = 'mr',
  SANSKRIT = 'sa',
  NEPALI = 'ne',
  KASHMIRI = 'ks',
  SINDHI = 'sd',
  TIBETAN = 'bo',
  MANIPURI = 'mni',
  KONKANI = 'gom',
  MAITHILI = 'mai',
  BODO = 'brx'
}

export interface LocalizedContent {
  [key: string]: {
    [SupportedLanguage.ENGLISH]: string;
    [SupportedLanguage.HINDI]: string;
    [SupportedLanguage.BENGALI]: string;
    [SupportedLanguage.TELUGU]: string;
    [SupportedLanguage.TAMIL]: string;
    // ... other languages
    [key: string]: string;
  };
}

// Indian States Enum
export enum IndianState {
  ANDHRA_PRADESH = 'AP',
  ARUNACHAL_PRADESH = 'AR',
  ASSAM = 'AS',
  BIHAR = 'BR',
  CHHATTISGARH = 'CG',
  GOA = 'GA',
  GUJARAT = 'GJ',
  HARYANA = 'HR',
  HIMACHAL_PRADESH = 'HP',
  JHARKHAND = 'JH',
  KARNATAKA = 'KA',
  KERALA = 'KL',
  MADHYA_PRADESH = 'MP',
  MAHARASHTRA = 'MH',
  MANIPUR = 'MN',
  MEGHALAYA = 'ML',
  MIZORAM = 'MZ',
  NAGALAND = 'NL',
  ODISHA = 'OR',
  PUNJAB = 'PB',
  RAJASTHAN = 'RJ',
  SIKKIM = 'SK',
  TAMIL_NADU = 'TN',
  TELANGANA = 'TS',
  TRIPURA = 'TR',
  UTTAR_PRADESH = 'UP',
  UTTARAKHAND = 'UK',
  WEST_BENGAL = 'WB',
  // Union Territories
  ANDAMAN_NICOBAR = 'AN',
  CHANDIGARH = 'CH',
  DADRA_NAGAR_HAVELI_DAMAN_DIU = 'DH',
  LAKSHADWEEP = 'LD',
  DELHI = 'DL',
  PUDUCHERRY = 'PY',
  LADAKH = 'LA',
  JAMMU_KASHMIR = 'JK'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Configuration Types
export interface AppConfig {
  blockchain: BlockchainConfig;
  api: ApiConfig;
  features: FeatureFlags;
  security: SecurityConfig;
  analytics: AnalyticsConfig;
}

export interface BlockchainConfig {
  networkId: string;
  contractAddress: string;
  rpcUrl: string;
  explorerUrl: string;
  gasPrice: string;
  confirmations: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface FeatureFlags {
  offlineVoting: boolean;
  voiceInterface: boolean;
  biometricAuth: boolean;
  smsVoting: boolean;
  realTimeResults: boolean;
  analytics: boolean;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxRetryAttempts: number;
  encryptionAlgorithm: string;
  hashAlgorithm: string;
  requireBiometric: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackingId: string;
  anonymizeIp: boolean;
  trackOfflineEvents: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  autoComplete?: string;
  maxLength?: number;
}

// Error Types
export class VotingSystemError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'VotingSystemError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export enum ErrorCode {
  AUTHENTICATION_FAILED = 'AUTH_FAILED',
  VOTER_NOT_FOUND = 'VOTER_NOT_FOUND',
  ELECTION_NOT_FOUND = 'ELECTION_NOT_FOUND',
  VOTING_CLOSED = 'VOTING_CLOSED',
  ALREADY_VOTED = 'ALREADY_VOTED',
  INVALID_VOTE = 'INVALID_VOTE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  BLOCKCHAIN_ERROR = 'BLOCKCHAIN_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE'
}