import type { Task } from "@/types/task"

const STORAGE_KEY = "natural-language-tasks"

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
