import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
