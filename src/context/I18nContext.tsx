'use client';

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useMemo,
} from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import jp from '@/locales/jp.json';

type Locale = 'en' | 'tr' | 'jp';

// Sözlükleri generic/loosely typed tutuyoruz ki dot-notation ile derin erişim yapabilelim
type Messages = Record<string, unknown>;

const translations: Record<Locale, Messages> = { en, tr, jp };

interface I18nContextProps {
    locale: Locale;
    // ÖNEMLİ: key artık string; "a.b.c" yollarını destekler
    t: (key: string, vars?: Record<string, string | number>) => string;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

// Dot-notation ile derin okuma yardımcıları
function getPath(obj: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, segment) => {
        if (acc == null || typeof acc !== 'object') return undefined;
        // @ts-expect-error: loose index access by design
        return acc[segment];
    }, obj);
}

function coerceToString(val: unknown, fallback: string): string {
    if (val == null) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    // Array/Obj gelirse (yanlış yapılandırma) anahtarı döndürerek debug kolaylığı sağlıyoruz
    return fallback;
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<Locale>('en');

    // İlk açılışta localStorage'dan oku
    useEffect(() => {
        try {
            const saved = localStorage.getItem('locale') as Locale | null;
            if (saved === 'en' || saved === 'tr') {
                setLocale(saved);
            }
        } catch {
            // SSR veya private mode durumlarında sessizce geç
        }
    }, []);

    // Dil değiştiğinde localStorage'a kaydet
    useEffect(() => {
        try {
            localStorage.setItem('locale', locale);
        } catch {
            // sessiz geç
        }
    }, [locale]);

    const t = useMemo<I18nContextProps['t']>(() => {
        return (key, vars) => {
            const dict = translations[locale] ?? translations.en;
            const raw = getPath(dict, key);
            let text = coerceToString(raw, key);

            if (vars) {
                // {name} gibi placeholder'ları çoklu tekrarlar için global replace ile değiştir
                Object.entries(vars).forEach(([k, v]) => {
                    const re = new RegExp(`\\{${k}\\}`, 'g');
                    text = text.replace(re, String(v));
                });
            }

            return text;
        };
    }, [locale]);

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
