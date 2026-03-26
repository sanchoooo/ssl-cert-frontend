// app/dashboard/[tenantId]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditConfigurationPage() {
    const params = useParams();
    const router = useRouter();
    const tenantId = params.tenantId as string;
    
    const [config, setConfig] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (tenantId) {
            const fetchConfig = async () => {
                try {
                    const response = await fetch(`/api/configuration?tenantId=${tenantId}`);
                    const data = await response.json();
                    if (data.success) {
                        setConfig(JSON.stringify(data.data, null, 2));
                    } else {
                        throw new Error(data.message || 'Failed to fetch configuration.');
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchConfig();
        }
    }, [tenantId]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const parsedConfig = JSON.parse(config);
            const response = await fetch('/api/configuration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, config: parsedConfig }),
            });
            const result = await response.json();
            setSaveMessage(result.message);
            if(response.ok) {
                setTimeout(() => router.back(), 1000);
            }
        } catch (err: any) {
            setSaveMessage('Invalid JSON format or failed to save.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Configuration</h1>
            <textarea
                className="w-full h-64 p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
            />
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
                {isSaving ? 'Saving...' : 'Save'}
            </button>
            {saveMessage && <p className="mt-2">{saveMessage}</p>}
        </div>
    );
}
