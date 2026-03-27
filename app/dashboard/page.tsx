"use client";

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Configuration from '../../components/configuration';
import Link from 'next/link';

// Define types for our data
interface Tenant {
  id: string;
  displayName: string;
}

interface ScanRecord {
  domain: string;
  days_until_expiry: number;
  [key: string]: any; // Allow other properties
}

interface ScanData extends Array<ScanRecord> {}

interface SiteMonitor {
  tenant: Tenant;
  scanData: ScanData | null;
}

const getStatusColor = (days: number) => {
  if (days < 15) return 'bg-red-500';
  if (days < 30) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function AccountOverview() {
  const [monitors, setMonitors] = useState<SiteMonitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async () => {
    setIsLoading(true);
    try {
      const tenantsResponse = await fetch('/api/tenants');
      const tenantsData = await tenantsResponse.json();

      if (!tenantsData.success) {
        throw new Error('Failed to fetch tenants.');
      }

      const siteMonitors: SiteMonitor[] = await Promise.all(
        tenantsData.tenants.map(async (tenant: Tenant) => {
          const scanResponse = await fetch(`/api/scans?tenantId=${tenant.id}`);
          const scanData = await scanResponse.json();
          return {
            tenant,
            scanData: scanData.success ? scanData.data : null,
          };
        })
      );

      setMonitors(siteMonitors);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-8">
          Account Overview
        </h1>

        <section id="monitored-sites">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">Monitored Sites</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitors.map((monitor) => (
              <Link href={`/dashboard/${monitor.tenant.id}`} key={monitor.tenant.id}>
                <div className="p-4 border rounded-lg h-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <h3 className="font-bold text-lg mb-2">{monitor.tenant.displayName}</h3>
                  {monitor.scanData && monitor.scanData.length > 0 ? (
                    monitor.scanData.map((scan) => (
                      <div key={scan.domain} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(scan.days_until_expiry)}`}></span>
                          <span>{scan.domain}</span>
                        </div>
                        <span className="font-medium">{scan.days_until_expiry} days</span>
                      </div>
                    ))
                  ) : (
                    <p>No scan data available.</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="configuration" className="mt-12">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">Configuration</h2>
          <Configuration onMonitorAdded={fetchMonitors} />
        </section>
      </main>
    </div>
  );
}
