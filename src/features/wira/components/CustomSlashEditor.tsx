import { useState, useRef, KeyboardEvent, FormEvent } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  CheckSquare,
  Type,
  GripVertical,
  Image as ImageIcon,
  ChevronRight,
  MessageSquare,
  Quote,
  Sparkles,
  Code,
  FileText,
  MousePointerClick,
  Table,
  Minus,
  Link,
  ListTree,
  Repeat,
  Video,
  Music,
  File,
  Bookmark,
  HardDrive,
  FileJson,
  LayoutGrid,
  Menu,
  Rss,
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  Map,
  BarChart,
  BarChartHorizontal,
  LineChart,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "../lib/utils";

type BlockType =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "todo"
  | "bullet"
  | "number"
  | "image"
  | "toggle"
  | "callout"
  | "quote"
  | "ai-notes"
  | "html-artifact"
  | "ask-ai"
  | "summarize"
  | "button-list"
  | "page"
  | "table"
  | "divider"
  | "link"
  | "toc"
  | "synced-block"
  | "video"
  | "audio"
  | "code-snippet"
  | "file"
  | "bookmark"
  | "drive"
  | "pdf"
  | "db-table"
  | "db-board"
  | "db-gallery"
  | "db-list"
  | "db-feed"
  | "db-dashboard"
  | "db-calendar"
  | "db-timeline"
  | "db-map"
  | "diagram-bar"
  | "diagram-hbar"
  | "diagram-line";
type Block = {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean;
  toggled?: boolean;
};

