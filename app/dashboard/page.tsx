import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerListTable } from "@/components/CustomerListTable";

export const dynamic = 'force-dynamic'; // Ensures this page always fetches fresh data

export default async function DashboardPage() {
  await connectDB();

  // Fetch all customers (for MVP, we fetch all instead of filtering by assignedTo)
  // We leanly select only the fields needed for the list view to optimize performance
  const customersData = await Customer.find({})
    .select("firstName lastName age city maritalStatus statusTag")
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
  }));

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Customer List</h1>
        <p className="text-zinc-400 mt-2">
          Manage and review all your assigned matchmaking clients.
        </p>
      </div>

      <CustomerListTable customers={customers} />
    </div>
  );
}
