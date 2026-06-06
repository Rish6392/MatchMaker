import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  User as UserIcon,
  Heart,
  Calendar,
  Phone,
  Mail,
  Home,
  Utensils,
  Cigarette,
  Wine,
  Sparkles
} from "lucide-react";
import { NotesSection } from "@/components/NotesSection";

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  New: "bg-sky-50 text-sky-700 border-sky-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Matched: "bg-purple-50 text-purple-700 border-purple-200",
  "Meeting Scheduled": "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-stone-100 text-stone-500 border-stone-200",
};

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "Not specified";
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

function InfoField({ label, value, icon: Icon, iconColor = "text-stone-400" }: {
  label: string;
  value: string | number | undefined;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        {label}
      </p>
      <p className="text-sm font-medium text-stone-700">
        {value || "Not specified"}
      </p>
    </div>
  );
}

export default async function CustomerDetailPage(props: CustomerPageProps) {
  const params = await props.params;
  const { id } = params;

  await connectDB();

  const customer = await Customer.findById(id).lean();

  if (!customer) {
    notFound();
  }

  // Calculate formatted Date of Birth if exists
  const dobString = customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : "Not specified";

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Navigation & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-stone-500 hover:text-rose-primary transition-colors font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-xl"
          >
            Edit Status
          </Button>
          <Link href={`/dashboard/customer/${id}/matches`}>
            <Button className="bg-gradient-to-r from-rose-primary to-rose-600 hover:from-rose-700 hover:to-rose-700 text-white border-0 shadow-lg shadow-rose-primary/20 rounded-xl">
              <Sparkles className="mr-2 h-4 w-4" />
              Find Match
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Profile Header */}
      <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in-up stagger-1">
        <div className="h-28 bg-gradient-to-r from-rose-lightest via-rose-50 to-gold-light/40 w-full relative">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(#C2185B 0.5px, transparent 0.5px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-end -mt-12">
            <div
              className={`h-24 w-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl overflow-hidden relative border-4 border-white ${
                customer.gender === "Female"
                  ? "bg-gradient-to-br from-rose-primary to-rose-400 text-white"
                  : "bg-gradient-to-br from-sky-600 to-sky-400 text-white"
              }`}
            >
              {customer.firstName?.[0]}{customer.lastName?.[0]}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl font-bold text-stone-800 tracking-tight">
                  {customer.firstName} {customer.lastName}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    statusColors[customer.statusTag] || statusColors.Closed
                  }`}
                >
                  {customer.statusTag}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-stone-400" />
                  {customer.gender}, {customer.age} yrs
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-stone-400" />
                  {customer.city}, {customer.country}
                </span>
                {customer.designation && customer.currentCompany && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-stone-400" />
                    {customer.designation} at {customer.currentCompany}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Main Info) */}
        <div className="md:col-span-2 space-y-6">

          {/* Education & Career */}
          <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-2">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-50">
                  <GraduationCap className="h-4.5 w-4.5 text-sky-600" />
                </div>
                Education & Profession
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5">
              <InfoField label="Degree" value={customer.degree} />
              <InfoField label="College / University" value={customer.undergraduateCollege} />
              <InfoField label="Current Role" value={customer.designation} />
              <InfoField label="Company" value={customer.currentCompany} />
              <InfoField label="Annual Income" value={formatCurrency(customer.annualIncome || customer.income)} />
            </CardContent>
          </Card>

          {/* Family & Cultural Background */}
          <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-3">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <Home className="h-4.5 w-4.5 text-amber-600" />
                </div>
                Family & Cultural Background
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5">
              <InfoField label="Religion" value={customer.religion} />
              <InfoField label="Caste" value={customer.caste} />
              <InfoField label="Mother Tongue" value={customer.motherTongue} />
              <InfoField label="Manglik Status" value={customer.manglik} />
              <InfoField label="Family Type" value={customer.familyType} />
              <InfoField
                label="Siblings"
                value={customer.siblings !== undefined ? customer.siblings : "Not specified"}
              />
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Languages Known
                </p>
                <div className="flex flex-wrap gap-2">
                  {customer.languagesKnown && customer.languagesKnown.length > 0 ? (
                    customer.languagesKnown.map((lang: string, i: number) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-stone-50 border-stone-200 text-stone-600 font-medium text-xs"
                      >
                        {lang}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-stone-400 font-medium">None specified</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences & Lifestyle */}
          <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-4">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-50">
                  <Heart className="h-4.5 w-4.5 text-rose-primary" />
                </div>
                Preferences & Lifestyle
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5">
              <InfoField label="Want Kids" value={customer.wantKids} />
              <InfoField label="Open to Relocate" value={customer.openToRelocate} />
              <InfoField label="Open to Pets" value={customer.openToPets} />
              <InfoField label="Diet" value={customer.dietPreference} icon={Utensils} iconColor="text-amber-500" />
              <InfoField label="Smoking" value={customer.smoking} icon={Cigarette} iconColor="text-stone-400" />
              <InfoField label="Drinking" value={customer.drinking} icon={Wine} iconColor="text-purple-400" />
            </CardContent>
          </Card>

          {/* Quick Notes Section */}
          <NotesSection customerId={id} />
        </div>

        {/* Right Column (Side Info) */}
        <div className="space-y-6">

          {/* Contact Details */}
          <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-2">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-50">
                  <Mail className="h-4 w-4 text-rose-primary" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-stone-700 break-all">{customer.email || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50">
                  <Phone className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-stone-700">{customer.phoneNumber || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-3">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Personal Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-sm font-medium text-stone-700">{dobString}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-50">
                  <UserIcon className="h-4 w-4 text-sky-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Height</p>
                  <p className="text-sm font-medium text-stone-700">{customer.height ? `${customer.height} cm` : "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-50">
                  <Heart className="h-4 w-4 text-rose-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Marital Status</p>
                  <p className="text-sm font-medium text-stone-700">{customer.maritalStatus || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
