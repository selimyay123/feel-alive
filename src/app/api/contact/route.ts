import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { name, lastName, email, message } = await req.json();

    // 1. Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    );

    try {
        // 2. Veriyi Supabase'e kaydet
        const { error } = await supabase.from("contact_messages").insert([
            {
                name,
                last_name: lastName,
                email,
                message,
            },
        ]);

        if (error) throw error;

        // 3. E-posta gönder
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name} ${lastName}" <${email}>`,
            to: process.env.MAIL_TO,
            subject: "Yeni İletişim Formu Mesajı",
            text: message,
            html: `<p>${message}</p>`,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
