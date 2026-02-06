import { createClient } from "@/lib/supabase/server";

export default async function DiagnosticPage() {
    try {
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Auth Error</h1>
                    <pre className="bg-red-100 p-4 rounded">{JSON.stringify(authError, null, 2)}</pre>
                </div>
            );
        }

        if (!authData.user) {
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
                    <p>No user found. Please login first.</p>
                    <a href="/login" className="text-blue-600 underline">Go to Login</a>
                </div>
            );
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

        return (
            <div className="p-8 space-y-6">
                <h1 className="text-3xl font-bold">🔍 Diagnostic Report</h1>

                <div className="bg-green-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">✅ User Authenticated</h2>
                    <p><strong>Email:</strong> {authData.user.email}</p>
                    <p><strong>ID:</strong> {authData.user.id}</p>
                    <p><strong>Email Confirmed:</strong> {authData.user.email_confirmed_at ? "Yes" : "No"}</p>
                </div>

                {profileError && (
                    <div className="bg-red-100 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">❌ Profile Error</h2>
                        <pre>{JSON.stringify(profileError, null, 2)}</pre>
                    </div>
                )}

                {profile ? (
                    <div className="bg-blue-100 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">✅ Profile Found</h2>
                        <pre className="text-sm">{JSON.stringify(profile, null, 2)}</pre>
                    </div>
                ) : (
                    <div className="bg-yellow-100 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">⚠️ No Profile Found</h2>
                        <p>The user account exists but has no profile in the database.</p>
                        <p className="mt-2">This is the root cause of the white screen!</p>
                    </div>
                )}

                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">📋 Next Steps</h2>
                    <ol className="list-decimal ml-6 space-y-2">
                        <li>Run the migration script: <code className="bg-gray-200 px-2 py-1 rounded">scripts/002_add_full_name_to_profiles.sql</code></li>
                        <li>If profile is missing, create it manually in Supabase</li>
                        <li>Refresh the dashboard</li>
                    </ol>
                </div>

                <div className="mt-6">
                    <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Try Dashboard Again
                    </a>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">💥 Unexpected Error</h1>
                <pre className="bg-red-100 p-4 rounded">{JSON.stringify(error, null, 2)}</pre>
            </div>
        );
    }
}

