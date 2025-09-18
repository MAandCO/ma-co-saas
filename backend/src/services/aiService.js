import fetch from 'node-fetch'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function generateComplianceTasks (clientProfile) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY environment variable.')
  }

  const systemPrompt = `You are an assistant for an accounting firm that specialises in UK compliance. Given client details, generate structured tasks with due dates, descriptions, and recommended assignees. Always return JSON with fields: title, description, dueDate (YYYY-MM-DD), category, suggestedAssigneeRole.`

  const userPrompt = `Client profile: ${JSON.stringify(clientProfile)}. Client type: ${clientProfile.type || 'general'}. Include statutory deadlines such as CIS returns (due 19th monthly), VAT returns (quarterly), payroll submissions, CT600, Self Assessment, and onboarding tasks if relevant.`

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://ma-co.local',
      'X-Title': 'Ma & Co Compliance Planner'
    },
    body: JSON.stringify({
      model: 'openai/gpt-5-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenRouter request failed: ${response.status} ${text}`)
  }

  const payload = await response.json()
  const rawContent = payload?.choices?.[0]?.message?.content
  if (!rawContent) {
    throw new Error('No content returned from OpenRouter.')
  }

  const parsed = JSON.parse(rawContent)
  const tasks = parsed.tasks || parsed.items || []
  return tasks.map(task => ({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    category: task.category,
    suggestedAssigneeRole: task.suggestedAssigneeRole
  }))
}
