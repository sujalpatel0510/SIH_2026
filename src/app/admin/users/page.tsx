'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2, XCircle, ShieldCheck, UserX, Search, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams();
      if (roleFilter !== 'ALL') query.append('role', roleFilter);
      if (statusFilter !== 'ALL') query.append('status', statusFilter);
      const res = await fetch(`/api/admin/users?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });

      if (res.ok) {
        setToastMessage(`User status updated to ${status} in PostgreSQL!`);
        setTimeout(() => setToastMessage(null), 3500);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });

      if (res.ok) {
        setToastMessage(`User role changed to ${role} in PostgreSQL!`);
        setTimeout(() => setToastMessage(null), 3500);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-purple-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-purple-600/20"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          User Management & RBAC Approvals
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review trainee and trainer registration requests, grant platform access, and manage authorization roles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="DISABLED">Disabled</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="TRAINEE">Trainee</option>
            <option value="TRAINER">Trainer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Department / Bio</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isPending = u.status === 'PENDING';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p>{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white p-1 text-[11px] font-bold text-slate-700"
                      >
                        <option value="TRAINEE">TRAINEE</option>
                        <option value="TRAINER">TRAINER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {u.traineeProfile?.department || u.trainerProfile?.subjects || 'General'}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : u.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u.id, u.status === 'APPROVED' ? 'DISABLED' : 'APPROVED')}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          {u.status === 'APPROVED' ? 'Disable Account' : 'Re-enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
