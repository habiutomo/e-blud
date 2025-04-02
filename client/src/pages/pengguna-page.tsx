import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Eye, EyeOff, UserPlus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const columns = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: "Nama Lengkap",
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "role",
    header: "Peran",
    cell: ({ row }: any) => {
      const role = row.getValue("role");
      let roleClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      
      switch (role) {
        case "administrator":
          roleClass += "bg-purple-100 text-purple-800";
          break;
        case "keuangan":
          roleClass += "bg-blue-100 text-blue-800";
          break;
        case "pimpinan":
          roleClass += "bg-green-100 text-green-800";
          break;
        default:
          roleClass += "bg-gray-100 text-gray-800";
      }
      
      const roleLabels: Record<string, string> = {
        "administrator": "Administrator",
        "keuangan": "Staff Keuangan",
        "pimpinan": "Pimpinan BLUD"
      };
      
      return <span className={roleClass}>{roleLabels[role] || role}</span>;
    },
  },
  {
    accessorKey: "department",
    header: "Departemen/SKPD",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }: any) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus pengguna "{row.original.name}"? 
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default function PenggunaPage() {
  const { user } = useAuth();
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is admin
  if (user?.role !== "administrator") {
    return (
      <SidebarProvider>
        <AppLayout>
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md mx-auto p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg
                    className="h-8 w-8 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-center">Akses Terbatas</h2>
                <p className="text-center text-neutral-500">
                  Anda tidak memiliki akses ke halaman ini. Halaman ini hanya dapat diakses oleh Administrator.
                </p>
              </div>
            </Card>
          </div>
        </AppLayout>
      </SidebarProvider>
    );
  }

  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["/api/users"],
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
          Error loading users. Please try again later.
        </div>
      );
    }

    return (
      <DataTable 
        columns={columns} 
        data={users || []} 
        searchField="name" 
        searchPlaceholder="Cari pengguna..." 
      />
    );
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Manajemen Pengguna</h1>
          <p className="text-neutral-500">
            Kelola akun pengguna dan akses sistem e-BLUD
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Pengguna
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                <DialogDescription>
                  Buat akun pengguna baru untuk mengakses sistem e-BLUD
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Masukkan username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" placeholder="Masukkan nama lengkap" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Masukkan email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Masukkan password" 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select defaultValue="keuangan">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="keuangan">Staff Keuangan</SelectItem>
                      <SelectItem value="pimpinan">Pimpinan BLUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departemen/SKPD</Label>
                  <Input id="department" placeholder="Masukkan departemen" />
                </div>
                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setShowNewUserDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={() => setShowNewUserDialog(false)}>
                    Simpan Pengguna
                  </Button>
                </DialogFooter>
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
