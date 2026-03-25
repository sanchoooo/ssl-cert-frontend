// app/dashboard/[tenantId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ScanData {
  [key: string]: any;
}

// Browser-compatible base64url decoder
function base64UrlDecode(str: string): string {
  try {
    // Replace URL-safe characters
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '=' signs
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    // Decode and convert to UTF-8
    return decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch (e) {
    console.error("Failed to decode base64url string:", e);
    return '';
  }
}

export default function CertificateDetailsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const [decodedTenantName, setDecodedTenantName] = useState('');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      setDecodedTenantName(base64UrlDecode(tenantId));

      const fetchScanData = async () => {
        try {
          const response = await fetch(`/api/scans?tenantId=${tenantId}`);
          const data = await response.json();
          if (data.success) {
            setScanData(data.data);
          } else {
            throw new Error(data.error || 'Failed to fetch scan data.');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchScanData();
    }
  }, [tenantId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Certificate Details for {decodedTenantName}</h1>
      {scanData ? (
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(scanData, null, 2)}</pre>
      ) : (
        <p>No scan data available.</p>
      )}
    </div>
  );
}
