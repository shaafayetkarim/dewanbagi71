"use client"

import Link from "next/link"
import { PenTool, FileText, FolderOpen, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionDiv, MotionCard, cardHover, staggerContainer, slideUp } from "@/components/ui/motion"

export default function DashboardPage() {
  // Mock data - in a real app, this would come from an API
  const recentIdeas = [
    { id: 1, title: "10 Ways to Improve Your Writing Skills", date: "2 days ago" },
    { id: 2, title: "The Future of AI in Content Creation", date: "3 days ago" },
    { id: 3, title: "How to Build a Successful Blog in 2023", date: "1 week ago" },
  ]

  const savedDrafts = [
    { id: 1, title: "Getting Started with Next.js", status: "Needs Editing", date: "Yesterday" },
    { id: 2, title: "Understanding TypeScript for Beginners", status: "Ready to Publish", date: "3 days ago" },
  ]

  const stats = [
    { title: "Total Blogs", value: "12" },
    { title: "Published", value: "8" },
    { title: "Drafts", value: "4" },
    { title: "Generations Left", value: "18/20" },
  ]

  return (
    <MotionDiv initial="hidden" animate="visible" variants={staggerContainer} className="container py-8 md:py-12">
      <MotionDiv variants={slideUp} className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your blog content.</p>
        </div>
        <Button asChild className="group transition-all duration-300 hover:shadow-md">
          <Link href="/generate" className="flex items-center">
            <PenTool className="mr-2 h-4 w-4" />
            <span>Generate New Blog</span>
          </Link>
        </Button>
      </MotionDiv>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <MotionCard
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="overflow-hidden border-none bg-card shadow transition-all duration-300 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </MotionCard>
        ))}
      </div>

      <MotionDiv variants={slideUp} transition={{ delay: 0.3 }} className="mt-8">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6 w-full justify-start sm:w-auto">
            <TabsTrigger value="recent" className="transition-all duration-300">
              Recent Ideas
            </TabsTrigger>
            <TabsTrigger value="drafts" className="transition-all duration-300">
              Saved Drafts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentIdeas.map((idea, index) => (
                <MotionDiv
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover="hover"
                  variants={cardHover}
                >
                  <Card className="h-full border-none shadow transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{idea.title}</CardTitle>
                      <CardDescription>{idea.date}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="group w-full" asChild>
                        <Link href={`/generate?idea=${idea.id}`} className="flex items-center justify-center">
                          Expand Idea
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="drafts" className="mt-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedDrafts.map((draft, index) => (
                <MotionDiv
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover="hover"
                  variants={cardHover}
                >
                  <Card className="h-full border-none shadow transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{draft.title}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span>{draft.date}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            draft.status === "Ready to Publish"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                          }`}
                        >
                          {draft.status}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full transition-all duration-300 hover:bg-primary/10"
                        asChild
                      >
                        <Link href={`/editor/${draft.id}`}>
                          <FileText className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full transition-all duration-300 hover:bg-primary/10"
                        asChild
                      >
                        <Link href={`/collections?draft=${draft.id}`}>
                          <FolderOpen className="mr-2 h-4 w-4" /> Add to Collection
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </MotionDiv>
    </MotionDiv>
  )
}

