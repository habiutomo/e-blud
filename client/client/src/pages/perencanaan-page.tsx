import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Plus, Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BudgetPlan } from "@shared/schema";

const columns = [
  {
    accessorKey: "title",
    header: "Judul Dokumen",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "fiscalYear",
    header: "Tahun Anggaran",
  },
  {
    accessorKey: "totalAmount",
    header: "Jumlah Anggaran",
    cell: ({ row }: any) => formatCurrency(row.getValue("totalAmount")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      let statusClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      
      switch (status) {
        case "draft":
          statusClass += "bg-gray-100 text-gray-800";
          break;
        case "submitted":
          statusClass += "bg-yellow-100 text-yellow-800";
          break;
        case "approved":
          statusClass += "bg-green-100 text-green-800";
          break;
        case "rejected":
          statusClass += "bg-red-100 text-red-800";
          break;
        default:
          statusClass += "bg-blue-100 text-blue-800";
      }
      
      return <span className={statusClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Pembuatan",
    cell: ({ row }: any) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Detail
          </Button>
        </div>
      );
    },
  },
];

export default function PerencanaanPage() {
  const [selectedTab, setSelectedTab] = useState("rba");
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Fetch budget plans
  const { data: budgetPlans, isLoading, error } = useQuery({
    queryKey: ["/api/budget-plans", { fiscalYear: 2025 }],
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
          Error loading data. Please try again later.
        </div>
      );
    }

    return (
      <DataTable 
        columns={columns} 
        data={budgetPlans || []} 
        searchField="title" 
        searchPlaceholder="Cari dokumen rencana..." 
      />
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Perencanaan</h1>
          <p className="text-neutral-500">
            Kelola dokumen perencanaan anggaran BLUD (RBA, RKA, dan rencana bisnis)
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Dokumen Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Dokumen Perencanaan Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Dokumen</Label>
                  <Input id="title" placeholder="Masukkan judul dokumen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Dokumen</Label>
                  <Select defaultValue="rba">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rba">Rencana Bisnis Anggaran (RBA)</SelectItem>
                      <SelectItem value="rka">Rencana Kerja Anggaran (RKA)</SelectItem>
                      <SelectItem value="business-plan">Rencana Bisnis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYear">Tahun Anggaran</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="fiscalYear">
                      <SelectValue placeholder="Pilih tahun anggaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Periode</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-xs">Mulai</Label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-xs">Selesai</Label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Anggaran</Label>
                  <Input id="totalAmount" placeholder="Masukkan total anggaran" type="number" />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewPlanDialog(false)}>
                    Buat Dokumen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle>Dokumen Perencanaan</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="rba">RBA</TabsTrigger>
                <TabsTrigger value="rka">RKA</TabsTrigger>
                <TabsTrigger value="business-plan">Rencana Bisnis</TabsTrigger>
              </TabsList>
              <TabsContent value="rba">
                {renderContent()}
              </TabsContent>
              <TabsContent value="rka">
                {renderContent()}
              </TabsContent>
              <TabsContent value="business-plan">
                {renderContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AppLayout>
    </SidebarProvider>
  );
}
