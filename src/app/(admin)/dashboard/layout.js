import Sidebar from "@/Components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 w-full pt-20 px-4 pb-24 md:p-10 md:pb-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
