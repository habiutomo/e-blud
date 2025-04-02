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
import { Loader2, Plus, FileText, Download, ClipboardCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";

const documentsColumns = [
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
    accessorKey: "approvalDate",
    header: "Tanggal Persetujuan",
    cell: ({ row }: any) => row.getValue("approvalDate") ? formatDate(row.getValue("approvalDate")) : "-",
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
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const auditColumns = [
  {
    accessorKey: "userId",
    header: "Pengguna",
    cell: ({ row }: any) => `ID: ${row.getValue("userId")}`,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }: any) => {
      const action = row.getValue("action");
      let actionClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      
      switch (action) {
        case "create":
          actionClass += "bg-green-100 text-green-800";
          break;
        case "update":
          actionClass += "bg-blue-100 text-blue-800";
          break;
        case "delete":
          actionClass += "bg-red-100 text-red-800";
          break;
        default:
          actionClass += "bg-gray-100 text-gray-800";
      }
      
      return <span className={actionClass}>{action.charAt(0).toUpperCase() + action.slice(1)}</span>;
    },
  },
  {
    accessorKey: "entityType",
    header: "Tipe Entitas",
  },
  {
    accessorKey: "entityId",
    header: "ID Entitas",
  },
  {
    accessorKey: "timestamp",
    header: "Waktu",
    cell: ({ row }: any) => formatDate(row.getValue("timestamp")),
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Detail
        </Button>
      );
    },
  },
];

export default function PertanggungjawabanPage() {
  const [selectedTab, setSelectedTab] = useState("documents");
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(new Date());

  // Fetch documents
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ["/api/documents", { type: "accountability" }],
  });

  // Fetch audit trails
  const { data: auditTrails, isLoading: auditLoading, error: auditError } = useQuery({
    queryKey: ["/api/audit-trails"],
  });

  const renderDocumentsContent = () => {
    if (documentsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (documentsError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Error loading documents. Please try again later.
        </div>
      );
    }

    return (
      <DataTable 
        columns={documentsColumns} 
        data={documents || []} 
        searchField="title" 
        searchPlaceholder="Cari dokumen pertanggungjawaban..." 
      />
    );
  };

  const renderAuditContent = () => {
    if (auditLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (auditError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Error loading audit trails. Please try again later.
        </div>
      );
    }

    return (
      <DataTable 
        columns={auditColumns} 
        data={auditTrails || []} 
        searchField="action" 
        searchPlaceholder="Cari aktivitas..." 
      />
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Pertanggungjawaban</h1>
          <p className="text-neutral-500">
            Pengelolaan dokumen pertanggungjawaban dan jejak audit BLUD
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
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
                <DialogTitle>Buat Dokumen Pertanggungjawaban</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Dokumen</Label>
                  <Input id="title" placeholder="Masukkan judul dokumen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Dokumen</Label>
                  <Select defaultValue="lra">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lra">Laporan Realisasi Anggaran</SelectItem>
                      <SelectItem value="lpe">Laporan Perubahan Ekuitas</SelectItem>
                      <SelectItem value="lo">Laporan Operasional</SelectItem>
                      <SelectItem value="lpe">Laporan Perubahan Ekuitas</SelectItem>
                      <SelectItem value="calk">Catatan atas Laporan Keuangan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Tanggal Pengajuan</Label>
                  <DatePicker date={submissionDate} setDate={setSubmissionDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Keterangan</Label>
                  <Textarea id="description" placeholder="Masukkan keterangan" />
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
            <TabsTrigger value="documents">Dokumen Pertanggungjawaban</TabsTrigger>
            <TabsTrigger value="audit">Jejak Audit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                {renderDocumentsContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardContent className="p-6">
                {renderAuditContent()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
