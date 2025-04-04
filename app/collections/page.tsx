"use client"

import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import { Folder, FolderPlus, MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function CollectionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - in a real app, this would come from an API
  const collections = [
    {
      id: 1,
      name: "Web Development",
      description: "Articles about web development technologies and best practices",
      count: 5,
      updatedAt: "2023-05-15",
    },
    {
      id: 2,
      name: "AI and Machine Learning",
      description: "Exploring artificial intelligence and machine learning concepts",
      count: 3,
      updatedAt: "2023-05-10",
    },
    {
      id: 3,
      name: "Digital Marketing",
      description: "Tips and strategies for effective digital marketing",
      count: 2,
      updatedAt: "2023-05-05",
    },
    {
      id: 4,
      name: "Product Management",
      description: "Insights into product management methodologies",
      count: 1,
      updatedAt: "2023-05-01",
    },
  ]

  // Filter collections based on search query
  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Collection name required",
        description: "Please enter a name for your collection",
        variant: "destructive",
      })
      return
    }

    // Simulate creating collection - replace with actual API call
    toast({
      title: "Collection created",
      description: `"${newCollectionName}" has been created successfully`,
    })

    setNewCollectionName("")
    setIsDialogOpen(false)
  }

  const handleDeleteCollection = (id: number, name: string) => {
    // Simulate deleting collection - replace with actual API call
    toast({
      title: "Collection deleted",
      description: `"${name}" has been deleted successfully`,
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Organize your blog posts into collections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" /> New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>Collections help you organize your blog posts by topic or theme.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Web Development, Marketing Tips"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this collection is about..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection}>Create Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredCollections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">No collections found matching your criteria</p>
            <Button onClick={() => setIsDialogOpen(true)}>Create New Collection</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <Card key={collection.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <CardTitle>{collection.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/collections/${collection.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Collection
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteCollection(collection.id, collection.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Collection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{collection.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {collection.count} {collection.count === 1 ? "post" : "posts"}
                  </span>
                  <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/collections/${collection.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> View Posts
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

