// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Save,
//   ArrowLeft,
//   Image,
//   Link2,
//   ListOrdered,
//   Bold,
//   Italic,
//   Underline,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Sparkles,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
// import { MotionDiv, MotionButton, fadeIn, slideUp } from "@/components/ui/motion"

// export default function EditorPage({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [title, setTitle] = useState("Getting Started with Next.js")
//   const [content, setContent] = useState(
//     "Next.js is a React framework that enables server-side rendering and static site generation for React applications. It's designed to make it easier to build production-ready React applications by providing a set of features that are commonly needed in web applications.\n\nIn this blog post, we'll explore the key features of Next.js and how to get started with it.",
//   )
//   const [status, setStatus] = useState("Needs Editing")
//   const [isSaving, setIsSaving] = useState(false)
//   const [isImproving, setIsImproving] = useState(false)

//   const handleSave = () => {
//     if (!title.trim()) {
//       toast({
//         title: "Title required",
//         description: "Please enter a title for your blog post",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSaving(true)

//     // Simulate saving - replace with actual API call
//     setTimeout(() => {
//       setIsSaving(false)
//       toast({
//         title: "Blog saved",
//         description: "Your blog post has been saved successfully",
//       })
//     }, 1000)
//   }

//   const handlePublish = () => {
//     if (!title.trim()) {
//       toast({
//         title: "Title required",
//         description: "Please enter a title for your blog post",
//         variant: "destructive",
//       })
//       return
//     }

//     // Simulate publishing - replace with actual API call
//     toast({
//       title: "Blog published",
//       description: "Your blog post has been published successfully",
//     })

//     // Navigate to dashboard
//     router.push("/dashboard")
//   }

//   const handleAIImprove = async () => {
//     if (!content.trim()) {
//       toast({
//         title: "Content required",
//         description: "Please add some content to improve",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsImproving(true)
//     toast({
//       title: "AI Improvement",
//       description: "Gemini AI is analyzing and improving your content...",
//     })

//     try {
//       console.log("Improving content with Gemini AI...")
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to improve content');
//       }

//       const data = await response.json();
//       setContent(data.improvedContent);
      
//       toast({
//         title: "Content improved",
//         description: "Gemini AI has enhanced your blog content",
//       })
//     } catch (error) {
//       console.error('Error improving content:', error);
//       toast({
//         title: "Error",
//         description: "Failed to improve content. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsImproving(false)
//     }
//   }

//   return (
//     <MotionDiv initial="hidden" animate="visible" variants={slideUp} className="container mx-auto p-4 sm:p-6 md:p-8">
//       <MotionDiv
//         variants={fadeIn}
//         transition={{ delay: 0.1 }}
//         className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
//       >
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => router.back()}
//             className="transition-all duration-300 hover:bg-primary/10"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
//         </div>
//         <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
//           <Select value={status} onValueChange={setStatus}>
//             <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/50">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Needs Editing">Needs Editing</SelectItem>
//               <SelectItem value="Ready to Publish">Ready to Publish</SelectItem>
//               <SelectItem value="Incomplete">Incomplete</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button
//             variant="outline"
//             onClick={handleSave}
//             disabled={isSaving}
//             className="transition-all duration-300 hover:bg-primary/10"
//           >
//             {isSaving ? "Saving..." : "Save Draft"}
//           </Button>
//           <Button onClick={handlePublish} className="transition-all duration-300 hover:shadow-md">
//             Publish
//           </Button>
//         </div>
//       </MotionDiv>

//       <MotionDiv variants={fadeIn} transition={{ delay: 0.2 }} className="mb-4 space-y-2">
//         <Label htmlFor="title">Title</Label>
//         <Input
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Enter blog title"
//           className="text-lg transition-all duration-200 focus:ring-2 focus:ring-primary/50"
//         />
//       </MotionDiv>

//       <MotionDiv
//         variants={fadeIn}
//         transition={{ delay: 0.3 }}
//         className="mb-4 overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-md"
//       >
//         <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-2">
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Bold className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Italic className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Underline className="h-4 w-4" />
//           </MotionButton>
//           <Separator orientation="vertical" className="mx-1 h-8" />
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <AlignLeft className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <AlignCenter className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <AlignRight className="h-4 w-4" />
//           </MotionButton>
//           <Separator orientation="vertical" className="mx-1 h-8" />
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <ListOrdered className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Link2 className="h-4 w-4" />
//           </MotionButton>
//           <MotionButton
//             variant="ghost"
//             size="sm"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Image className="h-4 w-4" />
//           </MotionButton>
//           <div className="ml-auto">
//             <MotionButton
//               variant="ghost"
//               size="sm"
//               onClick={handleAIImprove}
//               disabled={isImproving}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ duration: 0.2 }}
//               className="group"
//             >
//               <Sparkles className="mr-2 h-4 w-4 transition-all duration-300 group-hover:text-amber-500" />
//               {isImproving ? "Improving..." : "AI Improve"}
//             </MotionButton>
//           </div>
//         </div>
//         <Textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Write your blog content here..."
//           className="min-h-[500px] resize-none rounded-none border-0 p-4 focus-visible:ring-0"
//         />
//       </MotionDiv>