const MENU_OPTIONS = [
  // Suggested & AI
  {
    id: "ai-notes",
    label: "AI meeting notes",
    icon: Sparkles,
    desc: "Generate notes from a meeting.",
    category: "Suggested & AI",
  },
  {
    id: "html-artifact",
    label: "HTML Artifact",
    icon: Code,
    desc: "Embed HTML artifacts.",
    category: "Suggested & AI",
  },
  {
    id: "ask-ai",
    label: "Ask AI",
    icon: Sparkles,
    desc: "Write, edit, or ask Notion AI.",
    category: "Suggested & AI",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: FileText,
    desc: "Summarize the whole page.",
    category: "Suggested & AI",
  },

  // Basic Blocks
  {
    id: "p",
    label: "Text",
    icon: Type,
    desc: "Just start writing with plain text.",
    category: "Basic Blocks",
  },
  {
    id: "h1",
    label: "Heading 1",
    icon: Heading1,
    desc: "Large section heading.",
    category: "Basic Blocks",
  },
  {
    id: "h2",
    label: "Heading 2",
    icon: Heading2,
    desc: "Medium section heading.",
    category: "Basic Blocks",
  },
  {
    id: "h3",
    label: "Heading 3",
    icon: Heading3,
    desc: "Small section heading.",
    category: "Basic Blocks",
  },
  {
    id: "h4",
    label: "Heading 4",
    icon: Heading4,
    desc: "Extra small section heading.",
    category: "Basic Blocks",
  },
  {
    id: "todo",
    label: "To-do List",
    icon: CheckSquare,
    desc: "Track tasks with a checkbox.",
    category: "Basic Blocks",
  },
  {
    id: "bullet",
    label: "Bullet List",
    icon: List,
    desc: "Create a simple bulleted list.",
    category: "Basic Blocks",
  },
  {
    id: "number",
    label: "Numbered List",
    icon: ListOrdered,
    desc: "Create a list with numbering.",
    category: "Basic Blocks",
  },
  {
    id: "button-list",
    label: "Button List",
    icon: MousePointerClick,
    desc: "Add clickable buttons.",
    category: "Basic Blocks",
  },
  {
    id: "page",
    label: "Page",
    icon: FileText,
    desc: "Create a sub-page.",
    category: "Basic Blocks",
  },
  {
    id: "callout",
    label: "Callout",
    icon: MessageSquare,
    desc: "Make text stand out.",
    category: "Basic Blocks",
  },
  { id: "quote", label: "Quote", icon: Quote, desc: "Capture a quote.", category: "Basic Blocks" },
  { id: "table", label: "Table", icon: Table, desc: "Simple table.", category: "Basic Blocks" },
  {
    id: "divider",
    label: "Divider",
    icon: Minus,
    desc: "Visually divide blocks.",
    category: "Basic Blocks",
  },
  {
    id: "link",
    label: "Link to page",
    icon: Link,
    desc: "Link to another page.",
    category: "Basic Blocks",
  },
  {
    id: "toggle",
    label: "Toggle List",
    icon: ChevronRight,
    desc: "Toggles can hide/show content.",
    category: "Basic Blocks",
  },
  {
    id: "toc",
    label: "Table of Contents",
    icon: ListTree,
    desc: "Show all headings.",
    category: "Basic Blocks",
  },
  {
    id: "synced-block",
    label: "Synced Block",
    icon: Repeat,
    desc: "Sync content across pages.",
    category: "Basic Blocks",
  },

  // Media
  {
    id: "image",
    label: "Image",
    icon: ImageIcon,
    desc: "Upload or embed with a link.",
    category: "Media & Integrations",
  },
  {
    id: "video",
    label: "Video",
    icon: Video,
    desc: "Embed from YouTube, Vimeo...",
    category: "Media & Integrations",
  },
  {
    id: "audio",
    label: "Audio",
    icon: Music,
    desc: "Embed from SoundCloud...",
    category: "Media & Integrations",
  },
  {
    id: "code-snippet",
    label: "Code",
    icon: Code,
    desc: "Capture a code snippet.",
    category: "Media & Integrations",
  },
  {
    id: "file",
    label: "File",
    icon: File,
    desc: "Upload a file or embed.",
    category: "Media & Integrations",
  },
  {
    id: "bookmark",
    label: "Web Bookmark",
    icon: Bookmark,
    desc: "Save a link as a bookmark.",
    category: "Media & Integrations",
  },
  {
    id: "drive",
    label: "Google Drive",
    icon: HardDrive,
    desc: "Embed Google Drive files.",
    category: "Media & Integrations",
  },
  {
    id: "pdf",
    label: "PDF",
    icon: FileJson,
    desc: "Embed a PDF.",
    category: "Media & Integrations",
  },

  // Database
  {
    id: "db-table",
    label: "Table View",
    icon: Table,
    desc: "Add a table view.",
    category: "Database",
  },
  {
    id: "db-board",
    label: "Board View",
    icon: LayoutGrid,
    desc: "Add a board view.",
    category: "Database",
  },
  {
    id: "db-gallery",
    label: "Gallery View",
    icon: ImageIcon,
    desc: "Add a gallery view.",
    category: "Database",
  },
  { id: "db-list", label: "List View", icon: Menu, desc: "Add a list view.", category: "Database" },
  { id: "db-feed", label: "Feed View", icon: Rss, desc: "Add a feed view.", category: "Database" },
  {
    id: "db-dashboard",
    label: "Dashboard View",
    icon: LayoutDashboard,
    desc: "Add a dashboard view.",
    category: "Database",
  },
  {
    id: "db-calendar",
    label: "Calendar View",
    icon: Calendar,
    desc: "Add a calendar view.",
    category: "Database",
  },
  {
    id: "db-timeline",
    label: "Timeline View",
    icon: GanttChartSquare,
    desc: "Add a timeline view.",
    category: "Database",
  },
  { id: "db-map", label: "Map View", icon: Map, desc: "Add a map view.", category: "Database" },
  {
    id: "diagram-bar",
    label: "Bar Diagram",
    icon: BarChart,
    desc: "Add a bar diagram.",
    category: "Database",
  },
  {
    id: "diagram-hbar",
    label: "Horizontal Bar Diagram",
    icon: BarChartHorizontal,
    desc: "Add a horizontal bar diagram.",
    category: "Database",
  },
  {
    id: "diagram-line",
    label: "Line Diagram",
    icon: LineChart,
    desc: "Add a line diagram.",
    category: "Database",
  },
];

