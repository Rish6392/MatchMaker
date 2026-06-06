"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="w-full justify-start text-stone-500 hover:text-rose-primary hover:bg-rose-lightest/60 rounded-xl text-sm gap-2"
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}
