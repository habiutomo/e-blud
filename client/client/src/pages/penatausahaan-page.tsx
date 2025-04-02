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
import { Loader2, Plus, FileText, Upload, Download, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";

const spjColumns = [
  {
    accessorKey: "title",
    header: "Dokumen",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: "Jenis",
  },
  {
    accessorKey: "submissionDate",
    header: "Tanggal Pengajuan",
    cell: ({ row }: any) => formatDate(row.getValue("submissionDate")),
  },
  {
    accessorKey: "content.amount",
    header: "Nilai",
    cell: ({ row }: any) => {
      const content = row.original.content;
      return content && content.amount ? formatCurrency(content.amount) : "-";
    },
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
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Detail
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const sppColumns = [
  {
    accessorKey: "title",
    header: "Dokumen",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: "Jenis",
  },
  {
    accessorKey: "submissionDate",
    header: "Tanggal Pengajuan",
    cell: ({ row }: any) => formatDate(row.getValue("submissionDate")),
  },
  {
    accessorKey: "content.amount",
    header: "Nilai",
    cell: ({ row }: any) => {
      const content = row.original.content;
      return content && content.amount ? formatCurrency(content.amount) : "-";
    },
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
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Detail
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function PenatausahaanPage() {
  const [selectedTab, setSelectedTab] = useState("spj");
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(new Date());

  // Fetch documents
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["/api/documents"],
  });

  const renderContent = (documentsType: string) => {
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

    const filteredDocs = documents?.filter(doc => 
      documentsType === "spj" 
        ? doc.type.includes("SPJ") 
        : doc.type.includes("SPP")
    ) || [];

    const columns = documentsType === "spj" ? spjColumns : sppColumns;

    return (
      <DataTable 
        columns={columns} 
        data={filteredDocs} 
        searchField="title" 
        searchPlaceholder={`Cari dokumen ${documentsType.toUpperCase()}...`} 
      />
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Penatausahaan</h1>
          <p className="text-neutral-500">
            Kelola dokumen administrasi keuangan BLUD (SPJ, SPP, dan dokumen terkait)
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
          <Dialog open={showNewDocumentDialog} onOpenChange={setShowNewDocumentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Dokumen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Dokumen Penatausahaan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Dokumen</Label>
                  <Input id="title" placeholder="Masukkan judul dokumen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Dokumen</Label>
                  <Select defaultValue="spj-tu">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spj-tu">SPJ-TU</SelectItem>
                      <SelectItem value="spj-ls">SPJ-LS</SelectItem>
                      <SelectItem value="spp-up">SPP-UP</SelectItem>
                      <SelectItem value="spp-gu">SPP-GU</SelectItem>
                      <SelectItem value="spp-tu">SPP-TU</SelectItem>
                      <SelectItem value="spp-ls">SPP-LS</SelectItem>
                      <SelectItem value="spp-nihil">SPP-Nihil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Nilai</Label>
                  <Input id="amount" placeholder="Masukkan nilai dokumen" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Tanggal Pengajuan</Label>
                  <DatePicker date={submissionDate} setDate={setSubmissionDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Keterangan</Label>
                  <Input id="description" placeholder="Masukkan keterangan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:underline">
                          <span>Upload file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, Excel up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewDocumentDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewDocumentDialog(false)}>
                    Simpan Dokumen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="spj">SPJ (Surat Pertanggungjawaban)</TabsTrigger>
            <TabsTrigger value="spp">SPP (Surat Permintaan Pembayaran)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spj">
            <Card>
              <CardContent className="p-6">
                {renderContent("spj")}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="spp">
            <Card>
              <CardContent className="p-6">
                {renderContent("spp")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
