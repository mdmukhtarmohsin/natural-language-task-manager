"use client"

import { TaskInputForm } from "@/components/task-input-form"
import { TaskBoard } from "@/components/task-board"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTasks } from "@/hooks/use-tasks"
import type { ParsedTaskData } from "@/types/task"
import { Brain, CheckSquare, Sparkles } from "lucide-react"

export default function HomePage() {
  const { tasks, isLoading, addTask, addMultipleTasks, updateTask, deleteTask, toggleTaskCompletion } = useTasks()

  const handleTasksParsed = (parsedTasks: ParsedTaskData[]) => {
    if (parsedTasks.length === 1) {
      addTask(parsedTasks[0])
    } else {
      addMultipleTasks(parsedTasks)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <CheckSquare className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <Sparkles className="h-6 w-6 text-primary/60 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading your workspace</h2>
            <p className="text-muted-foreground">Preparing your intelligent task manager...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TaskMind AI
                </h1>
                <p className="text-xs text-muted-foreground">Intelligent Task Management</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Powered by Gemini AI
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Transform Ideas into Action
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Convert natural language descriptions and meeting transcripts into organized, actionable tasks. Let AI
            handle the parsing while you focus on getting things done.
          </p>
        </div>

        {/* Task Input */}
        <div className="max-w-4xl mx-auto">
          <TaskInputForm onTasksParsed={handleTasksParsed} />
        </div>

        {/* Task Board */}
        <div className="max-w-7xl mx-auto">
          <TaskBoard
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleComplete={toggleTaskCompletion}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>TaskMind AI - Intelligent Task Management</span>
            </div>
            <div className="text-xs text-muted-foreground">Built with Next.js, Tailwind CSS, and Gemini AI</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
