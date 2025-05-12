/**
 * Encryption utilities for sensitive data
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

// The encryption algorithm to use
const ALGORITHM = "aes-256-gcm"

// Get the encryption key from environment variables
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set")
  }

  // If the key is already a buffer or the right length, use it directly
  if (key.length === 32) {
    return Buffer.from(key)
  }

  // Otherwise, derive a key using a hash function
  return Buffer.from(key.padEnd(32, "0").slice(0, 32))
}

/**
 * Encrypts a string using AES-256-GCM
 * @param text The text to encrypt
 * @returns The encrypted text as a base64 string
 */
export async function encrypt(text: string): Promise<string> {
  try {
    if (!text) {
      return ""
    }

    // Get the encryption key
    const key = getEncryptionKey()

    // Create a random initialization vector
    const iv = randomBytes(16)

    // Create the cipher
    const cipher = createCipheriv(ALGORITHM, key, iv)

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "base64")
    encrypted += cipher.final("base64")

    // Get the authentication tag
    const authTag = cipher.getAuthTag()

    // Combine the IV, encrypted text, and authentication tag
    const result = JSON.stringify({
      iv: iv.toString("base64"),
      encrypted,
      authTag: authTag.toString("base64"),
    })

    return Buffer.from(result).toString("base64")
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Decrypts a string that was encrypted using AES-256-GCM
 * @param encryptedText The encrypted text as a base64 string
 * @returns The decrypted text
 */
export async function decrypt(encryptedText: string): Promise<string> {
  try {
    if (!encryptedText) {
      return ""
    }

    // Get the encryption key
    const key = getEncryptionKey()

    // Parse the encrypted data
    const data = JSON.parse(Buffer.from(encryptedText, "base64").toString())
    const iv = Buffer.from(data.iv, "base64")
    const authTag = Buffer.from(data.authTag, "base64")

    // Create the decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    // Decrypt the text
    let decrypted = decipher.update(data.encrypted, "base64", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}
