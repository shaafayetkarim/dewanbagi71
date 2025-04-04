"use client"

import { useState } from "react"
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

export default function DraftsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - in a real app, this would come from an API
  const drafts = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      excerpt: "Learn how to build modern web applications with Next.js, the React framework for production.",
      status: "Needs Editing",
      date: "2023-05-15",
      wordCount: 850,
    },
    {
      id: 2,
      title: "Understanding TypeScript for Beginners",
      excerpt: "A comprehensive guide to TypeScript fundamentals for JavaScript developers.",
      status: "Ready to Publish",
      date: "2023-05-10",
      wordCount: 1200,
    },
    {
      id: 3,
      title: "The Future of AI in Content Creation",
      excerpt: "Exploring how artificial intelligence is transforming the way we create and consume content.",
      status: "Incomplete",
      date: "2023-05-05",
      wordCount: 450,
    },
    {
      id: 4,
      title: "10 SEO Tips for Better Blog Performance",
      excerpt: "Practical SEO strategies to improve your blog's visibility and drive more organic traffic.",
      status: "Ready to Publish",
      date: "2023-05-01",
      wordCount: 950,
    },
  ]

  // Filter drafts based on search query and status filter
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || draft.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeleteDraft = (id: number) => {
    // In a real app, this would call an API to delete the draft
    toast({
      title: "Draft deleted",
      description: "The draft has been permanently deleted",
    })
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
            <SelectItem value="Ready to Publish">Ready to Publish</SelectItem>
            <SelectItem value="Needs Editing">Needs Editing</SelectItem>
            <SelectItem value="Incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </MotionDiv>

      {filteredDrafts.length === 0 ? (
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
                      {new Date(draft.date).toLocaleDateString()} • {draft.wordCount} words
                    </CardDescription>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      draft.status === "Ready to Publish"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : draft.status === "Needs Editing"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {draft.status}
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

