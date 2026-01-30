import { SuperAdminSidebar } from "@/components/SuperAdminSidebar";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SuperAdminSidebar />
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
}
