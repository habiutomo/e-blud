import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Loader2, Plus, FileText, Download, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const columns = [
  {
    accessorKey: "title",
    header: "Judul Dokumen",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: "Jenis",
  },
  {
    accessorKey: "department",
    header: "Departemen",
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

export default function DokumenPage() {
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);
  const [documentDate, setDocumentDate] = useState<Date | undefined>(new Date());
  
  // Filter states
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch documents
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["/api/documents"],
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
          Error loading documents. Please try again later.
        </div>
      );
    }

    // Apply filters
    let filteredDocuments = documents || [];
    
    if (searchTerm) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (documentTypeFilter.length > 0) {
      filteredDocuments = filteredDocuments.filter(doc => 
        documentTypeFilter.includes(doc.type)
      );
    }
    
    if (statusFilter.length > 0) {
      filteredDocuments = filteredDocuments.filter(doc => 
        statusFilter.includes(doc.status)
      );
    }

    return (
      <DataTable 
        columns={columns} 
        data={filteredDocuments} 
        searchField="title" 
        searchPlaceholder="Cari dokumen..." 
      />
    );
  };

  const documentTypes = [
    "RBA", "RKA", "DPA", "SPJ", "SPP", "LRA", "LO", "LPE", "CALK"
  ];

  const statuses = [
    "draft", "submitted", "approved", "rejected"
  ];

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Dokumen</h1>
          <p className="text-neutral-500">
            Manajemen dokumen keuangan dan administrasi BLUD
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Input 
              placeholder="Cari dokumen..." 
              className="w-full sm:w-80" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Jenis</span>
                    {documentTypeFilter.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-white">
                        {documentTypeFilter.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Jenis Dokumen</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {documentTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={documentTypeFilter.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDocumentTypeFilter([...documentTypeFilter, type]);
                        } else {
                          setDocumentTypeFilter(
                            documentTypeFilter.filter((item) => item !== type)
                          );
                        }
                      }}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                    {statusFilter.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-white">
                        {statusFilter.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Status Dokumen</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, status]);
                        } else {
                          setStatusFilter(
                            statusFilter.filter((item) => item !== status)
                          );
                        }
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Dialog open={showNewDocumentDialog} onOpenChange={setShowNewDocumentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Dokumen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Dokumen Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Dokumen</Label>
                  <Input id="title" placeholder="Masukkan judul dokumen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Dokumen</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Input id="department" placeholder="Masukkan departemen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentDate">Tanggal Dokumen</Label>
                  <DatePicker date={documentDate} setDate={setDocumentDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:underline">
                          <span>Upload file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, Excel, Word up to 10MB</p>
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

        <Card>
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
        </Card>
      </AppLayout>
    </SidebarProvider>
  );
}
