
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface TranslateProps {
  children: string;
  targetLanguage: string;
  className?: string;
}

const Translate: React.FC<TranslateProps> = ({ children, targetLanguage, className }) => {
  const [translatedText, setTranslatedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const textToTranslate = children.trim();

    if (!targetLanguage || targetLanguage.toLowerCase() === 'english' || !textToTranslate) {
      setTranslatedText(children);
      return;
    }

    const cacheKey = `caresync_v4_trans_${targetLanguage.toLowerCase()}:${textToTranslate}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslatedText(cached);
      return;
    }

    setIsTranslating(true);
    const performTranslation = async () => {
      try {
        const result = await geminiService.translate(textToTranslate, targetLanguage);
        if (isMounted.current) {
          setTranslatedText(result || textToTranslate);
        }
      } catch (err) {
        if (isMounted.current) setTranslatedText(children);
      } finally {
        if (isMounted.current) setIsTranslating(false);
      }
    };

    performTranslation();

    return () => { isMounted.current = false; };
  }, [children, targetLanguage]);

  return (
    <span className={`${className} transition-all duration-700 ${isTranslating ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'}`}>
      {translatedText}
    </span>
  );
};

export default Translate;
