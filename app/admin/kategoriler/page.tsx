"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const d = await res.json();
    if (d.success) setCategories(d.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success("Kategori eklendi");
      setName("");
      fetchCategories();
    } else toast.error(d.error);
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kategoriler</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kategori adı" className="max-w-xs" />
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
              <div>
                <p className="text-white font-medium">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat._count?.series || 0} dizi, {cat._count?.movies || 0} film</p>
              </div>
              <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
