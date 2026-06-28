import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hm-workspace-shell">
      <Sidebar />
      <main className="hm-workspace-main">
        {children}
      </main>
    </div>
  );
}
