import React, { useEffect } from 'react';
import type { PromptOptions } from '../types';
import { PROMPT_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { useLocalization } from '../context/LanguageContext';

interface InputPanelProps {
  promptIdea: string;
  setPromptIdea: (value: string) => void;
  promptOptions: PromptOptions;
  setPromptOptions: (options: PromptOptions) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onGetSuggestions: () => void;
  isSuggesting: boolean;
}

const SelectInput: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

export const InputPanel: React.FC<InputPanelProps> = ({
  promptIdea,
  setPromptIdea,
  promptOptions,
  setPromptOptions,
  onGenerate,
  isLoading,
  onGetSuggestions,
  isSuggesting,
}) => {
  const { language, t } = useLocalization();

  const handleOptionChange = <K extends keyof PromptOptions,>(key: K, value: PromptOptions[K]) => {
    setPromptOptions({ ...promptOptions, [key]: value });
  };
  
  // Reset select options when language changes to avoid value mismatch
  useEffect(() => {
    setPromptOptions({
      style: PROMPT_OPTIONS.styles[language][0],
      mood: PROMPT_OPTIONS.moods[language][0],
      cameraAngle: PROMPT_OPTIONS.cameraAngles[language][0],
      lighting: PROMPT_OPTIONS.lighting[language][0],
      quality: PROMPT_OPTIONS.qualities[language][0],
      voiceActor: PROMPT_OPTIONS.voiceActors[language][0],
      videoLength: PROMPT_OPTIONS.videoLengths[language][0],
      videoSegment: PROMPT_OPTIONS.videoSegments[language][0],
    });
  }, [language, setPromptOptions]);


  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-200">{t('inputPanel.visionTitle')}</h2>
      <div>
        <label htmlFor="prompt-idea" className="block text-sm font-medium text-gray-400 mb-1">
          {t('inputPanel.ideaLabel')}
        </label>
        <textarea
          id="prompt-idea"
          rows={4}
          className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder={t('inputPanel.ideaPlaceholder')}
          value={promptIdea}
          onChange={(e) => setPromptIdea(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-200">{t('inputPanel.refineTitle')}</h2>
        <button
          onClick={onGetSuggestions}
          disabled={isSuggesting || isLoading || !promptIdea.trim()}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSuggesting ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
              {t('inputPanel.gettingSuggestions')}
            </>
          ) : (
            <>
              <MagicWandIcon />
              {t('inputPanel.getSuggestions')}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label={t('inputPanel.style')}
          value={promptOptions.style}
          options={PROMPT_OPTIONS.styles[language]}
          onChange={(e) => handleOptionChange('style', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.mood')}
          value={promptOptions.mood}
          options={PROMPT_OPTIONS.moods[language]}
          onChange={(e) => handleOptionChange('mood', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.cameraAngle')}
          value={promptOptions.cameraAngle}
          options={PROMPT_OPTIONS.cameraAngles[language]}
          onChange={(e) => handleOptionChange('cameraAngle', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.lighting')}
          value={promptOptions.lighting}
          options={PROMPT_OPTIONS.lighting[language]}
          onChange={(e) => handleOptionChange('lighting', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.quality')}
          value={promptOptions.quality}
          options={PROMPT_OPTIONS.qualities[language]}
          onChange={(e) => handleOptionChange('quality', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.voiceActor')}
          value={promptOptions.voiceActor}
          options={PROMPT_OPTIONS.voiceActors[language]}
          onChange={(e) => handleOptionChange('voiceActor', e.target.value)}
        />
        <SelectInput
          label={t('inputPanel.videoLength')}
          value={promptOptions.videoLength}
          options={PROMPT_OPTIONS.videoLengths[language]}
          onChange={(e) => handleOptionChange('videoLength', e.target.value)}
        />
         <SelectInput
          label={t('inputPanel.videoSegment')}
          value={promptOptions.videoSegment}
          options={PROMPT_OPTIONS.videoSegments[language]}
          onChange={(e) => handleOptionChange('videoSegment', e.target.value)}
        />
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || isSuggesting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            t('inputPanel.buttonLoading')
          ) : (
            <>
              <SparklesIcon />
              {t('inputPanel.button')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
