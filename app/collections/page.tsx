"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Folder, FolderPlus, MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { MotionDiv, fadeIn } from "@/components/ui/motion"

type Collection = {
  id: string
  name: string
  description: string | null
  _count: {
    posts: number
  }
  updatedAt: string
}

export default function CollectionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/collections")

        if (!res.ok) {
          throw new Error("Failed to fetch collections")
        }

        const data = await res.json()
        setCollections(data.collections)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load collections",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [toast])

  // Filter collections based on search query
  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Collection name required",
        description: "Please enter a name for your collection",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCollectionName,
          description: newCollectionDescription || null,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create collection")
      }

      const data = await res.json()

      // Add the new collection to state
      setCollections([
        ...collections,
        {
          ...data.collection,
          _count: { posts: 0 },
        },
      ])

      toast({
        title: "Collection created",
        description: `"${newCollectionName}" has been created successfully`,
      })

      setNewCollectionName("")
      setNewCollectionDescription("")
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCollection = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete collection")
      }

      // Remove the deleted collection from state
      setCollections(collections.filter((collection) => collection.id !== id))

      toast({
        title: "Collection deleted",
        description: `"${name}" has been deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      })
    }
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
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
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

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="h-[200px] animate-pulse bg-muted">
                <CardContent className="p-4">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted-foreground/20"></div>
                  <div className="mt-4 h-20 w-full rounded bg-muted-foreground/20"></div>
                  <div className="mt-4 h-8 w-full rounded bg-muted-foreground/20"></div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <MotionDiv variants={fadeIn} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">No collections found matching your criteria</p>
              <Button onClick={() => setIsDialogOpen(true)}>Create New Collection</Button>
            </CardContent>
          </Card>
        </MotionDiv>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <MotionDiv
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card>
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
                      {collection._count.posts} {collection._count.posts === 1 ? "post" : "posts"}
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
            </MotionDiv>
          ))}
        </div>
      )}
    </div>
  )
}

