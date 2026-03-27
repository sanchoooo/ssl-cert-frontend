// app/api/configuration/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const getTenantConfigPath = (tenantId: string) => {
    if (!tenantId) {
        throw new Error("Tenant ID is required.");
    }
    // Basic validation to prevent directory traversal
    if (tenantId.includes('..')) {
        throw new Error("Invalid Tenant ID.");
    }
    return path.join(process.cwd(), 'data', tenantId, 'config.json');
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
        return NextResponse.json({ success: false, message: 'Tenant ID is required.' }, { status: 400 });
    }

    try {
        const configPath = getTenantConfigPath(tenantId);
        
        try {
            await fs.access(configPath);
            const fileContents = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(fileContents);
            return NextResponse.json({ success: true, data: config });
        } catch {
            // If file doesn't exist, return a default/empty config
            const defaultConfig = { ports: [443], domains: [] };
            return NextResponse.json({ success: true, data: defaultConfig });
        }
    } catch (error: any) {
        console.error("Failed to read configuration:", error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { tenantId, config } = await request.json();

    if (!tenantId || !config) {
        return NextResponse.json({ success: false, message: 'Tenant ID and config are required.' }, { status: 400 });
    }

    try {
        const configPath = getTenantConfigPath(tenantId);
        const fileContents = JSON.stringify(config, null, 2);
        
        await fs.writeFile(configPath, fileContents, 'utf8');
        
        return NextResponse.json({ success: true, message: 'Configuration saved successfully.' });
    } catch (error: any) {
        console.error("Failed to save configuration:", error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
