/**
 * Encryption utilities for sensitive data
 */

import crypto from "crypto"

// Get the encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

// Check if a string is already encrypted
export function isEncrypted(text: string): boolean {
  try {
    if (!text || typeof text !== "string") {
      return false
    }

    // Encrypted strings should be base64 and have a specific format
    const parts = text.split(":")
    return parts.length === 2 && parts[0].length === 32 && /^[A-Za-z0-9+/=]+$/.test(parts[1])
  } catch {
    return false
  }
}

// Encrypt a string using AES-256-CBC
export function encrypt(text: string): string {
  try {
    if (!text || typeof text !== "string") {
      console.warn("Invalid text provided for encryption")
      return text
    }

    if (!ENCRYPTION_KEY) {
      console.warn("ENCRYPTION_KEY is not set. Using plaintext.")
      return text
    }

    // If the text is already encrypted, return it as is
    if (isEncrypted(text)) {
      return text
    }

    // Create a buffer from the encryption key
    const key = crypto.createHash("sha256").update(String(ENCRYPTION_KEY)).digest()

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16)

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "base64")
    encrypted += cipher.final("base64")

    // Return the IV and encrypted text as a single string
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption error:", error)
    // Return the original text if encryption fails
    return text
  }
}

// Decrypt a string that was encrypted using AES-256-CBC
export function decrypt(encryptedText: string): string {
  try {
    if (!encryptedText || typeof encryptedText !== "string") {
      console.warn("Invalid text provided for decryption")
      return encryptedText
    }

    if (!ENCRYPTION_KEY) {
      console.warn("ENCRYPTION_KEY is not set. Using plaintext.")
      return encryptedText
    }

    // If the text is not encrypted, return it as is
    if (!isEncrypted(encryptedText)) {
      return encryptedText
    }

    // Split the IV and encrypted text
    const [ivHex, encrypted] = encryptedText.split(":")

    // Create a buffer from the encryption key
    const key = crypto.createHash("sha256").update(String(ENCRYPTION_KEY)).digest()

    // Convert the IV from hex to buffer
    const iv = Buffer.from(ivHex, "hex")

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

    // Decrypt the text
    let decrypted = decipher.update(encrypted, "base64", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    // Return the original text if decryption fails
    return encryptedText
  }
}
