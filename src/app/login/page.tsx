"use client";
import GoogleButton from "react-google-button";
import { supabase } from "../../../lib/supabaseClient";

export default function Login() {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:3000/auth/callback",
                queryParams: {
                    prompt: "select_account",
                },
            },
        });

        if (error) {
            alert("Google ile girişte hata oluştu: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className=" p-6 bg-white/15 backdrop-blur-lg rounded-lg  space-y-8">
                <h1 className="text-xl">Hi! Right now you can only login with Google.</h1>
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center border border-white/30 backdrop-blur-lg rounded-full px-6 py-3 transition hover:bg-white/15 mx-auto"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className="w-8 h-8 mr-3 rounded-lg"
                    />
                    <span className="text-white text-lg">Sign in with Google</span>
                </button>
            </div>

        </div>
    );
}
