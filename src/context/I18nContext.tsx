'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

type Locale = 'en' | 'tr';
type Messages = typeof en;

const translations: Record<Locale, Messages> = { en, tr };

interface I18nContextProps {
    locale: Locale;
    t: (key: keyof Messages, vars?: Record<string, string>) => string;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<Locale>('en');

    // İlk açılışta localStorage'dan oku
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale) {
            setLocale(savedLocale);
        }
    }, []);

    // Dil değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    const t = (key: keyof Messages, vars?: Record<string, string>) => {
        let text = translations[locale][key] || key;
        if (vars) {
            Object.entries(vars).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
    };

    return (
        <I18nContext.Provider value={{ locale, t, setLocale }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used within I18nProvider');
    return context;
};
