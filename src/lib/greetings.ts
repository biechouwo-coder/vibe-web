export const GREETINGS = [
  "What would you like to accomplish today?",
  "What are you planning to do today?",
  "Ready to take on today's tasks?",
  "What can you achieve today?",
  "Which tasks will you conquer today?",
  "What do you want to get done today?",
  "Time to make progress — where will you start?",
]

export function getGreeting(seed: number): string {
  return GREETINGS[Math.abs(seed) % GREETINGS.length]
}
