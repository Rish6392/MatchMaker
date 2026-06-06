"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { UserIcon, MapPin, Briefcase, Heart, Send, Star, Sparkles } from "lucide-react";

interface MatchCardProps {
  candidate: any; // We'll pass the candidate object
  matchScore: number;
  matchReasoning: string;
  customerName: string;
  customerId: string;
}

// Extract compatibility tags from reasoning keywords
function getCompatibilityTags(reasoning: string): string[] {
  const tags: string[] = [];
  const lower = reasoning.toLowerCase();
  if (lower.includes("career") || lower.includes("professional") || lower.includes("profession")) tags.push("Career Compatible");
  if (lower.includes("family") || lower.includes("values")) tags.push("Family Values Aligned");
  if (lower.includes("relocation") || lower.includes("relocat")) tags.push("Relocation Compatible");
  if (lower.includes("lifestyle") || lower.includes("energy")) tags.push("Lifestyle Match");
  if (lower.includes("cultural") || lower.includes("background")) tags.push("Cultural Fit");
  if (lower.includes("goal") || lower.includes("planning")) tags.push("Future Goals Aligned");
  if (tags.length === 0) tags.push("Strong Match");
  return tags.slice(0, 2);
}

export function MatchCard({ candidate, matchScore, matchReasoning, customerName, customerId }: MatchCardProps) {
  const handleSendMatch = async () => {
    try {
      const res = await fetch(`/api/customer/${customerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusTag: "Matched" })
      });

      if (res.ok) {
        toast.success(`Match sent!`, {
          description: `Mock email successfully sent to ${customerName} with ${candidate.firstName}'s profile. Status updated to Matched.`,
        });
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("An error occurred while updating status.");
    }
  };

  // Determine badge style based on score
  const getScoreStyle = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 shadow-sm";
    if (score >= 75) return "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200";
    return "bg-stone-50 text-stone-600 border-stone-200";
  };

  const tags = getCompatibilityTags(matchReasoning);

  return (
    <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card flex flex-col h-full overflow-hidden relative group">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-rose-primary/60 via-rose-soft to-gold-accent/60" />

      <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-start justify-between gap-3 space-y-0 p-5">
        <div className="flex gap-3.5">
          <div
            className={`h-14 w-14 rounded-xl flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0 ${
              candidate.gender === "Female"
                ? "bg-gradient-to-br from-rose-primary to-rose-400 text-white"
                : "bg-gradient-to-br from-sky-600 to-sky-400 text-white"
            }`}
          >
            {candidate.firstName?.[0]}{candidate.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800 tracking-tight">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <UserIcon className="h-3.5 w-3.5 text-stone-400" />
                {candidate.age} yrs, {candidate.height ? `${candidate.height} cm` : "Height N/A"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                {candidate.city}, {candidate.country}
              </span>
            </div>
          </div>
        </div>

        <Badge variant="outline" className={`font-bold px-2.5 py-1 text-xs ${getScoreStyle(matchScore)}`}>
          {matchScore >= 90 && <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />}
          {matchScore}%
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-5 gap-4">
        {/* Compatibility tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-rose-lightest text-rose-primary uppercase tracking-wider"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3 flex-1">
          {candidate.designation && candidate.currentCompany && (
            <div className="flex items-start gap-2.5">
              <Briefcase className="h-4 w-4 text-sky-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Profession</p>
                <p className="text-sm font-medium text-stone-700">{candidate.designation} at {candidate.currentCompany}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5">
            <Heart className="h-4 w-4 text-rose-primary mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">AI Insight</p>
              <p className="text-sm text-stone-600 leading-relaxed italic border-l-2 border-rose-soft pl-3 mt-1.5 py-0.5">
                &ldquo;{matchReasoning}&rdquo;
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSendMatch}
          className="w-full mt-auto bg-gradient-to-r from-rose-primary to-rose-600 hover:from-rose-700 hover:to-rose-700 text-white border-0 rounded-xl shadow-sm shadow-rose-primary/15 transition-all group-hover:shadow-md group-hover:shadow-rose-primary/20"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Match
        </Button>
      </CardContent>
    </Card>
  );
}
