"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const d = await res.json();
    if (d.success) setCategories(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName }) });
    const d = await res.json();
    if (d.success) { toast.success("Kategori eklendi"); setNewName(""); fetchCategories(); }
    else toast.error(d.error);
    setSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const res = await fetch(`/api/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editName }) });
    const d = await res.json();
    if (d.success) { toast.success("Güncellendi"); setEditingId(null); fetchCategories(); }
    else toast.error(d.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) { toast.success("Silindi"); fetchCategories(); }
    else toast.error(d.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kategoriler</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Kategori adı" className="max-w-xs" />
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-1" />}Ekle
        </Button>
      </form>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="grid gap-3">
          {categories.map((cat: any) => (
            <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="max-w-xs" autoFocus />
                  <Button size="sm" variant="ghost" onClick={() => handleUpdate(cat.id)}><Check className="h-4 w-4 text-green-500" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4 text-red-500" /></Button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-white font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat._count?.series || 0} dizi, {cat._count?.movies || 0} film</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
