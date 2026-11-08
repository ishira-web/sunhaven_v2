"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "AGENT";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const emptyForm: UserForm = { name: "", email: "", password: "", role: "AGENT" };

const roleDescriptions: Record<UserRole, string> = {
  SUPER_ADMIN: "Full access, including user management",
  ADMIN: "Manage site content and settings",
  AGENT: "Manage and respond to inquiries",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const requestUsers = async () => {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load users");
    return data as { users: AdminUser[]; currentUserId: string };
  };

  useEffect(() => {
    let isMounted = true;
    requestUsers()
      .then((data) => {
        if (!isMounted) return;
        setUsers(data.users);
        setCurrentUserId(data.currentUserId);
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load users");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestUsers();
      setUsers(data.users);
      setCurrentUserId(data.currentUserId);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setError(null);
    setModalOpen(true);
  };

  const saveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    try {
      const response = await fetch(
        editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users",
        {
          method: editingUser ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save user");

      setModalOpen(false);
      setMessage(editingUser ? "User account updated." : "User account created.");
      await fetchUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Remove access for ${user.name} (${user.email})?`)) return;

    setDeletingId(user.id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to remove user");
      setUsers((currentUsers) => currentUsers.filter((current) => current.id !== user.id));
      setMessage("User account removed.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to remove user");
    } finally {
      setDeletingId(null);
    }
  };

  const roleStyle = (role: UserRole) => {
    if (role === "SUPER_ADMIN") return "border-[#cca45b]/30 bg-[#cca45b]/10 text-[#cca45b]";
    if (role === "ADMIN") return "border-sky-400/20 bg-sky-400/10 text-sky-300";
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#cca45b]">
            <ShieldCheck className="h-4 w-4" />
            Access control
          </p>
          <h1 className="font-cinzel text-3xl font-bold text-white">User Management</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create staff accounts and control who can access the admin panel.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#cca45b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0a2118] transition-colors hover:bg-[#d9b46e]"
        >
          <Plus className="h-4 w-4" />
          Add user
        </button>
      </div>

      {message && (
        <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}
      {error && !modalOpen && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a2118]/70">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-cinzel text-lg font-semibold text-white">Admin accounts</h2>
            <p className="mt-1 text-xs text-slate-400">
              {users.length} {users.length === 1 ? "account" : "accounts"}
            </p>
          </div>
          <Users className="h-5 w-5 text-[#cca45b]" />
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-slate-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <UserRound className="mb-3 h-8 w-8 text-slate-500" />
            <p className="font-medium text-slate-200">No user accounts found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#cca45b]/20 bg-[#cca45b]/10 text-[#cca45b]">
                    {user.role === "SUPER_ADMIN" ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-white">{user.name}</p>
                      {user.id === currentUserId && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                          You
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>
                    <p className="mt-1 text-xs text-slate-500">{roleDescriptions[user.role]}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${roleStyle(user.role)}`}>
                    {user.role.replace("_", " ")}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditModal(user)}
                    aria-label={`Edit ${user.name}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-[#cca45b]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteUser(user)}
                    disabled={user.id === currentUserId || deletingId === user.id}
                    aria-label={`Remove ${user.name}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["SUPER_ADMIN", "ADMIN", "AGENT"] as UserRole[]).map((role) => (
          <div key={role} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#cca45b]">
              {role === "SUPER_ADMIN" ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              <p className="text-xs font-bold uppercase tracking-wider">{role.replace("_", " ")}</p>
            </div>
            <p className="text-xs leading-5 text-slate-400">{roleDescriptions[role]}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setModalOpen(false);
        }}>
          <form onSubmit={saveUser} className="w-full max-w-lg rounded-2xl border border-[#cca45b]/20 bg-[#0a2118] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-cinzel text-xl font-semibold text-white">
                  {editingUser ? "Edit user" : "Add user"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">Admin panel sign-in details and permissions</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Full name</span>
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#cca45b] focus:outline-none"
                  placeholder="Staff member name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Email address</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#cca45b] focus:outline-none"
                  placeholder="name@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  {editingUser ? "New password (optional)" : "Password"}
                </span>
                <input
                  required={!editingUser}
                  type="password"
                  autoComplete={editingUser ? "new-password" : "new-password"}
                  minLength={8}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#cca45b] focus:outline-none"
                  placeholder={editingUser ? "Leave blank to keep current password" : "At least 8 characters"}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Access role</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
                  className="w-full rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white focus:border-[#cca45b] focus:outline-none"
                >
                  <option value="AGENT">Agent — manage inquiries</option>
                  <option value="ADMIN">Admin — manage site content</option>
                  <option value="SUPER_ADMIN">Super admin — full access</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
              <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/5 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#cca45b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a2118] hover:bg-[#d9b46e] disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {saving ? "Saving..." : editingUser ? "Save changes" : "Create account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
