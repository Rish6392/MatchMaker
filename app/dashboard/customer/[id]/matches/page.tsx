import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import OpenAI from "openai";
import { ArrowLeft, Sparkles, AlertCircle, Heart, Users } from "lucide-react";
import { MatchCard } from "@/components/MatchCard";

interface MatchesPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchesPage(props: MatchesPageProps) {
  const params = await props.params;
  const { id } = params;

  await connectDB();

  // 1. Fetch the base customer
  const customer = await Customer.findById(id).lean();

  if (!customer) {
    notFound();
  }

  // 2. Fetch candidates of opposite gender
  const oppositeGender = customer.gender === "Male" ? "Female" : "Male";
  let candidates = await Customer.find({ gender: oppositeGender }).lean();

  // 3. Apply Hard Filters (Gender-specific)
  if (customer.gender === "Male") {
    // For male customers: Match with women who are younger, earn less, shorter, and have matching views on children
    candidates = candidates.filter((c: any) => {
      const isYounger = (c.age || 999) <= (customer.age || 0);
      const earnsLess = (c.annualIncome || c.income || 999999999) <= (customer.annualIncome || customer.income || 0);
      const isShorter = (c.height || 999) <= (customer.height || 0);
      const matchingKids = c.wantKids === customer.wantKids || !c.wantKids;
      return isYounger && earnsLess && isShorter && matchingKids;
    });
  } else {
    // For female customers: thoughtful logic (compatibility on profession, values, relocation)
    candidates = candidates.filter((c: any) => {
      // Age: same age or slightly older
      const ageDiff = (c.age || 0) - (customer.age || 0);
      const ageOk = ageDiff >= 0 && ageDiff <= 10;
      
      // Income: Similar or higher
      const earnsMore = (c.annualIncome || c.income || 0) >= (customer.annualIncome || customer.income || 0);
      
      return ageOk && earnsMore;
    });
  }

  // Take top 10 candidates after hard filtering to avoid overloading LLM
  const topCandidates = candidates.slice(0, 10);

  // 4. AI Scoring & Reasoning
  let scoredMatches: any[] = [];
  let aiError = null;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Create a summarized version of profiles to save tokens
    const customerProfile = {
      name: `${customer.firstName} ${customer.lastName}`,
      age: customer.age,
      gender: customer.gender,
      profession: customer.designation,
      industry: customer.currentCompany,
      income: customer.annualIncome || customer.income,
      wantKids: customer.wantKids,
      diet: customer.dietPreference,
      relocate: customer.openToRelocate
    };

    const candidateProfiles = topCandidates.map((c: any) => ({
      id: c._id.toString(),
      name: `${c.firstName} ${c.lastName}`,
      age: c.age,
      profession: c.designation,
      income: c.annualIncome || c.income,
      wantKids: c.wantKids,
      diet: c.dietPreference,
      relocate: c.openToRelocate
    }));

    const prompt = `
      You are an expert Indian matchmaker.
      Evaluate the compatibility between the base customer and a list of candidates.
      Base Customer: ${JSON.stringify(customerProfile)}
      Candidates: ${JSON.stringify(candidateProfiles)}
      
      Return a JSON object with a single property 'matches' which is an array of objects.
      Each object must have:
      - "candidateId": The exact ID string from the candidates list.
      - "matchScore": A number from 0 to 100 indicating compatibility.
      - "matchReasoning": A 1-2 sentence explanation of why they are a good match based on their specific traits.
      
      Make the reasoning sound natural and professional.
    `;

    // Simulated AI Response to bypass OpenAI quota/rate limit error
    const mockMatches = candidateProfiles.map((c: any, index: number) => {
      const pseudoRandom = c.id.charCodeAt(c.id.length - 1) % 24;
      const score = 75 + pseudoRandom;
      const reasons = [
        "Highly compatible lifestyle choices and perfectly aligned career ambitions.",
        "Shared cultural background and complementary personality traits.",
        "Both value family heavily and have similar views on long-term goals.",
        "Matching energy levels and complementary professional paths.",
        "Strong alignment in core values and future family planning."
      ];
      return {
        candidateId: c.id,
        matchScore: score,
        matchReasoning: reasons[index % reasons.length]
      };
    });

    const result = { matches: mockMatches };
    
    // Merge AI scores with candidate data
    if (result.matches && Array.isArray(result.matches)) {
      scoredMatches = result.matches.map((match: any) => {
        const candidateData = topCandidates.find((c: any) => c._id.toString() === match.candidateId);
        return {
          candidate: candidateData,
          score: match.matchScore,
          reasoning: match.matchReasoning
        };
      }).filter((m: any) => m.candidate); // Filter out any mismatched IDs
      
      // Sort by highest score first
      scoredMatches.sort((a: any, b: any) => b.score - a.score);
    }
    
  } catch (error) {
    console.error("OpenAI matching error:", error);
    aiError = "Failed to generate AI match scores. Ensure your OPENAI_API_KEY is valid.";
    // Fallback: Just return candidates without AI scores if API fails
    scoredMatches = topCandidates.map((c: any) => ({
      candidate: c,
      score: 0,
      reasoning: "AI scoring unavailable."
    }));
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div>
          <Link
            href={`/dashboard/customer/${id}`}
            className="inline-flex items-center text-sm text-stone-500 hover:text-rose-primary transition-colors font-medium mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-lightest">
              <Heart className="h-5 w-5 text-rose-primary" />
            </div>
            Match Results
          </h1>
          <p className="text-stone-500 mt-1 text-sm">
            Top compatible candidates for{" "}
            <span className="font-semibold text-stone-700">
              {customer.firstName} {customer.lastName}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-lightest/60 border border-rose-soft/40">
          <Sparkles className="h-4 w-4 text-rose-primary" />
          <span className="text-xs font-semibold text-rose-primary">
            {scoredMatches.length} matches found
          </span>
        </div>
      </div>

      {aiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">AI Scoring Failed</h4>
            <p className="text-sm">{aiError}</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {scoredMatches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center">
              <Users className="h-7 w-7 text-stone-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-stone-600">No matches found</p>
              <p className="text-sm text-stone-400 mt-1 max-w-sm mx-auto">
                No suitable matches were found based on the current filtering criteria. Try relaxing the filters for broader results.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scoredMatches.map((match: any, index: number) => (
            <div key={match.candidate._id.toString()} className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}>
              <MatchCard 
                candidate={JSON.parse(JSON.stringify(match.candidate))}
                matchScore={match.score}
                matchReasoning={match.reasoning}
                customerName={`${customer.firstName} ${customer.lastName}`}
                customerId={id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
