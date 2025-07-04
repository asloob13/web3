import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  Election,
  Voter,
  Vote,
  AuthSession,
  SystemStatus,
  UIState,
  VotingStep,
  SupportedLanguage,
  Theme,
  AccessibilitySettings,
  FontSize,
  OfflineVote,
  Candidate,
  LiveResults,
  ElectionResult,
  VotingMethod,
  SyncStatus,
} from '@/types';

// Auth Store
interface AuthState {
  session: AuthSession | null;
  voter: Voter | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (aadhaarNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateVoterPreferences: (preferences: Partial<Voter['preferences']>) => void;
  clearError: () => void;
}

// Election Store
interface ElectionState {
  currentElection: Election | null;
  availableElections: Election[];
  selectedCandidate: Candidate | null;
  liveResults: LiveResults | null;
  isLoadingElections: boolean;
  isLoadingResults: boolean;
}

interface ElectionActions {
  fetchElections: () => Promise<void>;
  selectElection: (electionId: string) => void;
  selectCandidate: (candidateId: string) => void;
  clearSelection: () => void;
  fetchLiveResults: (electionId: string) => Promise<void>;
}

// Voting Store
interface VotingState {
  votes: Vote[];
  offlineVotes: OfflineVote[];
  currentStep: VotingStep;
  isSubmitting: boolean;
  submitError: string | null;
  voteConfirmation: string | null;
}

interface VotingActions {
  castVote: (electionId: string, candidateId: string, method: VotingMethod) => Promise<void>;
  submitOfflineVote: (vote: Vote) => void;
  syncOfflineVotes: () => Promise<void>;
  setCurrentStep: (step: VotingStep) => void;
  clearVotingState: () => void;
  retryFailedVote: (voteId: string) => Promise<void>;
}

// System Store
interface SystemState {
  status: SystemStatus;
  isOfflineMode: boolean;
  pendingSyncCount: number;
  lastSyncTime: Date | null;
}

interface SystemActions {
  updateSystemStatus: (status: Partial<SystemStatus>) => void;
  toggleOfflineMode: () => void;
  checkConnectivity: () => Promise<boolean>;
  syncData: () => Promise<void>;
}

// UI Store
interface UIState {
  theme: Theme;
  language: SupportedLanguage;
  accessibility: AccessibilitySettings;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  currentStep: VotingStep;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: SupportedLanguage) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setCurrentStep: (step: VotingStep) => void;
  clearMessages: () => void;
}

// Combined Store Type
type VotingStore = AuthState &
  AuthActions &
  ElectionState &
  ElectionActions &
  VotingState &
  VotingActions &
  SystemState &
  SystemActions &
  UIState &
  UIActions;

