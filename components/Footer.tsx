import React from 'react';
import { useLocalization } from '../context/LanguageContext';

export const Footer: React.FC = () => {
    const { t } = useLocalization();
  return (
    <footer className="py-4 mt-8 text-center text-gray-500 text-sm border-t border-purple-500/30">
      <p>{t('footer.poweredBy')}</p>
    </footer>
  );
};
