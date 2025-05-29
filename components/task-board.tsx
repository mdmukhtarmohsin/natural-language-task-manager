"use client"

import { useState, useMemo } from "react"
import type { Task } from "@/types/task"
import { TaskCard } from "./task-card"
import { SearchFilter } from "./search-filter"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, AlertCircle, TrendingUp, Users, Calendar } from "lucide-react"

interface TaskBoardProps {
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onToggleComplete: (id: string) => void
}

export function TaskBoard({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }: TaskBoardProps) {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks)

  // Update filtered tasks when tasks change
  useMemo(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const completed = tasks.filter((task) => task.completed)
    const pending = tasks.filter((task) => !task.completed)
    const overdue = pending.filter((task) => new Date(task.dueDate) < today)
    const dueToday = pending.filter((task) => {
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    })

    const assignees = [...new Set(tasks.map((task) => task.assignee))].length
    const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      dueToday: dueToday.length,
      assignees,
      completionRate,
    }
  }, [tasks])

  const completedTasks = filteredTasks.filter((task) => task.completed)
  const pendingTasks = filteredTasks.filter((task) => !task.completed)

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <CheckSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start by adding your first task using natural language or paste meeting transcripts above. Our AI will
              automatically extract and organize your tasks.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Overdue</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Due Today</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.dueToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Assignees</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.assignees}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Complete</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <SearchFilter tasks={tasks} onFilteredTasks={setFilteredTasks} />

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Pending Tasks</CardTitle>
            <Badge
              variant="secondary"
              className="bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
            >
              {pendingTasks.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Completed Tasks</CardTitle>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300">
              {completedTasks.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTasks.length === 0 && tasks.length > 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <CheckSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks match your filters</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
