"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useI18n } from "@/context/I18nContext";
import { supabase } from "../../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { taskKeys } from "./data/tasks";

// İKİ SÖZLÜĞÜ İÇERİ AL: Metin → key eşleşmesi kurmak için
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";

type UserTaskRow = {
  task: string;        // "tasks.tX" veya eski düz metin
  created_at: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<string | null>(null); // DB'deki ham değer (key ya da eski düz metin)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const { t } = useI18n();
  const router = useRouter();

  // --- Reverse map: "metin" -> "tasks.tX"
  // Hem EN hem TR sözlükteki "tasks" içeriğini tarayıp tek bir ters sözlük çıkarıyoruz.
  const reverseTaskMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};

    function addDict(dict: any) {
      const tasksObj = dict?.tasks ?? {};
      Object.entries(tasksObj).forEach(([k, v]) => {
        if (typeof v === "string") {
          map[v] = `tasks.${k}`; // örn: "En az 10 dk..." -> "tasks.t1"
        }
      });
    }

    addDict(en);
    addDict(tr);

    return map;
  }, []);

  function formatTimeLeft(ms: number) {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Ekranda gösterilecek metin: eğer "tasks." ile başlıyorsa çeviri key'idir.
  function renderTaskText(raw: string | null): string {
    if (!raw) return "";
    if (raw.startsWith("tasks.")) {
      return t(raw); // örn: t("tasks.t1")
    }
    // Eski düz metin gelirse (normalize edilmeden önce), olduğu gibi göster
    return raw;
  }

  // Düz metin -> key normalizasyonu (eşleşme bulunursa key'i döndürür)
  function normalizeToKey(raw: string): string | null {
    if (raw.startsWith("tasks.")) return raw;
    return reverseTaskMap[raw] ?? null;
  }

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const msLeft = expiresAt.getTime() - Date.now();
      if (msLeft <= 0) {
        setTask(null);
        setExpiresAt(null);
        setTimeLeft("");
        clearInterval(interval);
      } else {
        setTimeLeft(formatTimeLeft(msLeft));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // On mount: fetch session and today's task
  useEffect(() => {
    const fetchUserAndTask = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!error && data?.session?.user) {
        setUser(data.session.user);

        const today = new Date().toISOString().split("T")[0];
        const { data: existingTask } = await supabase
          .from("user_tasks")
          .select("task, created_at")
          .eq("user_id", data.session.user.id)
          .eq("assigned_date", today)
          .single<UserTaskRow>();

        if (existingTask) {
          let raw = existingTask.task;

          // Eğer düz metinse, mümkünse key'e çevir ve İSTEĞE BAĞLI migrate et
          const normalized = normalizeToKey(raw);
          if (normalized && normalized !== raw) {
            raw = normalized;
            // --- Opsiyonel: DB'yi de anahtara migrate et (yorumdan çıkarırsan kalıcı olur)
            await supabase
              .from("user_tasks")
              .update({ task: raw })
              .eq("user_id", data.session.user.id)
              .eq("assigned_date", today);
          }

          setTask(raw);

          const expiry = new Date(existingTask.created_at);
          expiry.setHours(expiry.getHours() + 24);
          setExpiresAt(expiry);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserAndTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClick() {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    try {
      const { data: existingTask, error: fetchError } = await supabase
        .from("user_tasks")
        .select("task, created_at")
        .eq("user_id", user.id)
        .eq("assigned_date", today)
        .single<UserTaskRow>();

      // PGRST116 = no rows
      if (fetchError && (fetchError as { code?: string }).code !== "PGRST116") {
        throw fetchError;
      }

      if (existingTask) {
        let raw = existingTask.task;

        const normalized = normalizeToKey(raw);
        if (normalized && normalized !== raw) {
          raw = normalized;
          // Opsiyonel migrate:
          await supabase
            .from("user_tasks")
            .update({ task: raw })
            .eq("user_id", user.id)
            .eq("assigned_date", today);
        }

        setTask(raw);
        const expiry = new Date(existingTask.created_at);
        expiry.setHours(expiry.getHours() + 24);
        setExpiresAt(expiry);
        setLoading(false);
        return;
      }

      // Yeni bir rastgele görev KEY'i seç
      const idx = Math.floor(Math.random() * taskKeys.length);
      const newTaskKey = `tasks.${taskKeys[idx]}`; // "tasks.tX"

      const { data: inserted, error: insertError } = await supabase
        .from("user_tasks")
        .insert([
          {
            user_id: user.id,
            task: newTaskKey, // KEY'i kaydediyoruz
            assigned_date: today
          }
        ])
        .select("created_at")
        .single<{ created_at: string }>();

      if (insertError) throw insertError;

      setTask(newTaskKey);

      const expiry = new Date(inserted.created_at);
      expiry.setHours(expiry.getHours() + 24);
      setExpiresAt(expiry);

      setLoading(false);
    } catch (e: unknown) {
      let msg = "Unknown error";
      if (e instanceof Error) {
        msg = e.message;
      } else if (typeof e === "string") {
        msg = e;
      } else {
        try {
          msg = JSON.stringify(e);
        } catch { }
      }
      console.error("Task assignment error:", msg);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start mt-4 max-md:mt-0 min-h-screen">
      <h1 className="text-5xl md:text-7xl max-w-full font-semibold text-gradient animate-slide-in-left leading-[1.2] max-md:text-center">
        {t("slogan")}
      </h1>

      <div className="relative w-full h-[460px] md:h-[520px] mt-12 rounded-lg overflow-hidden">
        <Image
          src="/blue.jpg"
          alt="blue"
          fill
          className="object-cover rounded-xl opacity-30"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center w-[70%] max-md:w-full mx-auto px-4">
          {/* Slogans */}
          <div className="flex max-md:flex-col items-center justify-evenly gap-6 md:gap-0">
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t("subSlogan1")}
            </h1>
            <div className="w-px font-bold h-25 bg-white mx-8 max-md:hidden"></div>
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t("subSlogan2")}
            </h1>
          </div>

          <div className="mt-8 w-full max-w-2xl">
            <div
              className={[
                "rounded-2xl py-8 px-4 md:p-6 min-h-[140px] max-h-[200px] overflow-auto flex items-center justify-center text-center transition-all",
                task
                  ? "border-2 border-white/70 bg-white/10 backdrop-blur-3xl"
                  : "border-0 bg-transparent backdrop-blur-0"
              ].join(" ")}
            >
              {!task ? (
                <button
                  className="rounded-full w-[60%] max-md:w-full mx-auto py-3 px-4 hover-gradient"
                  onClick={handleClick}
                  disabled={loading}
                >
                  {loading ? <ClipLoader color="#8e44ad" size={20} /> : t("start")}
                </button>
              ) : (
                <p className="text-white text-xl italic">
                  &quot;{renderTaskText(task)}&quot;
                </p>
              )}
            </div>

            {task && timeLeft && (
              <p className="mt-3 text-center text-sm text-gray-200">
                {t("ui.newTaskIn")}{" "}
                <span className="font-bold">{timeLeft}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