// Store Implementation
export const useVotingStore = create<VotingStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Auth State
          session: null,
          voter: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,

          // Auth Actions
          login: async (aadhaarNumber: string, otp: string) => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              // Mock authentication - replace with actual API call
              const mockSession: AuthSession = {
                sessionId: `session_${Date.now()}`,
                voterId: `voter_${aadhaarNumber.slice(-4)}`,
                aadhaarVerified: true,
                biometricVerified: false,
                otpVerified: true,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                permissions: ['vote', 'view_results'],
              };

              const mockVoter: Voter = {
                id: mockSession.voterId,
                aadhaarHash: `hash_${aadhaarNumber.slice(-4)}`,
                voterIdNumber: `VOTER${aadhaarNumber.slice(-4)}`,
                name: 'Mock Voter',
                age: 25,
                gender: 'male',
                constituency: 'CONSTITUENCY_001',
                pollingStation: 'PS_001',
                isVerified: true,
                hasVoted: false,
                votingHistory: [],
                preferences: {
                  language: SupportedLanguage.ENGLISH,
                  fontSize: FontSize.MEDIUM,
                  highContrast: false,
                  screenReader: false,
                  voiceAssistance: false,
                  reducedMotion: false,
                },
                accessibility: {
                  visualImpairment: false,
                  hearingImpairment: false,
                  mobilityImpairment: false,
                  cognitiveImpairment: false,
                  requiredAssistance: [],
                },
              };

              set((state) => {
                state.session = mockSession;
                state.voter = mockVoter;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.language = mockVoter.preferences.language;
                state.accessibility = {
                  ...state.accessibility,
                  fontSize: mockVoter.preferences.fontSize,
                  highContrast: mockVoter.preferences.highContrast,
                  screenReader: mockVoter.preferences.screenReader,
                  reducedMotion: mockVoter.preferences.reducedMotion,
                };
              });
            } catch (error) {
              set((state) => {
                state.error = 'Authentication failed. Please try again.';
                state.isLoading = false;
              });
            }
          },

          logout: () => {
            set((state) => {
              state.session = null;
              state.voter = null;
              state.isAuthenticated = false;
              state.currentStep = VotingStep.LANGUAGE_SELECT;
              state.selectedCandidate = null;
              state.voteConfirmation = null;
            });
          },

          refreshSession: async () => {
            const { session } = get();
            if (!session) return;

            try {
              // Mock session refresh
              set((state) => {
                if (state.session) {
                  state.session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                }
              });
            } catch (error) {
              console.error('Session refresh failed:', error);
            }
          },

          updateVoterPreferences: (preferences) => {
            set((state) => {
              if (state.voter) {
                state.voter.preferences = { ...state.voter.preferences, ...preferences };
              }
            });
          },

          clearError: () => {
            set((state) => {
              state.error = null;
            });
          },

          // Election State
          currentElection: null,
          availableElections: [],
          selectedCandidate: null,
          liveResults: null,
          isLoadingElections: false,
          isLoadingResults: false,

          // Election Actions
          fetchElections: async () => {
            set((state) => {
              state.isLoadingElections = true;
            });

            try {
              // Mock elections data
              const mockElections: Election[] = [
                {
                  id: 'election_001',
                  name: 'Parliamentary Election 2024',
                  description: 'General Election for Lok Sabha',
                  type: 'parliamentary',
                  startDate: new Date('2024-04-15'),
                  endDate: new Date('2024-04-20'),
                  status: 'ongoing',
                  constituency: {
                    id: 'const_001',
                    name: 'Mumbai South',
                    code: 'MS001',
                    type: 'general',
                    state: 'MH',
                    district: 'Mumbai',
                    totalVoters: 1200000,
                    pollingStations: [],
                    boundaries: { north: 19.1, south: 18.9, east: 72.9, west: 72.8 },
                  },
                  candidates: [
                    {
                      id: 'candidate_001',
                      name: 'Rahul Sharma',
                      party: {
                        id: 'party_001',
                        name: 'Indian National Congress',
                        abbreviation: 'INC',
                        symbol: 'Hand',
                        type: 'national',
                        founded: new Date('1885-12-28'),
                        headquarters: 'New Delhi',
                      },
                      symbol: 'Hand',
                      symbolImage: '/symbols/hand.png',
                      age: 45,
                      education: 'MBA',
                      criminalCases: 0,
                      assets: 5000000,
                      photoUrl: '/candidates/rahul_sharma.jpg',
                    },
                    {
                      id: 'candidate_002',
                      name: 'Priya Patel',
                      party: {
                        id: 'party_002',
                        name: 'Bharatiya Janata Party',
                        abbreviation: 'BJP',
                        symbol: 'Lotus',
                        type: 'national',
                        founded: new Date('1980-04-06'),
                        headquarters: 'New Delhi',
                      },
                      symbol: 'Lotus',
                      symbolImage: '/symbols/lotus.png',
                      age: 42,
                      education: 'MA Political Science',
                      criminalCases: 0,
                      assets: 3000000,
                      photoUrl: '/candidates/priya_patel.jpg',
                    },
                    {
                      id: 'nota',
                      name: 'None of the Above',
                      party: {
                        id: 'nota',
                        name: 'NOTA',
                        abbreviation: 'NOTA',
                        symbol: 'NOTA',
                        type: 'independent',
                        founded: new Date('2013-09-27'),
                        headquarters: 'India',
                      },
                      symbol: 'NOTA',
                      symbolImage: '/symbols/nota.png',
                      age: 0,
                      education: '',
                      photoUrl: '/symbols/nota.png',
                      isNOTA: true,
                    },
                  ],
                  metadata: {
                    createdBy: 'eci_admin',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-04-15'),
                    version: '1.0.0',
                    isVerified: true,
                  },
                },
              ];

              set((state) => {
                state.availableElections = mockElections;
                state.isLoadingElections = false;
              });
            } catch (error) {
              set((state) => {
                state.isLoadingElections = false;
                state.error = 'Failed to fetch elections';
              });
            }
          },

          selectElection: (electionId) => {
            const { availableElections } = get();
            const election = availableElections.find((e) => e.id === electionId);
            set((state) => {
              state.currentElection = election || null;
              state.selectedCandidate = null;
            });
          },

          selectCandidate: (candidateId) => {
            const { currentElection } = get();
            if (!currentElection) return;

            const candidate = currentElection.candidates.find((c) => c.id === candidateId);
            set((state) => {
              state.selectedCandidate = candidate || null;
            });
          },

          clearSelection: () => {
            set((state) => {
              state.selectedCandidate = null;
            });
          },

          fetchLiveResults: async (electionId) => {
            set((state) => {
              state.isLoadingResults = true;
            });

            try {
              // Mock live results
              const mockResults: LiveResults = {
                electionId,
                totalVotesCast: 850000,
                totalVotersRegistered: 1200000,
                turnoutPercentage: 70.83,
                results: [
                  {
                    candidateId: 'candidate_002',
                    candidate: get().currentElection?.candidates.find((c) => c.id === 'candidate_002')!,
                    voteCount: 425000,
                    percentage: 50.0,
                    rank: 1,
                    isWinner: true,
                  },
                  {
                    candidateId: 'candidate_001',
                    candidate: get().currentElection?.candidates.find((c) => c.id === 'candidate_001')!,
                    voteCount: 400000,
                    percentage: 47.06,
                    rank: 2,
                    isWinner: false,
                  },
                  {
                    candidateId: 'nota',
                    candidate: get().currentElection?.candidates.find((c) => c.id === 'nota')!,
                    voteCount: 25000,
                    percentage: 2.94,
                    rank: 3,
                    isWinner: false,
                  },
                ],
                lastUpdated: new Date(),
                isOfficial: false,
              };

              set((state) => {
                state.liveResults = mockResults;
                state.isLoadingResults = false;
              });
            } catch (error) {
              set((state) => {
                state.isLoadingResults = false;
                state.error = 'Failed to fetch results';
              });
            }
          },

          // Voting State
          votes: [],
          offlineVotes: [],
          currentStep: VotingStep.LANGUAGE_SELECT,
          isSubmitting: false,
          submitError: null,
          voteConfirmation: null,

          // Voting Actions
          castVote: async (electionId, candidateId, method = VotingMethod.ONLINE) => {
            set((state) => {
              state.isSubmitting = true;
              state.submitError = null;
            });

            try {
              const { voter, status } = get();
              if (!voter) throw new Error('Voter not authenticated');

              const vote: Vote = {
                id: `vote_${Date.now()}`,
                electionId,
                candidateId,
                timestamp: new Date(),
                method,
                encryptedVote: `encrypted_${candidateId}_${Date.now()}`,
                nullifierHash: `nullifier_${voter.id}_${electionId}`,
                zkProof: {
                  proof: 'mock_proof',
                  publicSignals: ['signal1', 'signal2'],
                  verificationKey: 'mock_verification_key',
                },
                isOffline: !status.isOnline,
                syncStatus: status.isOnline ? SyncStatus.SYNCED : SyncStatus.PENDING,
              };

              if (status.isOnline) {
                // Simulate blockchain submission
                await new Promise((resolve) => setTimeout(resolve, 2000));
                vote.blockchainTxHash = `0x${Math.random().toString(16).substr(2, 8)}`;
                
                set((state) => {
                  state.votes.push(vote);
                  state.voteConfirmation = vote.id;
                  state.isSubmitting = false;
                  if (state.voter) {
                    state.voter.hasVoted = true;
                  }
                });
              } else {
                // Queue for offline sync
                const offlineVote: OfflineVote = {
                  vote,
                  queuedAt: new Date(),
                  retryCount: 0,
                };

                set((state) => {
                  state.offlineVotes.push(offlineVote);
                  state.voteConfirmation = vote.id;
                  state.isSubmitting = false;
                  state.pendingSyncCount = state.offlineVotes.length;
                  if (state.voter) {
                    state.voter.hasVoted = true;
                  }
                });
              }
            } catch (error) {
              set((state) => {
                state.submitError = error instanceof Error ? error.message : 'Vote submission failed';
                state.isSubmitting = false;
              });
            }
          },

          submitOfflineVote: (vote) => {
            const offlineVote: OfflineVote = {
              vote,
              queuedAt: new Date(),
              retryCount: 0,
            };

            set((state) => {
              state.offlineVotes.push(offlineVote);
              state.pendingSyncCount = state.offlineVotes.length;
            });
          },

          syncOfflineVotes: async () => {
            const { offlineVotes, status } = get();
            if (!status.isOnline || offlineVotes.length === 0) return;

            try {
              const successfullysynced: string[] = [];

              for (const offlineVote of offlineVotes) {
                try {
                  // Simulate blockchain submission
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  
                  offlineVote.vote.blockchainTxHash = `0x${Math.random().toString(16).substr(2, 8)}`;
                  offlineVote.vote.syncStatus = SyncStatus.SYNCED;
                  
                  successfullysynced.push(offlineVote.vote.id);
                } catch (error) {
                  offlineVote.retryCount += 1;
                  offlineVote.lastError = error instanceof Error ? error.message : 'Sync failed';
                  offlineVote.vote.syncStatus = SyncStatus.FAILED;
                }
              }

              set((state) => {
                // Move successfully synced votes to main votes array
                const syncedVotes = state.offlineVotes
                  .filter((ov) => successfullysynced.includes(ov.vote.id))
                  .map((ov) => ov.vote);
                
                state.votes.push(...syncedVotes);
                
                // Remove synced votes from offline queue
                state.offlineVotes = state.offlineVotes.filter(
                  (ov) => !successfullysynced.includes(ov.vote.id)
                );
                
                state.pendingSyncCount = state.offlineVotes.length;
                state.lastSyncTime = new Date();
              });
            } catch (error) {
              console.error('Offline vote sync failed:', error);
            }
          },

          setCurrentStep: (step) => {
            set((state) => {
              state.currentStep = step;
            });
          },

          clearVotingState: () => {
            set((state) => {
              state.selectedCandidate = null;
              state.voteConfirmation = null;
              state.submitError = null;
              state.currentStep = VotingStep.LANGUAGE_SELECT;
            });
          },

          retryFailedVote: async (voteId) => {
            const { offlineVotes } = get();
            const offlineVote = offlineVotes.find((ov) => ov.vote.id === voteId);
            if (!offlineVote) return;

            try {
              set((state) => {
                const vote = state.offlineVotes.find((ov) => ov.vote.id === voteId);
                if (vote) {
                  vote.vote.syncStatus = SyncStatus.SYNCING;
                }
              });

              // Simulate retry
              await new Promise((resolve) => setTimeout(resolve, 2000));
              
              offlineVote.vote.blockchainTxHash = `0x${Math.random().toString(16).substr(2, 8)}`;
              offlineVote.vote.syncStatus = SyncStatus.SYNCED;

              set((state) => {
                const index = state.offlineVotes.findIndex((ov) => ov.vote.id === voteId);
                if (index !== -1) {
                  const [syncedVote] = state.offlineVotes.splice(index, 1);
                  state.votes.push(syncedVote.vote);
                  state.pendingSyncCount = state.offlineVotes.length;
                }
              });
            } catch (error) {
              set((state) => {
                const vote = state.offlineVotes.find((ov) => ov.vote.id === voteId);
                if (vote) {
                  vote.retryCount += 1;
                  vote.lastError = error instanceof Error ? error.message : 'Retry failed';
                  vote.vote.syncStatus = SyncStatus.FAILED;
                }
              });
            }
          },

          // System State
          status: {
            isOnline: navigator.onLine,
            blockchainConnected: true,
            lastSyncTime: new Date(),
            pendingOfflineVotes: 0,
            systemHealth: 'healthy',
            networkType: 'wifi',
            batteryLevel: 100,
          },
          isOfflineMode: false,
          pendingSyncCount: 0,
          lastSyncTime: null,

          // System Actions
          updateSystemStatus: (newStatus) => {
            set((state) => {
              state.status = { ...state.status, ...newStatus };
            });
          },

          toggleOfflineMode: () => {
            set((state) => {
              state.isOfflineMode = !state.isOfflineMode;
            });
          },

          checkConnectivity: async () => {
            try {
              const response = await fetch('/api/health', { method: 'HEAD' });
              const isOnline = response.ok;
              
              set((state) => {
                state.status.isOnline = isOnline;
              });
              
              return isOnline;
            } catch {
              set((state) => {
                state.status.isOnline = false;
              });
              return false;
            }
          },

          syncData: async () => {
            const { syncOfflineVotes } = get();
            await syncOfflineVotes();
          },

          // UI State
          theme: Theme.SYSTEM,
          language: SupportedLanguage.ENGLISH,
          accessibility: {
            fontSize: FontSize.MEDIUM,
            highContrast: false,
            screenReader: false,
            voiceNavigation: false,
            gestureNavigation: false,
            reducedMotion: false,
            colorBlindSupport: false,
          },
          // isLoading: false, // Removed duplicate
          // error: null, // Removed duplicate
          success: null,
          // currentStep: VotingStep.LANGUAGE_SELECT, // Removed duplicate

          // UI Actions
          setTheme: (theme) => {
            set((state) => {
              state.theme = theme;
            });
          },

          setLanguage: (language) => {
            set((state) => {
              state.language = language;
            });
          },

          updateAccessibility: (settings) => {
            set((state) => {
              state.accessibility = { ...state.accessibility, ...settings };
            });
          },

          setLoading: (loading) => {
            set((state) => {
              state.isLoading = loading;
            });
          },

          setError: (error) => {
            set((state) => {
              state.error = error;
            });
          },

          setSuccess: (success) => {
            set((state) => {
              state.success = success;
            });
          },

          // setCurrentStep: (step) => { // Removed duplicate
          //   set((state) => {
          //     state.currentStep = step;
          //   });
          // },

          clearMessages: () => {
            set((state) => {
              state.error = null;
              state.success = null;
            });
          },
        }))
      ),
      {
        name: 'voting-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          accessibility: state.accessibility,
          voter: state.voter,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
          votes: state.votes,
          offlineVotes: state.offlineVotes,
        }),
      }
    ),
    {
      name: 'voting-store',
    }
  )
);

