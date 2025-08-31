"use client";

import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import { useI18n } from "@/context/I18nContext";

export default function Login() {

    const { t } = useI18n();

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    prompt: "select_account",
                },
            },
        });

        if (error) {
            alert("Error occured when signing in with Google: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="p-6 bg-white/15 backdrop-blur-lg rounded-lg space-y-8">
                <h1 className="text-xl">
                    {t('loginMessage')}
                </h1>
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center border border-white/30 backdrop-blur-lg rounded-full px-6 py-3 transition hover:bg-white/15 mx-auto"
                >
                    <Image
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        width={32}
                        height={32}
                        className="mr-3 rounded-lg"
                    />
                    <span className="text-white text-lg">{t('signInWithGoogle')}</span>
                </button>
            </div>
        </div>
    );
}
