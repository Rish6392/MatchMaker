"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StickyNote, Plus, Loader2, MessageSquare } from "lucide-react";

interface NotesSectionProps {
  customerId: string;
}

export function NotesSection({ customerId }: NotesSectionProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/customer/${customerId}/notes`);
        const data = await res.json();
        if (data.notes) {
          setNotes(data.notes);
        }
      } catch (error) {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [customerId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/customer/${customerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Note added successfully");
        setNotes([data.note, ...notes]);
        setNewNote("");
      } else {
        toast.error("Failed to add note");
      }
    } catch (error) {
      toast.error("Error adding note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-stone-200/60 bg-white rounded-2xl shadow-sm premium-card animate-fade-in-up stagger-5">
      <CardHeader className="pb-3 border-b border-stone-100">
        <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <StickyNote className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          Meeting Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {/* Add Note Form */}
        <div className="space-y-3">
          <Textarea 
            placeholder="Type a quick note here... (e.g., 'Sent Coty's profile, waiting for response')" 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-stone-50/80 border-stone-200 text-stone-700 resize-none h-20 placeholder:text-stone-400 rounded-xl focus-visible:ring-rose-primary/30 focus-visible:border-rose-primary/40"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim() || submitting}
            className="bg-gradient-to-r from-rose-primary to-rose-600 hover:from-rose-700 hover:to-rose-700 text-white w-full sm:w-auto transition-all rounded-xl shadow-sm shadow-rose-primary/15"
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Save Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3 mt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                  <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                  <div className="h-3 w-1/3 skeleton-shimmer rounded" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-500">No notes yet</p>
              <p className="text-xs text-stone-400 mt-0.5">Add your first note above.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-xl bg-stone-50/80 border border-stone-100 space-y-1.5 hover:border-stone-200 transition-colors"
              >
                <p className="text-sm text-stone-700 leading-relaxed">{note.content}</p>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
