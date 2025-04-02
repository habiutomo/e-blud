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
import { Loader2, Plus, FileText, Download, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const reportsColumns = [
  {
    accessorKey: "title",
    header: "Laporan",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: "Jenis",
  },
  {
    accessorKey: "periodValue",
    header: "Periode",
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
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const revenueExpenseData = [
  { name: 'Jan', pendapatan: 800000000, belanja: 700000000 },
  { name: 'Feb', pendapatan: 950000000, belanja: 850000000 },
  { name: 'Mar', pendapatan: 1200000000, belanja: 1100000000 },
  { name: 'Apr', pendapatan: 1100000000, belanja: 1000000000 },
  { name: 'May', pendapatan: 1400000000, belanja: 1350000000 },
  { name: 'Jun', pendapatan: 1500000000, belanja: 1400000000 },
  { name: 'Jul', pendapatan: 1450000000, belanja: 1350000000 },
  { name: 'Aug', pendapatan: 1800000000, belanja: 1700000000 },
  { name: 'Sep', pendapatan: 1350000000, belanja: 1300000000 },
];

const trendData = [
  { name: 'Q1 2023', realisasi: 68 },
  { name: 'Q2 2023', realisasi: 72 },
  { name: 'Q3 2023', realisasi: 75 },
  { name: 'Q4 2023', realisasi: 80 },
  { name: 'Q1 2024', realisasi: 73 },
  { name: 'Q2 2024', realisasi: 78 },
  { name: 'Q3 2024', realisasi: 82 },
  { name: 'Q4 2024', realisasi: 87 },
  { name: 'Q1 2025', realisasi: 79 },
  { name: 'Q2 2025', realisasi: 82 },
];

export default function PelaporanPage() {
  const [selectedTab, setSelectedTab] = useState("reports");
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [reportDate, setReportDate] = useState<Date | undefined>(new Date());

  // Fetch reports
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["/api/reports"],
  });

  const renderReportsContent = () => {
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
          Error loading reports. Please try again later.
        </div>
      );
    }

    return (
      <DataTable 
        columns={reportsColumns} 
        data={reports || []} 
        searchField="title" 
        searchPlaceholder="Cari laporan..." 
      />
    );
  };

  const renderAnalyticsContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pendapatan vs Belanja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueExpenseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="pendapatan" name="Pendapatan" fill="#0078D4" />
                    <Bar dataKey="belanja" name="Belanja" fill="#A19F9D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tren Realisasi Anggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="realisasi" 
                      name="Persentase Realisasi" 
                      stroke="#0078D4" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kinerja Keuangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm font-medium text-neutral-500">Total Pendapatan</div>
                <div className="text-2xl font-semibold text-primary mt-1">Rp 8.725.000.000</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  +8.2% dari tahun lalu
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm font-medium text-neutral-500">Total Belanja</div>
                <div className="text-2xl font-semibold text-primary mt-1">Rp 7.850.000.000</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  +5.4% dari tahun lalu
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm font-medium text-neutral-500">Surplus/Defisit</div>
                <div className="text-2xl font-semibold text-green-600 mt-1">Rp 875.000.000</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  +10.1% dari tahun lalu
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm font-medium text-neutral-500">Realisasi Anggaran</div>
                <div className="text-2xl font-semibold text-primary mt-1">82.4%</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  +4.3% dari tahun lalu
                </div>
              </div>
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
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Pelaporan Keuangan</h1>
          <p className="text-neutral-500">
            Kelola laporan keuangan dan analisis kinerja BLUD
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">Tahun 2025</SelectItem>
                <SelectItem value="2024">Tahun 2024</SelectItem>
                <SelectItem value="2023">Tahun 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Laporan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Laporan Keuangan Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Laporan</Label>
                  <Input id="title" placeholder="Masukkan judul laporan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Laporan</Label>
                  <Select defaultValue="financial">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Laporan Keuangan</SelectItem>
                      <SelectItem value="performance">Laporan Kinerja</SelectItem>
                      <SelectItem value="accountability">Laporan Pertanggungjawaban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Periode</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="quarterly">Triwulan</SelectItem>
                      <SelectItem value="semester">Semester</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodValue">Nilai Periode</Label>
                  <Select defaultValue="september-2025">
                    <SelectTrigger id="periodValue">
                      <SelectValue placeholder="Pilih nilai periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="september-2025">September 2025</SelectItem>
                      <SelectItem value="august-2025">Agustus 2025</SelectItem>
                      <SelectItem value="q3-2025">Q3 2025</SelectItem>
                      <SelectItem value="s1-2025">Semester I 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportDate">Tanggal Laporan</Label>
                  <DatePicker date={reportDate} setDate={setReportDate} />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewReportDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewReportDialog(false)}>
                    Buat Laporan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Daftar Laporan
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Analisis Keuangan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                {renderReportsContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            {renderAnalyticsContent()}
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
