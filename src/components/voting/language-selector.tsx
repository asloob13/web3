'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { SupportedLanguage } from '@/types';

interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  fontFamily?: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: SupportedLanguage.ENGLISH, name: 'English', nativeName: 'English' },
  { code: SupportedLanguage.HINDI, name: 'Hindi', nativeName: 'हिन्दी', fontFamily: 'font-devanagari' },
  { code: SupportedLanguage.BENGALI, name: 'Bengali', nativeName: 'বাংলা', fontFamily: 'font-bengali' },
  { code: SupportedLanguage.TELUGU, name: 'Telugu', nativeName: 'తెలుగు', fontFamily: 'font-telugu' },
  { code: SupportedLanguage.TAMIL, name: 'Tamil', nativeName: 'தமிழ்', fontFamily: 'font-tamil' },
  { code: SupportedLanguage.GUJARATI, name: 'Gujarati', nativeName: 'ગુજરાતી', fontFamily: 'font-gujarati' },
  { code: SupportedLanguage.URDU, name: 'Urdu', nativeName: 'اردو' },
  { code: SupportedLanguage.KANNADA, name: 'Kannada', nativeName: 'ಕನ್ನಡ', fontFamily: 'font-kannada' },
  { code: SupportedLanguage.MALAYALAM, name: 'Malayalam', nativeName: 'മലയാളം', fontFamily: 'font-malayalam' },
  { code: SupportedLanguage.ORIYA, name: 'Oriya', nativeName: 'ଓଡ଼ିଆ', fontFamily: 'font-oriya' },
  { code: SupportedLanguage.PUNJABI, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', fontFamily: 'font-punjabi' },
  { code: SupportedLanguage.ASSAMESE, name: 'Assamese', nativeName: 'অসমীয়া', fontFamily: 'font-assamese' },
  { code: SupportedLanguage.MARATHI, name: 'Marathi', nativeName: 'मराठी', fontFamily: 'font-marathi' },
  { code: SupportedLanguage.SANSKRIT, name: 'Sanskrit', nativeName: 'संस्कृतम्', fontFamily: 'font-devanagari' },
  { code: SupportedLanguage.NEPALI, name: 'Nepali', nativeName: 'नेपाली', fontFamily: 'font-devanagari' },
  { code: SupportedLanguage.KASHMIRI, name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: SupportedLanguage.SINDHI, name: 'Sindhi', nativeName: 'سنڌي' },
  { code: SupportedLanguage.TIBETAN, name: 'Tibetan', nativeName: 'བོད་སྐད་' },
  { code: SupportedLanguage.MANIPURI, name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { code: SupportedLanguage.KONKANI, name: 'Konkani', nativeName: 'कोंकणी', fontFamily: 'font-devanagari' },
  { code: SupportedLanguage.MAITHILI, name: 'Maithili', nativeName: 'मैथिली', fontFamily: 'font-devanagari' },
  { code: SupportedLanguage.BODO, name: 'Bodo', nativeName: 'बोडो', fontFamily: 'font-devanagari' },
];

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onNext: () => void;
  className?: string;
  showVoiceAssistance?: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  onNext,
  className,
  showVoiceAssistance = true,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
  
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: SupportedLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleVoiceAssistance = (language: Language) => {
    // Implement text-to-speech for language name
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${language.name} - ${language.nativeName}`
      );
      utterance.lang = language.code;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto p-6 space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-3 bg-saffron-500 rounded-full"></div>
          <div className="w-16 h-3 bg-white-500 border border-gray-300 rounded-full mx-1"></div>
          <div className="w-16 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Select Your Language
        </h1>
        <p className="text-sm text-gray-600">
          Choose your preferred language for voting / अपनी मतदान भाषा चुनें
        </p>
      </div>

      {/* Language Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between p-4 border-2 rounded-lg',
            'bg-white hover:bg-gray-50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500',
            'touch-target',
            isOpen && 'border-saffron-500 ring-2 ring-saffron-500'
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select language"
        >
          <div className="flex items-center space-x-3">
            <div className={cn(
              'text-lg',
              selectedLang?.fontFamily
            )}>
              {selectedLang?.nativeName}
            </div>
            <div className="text-sm text-gray-500">
              ({selectedLang?.name})
            </div>
          </div>
          <ChevronDown className={cn(
            'h-5 w-5 text-gray-400 transition-transform',
            isOpen && 'transform rotate-180'
          )} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-auto">
            {/* Search */}
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-saffron-500"
                autoFocus
              />
            </div>

            {/* Language Options */}
            <ul role="listbox" className="py-2">
              {filteredLanguages.map((language) => (
                <li key={language.code} role="option" aria-selected={language.code === selectedLanguage}>
                  <button
                    onClick={() => handleLanguageSelect(language.code)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 text-left hover:bg-gray-50',
                      'focus:outline-none focus:bg-saffron-50 focus:text-saffron-900',
                      'transition-colors touch-target',
                      language.code === selectedLanguage && 'bg-saffron-50 text-saffron-900'
                    )}
                  >
                    <div className="flex-1">
                      <div className={cn(
                        'text-base font-medium',
                        language.fontFamily
                      )}>
                        {language.nativeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language.name}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {showVoiceAssistance && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVoiceAssistance(language);
                          }}
                          className="p-1 text-gray-400 hover:text-saffron-500 focus:outline-none focus:text-saffron-500"
                          aria-label={`Listen to ${language.name}`}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      )}
                      
                      {language.code === selectedLanguage && (
                        <Check className="h-5 w-5 text-saffron-500" />
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No languages found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accessibility Options */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">
          Accessibility Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center space-x-2 p-2 text-sm text-left hover:bg-gray-100 rounded transition-colors">
            <input type="checkbox" className="rounded" />
            <span>Large Text</span>
          </button>
          <button className="flex items-center space-x-2 p-2 text-sm text-left hover:bg-gray-100 rounded transition-colors">
            <input type="checkbox" className="rounded" />
            <span>High Contrast</span>
          </button>
          <button className="flex items-center space-x-2 p-2 text-sm text-left hover:bg-gray-100 rounded transition-colors">
            <input type="checkbox" className="rounded" />
            <span>Screen Reader</span>
          </button>
          <button className="flex items-center space-x-2 p-2 text-sm text-left hover:bg-gray-100 rounded transition-colors">
            <input type="checkbox" className="rounded" />
            <span>Voice Navigation</span>
          </button>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
          size="lg"
          className="min-w-32"
          disabled={!selectedLanguage}
        >
          Continue / जारी रखें
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Need help? Press and hold any language option to hear it spoken aloud.</p>
        <p>सहायता चाहिए? किसी भी भाषा विकल्प को सुनने के लिए दबाएं और रोकें।</p>
      </div>
    </div>
  );
}

export default LanguageSelector;