import React from 'react';
import { useLocalization } from '../context/LanguageContext';
import { RefreshIcon } from './icons/RefreshIcon';

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const { language, setLanguage, t } = useLocalization();

  const LanguageButton: React.FC<{ lang: 'ko' | 'en'; children: React.ReactNode }> = ({ lang, children }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        language === lang
          ? 'bg-purple-500 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="py-6 text-center border-b border-purple-500/30 relative">
        <div className="absolute top-4 left-4">
            <button
                onClick={onReset}
                className="flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
                <RefreshIcon />
                {t('header.newPrompt')}
            </button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
            <LanguageButton lang="ko">한국어</LanguageButton>
            <LanguageButton lang="en">English</LanguageButton>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mt-8 md:mt-0">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {t('header.title1')}
            </span>
            <span className="text-gray-300">{t('header.title2')}</span>
        </h1>
        <p className="text-gray-400 mt-2">{t('header.subtitle')}</p>
    </header>
  );
};