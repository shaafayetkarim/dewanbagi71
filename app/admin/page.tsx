"use client"

import { useState } from "react"
import { Users, FileText, BarChart3, UserPlus, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Mock data - in a real app, this would come from an API
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      joinDate: "2023-01-15",
      blogCount: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "premium",
      status: "active",
      joinDate: "2023-02-20",
      blogCount: 8,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "free",
      status: "active",
      joinDate: "2023-03-10",
      blogCount: 3,
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "premium",
      status: "inactive",
      joinDate: "2023-04-05",
      blogCount: 0,
    },
  ]

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const stats = [
    { title: "Total Users", value: "42", icon: Users },
    { title: "Total Blogs", value: "156", icon: FileText },
    { title: "Premium Users", value: "18", icon: Users },
    { title: "Blogs Generated Today", value: "24", icon: BarChart3 },
  ]

  const handleChangeUserRole = (userId: number, newRole: string) => {
    // Simulate changing user role - replace with actual API call
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
    })
  }

  const handleExportData = () => {
    // Simulate exporting data - replace with actual export functionality
    toast({
      title: "Exporting data",
      description: "Your data export is being prepared",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and monitor platform activity</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Blogs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value) => handleChangeUserRole(user.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="free">Free</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{user.blogCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blogs">
          <Card>
            <CardHeader>
              <CardTitle>Blog Management</CardTitle>
              <CardDescription>Monitor and manage all blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Blog management interface would be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Platform usage statistics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Analytics dashboard would be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Platform settings would be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

