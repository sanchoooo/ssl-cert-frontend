import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // 1. Get the encoded tenantId from the URL
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required." }, { status: 400 });
    }

    // 2. Point to this specific customer's folder
    const tenantDirectory = path.join(process.cwd(), 'data', tenantId);

    // Check if the folder actually exists
    try {
      await fs.access(tenantDirectory);
    } catch {
      // If folder doesn't exist, just return empty data gracefully
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // 3. Get all files in the folder and sort them to find the newest one
    const files = await fs.readdir(tenantDirectory);
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse(); // Reversing puts the newest date (e.g., 2026-03-25.json) at index 0

    if (jsonFiles.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // 4. Read the most recent file
    const latestFile = jsonFiles[0];
    const filePath = path.join(tenantDirectory, latestFile);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const scanData = JSON.parse(fileContents);

    // 5. Decode the tenantId so the frontend knows the real domain name
    const decodedDomain = Buffer.from(tenantId, 'base64url').toString('utf-8');

    return NextResponse.json({
      success: true,
      data: scanData,
      meta: {
        domain: decodedDomain,
        source_file: latestFile,
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}