import { createFileRoute } from '@tanstack/react-router'
import { HomeWelcome } from '@/components/home-welcome'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <HomeWelcome />
}
