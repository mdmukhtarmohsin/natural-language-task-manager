import type { ParsedTaskData } from "@/types/task"

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

export async function parseTasksFromText(input: string): Promise<ParsedTaskData[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured")
  }

  const prompt = `
Parse the following text and extract task information. Return a JSON array of tasks with the following structure:
{
  "name": "task description",
  "assignee": "person assigned",
  "dueDate": "YYYY-MM-DD format",
  "dueTime": "HH:MM format (24-hour, optional)",
  "priority": "P1, P2, P3, or P4 (default P3 if not specified)"
}

Rules:
- Extract task name, assignee, due date/time, and priority
- Convert relative dates like "tomorrow", "next week" to actual dates
- Default priority is P3 unless P1, P2, or P4 is mentioned
- If no specific time is mentioned, omit dueTime
- Return empty array if no tasks found

Text to parse: "${input}"

Return only valid JSON array, no additional text.
`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error("No response from Gemini API")
    }

    // Clean the response and parse JSON
    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, "").trim()
    const parsedTasks = JSON.parse(cleanedText)

    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch (error) {
    console.error("Error parsing tasks:", error)
    throw new Error("Failed to parse tasks. Please try again.")
  }
}
