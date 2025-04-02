import { useState } from "react";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Lock, User, BellRing, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";

export default function PengaturanPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("account");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Pengaturan</h1>
          <p className="text-neutral-500">
            Kelola pengaturan akun dan preferensi sistem
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Akun
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="h-4 w-4 mr-2" />
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellRing className="h-4 w-4 mr-2" />
              Notifikasi
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>
                  Perbarui informasi profil dan preferensi akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username} disabled />
                  <p className="text-xs text-neutral-500 mt-1">
                    Username tidak dapat diubah setelah pendaftaran.
                  </p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ''} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="department">Departemen/SKPD</Label>
                  <Input id="department" defaultValue={user?.department} />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="role">Peran/Jabatan</Label>
                  <Input id="role" defaultValue={
                    user?.role === "administrator" ? "Administrator" :
                    user?.role === "keuangan" ? "Staff Keuangan" :
                    user?.role === "pimpinan" ? "Pimpinan BLUD" : user?.role
                  } disabled />
                  <p className="text-xs text-neutral-500 mt-1">
                    Peran ditentukan oleh administrator sistem.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
                <CardDescription>
                  Perbarui password akun Anda untuk keamanan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showCurrentPassword ? "text" : "password"} 
                      placeholder="Masukkan password saat ini" 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <div className="relative">
                    <Input 
                      id="new-password" 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Masukkan password baru" 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, dan angka.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <div className="relative">
                    <Input 
                      id="confirm-password" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Konfirmasi password baru" 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Perbarui Password
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
                <CardDescription>
                  Kelola preferensi notifikasi untuk akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Notifikasi Email</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-dokumen" className="text-base">Dokumen Baru</Label>
                        <p className="text-sm text-neutral-500">Terima notifikasi ketika ada dokumen baru</p>
                      </div>
                      <Switch id="email-dokumen" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-approval" className="text-base">Persetujuan Dokumen</Label>
                        <p className="text-sm text-neutral-500">Terima notifikasi tentang status persetujuan dokumen</p>
                      </div>
                      <Switch id="email-approval" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-anggaran" className="text-base">Perubahan Anggaran</Label>
                        <p className="text-sm text-neutral-500">Terima notifikasi tentang perubahan anggaran</p>
                      </div>
                      <Switch id="email-anggaran" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Notifikasi Sistem</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-login" className="text-base">Aktivitas Login</Label>
                        <p className="text-sm text-neutral-500">Terima notifikasi untuk aktivitas login ke akun Anda</p>
                      </div>
                      <Switch id="system-login" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-transaksi" className="text-base">Transaksi Baru</Label>
                        <p className="text-sm text-neutral-500">Terima notifikasi untuk transaksi baru</p>
                      </div>
                      <Switch id="system-transaksi" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-reminder" className="text-base">Pengingat Deadline</Label>
                        <p className="text-sm text-neutral-500">Terima pengingat untuk tenggat waktu yang akan datang</p>
                      </div>
                      <Switch id="system-reminder" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Preferensi
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AppLayout>
    </SidebarProvider>
  );
}
