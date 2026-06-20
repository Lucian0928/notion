import { Sidebar } from "./components/Sidebar";
import { Providers } from "./providers";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar />
        {children}
      </div>
    </Providers>
  );
}
