"use client"

import type React from "react"

import { useState } from "react"
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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Mock data - in a real app, this would come from an API
  const searchResults = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      excerpt: "Learn how to build modern web applications with Next.js, the React framework for production.",
      status: "Published",
      date: "2023-05-15",
      tags: ["Next.js", "React", "Web Development"],
    },
    {
      id: 2,
      title: "Understanding TypeScript for Beginners",
      excerpt: "A comprehensive guide to TypeScript fundamentals for JavaScript developers.",
      status: "Draft",
      date: "2023-05-10",
      tags: ["TypeScript", "JavaScript", "Programming"],
    },
    {
      id: 3,
      title: "The Future of AI in Content Creation",
      excerpt: "Exploring how artificial intelligence is transforming the way we create and consume content.",
      status: "Published",
      date: "2023-05-05",
      tags: ["AI", "Content Creation", "Technology"],
    },
    {
      id: 4,
      title: "10 SEO Tips for Better Blog Performance",
      excerpt: "Practical SEO strategies to improve your blog's visibility and drive more organic traffic.",
      status: "Draft",
      date: "2023-05-01",
      tags: ["SEO", "Marketing", "Blogging"],
    },
  ]

  // Filter search results based on filters
  const filteredResults = searchResults.filter((result) => {
    const matchesSearch =
      searchQuery === "" ||
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && result.status === "Published") ||
      (statusFilter === "draft" && result.status === "Draft")

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "last-week" && new Date(result.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "last-month" && new Date(result.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesStatus && matchesDate
  })

  // Available tags for filtering
  const allTags = Array.from(new Set(searchResults.flatMap((result) => result.tags)))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger an API call with the search query
  }

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
                      <Checkbox id={`tag-${tag}`} />
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
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {filteredResults.length === 0 ? (
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
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{result.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.date).toLocaleDateString()}
                      <FileText className="ml-2 h-3 w-3" />
                      {result.status}
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
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <div key={tag} className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={result.status === "Published" ? `/preview/${result.id}` : `/editor/${result.id}`}>
                    {result.status === "Published" ? "View Post" : "Continue Editing"}
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

