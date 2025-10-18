import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { LanguageProvider, useLocalization } from './context/LanguageContext';
import { PROMPT_OPTIONS } from './constants';
import { getPromptSuggestions, generateStructuredPrompt } from './services/geminiService';
import type { PromptOptions, GeneratedPromptOutput } from './types';

const AppContent: React.FC = () => {
  const { language } = useLocalization();

  const getInitialPromptOptions = useCallback((): PromptOptions => ({
    style: PROMPT_OPTIONS.styles[language][0],
    mood: PROMPT_OPTIONS.moods[language][0],
    cameraAngle: PROMPT_OPTIONS.cameraAngles[language][0],
    lighting: PROMPT_OPTIONS.lighting[language][0],
    quality: PROMPT_OPTIONS.qualities[language][0],
    voiceActor: PROMPT_OPTIONS.voiceActors[language][0],
    videoLength: PROMPT_OPTIONS.videoLengths[language][0],
    videoSegment: PROMPT_OPTIONS.videoSegments[language][0],
  }), [language]);

  const [promptIdea, setPromptIdea] = useState('');
  const [promptOptions, setPromptOptions] = useState<PromptOptions>(getInitialPromptOptions);
  const [output, setOutput] = useState<GeneratedPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPromptOptions(getInitialPromptOptions());
  }, [language, getInitialPromptOptions]);

  const handleGetSuggestions = async () => {
    if (!promptIdea.trim()) return;
    setIsSuggesting(true);
    setError(null);
    try {
      // Pass PROMPT_OPTIONS to constrain the AI's choices
      const suggestions = await getPromptSuggestions(promptIdea, language);
      setPromptOptions(prev => ({
        ...prev,
        ...suggestions,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while getting suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = async () => {
    if (!promptIdea.trim()) return;
    setIsLoading(true);
    setError(null);
    setOutput(null);
    try {
      const result = await generateStructuredPrompt(promptIdea, promptOptions, language);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating prompts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPromptIdea('');
    setPromptOptions(getInitialPromptOptions());
    setOutput(null);
    setError(null);
    setIsLoading(false);
    setIsSuggesting(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header onReset={handleReset} />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <InputPanel
          promptIdea={promptIdea}
          setPromptIdea={setPromptIdea}
          promptOptions={promptOptions}
          setPromptOptions={setPromptOptions}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onGetSuggestions={handleGetSuggestions}
          isSuggesting={isSuggesting}
        />
        <OutputPanel
          isLoading={isLoading}
          output={output}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;