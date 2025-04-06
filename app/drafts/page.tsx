"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Eye, FolderPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MotionDiv, MotionCard, cardHover, fadeIn, slideUp, staggerContainer } from "@/components/ui/motion"

type Post = {
  id: string
  title: string
  excerpt: string
  status: string
  createdAt: string
  wordCount: number
  tags?: string[]
}

export default function DraftsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [drafts, setDrafts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/posts?status=draft")

        if (!res.ok) {
          throw new Error("Failed to fetch drafts")
        }

        const data = await res.json()
        setDrafts(data.posts)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load drafts",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrafts()
  }, [toast])

  // Filter drafts based on search query and status filter
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      searchQuery === "" ||
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (draft.excerpt && draft.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && draft.status === "published") ||
      (statusFilter === "draft" && draft.status === "draft") ||
      (statusFilter === "incomplete" && draft.wordCount < 300)

    return matchesSearch && matchesStatus
  })

  const handleDeleteDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete draft")
      }

      // Remove the deleted draft from state
      setDrafts(drafts.filter((draft) => draft.id !== id))

      toast({
        title: "Draft deleted",
        description: "The draft has been permanently deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      })
    }
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto p-4 sm:p-6 md:p-8"
    >
      <MotionDiv variants={slideUp} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog Drafts</h1>
        <p className="text-muted-foreground">Manage your saved blog drafts</p>
      </MotionDiv>

      <MotionDiv variants={fadeIn} transition={{ delay: 0.1 }} className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search drafts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs transition-all duration-200 focus:ring-2 focus:ring-primary/50"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-xs transition-all duration-200 focus:ring-2 focus:ring-primary/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Ready to Publish</SelectItem>
            <SelectItem value="draft">Needs Editing</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </MotionDiv>

      {isLoading ? (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="h-[250px] animate-pulse bg-muted">
                <CardContent className="p-4">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted-foreground/20"></div>
                  <div className="mt-4 h-20 w-full rounded bg-muted-foreground/20"></div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 w-1/3 rounded bg-muted-foreground/20"></div>
                    <div className="h-8 w-1/3 rounded bg-muted-foreground/20"></div>
                    <div className="h-8 w-1/3 rounded bg-muted-foreground/20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : filteredDrafts.length === 0 ? (
        <MotionDiv variants={fadeIn} transition={{ delay: 0.2 }}>
          <Card className="border-none shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">No drafts found matching your criteria</p>
              <Button asChild className="transition-all duration-300 hover:shadow-md">
                <Link href="/generate">Create New Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </MotionDiv>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrafts.map((draft, index) => (
            <MotionCard
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover="hover"
              variants={cardHover}
              className="border-none shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-2">{draft.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(draft.createdAt).toLocaleDateString()} • {draft.wordCount} words
                    </CardDescription>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      draft.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : draft.status === "draft"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {draft.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{draft.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 transition-all duration-300 hover:bg-primary/10"
                    asChild
                  >
                    <Link href={`/editor/${draft.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 transition-all duration-300 hover:bg-primary/10"
                    asChild
                  >
                    <Link href={`/preview/${draft.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 transition-all duration-300 hover:bg-primary/10"
                    asChild
                  >
                    <Link href={`/collections?draft=${draft.id}`}>
                      <FolderPlus className="mr-2 h-4 w-4" /> Add to Collection
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 transition-all duration-300 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-none shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the draft.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="transition-all duration-300">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="bg-destructive text-destructive-foreground transition-all duration-300 hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      )}
    </MotionDiv>
  )
}

