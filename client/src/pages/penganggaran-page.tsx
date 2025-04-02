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
import { Loader2, Plus, FileText, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const columns = [
  {
    accessorKey: "title",
    header: "Dokumen Anggaran",
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
    accessorKey: "updatedAt",
    header: "Terakhir Diperbarui",
    cell: ({ row }: any) => formatDate(row.getValue("updatedAt")),
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const mockBudgetDistribution = [
  { name: "Program Kesehatan", value: 45, color: "#0078D4" },
  { name: "Pendidikan", value: 25, color: "#2B88D8" },
  { name: "Administrasi", value: 20, color: "#106EBE" },
  { name: "Lainnya", value: 10, color: "#A19F9D" },
];

export default function PenganggaranPage() {
  const [selectedTab, setSelectedTab] = useState("dokumen");
  const [showNewBudgetDialog, setShowNewBudgetDialog] = useState(false);

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
        searchPlaceholder="Cari dokumen anggaran..." 
      />
    );
  };

  const renderBudgetDistribution = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Anggaran 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockBudgetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockBudgetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Total Anggaran:</div>
                  <div className="text-2xl font-semibold text-primary">Rp 12.500.000.000</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Tahun Anggaran:</div>
                  <div className="text-2xl font-semibold">2025</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Alokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Belanja Pegawai</div>
                  <div className="text-sm font-medium">35%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Belanja Barang & Jasa</div>
                  <div className="text-sm font-medium">45%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Belanja Modal</div>
                  <div className="text-sm font-medium">15%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Belanja Lainnya</div>
                  <div className="text-sm font-medium">5%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Laporan Alokasi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Penganggaran</h1>
          <p className="text-neutral-500">
            Kelola alokasi anggaran dan dokumen penganggaran BLUD
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
          <Dialog open={showNewBudgetDialog} onOpenChange={setShowNewBudgetDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Anggaran Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Dokumen Anggaran Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Dokumen</Label>
                  <Input id="title" placeholder="Masukkan judul dokumen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Dokumen</Label>
                  <Select defaultValue="dpa">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dpa">DPA-BLUD</SelectItem>
                      <SelectItem value="rka">RKA-BLUD</SelectItem>
                      <SelectItem value="other">Dokumen Lainnya</SelectItem>
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
                  <Label htmlFor="totalAmount">Total Anggaran</Label>
                  <Input id="totalAmount" placeholder="Masukkan total anggaran" type="number" />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewBudgetDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewBudgetDialog(false)}>
                    Buat Dokumen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dokumen">Dokumen Anggaran</TabsTrigger>
            <TabsTrigger value="distribusi">Distribusi Anggaran</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dokumen">
            <Card>
              <CardContent className="p-6">
                {renderContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribusi">
            {renderBudgetDistribution()}
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
