import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Uncomment when database is connected:
    // const contactMessage = await prisma.contactMessage.create({
    //   data: { name, email, subject, message },
    // });
    // return NextResponse.json(contactMessage, { status: 201 });

    // For now, just log and return success
    console.log("Contact form submission:", { name, email, subject, message });
    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
