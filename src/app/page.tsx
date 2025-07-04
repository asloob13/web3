'use client';

import React, { useEffect } from 'react';
import { Wifi, WifiOff, Battery, Signal, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import LanguageSelector from '@/components/voting/language-selector';
import AadhaarAuth from '@/components/voting/aadhaar-auth';
import BallotView from '@/components/voting/ballot-view';
import VoteConfirmation from '@/components/voting/vote-confirmation';
import Results from '@/components/voting/results';
import SystemStatus from '@/components/system/system-status';
import { useVotingStore, useAuth, useElections, useVoting, useSystem, useUI } from '@/store/voting-store';
import { VotingStep, SupportedLanguage } from '@/types';
import { cn } from '@/utils/cn';

export default function VotingApp() {
  const { 
    isAuthenticated, 
    login, 
    voter 
  } = useAuth();
  
  const {
    currentElection,
    fetchElections,
    selectElection
  } = useElections();
  
  const {
    voteConfirmation,
    clearVotingState
  } = useVoting();
  
  const {
    status,
    checkConnectivity,
    syncData
  } = useSystem();
  
  const {
    currentStep,
    setCurrentStep,
    language,
    setLanguage,
    accessibility,
    updateAccessibility,
    error,
    success,
    clearMessages
  } = useUI();

  // Initialize app
  useEffect(() => {
    checkConnectivity();
    if (isAuthenticated) {
      fetchElections();
    }
  }, [isAuthenticated, checkConnectivity, fetchElections]);

  // Auto-sync when coming online
  useEffect(() => {
    if (status.isOnline) {
      syncData();
    }
  }, [status.isOnline, syncData]);

  const handleLanguageSelect = (selectedLanguage: SupportedLanguage) => {
    setLanguage(selectedLanguage);
    setCurrentStep(VotingStep.AUTHENTICATION);
  };

  const handleAuthSuccess = async (authData: { aadhaarNumber: string; otp: string }) => {
    try {
      await login(authData.aadhaarNumber, authData.otp);
      setCurrentStep(VotingStep.BALLOT_VIEW);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleVoteComplete = () => {
    setCurrentStep(VotingStep.CONFIRMATION);
  };

  const handleViewResults = () => {
    setCurrentStep(VotingStep.CONFIRMATION);
  };

  const handleStartNewVoting = () => {
    clearVotingState();
    setCurrentStep(VotingStep.LANGUAGE_SELECT);
  };

  const handleBackToAuth = () => {
    setCurrentStep(VotingStep.AUTHENTICATION);
  };

  const handleBackToLanguage = () => {
    setCurrentStep(VotingStep.LANGUAGE_SELECT);
  };

  const getStepProgress = () => {
    const steps = [
      VotingStep.LANGUAGE_SELECT,
      VotingStep.AUTHENTICATION,
      VotingStep.BALLOT_VIEW,
      VotingStep.CONFIRMATION
    ];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50">
      {/* Header with System Status */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-3 bg-saffron-500 rounded-sm"></div>
                <div className="w-4 h-3 bg-white border border-gray-300 rounded-sm"></div>
                <div className="w-4 h-3 bg-green-500 rounded-sm"></div>
              </div>
              <h1 className="text-lg font-bold text-gray-900">
                भारत मतदान / India Voting
              </h1>
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-4">
              {/* Connectivity Status */}
              <div className="flex items-center space-x-1">
                {status.isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-600">
                  {status.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Battery Status (if available) */}
              {status.batteryLevel && (
                <div className="flex items-center space-x-1">
                  <Battery className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {status.batteryLevel}%
                  </span>
                </div>
              )}

              {/* Settings */}
              <button 
                className="p-1 text-gray-400 hover:text-gray-600"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-saffron-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Global Messages */}
      {(error || success) && (
        <div className="container mx-auto px-4 pt-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
              <button
                onClick={clearMessages}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
          
          {success && (
            <div className="flex items-center space-x-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
              <button
                onClick={clearMessages}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Skip Link for Accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <div id="main-content" className="space-y-8">
            {/* Language Selection Step */}
            {currentStep === VotingStep.LANGUAGE_SELECT && (
              <div className="animate-fade-in">
                <LanguageSelector
                  selectedLanguage={language}
                  onLanguageChange={handleLanguageSelect}
                  onNext={() => setCurrentStep(VotingStep.AUTHENTICATION)}
                />
              </div>
            )}

            {/* Authentication Step */}
            {currentStep === VotingStep.AUTHENTICATION && (
              <div className="animate-fade-in">
                <AadhaarAuth
                  onSuccess={handleAuthSuccess}
                  onBack={handleBackToLanguage}
                />
              </div>
            )}

            {/* Ballot View Step */}
            {currentStep === VotingStep.BALLOT_VIEW && isAuthenticated && currentElection && (
              <div className="animate-fade-in">
                <BallotView
                  election={currentElection}
                  onVoteComplete={handleVoteComplete}
                  onBack={handleBackToAuth}
                />
              </div>
            )}

            {/* Vote Confirmation Step */}
            {currentStep === VotingStep.CONFIRMATION && voteConfirmation && (
              <div className="animate-fade-in">
                <VoteConfirmation
                  voteId={voteConfirmation}
                  onViewResults={handleViewResults}
                  onStartNew={handleStartNewVoting}
                />
              </div>
            )}

            {/* Results View (if viewing results) */}
            {currentStep === VotingStep.CONFIRMATION && currentElection && !voteConfirmation && (
              <div className="animate-fade-in">
                <Results
                  election={currentElection}
                  onStartNew={handleStartNewVoting}
                />
              </div>
            )}

            {/* Loading States */}
            {currentStep === VotingStep.BALLOT_VIEW && !currentElection && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600">Loading election data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Election Commission Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Election Commission of India
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Secure • Transparent • Verifiable
              </p>
              <p className="text-xs text-gray-500">
                Powered by Web3 Technology
              </p>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Help & Support
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Helpline: 1950</li>
                <li>Email: support@eci.gov.in</li>
                <li>Website: www.eci.gov.in</li>
              </ul>
            </div>

            {/* Technical Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                System Status
              </h3>
              <SystemStatus />
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-4 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Election Commission of India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Accessibility Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="accessibility-announcements"
      >
        {/* Screen reader announcements will be dynamically inserted here */}
      </div>

      {/* High Contrast Mode */}
      {accessibility.highContrast && (
        <style jsx global>{`
          * {
            filter: contrast(150%) brightness(110%);
          }
        `}</style>
      )}

      {/* Reduced Motion */}
      {accessibility.reducedMotion && (
        <style jsx global>{`
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `}</style>
      )}
    </div>
  );
}

// Additional placeholder components that would need to be implemented
function BallotView({ election, onVoteComplete, onBack }: any) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold mb-4">Ballot View</h2>
      <p className="text-gray-600 mb-6">Election: {election.name}</p>
      <div className="space-x-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button onClick={onVoteComplete} className="px-4 py-2 bg-saffron-500 text-white rounded">Cast Vote</button>
      </div>
    </div>
  );
}

function VoteConfirmation({ voteId, onViewResults, onStartNew }: any) {
  return (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-4">Vote Confirmed!</h2>
      <p className="text-gray-600 mb-6">Vote ID: {voteId}</p>
      <div className="space-x-4">
        <button onClick={onViewResults} className="px-4 py-2 bg-blue-500 text-white rounded">View Results</button>
        <button onClick={onStartNew} className="px-4 py-2 bg-gray-200 rounded">Start New</button>
      </div>
    </div>
  );
}

function Results({ election, onStartNew }: any) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold mb-4">Election Results</h2>
      <p className="text-gray-600 mb-6">Results for: {election.name}</p>
      <button onClick={onStartNew} className="px-4 py-2 bg-saffron-500 text-white rounded">
        Start New Vote
      </button>
    </div>
  );
}

function SystemStatus() {
  const { status } = useSystem();
  
  return (
    <div className="text-sm text-gray-600 space-y-1">
      <div className="flex items-center justify-between">
        <span>Network:</span>
        <span className={status.isOnline ? 'text-green-600' : 'text-red-600'}>
          {status.isOnline ? 'Connected' : 'Offline'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Blockchain:</span>
        <span className={status.blockchainConnected ? 'text-green-600' : 'text-yellow-600'}>
          {status.blockchainConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Status:</span>
        <span className="text-green-600 capitalize">
          {status.systemHealth}
        </span>
      </div>
    </div>
  );
}