export function CustomSlashEditor() {
  // 1. State Management untuk Blok & Slash Menu
  const [blocks, setBlocks] = useState<Block[]>([{ id: "1", type: "p", content: "" }]);

  const [slashMenu, setSlashMenu] = useState({
    isOpen: false,
    blockIndex: -1,
    x: 0,
    y: 0,
    selectedIndex: 0,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 2. Intercept Input / Deteksi ketikan "/"
  const handleInput = (e: FormEvent<HTMLDivElement>, index: number) => {
    const text = e.currentTarget.textContent || "";
    blocks[index].content = text; // Mutable update to prevent cursor jumping

    if (text.endsWith("/")) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Kalkulasi posisi kursor (caret) relatif terhadap container editor
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

        setSlashMenu({
          isOpen: true,
          blockIndex: index,
          x: rect.left - editorRect.left,
          y: rect.bottom - editorRect.top + 5, // 5px di bawah kursor
          selectedIndex: 0,
        });
      }
    } else if (slashMenu.isOpen) {
      setSlashMenu((prev) => ({ ...prev, isOpen: false }));
    }
  };

  // 3. Logika Navigasi Keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    // Jika Slash Menu terbuka, intercept tombol navigasi
    if (slashMenu.isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex + 1) % MENU_OPTIONS.length,
        }));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length,
        }));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        applySlashCommand(MENU_OPTIONS[slashMenu.selectedIndex].id as BlockType);
        return;
      }
      if (e.key === "Escape") {
        setSlashMenu((prev) => ({ ...prev, isOpen: false }));
        return;
      }
    }

    // Perilaku normal (Enter untuk blok baru, Backspace hapus blok)
    if (e.key === "Enter" && !e.shiftKey && !slashMenu.isOpen) {
      e.preventDefault();
      const newBlock: Block = { id: Date.now().toString(), type: "p", content: "" };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      setTimeout(() => blockRefs.current[index + 1]?.focus(), 0);
    }

    if (e.key === "Backspace" && blocks[index].content === "" && index > 0) {
      e.preventDefault();
      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      setBlocks(newBlocks);
      setTimeout(() => {
        const prev = blockRefs.current[index - 1];
        if (prev) {
          prev.focus();
          // Kembalikan kursor ke akhir baris
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(prev);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  // 4. Eksekusi Command (Ubah tipe blok & Hapus "/")
  const applySlashCommand = (type: BlockType) => {
    const index = slashMenu.blockIndex;
    const newBlocks = [...blocks];

    // Hapus karakter "/" dari ujung string
    const content = blockRefs.current[index]?.textContent || "";
    newBlocks[index].content = content.slice(0, -1);
    newBlocks[index].type = type;

    setBlocks(newBlocks);
    setSlashMenu((prev) => ({ ...prev, isOpen: false }));

    // Reset posisi kursor
    setTimeout(() => {
      if (blockRefs.current[index]) {
        blockRefs.current[index]!.textContent = newBlocks[index].content;
        blockRefs.current[index]?.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(blockRefs.current[index]!);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  };

  // 5. Logika Drag and Drop (Penataan ulang array)
  const onDragEnd = (result: DropResult) => {
    // Jika di-drop di luar droppable area, jangan lakukan apa-apa
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Jika posisi tidak berubah
    if (sourceIndex === destinationIndex) return;

    // Buat salinan array blocks (Immutability)
    const newBlocks = Array.from(blocks);

    // Hapus blok dari posisi aslinya
    const [reorderedItem] = newBlocks.splice(sourceIndex, 1);

    // Sisipkan blok ke posisi yang baru
    newBlocks.splice(destinationIndex, 0, reorderedItem);

    // Update state dengan susunan baru
    setBlocks(newBlocks);
  };

  const toggleCheck = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks[index].completed = !newBlocks[index].completed;
    setBlocks(newBlocks);
  };

  const toggleExpand = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks[index].toggled = !newBlocks[index].toggled;
    setBlocks(newBlocks);
  };

  return (
    <div className="relative w-full text-notion-text" ref={editorRef}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, i) => {
                // Determine block styling and prefix
                let blockClass = "text-[16px] min-h-[24px] py-1";
                let prefix = null;

                if (block.type === "h1") blockClass = "text-4xl font-bold mt-6 mb-4";
                else if (block.type === "h2") blockClass = "text-3xl font-bold mt-5 mb-3";
                else if (block.type === "h3") blockClass = "text-2xl font-bold mt-4 mb-2";
                else if (block.type === "h4")
                  blockClass = "text-xl font-bold mt-3 mb-1 text-card-foreground";
                else if (block.type === "quote")
                  blockClass =
                    "text-lg italic border-l-4 border-slate-800 pl-4 py-2 my-2 text-card-foreground";
                else if (block.type === "callout")
                  blockClass = "text-[15px] bg-blue-50 p-4 rounded-lg my-2 flex-1";

                if (block.type === "todo") {
                  prefix = (
                    <div
                      onClick={() => toggleCheck(i)}
                      className={cn(
                        "mr-3 mt-1.5 w-5 h-5 border rounded flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors",
                        block.completed
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-border bg-card",
                      )}
                    >
                      {block.completed && <CheckSquare size={14} className="opacity-0 absolute" />}
                      {block.completed && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  );
                } else if (block.type === "bullet") {
                  prefix = (
                    <div className="mr-4 mt-3 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  );
                } else if (block.type === "number") {
                  prefix = (
                    <div className="mr-3 mt-1.5 font-medium text-muted-foreground w-5 flex-shrink-0 select-none">
                      {i + 1}.
                    </div>
                  );
                } else if (block.type === "toggle") {
                  prefix = (
                    <div
                      onClick={() => toggleExpand(i)}
                      className="mr-2 mt-1.5 w-5 h-5 flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-muted rounded text-muted-foreground transition-transform"
                      style={{ transform: block.toggled ? "rotate(90deg)" : "none" }}
                    >
                      <ChevronRight size={18} />
                    </div>
                  );
                } else if (block.type === "callout") {
                  prefix = <div className="mr-3 mt-4 text-xl">💡</div>;
                }

                if (
                  [
                    "image",
                    "video",
                    "audio",
                    "file",
                    "bookmark",
                    "drive",
                    "pdf",
                    "db-table",
                    "db-board",
                    "db-gallery",
                    "db-list",
                    "db-feed",
                    "db-dashboard",
                    "db-calendar",
                    "db-timeline",
                    "db-map",
                    "diagram-bar",
                    "diagram-hbar",
                    "diagram-line",
                    "code-snippet",
                    "ai-notes",
                    "html-artifact",
                    "page",
                    "table",
                    "synced-block",
                  ].includes(block.type)
                ) {
                  let Icon = ImageIcon;
                  const placeholder = "Click to configure block";
                  if (block.type === "video") Icon = Video;
                  else if (block.type === "audio") Icon = Music;
                  else if (block.type === "file") Icon = File;
                  else if (block.type === "pdf") Icon = FileJson;
                  else if (block.type === "code-snippet") Icon = Code;
                  else if (block.type.startsWith("db-")) Icon = LayoutGrid;
                  else if (block.type.startsWith("diagram-")) Icon = BarChart;
                  else if (block.type === "page") Icon = FileText;

                  return (
                    <Draggable key={block.id} draggableId={block.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group relative flex items-start mb-4",
                            snapshot.isDragging && "opacity-50",
                          )}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="opacity-0 group-hover:opacity-100 w-8 flex items-center justify-center text-muted-foreground/70 mt-1 cursor-grab active:cursor-grabbing select-none mr-1 hover:bg-muted rounded-sm"
                            title="Drag to move"
                          >
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1 border border-border rounded-lg bg-muted/30 flex flex-col items-center justify-center p-8 text-muted-foreground hover:bg-muted transition-colors cursor-pointer group-hover:border-border">
                            <Icon size={24} className="mb-2 text-muted-foreground/70" />
                            <span className="text-sm font-medium">{block.type} block</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                }

                if (block.type === "divider") {
                  return (
                    <Draggable key={block.id} draggableId={block.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group relative flex items-center py-2",
                            snapshot.isDragging && "opacity-50",
                          )}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="opacity-0 group-hover:opacity-100 w-8 flex items-center justify-center text-muted-foreground/70 cursor-grab active:cursor-grabbing select-none mr-1 hover:bg-muted rounded-sm"
                            title="Drag to move"
                          >
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1 h-px bg-accent"></div>
                        </div>
                      )}
                    </Draggable>
                  );
                }

                return (
                  <Draggable key={block.id} draggableId={block.id} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group relative flex items-start mb-1",
                          // Efek visual halus saat sebuah blok sedang di-drag
                          snapshot.isDragging &&
                            "bg-blue-50/50 opacity-90 shadow-sm rounded-md ring-1 ring-blue-200 z-10",
                        )}
                      >
                        {/* Block Drag Handle (Notion style 6-dots) */}
                        <div
                          {...provided.dragHandleProps}
                          className="opacity-0 group-hover:opacity-100 w-8 flex items-center justify-center text-muted-foreground/70 mt-1 cursor-grab active:cursor-grabbing select-none mr-1 hover:bg-muted rounded-sm"
                          title="Drag to move"
                        >
                          <GripVertical size={16} />
                        </div>

                        {prefix}

                        {/* Content Editable Area */}
                        <div
                          ref={(el) => {
                            if (el) blockRefs.current[i] = el;
                          }}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => handleInput(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          className={cn(
                            "flex-1 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300",
                            blockClass,
                            block.completed &&
                              block.type === "todo" &&
                              "text-muted-foreground/70 line-through",
                          )}
                          data-placeholder={
                            block.type === "p"
                              ? "Type '/' for commands"
                              : block.type === "toggle"
                                ? "Toggle"
                                : ""
                          }
                        >
                          {block.content}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Slash Menu Popover Element */}
      {slashMenu.isOpen && (
        <div
          className="absolute z-50 w-72 bg-card rounded-lg shadow-xl border border-notion-border py-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          style={{ left: slashMenu.x, top: slashMenu.y }}
        >
          {MENU_OPTIONS.map((opt, i) => {
            const showCategory = i === 0 || MENU_OPTIONS[i - 1].category !== opt.category;
            return (
              <div key={opt.id}>
                {showCategory && (
                  <div className="px-3 pb-2 pt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card z-10">
                    {opt.category}
                  </div>
                )}
                <div
                  onClick={() => applySlashCommand(opt.id as BlockType)}
                  className={cn(
                    "flex items-center px-3 py-2 cursor-pointer transition-colors",
                    i === slashMenu.selectedIndex ? "bg-muted" : "hover:bg-muted/30",
                  )}
                >
                  <div className="w-10 h-10 border border-border rounded-md bg-card flex items-center justify-center mr-3 text-muted-foreground shrink-0">
                    <opt.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
