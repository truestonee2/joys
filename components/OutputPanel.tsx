import React from 'react';
import type { GeneratedPromptOutput } from '../types';
import { Spinner } from './Spinner';
import { OutputBlock } from './OutputBlock';
import { VoiceScriptBlock } from './VoiceScriptBlock';
import { useLocalization } from '../context/LanguageContext';

interface OutputPanelProps {
  isLoading: boolean;
  output: GeneratedPromptOutput | null;
  error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ isLoading, output, error }) => {
  const { t } = useLocalization();
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
          <Spinner />
          <p>{t('inputPanel.buttonLoading')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
          <h3 className="text-xl font-semibold mb-2">{t('outputPanel.errorTitle')}</h3>
          <p className="bg-red-900/50 p-4 rounded-md">{error}</p>
        </div>
      );
    }
    
    if (output) {
      return (
        <div className="space-y-6">
          <OutputBlock title={t('outputPanel.videoTitle')} content={output.title} />
          
          {output.scenePrompts.map((prompt, index) => (
            <OutputBlock 
              key={`prompt-${index}`}
              title={t('outputPanel.scenePromptTitle', { segment: index + 1 })}
              content={prompt} 
            />
          ))}

          <VoiceScriptBlock voiceScript={output.voiceScript} />

          {output.sceneJsons.map((json, index) => (
            <OutputBlock
              key={`json-${index}`}
              title={t('outputPanel.sceneJsonTitle', { segment: index + 1 })}
              content={JSON.stringify(json, null, 2)}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <h3 className="text-2xl font-semibold">{t('outputPanel.placeholderTitle')}</h3>
        <p className="mt-2">{t('outputPanel.placeholderSubtitle')}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full">
      <h2 className="text-2xl font-semibold text-gray-200 mb-6">{t('outputPanel.title')}</h2>
      <div className="h-[calc(100%-48px)] overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};
