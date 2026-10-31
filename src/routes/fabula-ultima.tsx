import { createFileRoute } from '@tanstack/react-router'
import { FabulaUltima } from '@/pages/FabulaUltima'

export const Route = createFileRoute('/fabula-ultima')({
  component: FabulaUltima,
})
