export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER'
export type Sentiment = 'Positive' | 'Neutral' | 'Negative'
export type Status = 'New' | 'Reviewed' | 'Actioned'

export interface Feedback {
  id: string
  text: string
  source: string
  customer: string
  date: string
  sentiment: Sentiment
  theme: string
  status: Status
  score: number
  impact: number
}

export const users: Record<Role, { name: string; email: string; initials: string; title: string }> = {
  ADMIN: { name: 'Sarah Connor', email: 'sarah.admin@acme.com', initials: 'SC', title: 'Workspace admin' },
  ANALYST: { name: 'Mark Watney', email: 'mark.analyst@acme.com', initials: 'MW', title: 'Product analyst' },
  VIEWER: { name: 'Alex Mercer', email: 'alex.viewer@acme.com', initials: 'AM', title: 'Read-only viewer' },
}

export const initialFeedback: Feedback[] = [
  { id: 'FB-1048', text: 'The new dashboard loads so much faster. I can finally get through my weekly review without waiting around.', source: 'App Store', customer: 'Olivia Chen', date: '2025-05-14', sentiment: 'Positive', theme: 'Performance', status: 'Actioned', score: 0.91, impact: 7 },
  { id: 'FB-1047', text: 'Would love to be able to export a report straight to Slides. We still copy everything over manually.', source: 'Sales call', customer: 'Marcus Lee', date: '2025-05-14', sentiment: 'Negative', theme: 'Integrations', status: 'New', score: 0.88, impact: 9 },
  { id: 'FB-1046', text: 'The mobile app keeps logging me out when I switch between tabs. It happens at least twice a day.', source: 'Support', customer: 'Priya Patel', date: '2025-05-13', sentiment: 'Negative', theme: 'Mobile app', status: 'Reviewed', score: 0.96, impact: 8 },
  { id: 'FB-1045', text: 'Setup was surprisingly easy. Had our whole team onboarded in less than an hour.', source: 'NPS survey', customer: 'James Wilson', date: '2025-05-13', sentiment: 'Positive', theme: 'Onboarding', status: 'Actioned', score: 0.94, impact: 6 },
  { id: 'FB-1044', text: 'The pricing page is a little hard to understand. Is the advanced analytics included in the team plan?', source: 'Zendesk', customer: 'Sofia Garcia', date: '2025-05-12', sentiment: 'Neutral', theme: 'Pricing', status: 'New', score: 0.83, impact: 5 },
  { id: 'FB-1043', text: 'Search results are not relevant when I search for customer names. It used to work better last month.', source: 'App Store', customer: 'Noah Kim', date: '2025-05-12', sentiment: 'Negative', theme: 'Search', status: 'New', score: 0.89, impact: 7 },
  { id: 'FB-1042', text: 'Really appreciate the new saved views. It makes it easy to track feedback from our enterprise customers.', source: 'Zendesk', customer: 'Emma Thompson', date: '2025-05-11', sentiment: 'Positive', theme: 'Reporting', status: 'Reviewed', score: 0.92, impact: 6 },
  { id: 'FB-1041', text: 'Notifications arrive in batches instead of in real time. We miss urgent customer escalations.', source: 'Support', customer: 'Ethan Brown', date: '2025-05-11', sentiment: 'Negative', theme: 'Notifications', status: 'New', score: 0.87, impact: 8 },
  { id: 'FB-1040', text: 'Could you add more color options to the charts? The current palette is tough for our team to distinguish.', source: 'Sales call', customer: 'Ava Martinez', date: '2025-05-10', sentiment: 'Neutral', theme: 'Reporting', status: 'Reviewed', score: 0.79, impact: 4 },
  { id: 'FB-1039', text: 'Love how simple the new onboarding checklist is. It helped our new hires find their way around.', source: 'NPS survey', customer: 'Liam Johnson', date: '2025-05-10', sentiment: 'Positive', theme: 'Onboarding', status: 'Actioned', score: 0.95, impact: 5 },
  { id: 'FB-1038', text: 'Our CSV upload failed with no useful error. We had to split the file into smaller pieces to make it work.', source: 'Support', customer: 'Isabella Nguyen', date: '2025-05-09', sentiment: 'Negative', theme: 'Integrations', status: 'New', score: 0.93, impact: 7 },
  { id: 'FB-1037', text: 'Great product overall. A dark mode would make working late much easier on the eyes.', source: 'App Store', customer: 'Lucas Davis', date: '2025-05-09', sentiment: 'Positive', theme: 'UX & design', status: 'Actioned', score: 0.84, impact: 3 },
]

export const sentimentColor: Record<Sentiment, string> = {
  Positive: '#12b981',
  Neutral: '#f5a623',
  Negative: '#f16c6c',
}

export function classifyFeedback(text: string): { sentiment: Sentiment; theme: string } {
  const value = text.toLowerCase()
  const negative = ['slow', 'fail', 'broken', 'hard', 'issue', 'bug', 'not ', 'keeps', 'wish', 'missing', 'crash']
  const positive = ['love', 'great', 'easy', 'fast', 'helpful', 'thanks', 'excellent', 'simple']
  const sentiment: Sentiment = negative.some((word) => value.includes(word))
    ? 'Negative'
    : positive.some((word) => value.includes(word)) ? 'Positive' : 'Neutral'
  const themes: [string, string[]][] = [
    ['Performance', ['slow', 'fast', 'load']],
    ['Integrations', ['csv', 'export', 'integrat', 'upload']],
    ['Mobile app', ['mobile', 'phone', 'app']],
    ['Onboarding', ['setup', 'onboard', 'checklist']],
    ['Pricing', ['price', 'cost', 'plan']],
    ['Search', ['search', 'find']],
    ['Notifications', ['notif', 'alert']],
    ['Reporting', ['report', 'chart', 'dashboard']],
  ]
  return { sentiment, theme: themes.find(([, words]) => words.some((word) => value.includes(word)))?.[0] ?? 'Product feedback' }
}
