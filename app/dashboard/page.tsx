import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerListTable } from "@/components/CustomerListTable";

export const dynamic = 'force-dynamic'; // Ensures this page always fetches fresh data

export default async function DashboardPage() {
  await connectDB();

  // Fetch all customers (for MVP, we fetch all instead of filtering by assignedTo)
  // We leanly select only the fields needed for the list view to optimize performance
  const customersData = await Customer.find({})
    .select("firstName lastName age city maritalStatus statusTag gender religion")
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB ObjectIds to strings to pass safely to Client Components
  const customers = customersData.map(c => ({
    _id: c._id.toString(),
    firstName: c.firstName,
    lastName: c.lastName,
    age: c.age,
    city: c.city,
    maritalStatus: c.maritalStatus,
    statusTag: c.statusTag,
    gender: c.gender,
    religion: c.religion,
  }));

  // Compute stats for the dashboard cards
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.statusTag === "Active").length,
    matched: customers.filter(c => c.statusTag === "Matched").length,
    meetings: customers.filter(c => c.statusTag === "Meeting Scheduled").length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-800">
          Welcome back 💍
        </h1>
        <p className="text-stone-500 mt-1.5 text-sm">
          Manage your clients, review profiles, and find perfect matches.
        </p>
      </div>

      <CustomerListTable customers={customers} stats={stats} />
    </div>
  );
}
