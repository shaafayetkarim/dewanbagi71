"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SearchIcon, Filter, FileText, Calendar, Tag, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { MotionDiv } from "@/components/ui/motion"

type Post = {
  id: string
  title: string
  excerpt: string | null
  status: string
  createdAt: string
  tags?: string[]
}

export default function SearchPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/posts")

        if (!res.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await res.json()
        setSearchResults(data.posts)

        // Extract unique tags from posts
        const tags = data.posts.flatMap((post: Post) => post.tags || [])
        setAllTags(Array.from(new Set(tags)))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Build query parameters
      const params = new URLSearchParams()
      if (searchQuery) params.append("query", searchQuery)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","))

      // Add date filter
      if (dateFilter === "last-week") {
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)
        params.append("from", lastWeek.toISOString())
      } else if (dateFilter === "last-month") {
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        params.append("from", lastMonth.toISOString())
      }

      const res = await fetch(`/api/posts?${params.toString()}`)

      if (!res.ok) {
        throw new Error("Failed to search posts")
      }

      const data = await res.json()
      setSearchResults(data.posts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setDateFilter("all")
    setSelectedTags([])
  }

  // Filter search results based on filters
  const filteredResults = searchResults.filter((result) => {
    const matchesSearch =
      searchQuery === "" ||
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (result.excerpt && result.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (result.tags && result.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && result.status === "published") ||
      (statusFilter === "draft" && result.status === "draft")

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "last-week" && new Date(result.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "last-month" && new Date(result.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    const matchesTags =
      selectedTags.length === 0 || (result.tags && selectedTags.every((tag) => result.tags!.includes(tag)))

    return matchesSearch && matchesStatus && matchesDate && matchesTags
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">Find your blog posts and ideas</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs, ideas, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> More Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your search results with additional filters</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <h3 className="mb-2 text-sm font-medium">Tags</h3>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <h3 className="mb-2 text-sm font-medium">Word Count</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="word-count-short" />
                    <Label htmlFor="word-count-short">Short (&lt; 500 words)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="word-count-medium" />
                    <Label htmlFor="word-count-medium">Medium (500-1000 words)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="word-count-long" />
                    <Label htmlFor="word-count-long">Long (&gt; 1000 words)</Label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button onClick={handleSearch}>Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4)
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
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">No results found matching your criteria</p>
            <Button asChild>
              <Link href="/generate">Create New Blog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <MotionDiv
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{result.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(result.createdAt).toLocaleDateString()}
                        <FileText className="ml-2 h-3 w-3" />
                        {result.status === "published" ? "Published" : "Draft"}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/editor/${result.id}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.excerpt}</p>
                  {result.tags && result.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <div key={tag} className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={result.status === "published" ? `/preview/${result.id}` : `/editor/${result.id}`}>
                      {result.status === "published" ? "View Post" : "Continue Editing"}
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

