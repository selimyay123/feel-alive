"use client";
import { useI18n } from "@/context/I18nContext";
import { useState } from "react";

function Contact() {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("Your message is sent!");
            setForm({ name: "", lastName: "", email: "", message: "" });
        } else {
            alert("Error!");
        }
    };

    const { t } = useI18n();

    return (
        <form
            onSubmit={handleSubmit}
            className="w-[40%] rounded-lg backdrop-blur-3xl max-md:w-full mx-auto px-4 py-6 space-y-4 flex flex-col justify-center items-center border border-white/15"
        >
            <input
                required
                type="text"
                name="name"
                placeholder={t('name')}
                value={form.name}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <input
                required
                type="text"
                name="lastName"
                placeholder={t('lastName')}
                value={form.lastName}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <input
                required
                type="email"
                name="email"
                placeholder={t('email')}
                value={form.email}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <textarea
                required
                name="message"
                placeholder={t('enterYourMessageHere')}
                value={form.message}
                onChange={handleChange}
                className="border w-full border-white px-4 py-3 rounded-lg min-h-[200px]"
            />
            <button type="submit" className="w-full bg-white/80 text-black rounded-lg px-4 py-3 mt-2">
                {t('send')}
            </button>
        </form>
    );
}

export default Contact;
