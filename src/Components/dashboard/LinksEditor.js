"use client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableLink from "@/Components/dashboard/SortableLink";
import { Plus } from "lucide-react";

export default function LinksEditor({ links, setLinks, onUpdate, onRemove, onAdd }) {
  // 1. Move Sensors here (UI Logic)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // 2. Handle Reorder locally
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = links.findIndex((l) => (l._id || l.tempId) === active.id);
    const newIndex = links.findIndex((l) => (l._id || l.tempId) === over.id);
    
    // Pass the new sorted array back to parent
    setLinks(arrayMove(links, oldIndex, newIndex));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-slate-800 text-lg">Your Links</h3>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l._id || l.tempId)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3" role="list">
            {links.map((link, index) => (
              <SortableLink
                key={link._id || link.tempId}
                id={link._id || link.tempId}
                index={index}
                link={link}
                updateLink={onUpdate}
                removeLink={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all font-bold flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500"
      >
        <Plus size={20} />
        Add New Link
      </button>
    </section>
  );
}