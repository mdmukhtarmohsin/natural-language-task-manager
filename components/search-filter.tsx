"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Task } from "@/types/task"

interface SearchFilterProps {
  tasks: Task[]
  onFilteredTasks: (tasks: Task[]) => void
}

export type SortOption = "dueDate" | "priority" | "assignee" | "created"
export type FilterOption = "all" | "pending" | "completed" | "overdue"

export function SearchFilter({ tasks, onFilteredTasks }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("dueDate")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  const applyFilters = (search: string, sort: SortOption, filter: FilterOption) => {
    let filtered = [...tasks]

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(search.toLowerCase()) ||
          task.assignee.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply status filter
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (filter) {
      case "pending":
        filtered = filtered.filter((task) => !task.completed)
        break
      case "completed":
        filtered = filtered.filter((task) => task.completed)
        break
      case "overdue":
        filtered = filtered.filter((task) => {
          const dueDate = new Date(task.dueDate)
          return !task.completed && dueDate < today
        })
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case "assignee":
          return a.assignee.localeCompare(b.assignee)
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    onFilteredTasks(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    applyFilters(value, sortBy, filterBy)
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    applyFilters(searchTerm, value, filterBy)
  }

  const handleFilterChange = (value: FilterOption) => {
    setFilterBy(value)
    applyFilters(searchTerm, sortBy, value)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSortBy("dueDate")
    setFilterBy("all")
    onFilteredTasks(tasks)
  }

  const hasActiveFilters = searchTerm || sortBy !== "dueDate" || filterBy !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks or assignees..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="assignee">Assignee</SelectItem>
            <SelectItem value="created">Created</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterBy} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="px-3">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
