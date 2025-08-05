"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

function Login() {
    const [signupClicked, setSignupClicked] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (!username || !password) {
            alert("Please fill in both fields.");
            return;
        }

        if (signupClicked) {
            // Signup işlemi
            const { data, error } = await supabase
                .from("users")
                .insert([{ username, password }]);

            if (error) {
                console.error("Signup error:", error.message);
                alert(error.message);
            } else {
                alert("Signup successful! You can now log in.");
                setSignupClicked(false);
            }
        } else {
            // Login işlemi
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .eq("password", password)
                .single();

            if (error || !data) {
                console.error("Login error:", error?.message || "User not found");
                alert("Invalid username or password.");
            } else {
                alert("Login successful!");
                router.push("/"); // Giriş sonrası yönlendirme
            }
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-[400px] border border-white/15 backdrop-blur-3xl flex flex-col gap-4 p-8 rounded-xl">
                <h1 className="text-center text-lg">
                    {signupClicked ? "Sign Up" : "Login"}
                </h1>

                <input
                    type="text"
                    placeholder="username"
                    className="rounded-lg p-4 border border-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="password"
                    className="rounded-lg p-4 border border-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="bg-white/50 text-black rounded-lg px-4 py-3 mt-2"
                >
                    {signupClicked ? "Sign Up" : "Login"}
                </button>

                {!signupClicked && (
                    <p className="mt-4">
                        If you do not have an account,{" "}
                        <span
                            className="underline cursor-pointer"
                            onClick={() => setSignupClicked(true)}
                        >
                            Sign Up
                        </span>
                    </p>
                )}

                {signupClicked && (
                    <p className="mt-4">
                        Already have an account?{" "}
                        <span
                            className="underline cursor-pointer"
                            onClick={() => setSignupClicked(false)}
                        >
                            Login
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;
