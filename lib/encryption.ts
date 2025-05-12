import crypto from "crypto"

// Get the encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  console.error("ENCRYPTION_KEY environment variable is not set")
}

// Algorithm to use for encryption
const ALGORITHM = "aes-256-cbc"

/**
 * Encrypts a string using AES-256-CBC
 * @param text The text to encrypt
 * @returns The encrypted text as a base64 string
 */
export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key is not set")
  }

  // Create a buffer from the encryption key (must be 32 bytes for aes-256)
  const key = crypto.createHash("sha256").update(String(ENCRYPTION_KEY)).digest("base64").substring(0, 32)

  // Create a random initialization vector
  const iv = crypto.randomBytes(16)

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return the IV and encrypted data as a single base64 string
  return Buffer.from(iv.toString("hex") + ":" + encrypted).toString("base64")
}

/**
 * Decrypts a string that was encrypted with the encrypt function
 * @param encryptedText The encrypted text as a base64 string
 * @returns The decrypted text
 */
export function decrypt(encryptedText: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key is not set")
  }

  // Create a buffer from the encryption key (must be 32 bytes for aes-256)
  const key = crypto.createHash("sha256").update(String(ENCRYPTION_KEY)).digest("base64").substring(0, 32)

  // Decode the base64 string
  const encryptedBuffer = Buffer.from(encryptedText, "base64").toString()

  // Split the IV and encrypted data
  const textParts = encryptedBuffer.split(":")

  // Convert the IV from hex to a buffer
  const iv = Buffer.from(textParts.shift() || "", "hex")

  // Get the encrypted text
  const encryptedData = textParts.join(":")

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

/**
 * Checks if a string is encrypted
 * @param text The text to check
 * @returns True if the text appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
  try {
    // Try to decode as base64
    const decoded = Buffer.from(text, "base64").toString()

    // Check if it has the expected format (iv:encrypted)
    return decoded.includes(":") && decoded.split(":").length >= 2
  } catch (error) {
    return false
  }
}
