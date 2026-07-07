"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, type User } from "@/lib/session";
import Wordmark from "./Wordmark";

export default function Header() {
  const [user, setUserState] = useState<User | null>(null);

  // localStorage is only available client-side; read after mount
  useEffect(() => {
    setUserState(getUser());
  }, []);

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`
    : "";

  return (
    <header className="flex items-center justify-between px-5 md:px-10 py-5">
      <Link href="/home" className="hover:opacity-60 transition-opacity">
        <Wordmark />
      </Link>
      {user && (
        <div
          className="flex items-center gap-3"
          title={`${user.firstName} ${user.lastName}`}
        >
          <span className="hidden md:block text-sm text-neutral-500">
            {user.firstName} {user.lastName}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 text-xs font-medium">
            {initials}
          </span>
        </div>
      )}
    </header>
  );
}
