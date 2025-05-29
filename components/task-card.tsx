"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PriorityBadge } from "./priority-badge"
import type { Task } from "@/types/task"
import { Calendar, Clock, User, Edit2, Save, X, Trash2, AlertTriangle } from "lucide-react"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

export function TaskCard({ task, onUpdate, onDelete, onToggleComplete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: task.name,
    assignee: task.assignee,
    dueDate: task.dueDate,
    dueTime: task.dueTime || "",
    priority: task.priority,
  })

  const handleSave = () => {
    onUpdate(task.id, {
      ...editData,
      dueTime: editData.dueTime || undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: task.name,
      assignee: task.assignee,
      dueDate: task.dueDate,
      dueTime: task.dueTime || "",
      priority: task.priority,
    })
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ""
    try {
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return timeString
    }
  }

  const isOverdue = () => {
    if (task.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    return dueDate < today
  }

  const getDaysUntilDue = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue()
  const overdue = isOverdue()

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
        task.completed
          ? "opacity-70 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
          : overdue
            ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
            : "border-border hover:border-primary/50"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="transition-all duration-200 hover:scale-110"
            />
            <PriorityBadge priority={task.priority} size="sm" />
            {overdue && !task.completed && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-full text-xs animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                Overdue
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0 hover:bg-muted">
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {isEditing ? (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Task name"
                className="font-medium"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={editData.assignee}
                  onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                  placeholder="Assignee"
                />
                <Select
                  value={editData.priority}
                  onValueChange={(value: "P1" | "P2" | "P3" | "P4") => setEditData({ ...editData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                />
                <Input
                  type="time"
                  value={editData.dueTime}
                  onChange={(e) => setEditData({ ...editData, dueTime: e.target.value })}
                  placeholder="Optional time"
                />
              </div>
            </div>
          ) : (
            <>
              <h3
                className={`font-semibold text-lg leading-tight transition-all duration-200 ${
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.name}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{task.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(task.dueDate)}</span>
                  {!task.completed && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        daysUntilDue < 0
                          ? "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                          : daysUntilDue === 0
                            ? "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                            : daysUntilDue <= 3
                              ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
                              : "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {daysUntilDue < 0
                        ? `${Math.abs(daysUntilDue)}d overdue`
                        : daysUntilDue === 0
                          ? "Due today"
                          : daysUntilDue === 1
                            ? "Due tomorrow"
                            : `${daysUntilDue}d left`}
                    </span>
                  )}
                </div>
                {task.dueTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(task.dueTime)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