// Selectors for optimized subscriptions
export const useAuth = () => useVotingStore((state) => ({
  session: state.session,
  voter: state.voter,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
  login: state.login,
  logout: state.logout,
  refreshSession: state.refreshSession,
  updateVoterPreferences: state.updateVoterPreferences,
  clearError: state.clearError,
}));

export const useElections = () => useVotingStore((state) => ({
  currentElection: state.currentElection,
  availableElections: state.availableElections,
  selectedCandidate: state.selectedCandidate,
  liveResults: state.liveResults,
  isLoadingElections: state.isLoadingElections,
  isLoadingResults: state.isLoadingResults,
  fetchElections: state.fetchElections,
  selectElection: state.selectElection,
  selectCandidate: state.selectCandidate,
  clearSelection: state.clearSelection,
  fetchLiveResults: state.fetchLiveResults,
}));

export const useVoting = () => useVotingStore((state) => ({
  votes: state.votes,
  offlineVotes: state.offlineVotes,
  isSubmitting: state.isSubmitting,
  submitError: state.submitError,
  voteConfirmation: state.voteConfirmation,
  castVote: state.castVote,
  submitOfflineVote: state.submitOfflineVote,
  syncOfflineVotes: state.syncOfflineVotes,
  clearVotingState: state.clearVotingState,
  retryFailedVote: state.retryFailedVote,
}));

export const useSystem = () => useVotingStore((state) => ({
  status: state.status,
  isOfflineMode: state.isOfflineMode,
  pendingSyncCount: state.pendingSyncCount,
  lastSyncTime: state.lastSyncTime,
  updateSystemStatus: state.updateSystemStatus,
  toggleOfflineMode: state.toggleOfflineMode,
  checkConnectivity: state.checkConnectivity,
  syncData: state.syncData,
}));

export const useUI = () => useVotingStore((state) => ({
  theme: state.theme,
  language: state.language,
  accessibility: state.accessibility,
  currentStep: state.currentStep,
  isLoading: state.isLoading,
  error: state.error,
  success: state.success,
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
  updateAccessibility: state.updateAccessibility,
  setCurrentStep: state.setCurrentStep,
  setLoading: state.setLoading,
  setError: state.setError,
  setSuccess: state.setSuccess,
  clearMessages: state.clearMessages,
}));