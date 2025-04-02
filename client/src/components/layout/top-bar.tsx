import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function TopBar() {
  const { user, logoutMutation } = useAuth();
  const { toggle } = useSidebar();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggle} className="text-neutral-500">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center lg:justify-start">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-neutral-500" />
          </div>
          <Input 
            className="pl-10 pr-3 py-2 rounded-md bg-neutral-100 border-neutral-200 focus:bg-white w-full"
            placeholder="Cari dokumen, transaksi..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-neutral-500 hover:bg-neutral-100"
        >
          <Bell className="h-6 w-6" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="rounded-full p-0 hover:bg-neutral-100 h-10 w-10 overflow-hidden"
            >
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.department}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/pengaturan" className="cursor-pointer">Pengaturan Akun</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