//       <MotionDiv variants={fadeIn} transition={{ delay: 0.4 }} className="flex flex-col justify-end gap-2 sm:flex-row">
//         <Button
//           variant="outline"
//           onClick={handleSave}
//           disabled={isSaving || isImproving}
//           className="transition-all duration-300 hover:bg-primary/10"
//         >
//           <Save className="mr-2 h-4 w-4" />
//           {isSaving ? "Saving..." : "Save Draft"}
//         </Button>
//         <Button 
//           onClick={handlePublish} 
//           disabled={isImproving}
//           className="transition-all duration-300 hover:shadow-md"
//         >
//           Publish
//         </Button>
//       </MotionDiv>
//     </MotionDiv>
//   )
// }





"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  ArrowLeft,
  Image,
  Link2,
  ListOrdered,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MotionDiv, MotionButton, fadeIn, slideUp } from "@/components/ui/motion"

export default function EditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isImproving, setIsImproving] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/posts/${params.id}`)

        if (!res.ok) {
          throw new Error("Failed to fetch post")
        }

        const data = await res.json()
        setTitle(data.post.title)
        setContent(data.post.content)
        setStatus(data.post.status)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, toast])

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save post")
      }

      toast({
        title: "Blog saved",
        description: "Your blog post has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          status: "published",
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to publish post")
      }

      toast({
        title: "Blog published",
        description: "Your blog post has been published successfully",
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      })
    }
  }

  const handleAIImprove = async () => {
    setIsImproving(true)

    try {
      const res = await fetch(`/api/generate/improve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          postId: params.id,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to improve content")
      }

      const data = await res.json()
      setContent(data.improvedContent)

      toast({
        title: "Content improved",
        description: "AI has enhanced your blog content",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve content",
        variant: "destructive",
      })
    } finally {
      setIsImproving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <MotionDiv initial="hidden" animate="visible" variants={slideUp} className="container mx-auto p-4 sm:p-6 md:p-8">
      <MotionDiv
        variants={fadeIn}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="transition-all duration-300 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="transition-all duration-300 hover:bg-primary/10"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={handlePublish} className="transition-all duration-300 hover:shadow-md">
            Publish
          </Button>
        </div>
      </MotionDiv>

      <MotionDiv variants={fadeIn} transition={{ delay: 0.2 }} className="mb-4 space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="text-lg transition-all duration-200 focus:ring-2 focus:ring-primary/50"
        />
      </MotionDiv>

      <MotionDiv
        variants={fadeIn}
        transition={{ delay: 0.3 }}
        className="mb-4 overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-2">
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Bold className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Italic className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Underline className="h-4 w-4" />
          </MotionButton>
          <Separator orientation="vertical" className="mx-1 h-8" />
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AlignLeft className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AlignCenter className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AlignRight className="h-4 w-4" />
          </MotionButton>
          <Separator orientation="vertical" className="mx-1 h-8" />
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ListOrdered className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link2 className="h-4 w-4" />
          </MotionButton>
          <MotionButton
            variant="ghost"
            size="sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image className="h-4 w-4" />
          </MotionButton>
          <div className="ml-auto">
            <MotionButton
              variant="ghost"
              size="sm"
              onClick={handleAIImprove}
              disabled={isImproving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              {isImproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 transition-all duration-300 group-hover:text-amber-500" />
                  AI Improve
                </>
              )}
            </MotionButton>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          className="min-h-[500px] resize-none rounded-none border-0 p-4 focus-visible:ring-0"
        />
      </MotionDiv>

      <MotionDiv variants={fadeIn} transition={{ delay: 0.4 }} className="flex flex-col justify-end gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="transition-all duration-300 hover:bg-primary/10"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>
        <Button onClick={handlePublish} className="transition-all duration-300 hover:shadow-md">
          Publish
        </Button>
      </MotionDiv>
    </MotionDiv>
  )
}

