import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Home, FileText, DollarSign, 
  BarChart2, FileInput, ClipboardCheck, 
  PieChart, FileCog, Users, Settings, HelpCircle 
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[]; // If undefined, shown to all roles
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sidebarNavigation: NavSection[] = [
  {
    title: "Beranda",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: <Home className="h-5 w-5" />,
      }
    ]
  },
  {
    title: "Modul",
    items: [
      {
        title: "Perencanaan",
        href: "/perencanaan",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Penganggaran",
        href: "/penganggaran",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        title: "Pelaksanaan",
        href: "/pelaksanaan",
        icon: <BarChart2 className="h-5 w-5" />,
      },
      {
        title: "Penatausahaan",
        href: "/penatausahaan",
        icon: <FileInput className="h-5 w-5" />,
      },
      {
        title: "Pertanggungjawaban",
        href: "/pertanggungjawaban",
        icon: <ClipboardCheck className="h-5 w-5" />,
      },
      {
        title: "Pelaporan Keuangan",
        href: "/pelaporan",
        icon: <PieChart className="h-5 w-5" />,
      }
    ]
  },
  {
    title: "Lainnya",
    items: [
      {
        title: "Dokumen",
        href: "/dokumen",
        icon: <FileCog className="h-5 w-5" />,
      },
      {
        title: "Pengguna",
        href: "/pengguna",
        icon: <Users className="h-5 w-5" />,
        roles: ["administrator"],
      },
      {
        title: "Pengaturan",
        href: "/pengaturan",
        icon: <Settings className="h-5 w-5" />,
      }
    ]
  }
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { isOpen, toggle, closeSidebar } = useSidebar();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 lg:hidden" 
          onClick={closeSidebar}
        ></div>
      )}
      
      <aside 
        className={cn(
          "w-64 h-screen bg-white border-r border-neutral-200 flex-shrink-0 overflow-y-auto flex flex-col fixed top-0 left-0 z-40 lg:static transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-neutral-200 flex items-center">
          <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold mr-3">e</div>
          <h1 className="text-lg font-semibold">e-BLUD 2025</h1>
        </div>
        
        <nav className="flex-grow">
          {sidebarNavigation.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-6 px-4">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="mt-2 space-y-1">
                {section.items
                  .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                  .map((item, itemIndex) => (
                    <Link 
                      key={itemIndex} 
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          closeSidebar();
                        }
                      }}
                    >
                      <a 
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                          location === item.href 
                            ? "bg-primary/10 text-primary border-l-[3px] border-primary" 
                            : "text-neutral-600 hover:bg-neutral-100"
                        )}
                      >
                        <span 
                          className={cn(
                            "mr-3", 
                            location === item.href 
                              ? "text-primary" 
                              : "text-neutral-500"
                          )}
                        >
                          {item.icon}
                        </span>
                        {item.title}
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <a href="#bantuan" className="flex items-center text-sm text-neutral-500 font-medium hover:text-primary">
            <HelpCircle className="mr-3 h-5 w-5" />
            Pusat Bantuan
          </a>
        </div>
      </aside>
    </>
  );
}
