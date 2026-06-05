import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">
            &larr; Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Customer Details</h1>
        <p className="text-zinc-400 mt-2">
          Viewing details for customer ID: {id}
        </p>
      </div>

      <div className="p-8 rounded-md border border-zinc-800 bg-zinc-900/50 text-center text-zinc-500">
        Detailed matchmaking view will be built here in the next step.
      </div>
    </div>
  );
}
