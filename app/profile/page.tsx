"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Mock user data - in a real app, this would come from an API
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    subscription: "Free",
    generationsLeft: 18,
    generationsTotal: 20,
  })

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate saving - replace with actual API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    }, 1000)
  }

  const handleUpgradeSubscription = () => {
    // Simulate upgrading - replace with actual payment flow
    toast({
      title: "Redirecting to payment",
      description: "You'll be redirected to complete your subscription upgrade",
    })

    // In a real app, redirect to payment page
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Subscription</span>
                <span className="text-sm">{user.subscription}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Generations Left</span>
                <span className="text-sm">
                  {user.generationsLeft}/{user.generationsTotal}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(user.generationsLeft / user.generationsTotal) * 100}%` }}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleUpgradeSubscription}>
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </span>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Picture
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input id="current-password" type="password" className="rounded-l-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input id="new-password" type="password" className="rounded-l-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input id="confirm-password" type="password" className="rounded-l-none" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-tone">Default Blog Tone</Label>
                  <select
                    id="default-tone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="professional"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="humorous">Humorous</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-length">Default Blog Length</Label>
                  <select
                    id="default-length"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="medium"
                  >
                    <option value="short">Short (300-500 words)</option>
                    <option value="medium">Medium (500-800 words)</option>
                    <option value="long">Long (800-1200 words)</option>
                    <option value="comprehensive">Comprehensive (1200+ words)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="email-notifications">Receive email notifications for blog generation</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

