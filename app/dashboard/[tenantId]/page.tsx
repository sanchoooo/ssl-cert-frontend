'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { base64UrlDecode } from '../../../lib/utils';

interface ScanData {
  [key: string]: any;
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
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Certificate Details for {decodedTenantName}</h1>
            <Link href={`/dashboard/${tenantId}/edit`}>
                <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 cursor-pointer">
                    Edit Configuration
                </span>
            </Link>
        </div>
      {scanData ? (
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(scanData, null, 2)}</pre>
      ) : (
        <p>No scan data available.</p>
      )}
    </div>
  );
}
