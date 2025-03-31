"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Edit, Grip, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useServers } from "@/hooks/use-servers"
import { Badge } from "@/components/ui/badge"
import {
  createServerGroup,
  updateServerGroup,
  deleteServerGroup,
  updateServerGroupOrder,
  updateGroupServers,
  type ServerGroup,
} from "@/lib/actions/settings"
import { useServerGroups } from "@/hooks/use-server-groups"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export function ServerGroups() {
  const { toast } = useToast()
  const { servers } = useServers()
  const { groups, setGroups, unassignedServers, setUnassignedServers, isLoading, error } = useServerGroups()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<ServerGroup | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = async (result: any) => {
    setIsDragging(false)

    // Safety check for result
    if (!result) return

    const { source, destination, type } = result

    // Dropped outside the list
    if (!destination) return

    // Safety check for source and destination
    if (!source || !destination) return

    // Reordering groups
    if (type === "group") {
      if (!groups) return

      const reorderedGroups = [...groups]
      const [removed] = reorderedGroups.splice(source.index, 1)
      reorderedGroups.splice(destination.index, 0, removed)

      setGroups(reorderedGroups)

      try {
        await updateServerGroupOrder(reorderedGroups.map((g) => g.id))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update group order. Please try again.",
          variant: "destructive",
        })
      }
      return
    }

    // Moving servers between groups
    const sourceGroupId = source.droppableId
    const destGroupId = destination.droppableId

    // Same group
    if (sourceGroupId === destGroupId) {
      if (sourceGroupId === "unassigned") {
        if (!unassignedServers) return

        const newUnassigned = [...unassignedServers]
        const [removed] = newUnassigned.splice(source.index, 1)
        newUnassigned.splice(destination.index, 0, removed)
        setUnassignedServers(newUnassigned)
      } else {
        if (!groups) return

        const groupIndex = groups.findIndex((g) => g.id === sourceGroupId)
        if (groupIndex === -1) return

        const newGroups = [...groups]
        const newServers = [...(newGroups[groupIndex].servers || [])]
        const [removed] = newServers.splice(source.index, 1)
        newServers.splice(destination.index, 0, removed)
        newGroups[groupIndex].servers = newServers
        setGroups(newGroups)

        try {
          await updateGroupServers(sourceGroupId, newServers)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update server order. Please try again.",
            variant: "destructive",
          })
        }
      }
      return
    }

    // Moving between different groups
    let sourceServers: number[]
    let sourceIndex: number

    if (sourceGroupId === "unassigned") {
      if (!unassignedServers) return
      sourceServers = [...unassignedServers]
      sourceIndex = -1
    } else {
      if (!groups) return

      sourceIndex = groups.findIndex((g) => g.id === sourceGroupId)
      if (sourceIndex === -1) return

      sourceServers = [...(groups[sourceIndex].servers || [])]
    }

    const [removed] = sourceServers.splice(source.index, 1)

    if (destGroupId === "unassigned") {
      if (!unassignedServers) return

      const newUnassigned = [...unassignedServers]
      newUnassigned.splice(destination.index, 0, removed)
      setUnassignedServers(newUnassigned)
    } else {
      if (!groups) return

      const destIndex = groups.findIndex((g) => g.id === destGroupId)
      if (destIndex === -1) return

      const newGroups = [...groups]
      const destServers = [...(newGroups[destIndex].servers || [])]
      destServers.splice(destination.index, 0, removed)
      newGroups[destIndex].servers = destServers
      setGroups(newGroups)

      try {
        await updateGroupServers(destGroupId, destServers)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update server group. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (sourceGroupId !== "unassigned") {
      if (!groups) return

      const newGroups = [...groups]
      newGroups[sourceIndex].servers = sourceServers
      setGroups(newGroups)

      try {
        await updateGroupServers(sourceGroupId, sourceServers)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update server group. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      setUnassignedServers(sourceServers)
    }
  }

  const handleAddGroup = () => {
    setCurrentGroup(null)
    setIsGroupDialogOpen(true)
  }

  const handleEditGroup = (group: ServerGroup) => {
    setCurrentGroup(group)
    setIsGroupDialogOpen(true)
  }

  const handleDeleteGroup = async (groupId: string) => {
    setIsSubmitting(true)

    try {
      await deleteServerGroup(groupId)

      // Move servers from deleted group to unassigned
      if (groups) {
        const groupIndex = groups.findIndex((g) => g.id === groupId)
        if (groupIndex !== -1) {
          const groupServers = groups[groupIndex].servers || []
          setUnassignedServers((prev) => [...(prev || []), ...groupServers])
          setGroups((prev) => (prev || []).filter((g) => g.id !== groupId))
        }
      }

      toast({
        title: "Group deleted",
        description: "The server group has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the server group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      if (currentGroup) {
        // Update existing group
        await updateServerGroup(currentGroup.id, { name, description })

        setGroups((prev) => (prev || []).map((g) => (g.id === currentGroup.id ? { ...g, name, description } : g)))

        toast({
          title: "Group updated",
          description: "The server group has been updated successfully.",
        })
      } else {
        // Create new group
        const newGroup = await createServerGroup({ name, description })

        setGroups((prev) => [...(prev || []), { ...newGroup, servers: [] }])

        toast({
          title: "Group created",
          description: "The server group has been created successfully.",
        })
      }

      setIsGroupDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentGroup ? "update" : "create"} the server group. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServerName = (serverId: number) => {
    if (!servers) return `Server ${serverId}`
    const server = servers.find((s) => s.id === serverId)
    return server?.name || `Server ${serverId}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load server groups. Please refresh the page and try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Server Groups</CardTitle>
            <CardDescription>Organize your servers into groups and manage them efficiently</CardDescription>
          </div>
          <Button onClick={handleAddGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="groups" type="group">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {groups && groups.length > 0 ? (
                    groups.map((group, index) => (
                      <Draggable key={group.id} draggableId={group.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} className="border rounded-lg">
                            <div className="p-4 flex items-center justify-between bg-muted/20 rounded-t-lg border-b">
                              <div className="flex items-center">
                                <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                  <Grip className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{group.name}</h3>
                                  <p className="text-sm text-muted-foreground">{group.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {(group.servers || []).length} server{(group.servers || []).length !== 1 ? "s" : ""}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Group
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleDeleteGroup(group.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Group
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            <Droppable droppableId={group.id} type="server">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`p-4 min-h-[100px] ${snapshot.isDraggingOver ? "bg-muted/30" : ""}`}
                                >
                                  {group.servers && group.servers.length > 0 ? (
                                    <div className="space-y-2">
                                      {group.servers.map((serverId, index) => (
                                        <Draggable
                                          key={`server-${serverId}`}
                                          draggableId={`server-${serverId}`}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className="p-3 bg-background border rounded-md flex items-center justify-between"
                                            >
                                              <span>{getServerName(serverId)}</span>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                                      <p className="text-sm text-muted-foreground">Drag and drop servers here</p>
                                    </div>
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <EmptyState
                      icon={<Grip className="h-10 w-10" />}
                      title="No server groups"
                      description="Create your first server group to organize your servers"
                      actionLabel="Add Group"
                      actionLink="#"
                      action={
                        <Button onClick={handleAddGroup}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Group
                        </Button>
                      }
                    />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="mt-8">
              <h3 className="font-medium mb-4">Unassigned Servers</h3>
              <Droppable droppableId="unassigned" type="server">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 border rounded-lg min-h-[100px] ${snapshot.isDraggingOver ? "bg-muted/30" : ""}`}
                  >
                    {unassignedServers && unassignedServers.length > 0 ? (
                      <div className="space-y-2">
                        {unassignedServers.map((serverId, index) => (
                          <Draggable key={`server-${serverId}`} draggableId={`server-${serverId}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 bg-background border rounded-md flex items-center justify-between"
                              >
                                <span>{getServerName(serverId)}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20">
                        <p className="text-sm text-muted-foreground">No unassigned servers</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentGroup ? "Edit Group" : "Create Group"}</DialogTitle>
            <DialogDescription>
              {currentGroup ? "Update the server group details" : "Create a new server group to organize your servers"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveGroup}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentGroup?.name || ""}
                  placeholder="e.g., Production Servers"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={currentGroup?.description || ""}
                  placeholder="e.g., Main production environment servers"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : currentGroup ? "Update Group" : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

