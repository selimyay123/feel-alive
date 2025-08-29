"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tasks } from "./data/tasks";
import { ClipLoader } from "react-spinners";
import { useI18n } from "@/context/I18nContext";
import { supabase } from "../../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type UserTaskRow = {
  task: string;
  created_at: string; // ISO string from Supabase
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const { t } = useI18n();
  const router = useRouter();

  function formatTimeLeft(ms: number) {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
          setTask(existingTask.task);
          const expiry = new Date(existingTask.created_at);
          expiry.setHours(expiry.getHours() + 24);
          setExpiresAt(expiry);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserAndTask();
  }, []);

  // NEW: listen for sign-outs and clear state
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setTask(null);
        setExpiresAt(null);
        setTimeLeft("");
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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
        setTask(existingTask.task);
        const expiry = new Date(existingTask.created_at);
        expiry.setHours(expiry.getHours() + 24);
        setExpiresAt(expiry);
        setLoading(false);
        return;
      }

      // Pick a new random task
      const newTask = tasks[Math.floor(Math.random() * tasks.length)].task;

      const { data: inserted, error: insertError } = await supabase
        .from("user_tasks")
        .insert([
          {
            user_id: user.id,
            task: newTask,
            assigned_date: today,
          },
        ])
        .select("created_at")
        .single<{ created_at: string }>();

      if (insertError) throw insertError;

      setTask(newTask);

      const expiry = new Date(inserted.created_at);
      expiry.setHours(expiry.getHours() + 24);
      setExpiresAt(expiry);

      setLoading(false);
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e ? String((e as any).message) : "Unknown error";
      console.error("Task assignment error:", msg);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start mt-4 max-md:mt-0 min-h-screen">
      <h1 className="text-5xl md:text-7xl max-w-full font-semibold text-gradient animate-slide-in-left leading-[1.2] max-md:text-center">
        {t("slogan")}
      </h1>

      <div className="relative w-full min-h-[350px] mt-12 rounded-lg overflow-visible">
        <Image
          src="/blue.jpg"
          alt="blue"
          fill
          className="object-cover rounded-xl opacity-30"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center w-[70%] max-md:w-full mx-auto">
          <div className="flex max-md:flex-col items-center justify-evenly max-md:gap-8">
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t("subSlogan1")}
            </h1>
            <div className="w-px font-bold h-25 bg-white mx-8 max-md:hidden"></div>
            <h1 className="text-white text-2xl text-center px-4 underline">
              {t("subSlogan2")}
            </h1>
          </div>

          {!loading && !task && (
            <button
              className="rounded-full w-[50%] max-md:w-full mx-auto p-4 mt-8 hover-gradient"
              onClick={handleClick}
            >
              {t("start")}
            </button>
          )}

          {loading && (
            <div className="mt-16 flex justify-center items-center w-full">
              <ClipLoader color="#8e44ad" size={50} />
            </div>
          )}

          {task && (
            <div className="mt-16 flex flex-col items-center justify-center w-[70%] mx-auto max-md:w-full text-xl italic p-4 backdrop-blur-3xl border-2 border-white rounded-2xl text-center space-y-4">
              <p>&quot;{task}&quot;</p>
              {timeLeft && (
                <p className="text-sm text-gray-200">
                  New task available in <span className="font-bold">{timeLeft}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
