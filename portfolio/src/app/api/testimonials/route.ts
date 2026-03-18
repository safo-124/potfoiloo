import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({ data: body });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
