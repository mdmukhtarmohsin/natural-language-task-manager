"use client"

import { useState, useEffect } from "react"
import type { Task, ParsedTaskData } from "@/types/task"
import { saveTasks, loadTasks, generateTaskId } from "@/lib/storage"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadedTasks = loadTasks()
    setTasks(loadedTasks)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks)
    }
  }, [tasks, isLoading])

  const addTask = (taskData: ParsedTaskData) => {
    const newTask: Task = {
      id: generateTaskId(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const addMultipleTasks = (tasksData: ParsedTaskData[]) => {
    const newTasks: Task[] = tasksData.map((taskData) => ({
      id: generateTaskId(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }))
    setTasks((prev) => [...prev, ...newTasks])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  return {
    tasks,
    isLoading,
    addTask,
    addMultipleTasks,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  }
}
