import React, { useState, useMemo } from "react";
import {
  Users,
  Shield,
  MessageSquare,
  Share2,
  Activity,
  Plus,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Trash2,
  UserPlus,
  Lock,
  Globe,
  Link,
  BarChart3,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useCollaborationStore } from "./store";
import { MemberStatus, SharedWithType, PermissionLevel, PermissionAction } from "./types";

type ViewTab = "members" | "teams" | "roles" | "feed" | "comments" | "shares" | "stats";

export function CollaborationApp() {
  const {
    workspace,
    members,
    teams,
    roles,
    comments,
    shares,
    activityFeed,
    inviteMember,
    updateMemberStatus,
    updateMemberRole,
    removeMember,
    createTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    addComment,
    deleteComment,
    createShare,
    revokeShare,
  } = useCollaborationStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("members");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & forms
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState(roles[1]?.id || "");

  // New Team
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");

  // New Share
  const [isNewShareOpen, setIsNewShareOpen] = useState(false);
  const [shareEntityType, setShareEntityType] = useState("deliverable");
  const [shareEntityTitle, setShareEntityTitle] = useState("");
  const [shareType, setShareType] = useState<SharedWithType>("team");
  const [shareTargetTeamId, setShareTargetTeamId] = useState(teams[0]?.id || "");
  const [sharePermLevel, setSharePermLevel] = useState<PermissionLevel>("view");

  // New Comment
  const [newCommentText, setNewCommentText] = useState("");
  const [commentTargetEntity, setCommentTargetEntity] = useState("deliverable:deliv-01");

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Statistics calculation per specification
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeCount = members.filter((m) => m.status === "active").length;
    const invitedCount = members.filter((m) => m.status === "invited").length;
    const suspendedCount = members.filter((m) => m.status === "suspended").length;

    // Comments per app/entityType
    const commentCount = comments.length;
    const sharesOutstanding = shares.length;

    // Most active member based on activity feed
    const activityCounts: Record<string, number> = {};
    activityFeed.forEach((a) => {
      activityCounts[a.actorName] = (activityCounts[a.actorName] || 0) + 1;
    });
    const mostActiveEntry = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];
    const mostActiveMember = mostActiveEntry ? `${mostActiveEntry[0]} (${mostActiveEntry[1]} actions)` : "None";

    return {
      totalMembers,
      activeCount,
      invitedCount,
      suspendedCount,
      commentCount,
      sharesOutstanding,
      mostActiveMember,
      teamsCount: teams.length,
    };
  }, [members, comments, shares, activityFeed, teams]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const role = roles.find((r) => r.id === inviteRoleId);
    inviteMember({
      name: inviteName,
      email: inviteEmail,
      userId: `u-${Date.now()}`,
      roleId: inviteRoleId,
      roleName: role?.name || "Standard Editor",
      status: "invited",
    });

    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    createTeam({
      name: teamName,
      description: teamDesc,
      memberIds: [members[0]?.id || "m-1"],
    });

    setTeamName("");
    setTeamDesc("");
    setIsNewTeamOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
              #23 Collaboration
            </span>
            <span className="text-xs text-slate-400">Workspace RBAC, Teams, Generic Comments, Sharing & Unified Feed</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            {workspace.name}
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/30">
              {workspace.plan} Plan
            </span>
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-sm">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "members" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Directory ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "teams" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "roles" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            RBAC Matrix ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "feed" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Global Activity Feed
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "comments" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Comments ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab("shares")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "shares" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Shares ({shares.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "stats" ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Org Stats
          </button>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter members by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white w-full"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Active: <strong className="text-emerald-400">{stats.activeCount}</strong></span>
                <span>•</span>
                <span>Invited: <strong className="text-amber-400">{stats.invitedCount}</strong></span>
                <span>•</span>
                <span>Suspended: <strong className="text-rose-400">{stats.suspendedCount}</strong></span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Member</th>
                    <th className="py-3 px-4 font-semibold">Assigned Role</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Joined Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-slate-400 text-[11px]">{m.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={m.roleId}
                          onChange={(e) => {
                            const newRole = roles.find((r) => r.id === e.target.value);
                            if (newRole) updateMemberRole(m.id, newRole.id, newRole.name);
                          }}
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-medium"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={m.status}
                          onChange={(e) => updateMemberStatus(m.id, e.target.value as MemberStatus)}
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold border ${
                            m.status === "active"
                              ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                              : m.status === "invited"
                              ? "bg-amber-950/60 border-amber-700 text-amber-300"
                              : "bg-rose-950/60 border-rose-700 text-rose-300"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="invited">Invited</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{m.joinedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => removeMember(m.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                          title="Remove from workspace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TEAMS STRUCTURE */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Teams & Functional Groups</h2>
                <p className="text-xs text-slate-400">
                  Group members into teams for batch sharing and granular resource permissions.
                </p>
              </div>
              <button
                onClick={() => setIsNewTeamOpen(true)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Team
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((t) => {
                const teamMembers = members.filter((m) => t.memberIds.includes(m.id));
                const availableToAdd = members.filter((m) => !t.memberIds.includes(m.id));

                return (
                  <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-base">{t.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                          {teamMembers.length} members
                        </span>
                      </div>
                      {t.description && <p className="text-xs text-slate-400">{t.description}</p>}

                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Team Roster:</span>
                        {teamMembers.map((tm) => (
                          <div key={tm.id} className="flex items-center justify-between bg-slate-950 p-2 rounded text-xs">
                            <span className="font-medium text-slate-200">{tm.name}</span>
                            <button
                              onClick={() => removeMemberFromTeam(t.id, tm.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {availableToAdd.length > 0 && (
                      <div className="pt-3 border-t border-slate-800">
                        <select
                          onChange={(e) => {
                            if (e.target.value) addMemberToTeam(t.id, e.target.value);
                          }}
                          defaultValue=""
                          className="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-300"
                        >
                          <option value="" disabled>+ Add member to team...</option>
                          {availableToAdd.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ROLES & RBAC MATRIX */}
        {activeTab === "roles" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Role-Based Access Control (RBAC) Matrix</h2>
              <p className="text-xs text-slate-400">
                Shared permissions applied consistently across all 90 ecosystem applications.
              </p>
            </div>

            <div className="space-y-4">
              {roles.map((r) => (
                <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-violet-400" />
                      <span className="font-bold text-white text-base">{r.name}</span>
                      {r.isSystemDefault && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono uppercase">
                          System Default
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Configured Permissions:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {r.permissions.map((p) => (
                        <div key={p.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 font-mono">[{p.resourceType}]</span>{" "}
                            <span className="font-bold text-violet-300">{p.resourceRef}</span>
                          </div>
                          <div className="flex gap-1">
                            {p.actions.map((act) => (
                              <span key={act} className="text-[10px] bg-violet-950 text-violet-300 border border-violet-800 px-1.5 py-0.5 rounded font-mono">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GLOBAL ACTIVITY FEED */}
        {activeTab === "feed" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              Unified Ecosystem Activity Feed
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated audit trail showing cross-application actions happening throughout the Workspace.
            </p>

            <div className="space-y-3">
              {activityFeed.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      act.action === "completed" ? "bg-emerald-400" : act.action === "created" ? "bg-cyan-400" : "bg-violet-400"
                    }`} />
                    <div>
                      <span className="font-bold text-white">{act.actorName}</span>{" "}
                      <span className="text-violet-300 font-semibold">{act.action}</span>{" "}
                      <span className="text-slate-200">{act.entityType}: "{act.entityTitle}"</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{act.sourceApp}</span>
                    <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GENERIC COMMENTS */}
        {activeTab === "comments" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Generic Comments Primitive</h2>
              <p className="text-xs text-slate-400">
                Cross-app comments can attach to any entity (task, deliverable, article, etc.) without each app building custom comment tables.
              </p>
            </div>

            {/* Add Comment */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Attach to entity:</span>
                <select
                  value={commentTargetEntity}
                  onChange={(e) => setCommentTargetEntity(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white"
                >
                  <option value="deliverable:deliv-01">Deliverable: RBAC Architecture</option>
                  <option value="task:task-auto-801">Task: SyncEvent Dispatcher</option>
                  <option value="meeting:mtg-02">Meeting: Sprint 43 Sync</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Write a cross-app comment (use @name to mention)..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!newCommentText.trim()) return;
                    const [entityType, entityId] = commentTargetEntity.split(":");
                    addComment({
                      entityType,
                      entityId,
                      entityTitle: commentTargetEntity,
                      authorId: "u-self",
                      authorName: "Andi Pratama",
                      content: newCommentText,
                      mentions: [],
                    });
                    setNewCommentText("");
                  }}
                  className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-semibold"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comment Feed */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.authorName}</span>
                      <span className="text-[10px] bg-slate-900 text-violet-300 px-2 py-0.5 rounded border border-slate-800">
                        {c.entityType} #{c.entityId}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-200">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SHARES */}
        {activeTab === "shares" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Granular Resource Sharing</h2>
            <p className="text-xs text-slate-400">
              Shares allow explicit access overrides per entity (e.g. sharing a single Deliverable with an external team or public token).
            </p>

            <div className="space-y-3">
              {shares.map((s) => (
                <div key={s.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{s.entityTitle}</div>
                    <div className="text-slate-400">
                      Shared with: <strong className="text-violet-300">{s.sharedWithName}</strong> ({s.sharedWithType}) • Access: <span className="uppercase text-emerald-400">{s.permissionLevel}</span>
                    </div>
                    {s.token && <div className="text-[11px] text-slate-500 font-mono">Token: {s.token}</div>}
                  </div>

                  <button
                    onClick={() => revokeShare(s.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30"
                  >
                    Revoke Share
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: STATS */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Members</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalMembers}</div>
                <div className="text-[11px] text-emerald-400 mt-1">{stats.activeCount} active in workspace</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Active Teams</span>
                <div className="text-2xl font-bold text-violet-400 mt-1">{stats.teamsCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Cross-app groups</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Shares Outstanding</span>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.sharesOutstanding}</div>
                <div className="text-[11px] text-slate-400 mt-1">Active resource grants</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Most Active</span>
                <div className="text-sm font-bold text-emerald-400 mt-2 truncate">{stats.mostActiveMember}</div>
                <div className="text-[11px] text-slate-400 mt-1">Activity events log</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-xs text-slate-400 space-y-2">
              <h3 className="font-bold text-white text-base">Shared Infrastructure Architecture</h3>
              <p className="leading-relaxed">
                Collaboration (#23) does not own work content (no Tasks, Notes, or Deliverables belong to it).
                Instead, it serves as the foundational organizational substrate for all 90 ecosystem applications,
                answering: "Who can view/edit what?" and "Who commented where?".
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Invite Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dian Sastro"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="dian@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Assigned Role</label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Team Modal */}
      {isNewTeamOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Team</h3>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Guild"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities or scope..."
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTeamOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
