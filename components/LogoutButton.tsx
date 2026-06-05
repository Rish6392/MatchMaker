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
      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
