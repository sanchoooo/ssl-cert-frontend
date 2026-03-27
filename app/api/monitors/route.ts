// app/api/monitors/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { type, target, ports } = await request.json();

    // Basic validation
    if (!type || !target) {
      return NextResponse.json({ message: "Monitor type and target are required." }, { status: 400 });
    }

    // Encode the target to create a safe folder name
    const encodedTarget = Buffer.from(target, 'utf-8').toString('base64url');
    const dataDirectory = path.join(process.cwd(), 'data', encodedTarget);

    // Create the directory if it doesn't exist
    await fs.mkdir(dataDirectory, { recursive: true });

    // Here you would typically trigger a scan or add to a scanning queue.
    // For this example, we'll just log it.
    console.log(`Monitor added: Type=${type}, Target=${target}, Ports=${ports}`);
    
    // You could also create an initial placeholder file if you want.
    const initialData = {
      status: "pending",
      details: "Awaiting first scan.",
      configured_at: new Date().toISOString(),
      type,
      target,
      ports
    };
    const today = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dataDirectory, `${today}.json`);
    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));


    return NextResponse.json({ message: "Monitor added successfully." }, { status: 201 });
  } catch (error) {
    console.error("Failed to add monitor:", error);
    return NextResponse.json({ message: "Failed to add monitor." }, { status: 500 });
  }
}
