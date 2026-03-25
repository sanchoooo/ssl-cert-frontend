// app/api/tenants/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data');
    const items = await fs.readdir(dataDirectory, { withFileTypes: true });
    
    const tenants = items
      .filter(item => item.isDirectory())
      .map(dir => {
        // dir.name is the Base64Url encoded folder (e.g., d3d3LmRpc...)
        // We decode it back to plain text for the user interface
        const decodedName = Buffer.from(dir.name, 'base64url').toString('utf-8');
        
        return {
          id: dir.name,           // The encoded folder name (used for safe routing)
          displayName: decodedName // The real domain name (used for display)
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return NextResponse.json({ success: true, tenants });
  } catch (error) {
    console.error("Failed to read tenant folders:", error);
    return NextResponse.json({ success: false, tenants: [] }, { status: 500 });
  }
}