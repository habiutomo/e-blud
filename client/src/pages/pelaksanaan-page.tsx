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
import { Loader2, Plus, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const transactionColumns = [
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "transactionDate",
    header: "Tanggal Transaksi",
    cell: ({ row }: any) => formatDate(row.getValue("transactionDate")),
  },
  {
    accessorKey: "type",
    header: "Jenis",
    cell: ({ row }: any) => {
      const type = row.getValue("type");
      let typeClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      
      if (type === "income") {
        typeClass += "bg-green-100 text-green-800";
        return <span className={typeClass}>Pendapatan</span>;
      } else {
        typeClass += "bg-red-100 text-red-800";
        return <span className={typeClass}>Pengeluaran</span>;
      }
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }: any) => {
      const amount = row.getValue("amount");
      const type = row.original.type;
      
      return (
        <div className={type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {type === "income" ? "+" : "-"} {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      let statusClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      
      switch (status) {
        case "pending":
          statusClass += "bg-yellow-100 text-yellow-800";
          break;
        case "approved":
        case "completed":
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
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <Button variant="outline" size="sm">
          Detail
        </Button>
      );
    },
  },
];

const executionData = [
  { name: 'Jan', target: 1000000000, realization: 700000000 },
  { name: 'Feb', target: 1000000000, realization: 950000000 },
  { name: 'Mar', target: 1000000000, realization: 1200000000 },
  { name: 'Apr', target: 1000000000, realization: 1000000000 },
  { name: 'May', target: 1000000000, realization: 1350000000 },
  { name: 'Jun', target: 1000000000, realization: 1500000000 },
  { name: 'Jul', target: 1000000000, realization: 1400000000 },
  { name: 'Aug', target: 1000000000, realization: 1800000000 },
  { name: 'Sep', target: 1000000000, realization: 1350000000 },
  { name: 'Oct', target: 1000000000, realization: 0 },
  { name: 'Nov', target: 1000000000, realization: 0 },
  { name: 'Dec', target: 1000000000, realization: 0 },
];

export default function PelaksanaanPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showNewTransactionDialog, setShowNewTransactionDialog] = useState(false);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date());

  // Fetch transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const renderOverview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Anggaran</p>
                  <p className="text-2xl font-semibold mt-1">Rp 12.500.000.000</p>
                  <p className="text-xs mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    <span className="text-green-600">5.2% dari periode lalu</span>
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Realisasi</p>
                  <p className="text-2xl font-semibold mt-1">Rp 7.800.000.000</p>
                  <p className="text-xs text-neutral-500 mt-1">62.4% dari total anggaran</p>
                </div>
                <div className="p-2 bg-green-50 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Sisa Anggaran</p>
                  <p className="text-2xl font-semibold mt-1">Rp 4.700.000.000</p>
                  <p className="text-xs text-neutral-500 mt-1">37.6% dari total anggaran</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-full">
                  <TrendingDown className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Realisasi vs Target Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={executionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="target" name="Target" fill="#A19F9D" />
                  <Bar dataKey="realization" name="Realisasi" fill="#0078D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTransactions = () => {
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
        columns={transactionColumns} 
        data={transactions || []} 
        searchField="description" 
        searchPlaceholder="Cari transaksi..." 
      />
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Pelaksanaan</h1>
          <p className="text-neutral-500">
            Monitoring pelaksanaan anggaran dan transaksi keuangan BLUD
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih tahun anggaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">Tahun Anggaran 2025</SelectItem>
                <SelectItem value="2024">Tahun Anggaran 2024</SelectItem>
                <SelectItem value="2023">Tahun Anggaran 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showNewTransactionDialog} onOpenChange={setShowNewTransactionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Transaksi Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Transaksi Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Transaksi</Label>
                  <Select defaultValue="expense">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                      <SelectItem value="income">Pendapatan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select defaultValue="operational">
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Belanja Operasional</SelectItem>
                      <SelectItem value="capital">Belanja Modal</SelectItem>
                      <SelectItem value="salary">Belanja Pegawai</SelectItem>
                      <SelectItem value="maintenance">Pemeliharaan</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah</Label>
                  <Input id="amount" placeholder="Masukkan jumlah" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" placeholder="Masukkan deskripsi transaksi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionDate">Tanggal Transaksi</Label>
                  <DatePicker date={transactionDate} setDate={setTransactionDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetPlan">Dokumen Anggaran Terkait</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="budgetPlan">
                      <SelectValue placeholder="Pilih dokumen anggaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">DPA-BLUD 2025</SelectItem>
                      <SelectItem value="2">RKA-BLUD 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewTransactionDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewTransactionDialog(false)}>
                    Simpan Transaksi
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardContent className="p-6">
                {renderTransactions()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
