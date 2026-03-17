"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  PenTool,
  MessageSquare,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  GraduationCap,
  FlaskConical,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────
interface Project {
  id: string; title: string; slug: string; description: string; longDescription?: string;
  imageUrl?: string; demoUrl?: string; githubUrl?: string; tags: string[]; category: string;
  featured: boolean; order: number;
}
interface Experience {
  id: string; title: string; company: string; location?: string; description: string;
  startDate: string; endDate?: string; current: boolean; type: string; order: number;
}
interface Skill {
  id: string; name: string; category: string; level: number; icon?: string; order: number;
}
interface Publication {
  id: string; title: string; authors: string; venue: string; year: number;
  abstract?: string; doi?: string; pdfUrl?: string; type: string; order: number;
}
interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  coverImage?: string; tags: string[]; published: boolean; views: number;
  createdAt: string;
}
interface ContactMessage {
  id: string; name: string; email: string; subject: string; message: string;
  read: boolean; createdAt: string;
}
interface Stats {
  projects: number; blogPosts: number; publications: number; messages: number;
}

// ─── Generic Form Modal ───────────────────────────────────────
function FormModal({ title, open, onClose, onSubmit, children, loading }: {
  title: string; open: boolean; onClose: () => void;
  onSubmit: (e: React.FormEvent) => void; children: React.ReactNode; loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // Data state
  const [stats, setStats] = useState<Stats>({ projects: 0, blogPosts: 0, publications: 0, messages: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid password");
    }
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, projRes, expRes, skillRes, pubRes, blogRes, msgRes] = await Promise.all([
        fetch("/api/stats"), fetch("/api/projects"), fetch("/api/experiences"),
        fetch("/api/skills"), fetch("/api/publications"), fetch("/api/blog"), fetch("/api/messages"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (skillRes.ok) setSkills(await skillRes.json());
      if (pubRes.ok) setPublications(await pubRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (err) { console.error("Failed to fetch data:", err); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated, fetchAll]);

  // CRUD helpers
  const openCreate = (type: string, defaults: Record<string, unknown> = {}) => {
    setModalType(type);
    setEditingItem(null);
    setFormData(defaults);
    setModalOpen(true);
  };
  const openEdit = (type: string, item: Record<string, unknown>) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingItem(null); setFormData({}); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const isEdit = !!editingItem;
    const endpoints: Record<string, string> = {
      project: "/api/projects", experience: "/api/experiences", skill: "/api/skills",
      publication: "/api/publications", blog: "/api/blog",
    };
    const url = isEdit ? `${endpoints[modalType]}/${(editingItem as { id: string }).id}` : endpoints[modalType];
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { closeModal(); fetchAll(); }
    } catch (err) { console.error("Save failed:", err); }
    setSaving(false);
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const endpoints: Record<string, string> = {
      project: "/api/projects", experience: "/api/experiences", skill: "/api/skills",
      publication: "/api/publications", blog: "/api/blog", message: "/api/messages",
    };
    try {
      await fetch(`${endpoints[type]}/${id}`, { method: "DELETE" });
      fetchAll();
    } catch (err) { console.error("Delete failed:", err); }
  };

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    fetchAll();
  };

  const setField = (key: string, value: unknown) => setFormData(prev => ({ ...prev, [key]: value }));

  // ─── Login Screen ──────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Enter your password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────
  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderOpen },
    { label: "Blog Posts", value: stats.blogPosts, icon: PenTool },
    { label: "Publications", value: stats.publications, icon: BookOpen },
    { label: "Messages", value: stats.messages, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
          </div>
          <Link href="/"><Button variant="outline">View Site</Button></Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{loading ? "…" : stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experiences">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-1" /> Overview
            </TabsTrigger>
          </TabsList>

          {/* ── Projects Tab ──────────────────────────────── */}
          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Projects</CardTitle><CardDescription>Manage your portfolio projects</CardDescription></div>
                <Button onClick={() => openCreate("project", { tags: [], featured: false, order: 0 })}>
                  <Plus className="h-4 w-4 mr-2" />Add Project
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No projects yet. Add your first project!</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{p.title}</p>
                            {p.featured && <Badge>Featured</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{p.category} · {p.tags.join(", ")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit("project", p as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("project", p.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Experience Tab ────────────────────────────── */}
          <TabsContent value="experiences">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Experience</CardTitle><CardDescription>Manage education, work, and research</CardDescription></div>
                <Button onClick={() => openCreate("experience", { type: "work", current: false, order: 0 })}>
                  <Plus className="h-4 w-4 mr-2" />Add Experience
                </Button>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No experiences yet.</p>
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            {exp.type === "education" && <GraduationCap className="h-4 w-4 text-blue-500" />}
                            {exp.type === "work" && <Briefcase className="h-4 w-4 text-primary" />}
                            {exp.type === "research" && <FlaskConical className="h-4 w-4 text-purple-500" />}
                            <p className="font-medium">{exp.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{exp.company} · {exp.type}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit("experience", exp as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("experience", exp.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Skills Tab ────────────────────────────────── */}
          <TabsContent value="skills">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Skills</CardTitle><CardDescription>Manage your technical skills</CardDescription></div>
                <Button onClick={() => openCreate("skill", { category: "Languages", level: 80, order: 0 })}>
                  <Plus className="h-4 w-4 mr-2" />Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No skills yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(["Languages", "Frameworks", "Tools", "Domains"] as const).map((cat) => {
                      const catSkills = skills.filter(s => s.category === cat);
                      if (catSkills.length === 0) return null;
                      return (
                        <div key={cat}>
                          <p className="text-sm font-semibold mb-2">{cat}</p>
                          {catSkills.map((s) => (
                            <div key={s.id} className="flex items-center justify-between py-2 px-4 rounded border border-border mb-1">
                              <div className="flex items-center gap-3">
                                <p className="text-sm">{s.name}</p>
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.level}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{s.level}%</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit("skill", s as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete("skill", s.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Publications Tab ──────────────────────────── */}
          <TabsContent value="publications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Publications</CardTitle><CardDescription>Manage your research publications</CardDescription></div>
                <Button onClick={() => openCreate("publication", { year: new Date().getFullYear(), type: "conference", order: 0 })}>
                  <Plus className="h-4 w-4 mr-2" />Add Publication
                </Button>
              </CardHeader>
              <CardContent>
                {publications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No publications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {publications.map((pub) => (
                      <div key={pub.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={pub.type === "journal" ? "default" : "secondary"}>{pub.type}</Badge>
                            <span className="text-xs text-muted-foreground font-mono">{pub.year}</span>
                          </div>
                          <p className="font-medium text-sm">{pub.title}</p>
                          <p className="text-xs text-muted-foreground">{pub.authors}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit("publication", pub as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("publication", pub.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Blog Tab ──────────────────────────────────── */}
          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Blog Posts</CardTitle><CardDescription>Write and manage blog articles</CardDescription></div>
                <Button onClick={() => openCreate("blog", { tags: [], published: false })}>
                  <Plus className="h-4 w-4 mr-2" />New Post
                </Button>
              </CardHeader>
              <CardContent>
                {blogPosts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No blog posts yet.</p>
                ) : (
                  <div className="space-y-3">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{post.title}</p>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? <><Eye className="h-3 w-3 mr-1" />Published</> : <><EyeOff className="h-3 w-3 mr-1" />Draft</>}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{post.tags.join(", ")} · {post.views} views</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit("blog", post as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("blog", post.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Messages Tab ──────────────────────────────── */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View messages from the contact form</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No messages yet.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg border ${msg.read ? "border-border" : "border-primary/50 bg-primary/5"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{msg.name}</p>
                              {!msg.read && <Badge className="bg-primary text-xs">New</Badge>}
                            </div>
                            <p className="text-sm font-medium">{msg.subject}</p>
                            <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-2">
                              {msg.email} · {new Date(msg.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {!msg.read && (
                              <Button variant="outline" size="sm" onClick={() => markRead(msg.id)}>
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button variant="destructive" size="sm" onClick={() => handleDelete("message", msg.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Overview Tab ──────────────────────────────── */}
          <TabsContent value="overview">
            <Card>
              <CardHeader><CardTitle>Overview</CardTitle><CardDescription>Quick summary of your portfolio content</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{stats.projects}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Experience Entries</p>
                    <p className="text-2xl font-bold">{experiences.length}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Total Skills</p>
                    <p className="text-2xl font-bold">{skills.length}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Unread Messages</p>
                    <p className="text-2xl font-bold">{messages.filter(m => !m.read).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Form Modals ───────────────────────────────────── */}

      {/* Project Modal */}
      <FormModal title={editingItem ? "Edit Project" : "Add Project"} open={modalOpen && modalType === "project"} onClose={closeModal} onSubmit={handleSave} loading={saving}>
        <Input placeholder="Title" value={(formData.title as string) || ""} onChange={e => setField("title", e.target.value)} required />
        <Input placeholder="Slug (url-friendly)" value={(formData.slug as string) || ""} onChange={e => setField("slug", e.target.value)} required />
        <Textarea placeholder="Description" value={(formData.description as string) || ""} onChange={e => setField("description", e.target.value)} required />
        <Textarea placeholder="Long description (optional)" value={(formData.longDescription as string) || ""} onChange={e => setField("longDescription", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Category" value={(formData.category as string) || ""} onChange={e => setField("category", e.target.value)} required />
          <Input placeholder="Tags (comma separated)" value={Array.isArray(formData.tags) ? (formData.tags as string[]).join(", ") : ""} onChange={e => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Image URL" value={(formData.imageUrl as string) || ""} onChange={e => setField("imageUrl", e.target.value)} />
          <Input placeholder="Demo URL" value={(formData.demoUrl as string) || ""} onChange={e => setField("demoUrl", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="GitHub URL" value={(formData.githubUrl as string) || ""} onChange={e => setField("githubUrl", e.target.value)} />
          <Input type="number" placeholder="Order" value={(formData.order as number) || 0} onChange={e => setField("order", parseInt(e.target.value) || 0)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={(formData.featured as boolean) || false} onChange={e => setField("featured", e.target.checked)} className="rounded" />
          Featured project
        </label>
      </FormModal>

      {/* Experience Modal */}
      <FormModal title={editingItem ? "Edit Experience" : "Add Experience"} open={modalOpen && modalType === "experience"} onClose={closeModal} onSubmit={handleSave} loading={saving}>
        <Input placeholder="Title" value={(formData.title as string) || ""} onChange={e => setField("title", e.target.value)} required />
        <Input placeholder="Company / University" value={(formData.company as string) || ""} onChange={e => setField("company", e.target.value)} required />
        <Input placeholder="Location" value={(formData.location as string) || ""} onChange={e => setField("location", e.target.value)} />
        <Textarea placeholder="Description" value={(formData.description as string) || ""} onChange={e => setField("description", e.target.value)} required />
        <div className="grid grid-cols-3 gap-4">
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={(formData.type as string) || "work"} onChange={e => setField("type", e.target.value)}>
            <option value="education">Education</option>
            <option value="work">Work</option>
            <option value="research">Research</option>
          </select>
          <Input type="date" placeholder="Start date" value={(formData.startDate as string)?.split("T")[0] || ""} onChange={e => setField("startDate", e.target.value)} required />
          <Input type="date" placeholder="End date" value={(formData.endDate as string)?.split("T")[0] || ""} onChange={e => setField("endDate", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={(formData.current as boolean) || false} onChange={e => setField("current", e.target.checked)} className="rounded" />
          Currently here
        </label>
      </FormModal>

      {/* Skill Modal */}
      <FormModal title={editingItem ? "Edit Skill" : "Add Skill"} open={modalOpen && modalType === "skill"} onClose={closeModal} onSubmit={handleSave} loading={saving}>
        <Input placeholder="Skill name" value={(formData.name as string) || ""} onChange={e => setField("name", e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={(formData.category as string) || "Languages"} onChange={e => setField("category", e.target.value)}>
            <option value="Languages">Languages</option>
            <option value="Frameworks">Frameworks</option>
            <option value="Tools">Tools</option>
            <option value="Domains">Domains</option>
          </select>
          <div>
            <Input type="range" min={0} max={100} value={(formData.level as number) || 80} onChange={e => setField("level", parseInt(e.target.value))} />
            <p className="text-xs text-muted-foreground text-center">{(formData.level as number) || 80}%</p>
          </div>
        </div>
      </FormModal>

      {/* Publication Modal */}
      <FormModal title={editingItem ? "Edit Publication" : "Add Publication"} open={modalOpen && modalType === "publication"} onClose={closeModal} onSubmit={handleSave} loading={saving}>
        <Input placeholder="Title" value={(formData.title as string) || ""} onChange={e => setField("title", e.target.value)} required />
        <Input placeholder="Authors" value={(formData.authors as string) || ""} onChange={e => setField("authors", e.target.value)} required />
        <Input placeholder="Venue (journal/conference)" value={(formData.venue as string) || ""} onChange={e => setField("venue", e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" placeholder="Year" value={(formData.year as number) || ""} onChange={e => setField("year", parseInt(e.target.value))} required />
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={(formData.type as string) || "conference"} onChange={e => setField("type", e.target.value)}>
            <option value="conference">Conference</option>
            <option value="journal">Journal</option>
            <option value="thesis">Thesis</option>
          </select>
        </div>
        <Textarea placeholder="Abstract" value={(formData.abstract as string) || ""} onChange={e => setField("abstract", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="DOI" value={(formData.doi as string) || ""} onChange={e => setField("doi", e.target.value)} />
          <Input placeholder="PDF URL" value={(formData.pdfUrl as string) || ""} onChange={e => setField("pdfUrl", e.target.value)} />
        </div>
      </FormModal>

      {/* Blog Post Modal */}
      <FormModal title={editingItem ? "Edit Blog Post" : "New Blog Post"} open={modalOpen && modalType === "blog"} onClose={closeModal} onSubmit={handleSave} loading={saving}>
        <Input placeholder="Title" value={(formData.title as string) || ""} onChange={e => setField("title", e.target.value)} required />
        <Input placeholder="Slug (url-friendly)" value={(formData.slug as string) || ""} onChange={e => setField("slug", e.target.value)} required />
        <Textarea placeholder="Excerpt (short summary)" value={(formData.excerpt as string) || ""} onChange={e => setField("excerpt", e.target.value)} required />
        <Textarea placeholder="Content (markdown)" className="min-h-[200px] font-mono text-sm" value={(formData.content as string) || ""} onChange={e => setField("content", e.target.value)} required />
        <Input placeholder="Tags (comma separated)" value={Array.isArray(formData.tags) ? (formData.tags as string[]).join(", ") : ""} onChange={e => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} />
        <Input placeholder="Cover image URL" value={(formData.coverImage as string) || ""} onChange={e => setField("coverImage", e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={(formData.published as boolean) || false} onChange={e => setField("published", e.target.checked)} className="rounded" />
          Published
        </label>
      </FormModal>
    </div>
  );
}
