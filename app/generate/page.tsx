"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MotionDiv, fadeIn, slideUp } from "@/components/ui/motion"

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate blog ideas",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation - replace with actual API call
    setTimeout(() => {
      const mockIdeas = [
        `How to Master ${topic} in 30 Days`,
        `The Ultimate Guide to ${topic} for Beginners`,
        `10 Advanced ${topic} Techniques You Need to Know`,
        `Why ${topic} is Essential for Your Business Growth`,
        `The Future of ${topic}: Trends to Watch in 2023`,
      ]

      setGeneratedIdeas(mockIdeas)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSaveIdea = () => {
    if (!selectedIdea) {
      toast({
        title: "No idea selected",
        description: "Please select an idea to save",
        variant: "destructive",
      })
      return
    }

    // Simulate saving - replace with actual API call
    toast({
      title: "Idea saved",
      description: "Your blog idea has been saved to drafts",
    })

    // Navigate to drafts page
    router.push("/drafts")
  }

  const handleExpandIdea = () => {
    if (!selectedIdea) {
      toast({
        title: "No idea selected",
        description: "Please select an idea to expand",
        variant: "destructive",
      })
      return
    }

    // Simulate expanding - replace with actual API call
    toast({
      title: "Generating full blog",
      description: "Your full blog post is being generated",
    })

    // Navigate to editor page
    router.push("/editor/new")
  }

  return (
    <MotionDiv initial="hidden" animate="visible" variants={slideUp} className="container py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Generate Blog Content</h1>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="mb-6 w-full justify-start sm:w-auto">
          <TabsTrigger value="ideas" className="transition-all duration-300">
            Generate Ideas
          </TabsTrigger>
          <TabsTrigger value="full" className="transition-all duration-300">
            Full Blog Post
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-6">
          <MotionDiv variants={fadeIn} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Blog Idea Generator</CardTitle>
                <CardDescription>Enter a topic and optional keywords to generate blog ideas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Digital Marketing, Web Development, AI"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (optional)</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., beginner, tutorial, trends"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="w-full transition-all duration-300 hover:shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Ideas
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </MotionDiv>

          {generatedIdeas.length > 0 && (
            <MotionDiv variants={fadeIn} transition={{ delay: 0.3 }} className="mt-6">
              <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Generated Ideas</CardTitle>
                  <CardDescription>Select an idea to save or expand into a full blog post</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {generatedIdeas.map((idea, index) => (
                      <MotionDiv
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className={`cursor-pointer rounded-md border p-3 transition-colors hover:bg-accent ${
                          selectedIdea === idea ? "border-primary bg-accent" : ""
                        }`}
                        onClick={() => setSelectedIdea(idea)}
                      >
                        {idea}
                      </MotionDiv>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={handleSaveIdea}
                    disabled={!selectedIdea}
                    className="w-full transition-all duration-300 hover:bg-primary/10"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Drafts
                  </Button>
                  <Button
                    onClick={handleExpandIdea}
                    disabled={!selectedIdea}
                    className="w-full transition-all duration-300 hover:shadow-md"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Expand to Full Blog
                  </Button>
                </CardFooter>
              </Card>
            </MotionDiv>
          )}
        </TabsContent>

        <TabsContent value="full" className="mt-6">
          <MotionDiv variants={fadeIn} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Full Blog Generator</CardTitle>
                <CardDescription>
                  Describe what you want to write about and we'll generate a complete blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Blog Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your blog post"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want to write about in detail..."
                    className="min-h-[150px] transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <select
                      id="tone"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
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
                    <Label htmlFor="length">Length</Label>
                    <select
                      id="length"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      defaultValue="medium"
                    >
                      <option value="short">Short (300-500 words)</option>
                      <option value="medium">Medium (500-800 words)</option>
                      <option value="long">Long (800-1200 words)</option>
                      <option value="comprehensive">Comprehensive (1200+ words)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full transition-all duration-300 hover:shadow-md">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Full Blog Post
                </Button>
              </CardFooter>
            </Card>
          </MotionDiv>
        </TabsContent>
      </Tabs>
    </MotionDiv>
  )
}

