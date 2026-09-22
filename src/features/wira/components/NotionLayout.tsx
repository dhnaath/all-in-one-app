import { useState, useEffect, useRef, ReactNode } from "react";
import {
  ChevronRight,
  ChevronDown,
  Menu,
  Plus,
  Search,
  Settings,
  FileText,
  LayoutDashboard,
  CheckSquare,
  Users,
  DollarSign,
  Receipt,
  ChevronLeft,
} from "lucide-react";
import { cn } from "../lib/utils";

type NavItem = {
  id: string;
  title: string;
  icon?: any;
  children?: NavItem[];
};

const initialNavData: NavItem[] = [
  {
    id: "notes",
    title: "Personal Workspace",
    icon: FileText,
    children: [
      { id: "notes-meeting", title: "Meeting Notes", icon: FileText },
      { id: "notes-ideas", title: "Project Ideas", icon: FileText },
      { id: "notes-journal", title: "Daily Journal", icon: FileText },
    ],
  },
  {
    id: "docs",
    title: "Team Documentation",
    icon: FileText,
    children: [
      { id: "docs-onboarding", title: "Onboarding", icon: FileText },
      { id: "docs-guidelines", title: "Design Guidelines", icon: FileText },
    ],
  },
];

interface NotionLayoutProps {
  children: ReactNode;
  activeId: string;
  onNavigate: (id: string) => void;
  onBack?: () => void;
}

export function NotionLayout({ children, activeId, onNavigate, onBack }: NotionLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth > 768 : true,
  );
  const [isResizing, setIsResizing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    notes: true,
  });
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 480) newWidth = 480;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = activeId === item.id;
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={cn(
            "group flex items-center min-h-[28px] text-[14px] px-2 py-1 mx-2 rounded-sm cursor-pointer hover:bg-background-hover transition-colors",
            isActive ? "bg-background-hover text-foreground font-medium" : "text-muted-foreground",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => onNavigate(item.id)}
        >
          <div
            className="w-5 h-5 flex items-center justify-center mr-1 rounded-sm hover:bg-accent/50 cursor-pointer"
            onClick={(e) => hasChildren && toggleExpand(item.id, e)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown size={14} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground" />
              )
            ) : (
              item.icon && <item.icon size={16} className="text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 truncate">{item.title}</div>

          {hasChildren && (
            <div
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-accent/50 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); /* Add new child logic here */
              }}
            >
              <Plus size={14} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>{item.children!.map((child) => renderNavItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  // Build Breadcrumb path
  const getBreadcrumb = () => {
    let path: NavItem[] = [];
    const findPath = (items: NavItem[], currentPath: NavItem[]): boolean => {
      for (const item of items) {
        if (item.id === activeId) {
          path = [...currentPath, item];
          return true;
        }
        if (item.children && findPath(item.children, [...currentPath, item])) {
          return true;
        }
      }
      return false;
    };
    findPath(initialNavData, []);
    return path;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden selection:bg-primary/20 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: isSidebarOpen ? sidebarWidth : 0 }}
        className={cn(
          "absolute md:relative z-50 h-full flex-shrink-0 bg-muted/50 flex flex-col transition-all duration-300 ease-in-out border-r border-border",
          !isSidebarOpen
            ? "opacity-0 invisible overflow-hidden border-none -translate-x-full md:translate-x-0"
            : "translate-x-0 opacity-100 visible",
        )}
      >
        {/* Resize Handle (Desktop Only) */}
        <div
          className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 transition-colors z-50"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Workspace Switcher */}
        <div className="h-12 flex items-center px-4 mb-2 hover:bg-accent/50 cursor-pointer transition-colors group mt-2 md:mt-0">
          <div className="w-5 h-5 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-2">
            S
          </div>
          <div className="font-medium text-sm truncate flex-1">Solopreneur's Notion</div>
          <div className="opacity-100 md:opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(false);
              }}
              className="hover:bg-accent/50 rounded-sm p-0.5 text-muted-foreground focus:outline-none"
              title="Close sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 mb-4 space-y-0.5">
          <div className="flex items-center text-[14px] text-muted-foreground px-2 py-1 rounded-sm cursor-pointer hover:bg-background-hover transition-colors">
            <Search size={16} className="mr-2" /> Search
          </div>
          <div className="flex items-center text-[14px] text-muted-foreground px-2 py-1 rounded-sm cursor-pointer hover:bg-background-hover transition-colors">
            <Settings size={16} className="mr-2" /> Settings & members
          </div>
          <div className="flex items-center text-[14px] text-muted-foreground px-2 py-1 rounded-sm cursor-pointer hover:bg-background-hover transition-colors">
            <Plus size={16} className="mr-2" /> New page
          </div>
        </div>

        {/* Navigation Tree */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
          <div className="px-4 text-xs font-semibold text-muted-foreground mb-1">WORKSPACE</div>
          {initialNavData.map((item) => renderNavItem(item))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative transition-all duration-300 ease-in-out w-full">
        {/* Top Header & Breadcrumb */}
        <header className="h-12 flex items-center px-4 justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center text-[14px]">
            {!isSidebarOpen && (
              <div
                className="w-8 h-8 flex items-center justify-center mr-2 rounded-sm cursor-pointer hover:bg-background-hover text-muted-foreground"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center">
              {breadcrumb.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  {index > 0 && <span className="mx-1.5 text-gray-300">/</span>}
                  <div className="flex items-center px-1.5 py-0.5 rounded-sm hover:bg-background-hover cursor-pointer transition-colors text-muted-foreground">
                    {item.icon && <item.icon size={16} className="mr-1.5" />}
                    <span className="truncate max-w-[150px]">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center text-muted-foreground gap-2">
            <div className="text-[14px] px-2 py-1 rounded-sm cursor-pointer hover:bg-background-hover transition-colors">
              Share
            </div>
            <div className="p-1 rounded-sm cursor-pointer hover:bg-background-hover transition-colors">
              <Settings size={18} />
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <main className={cn("flex-1 overflow-y-auto", activeId === "tasks" ? "flex flex-col" : "")}>
          {activeId === "tasks" ? (
            <div className="flex-1 w-full h-full">{children}</div>
          ) : (
            <div className="max-w-[900px] mx-auto px-12 py-10 pb-32">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}
