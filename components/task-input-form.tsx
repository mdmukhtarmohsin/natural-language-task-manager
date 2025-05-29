"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseTasksFromText } from "@/lib/ai-parser"
import type { ParsedTaskData } from "@/types/task"
import { Loader2, Plus, FileText, Sparkles, CheckCircle } from "lucide-react"

interface TaskInputFormProps {
  onTasksParsed: (tasks: ParsedTaskData[]) => void
}

export function TaskInputForm({ onTasksParsed }: TaskInputFormProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const parsedTasks = await parseTasksFromText(input.trim())
      if (parsedTasks.length > 0) {
        onTasksParsed(parsedTasks)
        setInput("")
        setSuccess(`Successfully parsed ${parsedTasks.length} task${parsedTasks.length > 1 ? "s" : ""}!`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError("No tasks could be extracted from the input. Please try rephrasing.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const exampleTexts = {
    single: "Review design mockups Sarah by 3pm tomorrow P2",
    transcript:
      "Sarah, you need to finish the user interface designs by Thursday. Mike, please handle the client presentation by next Tuesday P1. John, can you complete the API integration by this Friday?",
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          AI Task Parser
        </CardTitle>
        <p className="text-sm text-muted-foreground">Transform natural language into organized tasks with AI</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="single" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Plus className="h-4 w-4" />
              Single Task
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2 data-[state=active]:bg-background">
              <FileText className="h-4 w-4" />
              Meeting Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder={`Try: "${exampleTexts.single}"`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px] resize-none border-2 focus:border-primary/50 transition-all duration-200"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Include assignee, due date, and priority (P1-P4) in your description
                </p>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Parse Task
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder={`Try: "${exampleTexts.transcript}"`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px] resize-none border-2 focus:border-primary/50 transition-all duration-200"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Paste meeting notes or conversation transcripts to extract multiple tasks
                </p>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Tasks...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Extract Tasks from Transcript
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
