import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { PendingDocuments } from "@/components/dashboard/pending-documents";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/hooks/use-sidebar";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Error loading dashboard data. Please try again later.
        </div>
      );
    }

    if (!data) return null;

    const { 
      budgetOverview, 
      budgetDistribution,
      monthlyRealization,
      recentTransactions,
      pendingDocuments
    } = data;

    const realizationPercentage = (budgetOverview.realization / budgetOverview.totalBudget) * 100;

    return (
      <>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Anggaran"
            value={budgetOverview.totalBudget}
            type="budget"
            changeValue={5.2}
            changeText="5.2% dari periode lalu"
          />
          <OverviewCard
            title="Realisasi"
            value={budgetOverview.realization}
            type="realization"
          />
          <OverviewCard
            title="Sisa Anggaran"
            value={budgetOverview.remaining}
            type="remaining"
          />
          <OverviewCard
            title="Dokumen"
            value={budgetOverview.documentCount}
            type="document"
            isPendingValue={pendingDocuments.length}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BudgetChart data={monthlyRealization} />
          </div>
          <div>
            <DistributionChart 
              data={budgetDistribution} 
              realizationPercentage={realizationPercentage}
            />
          </div>
        </div>

        {/* Recent Transactions & Pending Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions transactions={recentTransactions} />
          <PendingDocuments documents={pendingDocuments} />
        </div>
      </>
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Dashboard</h1>
          <p className="text-neutral-500">
            Selamat datang, <span>{user?.name}</span>. Berikut ringkasan data keuangan terkini.
          </p>
        </div>
        
        {renderContent()}
      </AppLayout>
    </SidebarProvider>
  );
}
