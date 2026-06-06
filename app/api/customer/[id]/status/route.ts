import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { statusTag } = body;

    if (!statusTag) {
      return NextResponse.json({ error: "Missing statusTag" }, { status: 400 });
    }

    await connectDB();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { statusTag },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
