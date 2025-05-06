import crypto from "crypto"

// Use environment variable for encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-encryption-key-for-development-only"

// Encrypt sensitive data
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const key = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest("base64").substring(0, 32)
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return IV + encrypted data
  return iv.toString("hex") + ":" + encrypted
}

// Decrypt sensitive data
export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedData] = encryptedText.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const key = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest("base64").substring(0, 32)
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

  let decrypted = decipher.update(encryptedData, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
