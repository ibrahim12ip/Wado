"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const d = await res.json();
    if (d.success) setUsers(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (user: any) => {
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isActive: !user.isActive, role: user.role }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success("Kullanıcı güncellendi");
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } else toast.error(d.error);
  };

  const toggleRole = async (user: any) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`${user.email} kullanıcısını ${newRole === "ADMIN" ? "admin" : "kullanıcı"} yapmak istediğinize emin misiniz?`)) return;
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isActive: user.isActive, role: newRole }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success(`Rol ${newRole} olarak güncellendi`);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } else toast.error(d.error);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`${email} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    const res = await fetch(`/api/admin/users`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await res.json();
    if (d.success) { toast.success("Kullanıcı silindi"); fetchUsers(); }
    else toast.error(d.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kullanıcı Yönetimi</h1>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium">Kullanıcı</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Rol</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Durum</th>
                <th className="text-right p-4 text-muted-foreground font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-wado-600/20 flex items-center justify-center text-wado-500 text-sm font-medium">
                        {(u.name?.[0] || "U").toUpperCase()}
                      </div>
                      <p className="text-white">{u.name || "İsimsiz"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{u.email}</td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-wado-600/20 text-wado-400" : "bg-white/5 text-muted-foreground"}`}>{u.role}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {u.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleRole(u)} title="Rol değiştir">
                        {u.role === "ADMIN" ? <ShieldOff className="h-4 w-4 text-yellow-500" /> : <Shield className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(u)}>
                        {u.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(u.id, u.email)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
