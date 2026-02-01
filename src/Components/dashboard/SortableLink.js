"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BarChart2, GripVertical, Trash2, AlertCircle, Link as LinkIcon } from "lucide-react";

export default function SortableLink({
  id,
  index,
  link,
  updateLink,
  removeLink,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasUrlError = link.url && !link.url.startsWith("http");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-3 sm:p-5 rounded-2xl border flex gap-3 items-start sm:items-center shadow-sm group touch-manipulation transition-colors ${
        hasUrlError
          ? "bg-red-50/50 border-red-300"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
      role="listitem"
    >
      {/* The Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder link"
        className="cursor-grab active:cursor-grabbing p-2 mt-1 sm:mt-0 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 shrink-0 touch-none"
      >
        <GripVertical size={20} aria-hidden="true" />
      </button>

      <div className="flex-1 space-y-3 min-w-0">
        {/* Title Input */}
        <div className="space-y-1">
          <label htmlFor={`link-title-${id}`} className="sr-only">
            Link Title
          </label>
          <div className="relative">
             <input
              id={`link-title-${id}`}
              type="text"
              value={link.title}
              onChange={(e) => updateLink(index, "title", e.target.value)}
              placeholder="e.g. My Portfolio"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              autoComplete="off"
            />
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-1">
          <label htmlFor={`link-url-${id}`} className="sr-only">
            Link URL
          </label>
          <div className="relative group/input">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <LinkIcon size={14} />
            </div>
            
            <input
              id={`link-url-${id}`}
              type="url"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              placeholder="https://zookly.vercel.app/"
              className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 outline-none transition-all ${
                hasUrlError 
                  ? "border-red-300 focus:ring-2 focus:ring-red-200 text-red-600" 
                  : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
              autoComplete="off"
            />
            
            {hasUrlError && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-red-600 font-bold bg-white/80 px-2 py-0.5 rounded-full shadow-sm border border-red-100 animate-in fade-in zoom-in">
                <AlertCircle size={10} />
                <span className="hidden xs:inline">Fix URL</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics & Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shrink-0 mt-1 sm:mt-0">
        <div
          className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100"
          title={`${link.clicks || 0} total clicks`}
          aria-label={`${link.clicks || 0} clicks`}
        >
          <BarChart2 size={12} aria-hidden="true" />
          <span>{link.clicks || 0}</span>
        </div>

        <button
          type="button"
          onClick={() => removeLink(index, link._id || link.tempId || "")}
          aria-label={`Remove link: ${link.title || "Untitled"}`}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <Trash2 size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}