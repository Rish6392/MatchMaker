"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-bg via-rose-lightest/30 to-gold-light/20 p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#C2185B 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-primary to-rose-500 shadow-xl shadow-rose-primary/20 mb-5">
            <Heart className="h-7 w-7 text-white fill-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-800">
            TDC Matchmaker
          </h1>
          <p className="text-stone-500 mt-2 text-sm">
            Sign in to your matchmaking portal
          </p>
        </div>

        <Card className="border-stone-200/60 bg-white/90 backdrop-blur-sm shadow-xl shadow-stone-900/5 rounded-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-stone-800 font-semibold">Welcome back</CardTitle>
              <CardDescription className="text-stone-500 text-sm">
                Enter your credentials to access the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {error && (
                <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200 font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-stone-50/80 border-stone-200 text-stone-800 placeholder:text-stone-400 focus-visible:ring-rose-primary/30 focus-visible:border-rose-primary/40 rounded-xl h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-stone-50/80 border-stone-200 text-stone-800 placeholder:text-stone-400 focus-visible:ring-rose-primary/30 focus-visible:border-rose-primary/40 rounded-xl h-11"
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-rose-primary to-rose-600 hover:from-rose-700 hover:to-rose-700 text-white rounded-xl h-11 shadow-lg shadow-rose-primary/20 transition-all font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6">
          TDC Matchmaker &middot; Premium Matchmaking Platform
        </p>
      </div>
    </div>
  );
}
