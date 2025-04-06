import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      subscription: "premium",
      generationsLeft: 999,
      generationsTotal: 999,
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
      subscription: "free",
      generationsLeft: 18,
      generationsTotal: 20,
    },
  })

  // Create sample posts for admin
  const adminPost1 = await prisma.post.create({
    data: {
      title: "Getting Started with Next.js",
      content:
        "Next.js is a React framework that enables server-side rendering and static site generation for React applications. It's designed to make it easier to build production-ready React applications by providing a set of features that are commonly needed in web applications.\n\nIn this blog post, we'll explore the key features of Next.js and how to get started with it.",
      excerpt: "Learn how to build modern web applications with Next.js, the React framework for production.",
      status: "published",
      wordCount: 850,
      authorId: admin.id,
      likes: 15,
    },
  })

  const adminPost2 = await prisma.post.create({
    data: {
      title: "Understanding TypeScript for Beginners",
      content:
        "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds static type definitions to JavaScript, which can help you catch errors early and make your code more robust.\n\nIn this comprehensive guide, we'll cover TypeScript fundamentals for JavaScript developers.",
      excerpt: "A comprehensive guide to TypeScript fundamentals for JavaScript developers.",
      status: "published",
      wordCount: 1200,
      authorId: admin.id,
      likes: 8,
    },
  })

  // Create sample posts for user
  const userPost1 = await prisma.post.create({
    data: {
      title: "The Future of AI in Content Creation",
      content:
        "Artificial intelligence is transforming the way we create and consume content. From automated blog post generation to intelligent content recommendations, AI is changing the content creation landscape.\n\nIn this post, we explore how AI is being used in content creation today and what the future might hold.",
      excerpt: "Exploring how artificial intelligence is transforming the way we create and consume content.",
      status: "draft",
      wordCount: 450,
      authorId: user.id,
      likes: 3,
    },
  })

  const userPost2 = await prisma.post.create({
    data: {
      title: "10 SEO Tips for Better Blog Performance",
      content:
        "Search Engine Optimization (SEO) is crucial for driving organic traffic to your blog. By implementing the right SEO strategies, you can improve your blog's visibility and reach a wider audience.\n\nHere are 10 practical SEO tips to improve your blog's performance and drive more organic traffic.",
      excerpt: "Practical SEO strategies to improve your blog's visibility and drive more organic traffic.",
      status: "draft",
      wordCount: 950,
      authorId: user.id,
      likes: 5,
    },
  })

  // Create collections
  const adminCollection = await prisma.collection.create({
    data: {
      name: "Web Development",
      description: "Articles about web development technologies and best practices",
      userId: admin.id,
      posts: {
        connect: [{ id: adminPost1.id }, { id: adminPost2.id }],
      },
    },
  })

  const userCollection = await prisma.collection.create({
    data: {
      name: "Content Marketing",
      description: "Resources for effective content marketing",
      userId: user.id,
      posts: {
        connect: [{ id: userPost1.id }, { id: userPost2.id }],
      },
    },
  })

  // Create saved posts
  await prisma.savedPost.create({
    data: {
      userId: user.id,
      postId: adminPost1.id,
    },
  })

  await prisma.savedPost.create({
    data: {
      userId: admin.id,
      postId: userPost2.id,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

