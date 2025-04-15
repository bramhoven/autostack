// Types
interface Installation {
  id: number
  status: string
  [key: string]: any
}

interface UpdateInstallationParams {
  id: number
  data: Partial<Installation>
}

interface ToggleStatusParams {
  id: number
  status: string
}

// API functions
export async function updateInstallation({ id, data }: UpdateInstallationParams): Promise<Installation> {
  try {
    // In a real app, this would be an API call to update the installation
    // For now, we'll simulate a successful update
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Installation
  } catch (error) {
    console.error("Error updating installation:", error)
    throw new Error("Failed to update installation")
  }
}

export async function deleteInstallation(id: number): Promise<{ success: boolean }> {
  try {
    // In a real app, this would be an API call to delete the installation
    // For now, we'll simulate a successful deletion
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true }
  } catch (error) {
    console.error("Error deleting installation:", error)
    throw new Error("Failed to delete installation")
  }
}

export async function toggleInstallationStatus({ id, status }: ToggleStatusParams): Promise<Installation> {
  try {
    // In a real app, this would be an API call to toggle the installation status
    // For now, we'll simulate a successful status toggle
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newStatus = status === "active" ? "inactive" : "active"

    return {
      id,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    } as Installation
  } catch (error) {
    console.error("Error toggling installation status:", error)
    throw new Error("Failed to toggle installation status")
  }
}
