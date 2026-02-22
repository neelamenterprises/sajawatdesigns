import { getSession } from "@/lib/admin-actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSession();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar userEmail={user?.email} />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
