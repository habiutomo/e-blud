import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import PerencanaanPage from "@/pages/perencanaan-page";
import PenganggaranPage from "@/pages/penganggaran-page";
import PelaksanaanPage from "@/pages/pelaksanaan-page";
import PenatausahaanPage from "@/pages/penatausahaan-page";
import PertanggungjawabanPage from "@/pages/pertanggungjawaban-page";
import PelaporanPage from "@/pages/pelaporan-page";
import DokumenPage from "@/pages/dokumen-page";
import PenggunaPage from "@/pages/pengguna-page";
import PengaturanPage from "@/pages/pengaturan-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/perencanaan" component={PerencanaanPage} />
      <ProtectedRoute path="/penganggaran" component={PenganggaranPage} />
      <ProtectedRoute path="/pelaksanaan" component={PelaksanaanPage} />
      <ProtectedRoute path="/penatausahaan" component={PenatausahaanPage} />
      <ProtectedRoute path="/pertanggungjawaban" component={PertanggungjawabanPage} />
      <ProtectedRoute path="/pelaporan" component={PelaporanPage} />
      <ProtectedRoute path="/dokumen" component={DokumenPage} />
      <ProtectedRoute path="/pengguna" component={PenggunaPage} />
      <ProtectedRoute path="/pengaturan" component={PengaturanPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
