"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Defined the type based on the Mongoose schema we created
export type CustomerListType = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  maritalStatus: string;
  statusTag: string;
};

export function CustomerListTable({ customers }: { customers: CustomerListType[] }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20";
      case "Active":
        return "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20";
      case "Matched":
        return "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20";
      case "Meeting Scheduled":
        return "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20";
      case "Closed":
        return "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20";
    }
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Age</TableHead>
            <TableHead className="text-zinc-400">City</TableHead>
            <TableHead className="text-zinc-400">Marital Status</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow 
                key={customer._id}
                className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/dashboard/customer/${customer._id}`)}
              >
                <TableCell className="font-medium text-zinc-100">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell className="text-zinc-300">{customer.age}</TableCell>
                <TableCell className="text-zinc-300">{customer.city}</TableCell>
                <TableCell className="text-zinc-300">{customer.maritalStatus}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(customer.statusTag)}>
                    {customer.statusTag}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
