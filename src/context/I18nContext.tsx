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

type Locale = 'en' | 'tr';

// Sözlükleri generic tutuyoruz ki dot-notation ile derin erişim mümkün olsun
type Messages = Record<string, unknown>;
const translations: Record<Locale, Messages> = { en, tr };

// Fallback dil
const FALLBACK_LOCALE: Locale = 'en';

interface I18nContextProps {
    locale: Locale;
    // ÖNEMLİ: key string; "a.b.c" yollarını destekler
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
    // Yanlış yapılandırmada (array/obj) debug kolaylığı için fallback (key) döndür
    return fallback;
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<Locale>('en');

    // İlk açılışta localStorage'dan oku
    useEffect(() => {
        try {
            const saved = localStorage.getItem('locale') as Locale | null;
            if (saved === 'en' || saved === 'tr') setLocale(saved);
        } catch {
            // SSR/private mode vb.
        }
    }, []);

    // Dil değişince localStorage'a ve <html lang> özniteliğine yaz
    useEffect(() => {
        try {
            localStorage.setItem('locale', locale);
        } catch {
            // sessiz geç
        }
        try {
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('lang', locale);
            }
        } catch {
            // sessiz geç
        }
    }, [locale]);

    const t = useMemo<I18nContextProps['t']>(() => {
        return (key, vars) => {
            const primaryDict = translations[locale] ?? translations[FALLBACK_LOCALE];
            const fallbackDict =
                locale === FALLBACK_LOCALE ? primaryDict : translations[FALLBACK_LOCALE];

            // 1) Önce seçili dilde ara
            let raw = getPath(primaryDict, key);

            // 2) Bulunamazsa fallback (EN) dene
            if (raw == null && fallbackDict) {
                raw = getPath(fallbackDict, key);
            }

            // Geliştirme ortamında eksik anahtarları uyar
            if (raw == null && process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn(`[i18n] Missing key (locale=${locale} → fallback=${FALLBACK_LOCALE}): ${key}`);
            }

            let text = coerceToString(raw, key);

            if (vars) {
                // {name} gibi placeholder'ları global replace ile değiştir
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
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
};
