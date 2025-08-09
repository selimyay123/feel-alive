"use client";
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
            alert("Mesajın gönderildi!");
            setForm({ name: "", lastName: "", email: "", message: "" });
        } else {
            alert("Bir hata oluştu.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-[40%] rounded-lg backdrop-blur-3xl max-md:w-full mx-auto px-4 py-6 space-y-4 flex flex-col justify-center items-center border border-white/15"
        >
            <input
                required
                type="text"
                name="name"
                placeholder="Name*"
                value={form.name}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <input
                required
                type="text"
                name="lastName"
                placeholder="Last Name*"
                value={form.lastName}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <input
                required
                type="email"
                name="email"
                placeholder="Email*"
                value={form.email}
                onChange={handleChange}
                className="border border-white px-4 py-3 rounded-lg w-full"
            />
            <textarea
                required
                name="message"
                placeholder="Write your message here...*"
                value={form.message}
                onChange={handleChange}
                className="border w-full border-white px-4 py-3 rounded-lg min-h-[200px]"
            />
            <button type="submit" className="w-full bg-white/80 text-black rounded-lg px-4 py-3 mt-2">
                Submit
            </button>
        </form>
    );
}

export default Contact;
