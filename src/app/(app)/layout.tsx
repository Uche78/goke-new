import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AppNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
