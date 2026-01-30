"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BarChart2, GripVertical, Trash2 } from "lucide-react";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4 items-center shadow-sm group"
    >
      {/* The Handle: Dragging only happens when grabbing this */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-slate-600 transition-colors"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1 space-y-3">
        <input
          value={link.title}
          onChange={(e) => updateLink(index, "title", e.target.value)}
          placeholder="Link Title"
          className="w-full font-bold text-slate-700 outline-none bg-transparent"
        />
        <input
          value={link.url}
          onChange={(e) => updateLink(index, "url", e.target.value)}
          placeholder="URL"
          className="w-full text-sm text-slate-400 outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          <span className="text-[10px] font-black uppercase">{link.icon}</span>
        </div>

        <button
          onClick={() => removeLink(index, link?._id || link.tempId)}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
        <BarChart2 size={12} /> {/* Import BarChart2 from lucide-react */}
        {link.clicks || 0} clicks
      </div>
    </div>
  );
}
