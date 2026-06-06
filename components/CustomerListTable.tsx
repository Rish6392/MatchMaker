"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  Heart,
  CalendarCheck,
  Search,
  Filter,
  X,
  ChevronRight,
} from "lucide-react";

// Defined the type based on the Mongoose schema we created
export type CustomerListType = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  maritalStatus: string;
  statusTag: string;
  gender: string;
  religion: string;
};

type StatsType = {
  total: number;
  active: number;
  matched: number;
  meetings: number;
};

const statusColors: Record<string, string> = {
  New: "bg-sky-50 text-sky-700 border-sky-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Matched: "bg-purple-50 text-purple-700 border-purple-200",
  "Meeting Scheduled": "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-stone-100 text-stone-500 border-stone-200",
};

const statCards = [
  {
    label: "Total Customers",
    key: "total" as keyof StatsType,
    icon: Users,
    gradient: "from-rose-50 to-rose-100/50",
    iconBg: "bg-rose-primary/10",
    iconColor: "text-rose-primary",
  },
  {
    label: "Active Profiles",
    key: "active" as keyof StatsType,
    icon: UserCheck,
    gradient: "from-emerald-50 to-emerald-100/50",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    label: "Matches Sent",
    key: "matched" as keyof StatsType,
    icon: Heart,
    gradient: "from-purple-50 to-purple-100/50",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    label: "Meetings Scheduled",
    key: "meetings" as keyof StatsType,
    icon: CalendarCheck,
    gradient: "from-amber-50 to-amber-100/50",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
];

export function CustomerListTable({
  customers,
  stats,
}: {
  customers: CustomerListType[];
  stats: StatsType;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterReligion, setFilterReligion] = useState("all");
  const [filterMarital, setFilterMarital] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  // Extract unique values for filter dropdowns
  const cities = useMemo(
    () => [...new Set(customers.map((c) => c.city).filter(Boolean))].sort(),
    [customers]
  );
  const religions = useMemo(
    () => [...new Set(customers.map((c) => c.religion).filter(Boolean))].sort(),
    [customers]
  );
  const maritalStatuses = useMemo(
    () => [...new Set(customers.map((c) => c.maritalStatus).filter(Boolean))].sort(),
    [customers]
  );
  const statuses = useMemo(
    () => [...new Set(customers.map((c) => c.statusTag).filter(Boolean))].sort(),
    [customers]
  );

  // Apply all filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = filterCity === "all" || c.city === filterCity;
      const matchesReligion = filterReligion === "all" || c.religion === filterReligion;
      const matchesMarital = filterMarital === "all" || c.maritalStatus === filterMarital;
      const matchesStatus = filterStatus === "all" || c.statusTag === filterStatus;
      const matchesGender = filterGender === "all" || c.gender === filterGender;

      return matchesSearch && matchesCity && matchesReligion && matchesMarital && matchesStatus && matchesGender;
    });
  }, [customers, searchQuery, filterCity, filterReligion, filterMarital, filterStatus, filterGender]);

  const hasActiveFilters =
    filterCity !== "all" ||
    filterReligion !== "all" ||
    filterMarital !== "all" ||
    filterStatus !== "all" ||
    filterGender !== "all";

  const clearFilters = () => {
    setFilterCity("all");
    setFilterReligion("all");
    setFilterMarital("all");
    setFilterStatus("all");
    setFilterGender("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.key}
            className={`premium-card bg-gradient-to-br ${card.gradient} rounded-2xl border border-white/60 p-5 animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-stone-800 mt-2 font-heading">
                  {stats[card.key]}
                </p>
              </div>
              <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-sm animate-fade-in-up stagger-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-stone-50/80 border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus-visible:ring-rose-primary/30 focus-visible:border-rose-primary/40"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>

          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl bg-stone-50 border-stone-200 text-stone-600">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-[150px] h-9 text-xs rounded-xl bg-stone-50 border-stone-200 text-stone-600">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterReligion} onValueChange={setFilterReligion}>
            <SelectTrigger className="w-[150px] h-9 text-xs rounded-xl bg-stone-50 border-stone-200 text-stone-600">
              <SelectValue placeholder="Religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Religions</SelectItem>
              {religions.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterMarital} onValueChange={setFilterMarital}>
            <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl bg-stone-50 border-stone-200 text-stone-600">
              <SelectValue placeholder="Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {maritalStatuses.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[170px] h-9 text-xs rounded-xl bg-stone-50 border-stone-200 text-stone-600">
              <SelectValue placeholder="Status Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-primary hover:text-rose-primary/80 font-medium transition-colors ml-auto"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-stone-500">
          Showing <span className="font-semibold text-stone-700">{filteredCustomers.length}</span> of {customers.length} profiles
        </p>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden animate-fade-in-up stagger-6">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-100 hover:bg-transparent bg-stone-50/80">
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider pl-5">
                Profile
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider">
                Age
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider">
                City
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Religion
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Marital Status
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-stone-500 font-semibold text-xs uppercase tracking-wider w-10">
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-stone-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-600">No profiles found</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-rose-primary hover:underline font-medium mt-1"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer._id}
                  className="border-stone-100 hover:bg-rose-lightest/30 cursor-pointer transition-colors group"
                  onClick={() => router.push(`/dashboard/customer/${customer._id}`)}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm ${
                          customer.gender === "Female"
                            ? "bg-gradient-to-br from-rose-soft to-rose-lightest text-rose-primary"
                            : "bg-gradient-to-br from-sky-100 to-sky-50 text-sky-700"
                        }`}
                      >
                        {customer.firstName?.[0]}
                        {customer.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {customer.gender}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-stone-600">{customer.age}</TableCell>
                  <TableCell className="text-sm text-stone-600">{customer.city}</TableCell>
                  <TableCell className="text-sm text-stone-600 hidden md:table-cell">{customer.religion}</TableCell>
                  <TableCell className="text-sm text-stone-600 hidden sm:table-cell">{customer.maritalStatus}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold ${
                        statusColors[customer.statusTag] || statusColors.Closed
                      }`}
                    >
                      {customer.statusTag}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-rose-primary transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
