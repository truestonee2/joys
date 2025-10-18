import React, { useState, useCallback } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { useLocalization } from '../context/LanguageContext';
import type { VoiceScript } from '../types';

interface VoiceScriptBlockProps {
  voiceScript: VoiceScript;
}

export const VoiceScriptBlock: React.FC<VoiceScriptBlockProps> = ({ voiceScript }) => {
  const { t } = useLocalization();
  const [isCopied, setIsCopied] = useState(false);

  const getCopyableText = useCallback(() => {
    if (voiceScript.type === 'narration') {
      return voiceScript.script;
    } else {
      return voiceScript.script
        .map(line => `${line.character}:\n${line.line}`)
        .join('\n\n');
    }
  }, [voiceScript]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(getCopyableText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [getCopyableText]);

  const renderScript = () => {
    if (voiceScript.type === 'narration') {
      return (
        <div className="bg-gray-900 p-3 rounded-md text-gray-300 text-sm whitespace-pre-wrap font-mono">
          {voiceScript.script}
        </div>
      );
    } else {
      return (
        <div className="bg-gray-900 p-3 rounded-md text-gray-300 text-sm font-mono space-y-3">
          {voiceScript.script.map((line, index) => (
            <div key={index}>
              <p className="font-bold text-purple-300">{line.character}:</p>
              <p className="whitespace-pre-wrap pl-2">{line.line}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-300">{t('outputPanel.voiceScriptTitle')}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300"
        >
          <ClipboardIcon />
          {isCopied ? t('outputPanel.copied') : t('outputPanel.copy')}
        </button>
      </div>
      {renderScript()}
    </div>
  );
};
