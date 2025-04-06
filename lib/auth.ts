import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function signJWT(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const token = cookies().get("token")?.value
  if (!token) return null

  const payload = await verifyJWT(token)
  return payload
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session || !session.id) return null

  return session as User
}

export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null

  return verifyJWT(token)
}

