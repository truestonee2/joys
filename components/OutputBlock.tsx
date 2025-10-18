import React, { useState, useCallback } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { useLocalization } from '../context/LanguageContext';

interface OutputBlockProps {
  title: string;
  content: string;
}

export const OutputBlock: React.FC<OutputBlockProps> = ({ title, content }) => {
  const { t } = useLocalization();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [content]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300"
        >
          <ClipboardIcon />
          {isCopied ? t('outputPanel.copied') : t('outputPanel.copy')}
        </button>
      </div>
      <div className="bg-gray-900 p-3 rounded-md text-gray-300 text-sm whitespace-pre-wrap font-mono">
        {content}
      </div>
    </div>
  );
};
