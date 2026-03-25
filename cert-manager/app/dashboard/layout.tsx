// app/dashboard/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li>
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              Account Overview
            </Link>
          </li>
          {/* Add more navigation links here as needed */}
        </ul>
      </nav>
      <main className="flex-1 p-8 bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
