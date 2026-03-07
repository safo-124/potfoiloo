"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Briefcase,
  PenTool,
  MessageSquare,
  BarChart3,
  BookOpen,
  Award,
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

// Placeholder data — later fetched from Prisma
const stats = [
  { label: "Projects", value: 6, icon: FolderOpen },
  { label: "Blog Posts", value: 3, icon: PenTool },
  { label: "Publications", value: 3, icon: BookOpen },
  { label: "Messages", value: 12, icon: MessageSquare },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Simple password protection — replace with NextAuth in production
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Enter your password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Default password: admin123 (change in production)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your portfolio content
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">View Site</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Manage your portfolio projects
                  </CardDescription>
                </div>
                <Button>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Neural Speech Enhancement",
                    "Adaptive Beamforming with DNN",
                    "Real-time Object Detection System",
                  ].map((title) => (
                    <div
                      key={title}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>
                    Write and manage blog articles
                  </CardDescription>
                </div>
                <Button>
                  <PenTool className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Understanding Fourier Transforms",
                      published: true,
                    },
                    {
                      title: "Building a Real-Time Audio Classifier",
                      published: true,
                    },
                    {
                      title: "Kalman Filters Explained",
                      published: false,
                    },
                  ].map((post) => (
                    <div
                      key={post.title}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{post.title}</p>
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Publications</CardTitle>
                  <CardDescription>
                    Manage your research publications
                  </CardDescription>
                </div>
                <Button>
                  <Award className="h-4 w-4 mr-2" />
                  Add Publication
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Connect your PostgreSQL database to manage publications
                  dynamically.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  View messages from the contact form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Dr. Smith",
                      subject: "Research Collaboration",
                      date: "2025-12-01",
                      read: false,
                    },
                    {
                      name: "Tech Corp HR",
                      subject: "ML Engineer Position",
                      date: "2025-11-28",
                      read: true,
                    },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        msg.read
                          ? "border-border"
                          : "border-primary/50 bg-primary/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{msg.name}</p>
                          {!msg.read && (
                            <Badge className="bg-primary text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {msg.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
