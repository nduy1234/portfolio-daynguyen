import { promises as fs } from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

export type ContactSubmission = {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  userAgent?: string
  ip?: string
}

const DEFAULT_STORE_PATH = path.join(process.cwd(), "data", "contact-submissions.json")

function getStorePath() {
  return process.env.CONTACT_STORE_PATH || DEFAULT_STORE_PATH
}

async function ensureDirExists(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

async function readAll(filePath: string): Promise<ContactSubmission[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ContactSubmission[]) : []
  } catch (e: any) {
    if (e?.code === "ENOENT") return []
    throw e
  }
}

async function atomicWrite(filePath: string, content: string) {
  await ensureDirExists(filePath)
  const tmp = `${filePath}.${crypto.randomUUID()}.tmp`
  await fs.writeFile(tmp, content, "utf8")
  await fs.rename(tmp, filePath)
}

export async function createContactSubmission(input: Omit<ContactSubmission, "id" | "createdAt">) {
  const filePath = getStorePath()
  const all = await readAll(filePath)
  const createdAt = new Date().toISOString()

  const record: ContactSubmission = {
    id: crypto.randomUUID(),
    createdAt,
    ...input,
  }

  all.unshift(record)
  await atomicWrite(filePath, JSON.stringify(all, null, 2))
  return record
}

export async function listContactSubmissions(): Promise<ContactSubmission[]> {
  const filePath = getStorePath()
  return await readAll(filePath)
}

