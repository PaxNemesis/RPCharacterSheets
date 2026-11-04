/** 'turn' lasts until the start of your next turn. */
export type DanceDuration = 'instant' | 'turn'

export type DanceData = {
  name: string
  page: number
  duration: DanceDuration
  /** The damage type of a dance that grants a Resistance or changes damage to that type. */
  element?: string
}

/** The Dancer's dances, with their pages and durations (HF pp. 144–145). */
export const DANCES: DanceData[] = [
  { name: 'Angel Dance', page: 144, duration: 'turn', element: 'light' },
  { name: 'Banshee Dance', page: 144, duration: 'instant' },
  { name: 'Bat Dance', page: 144, duration: 'turn', element: 'dark' },
  { name: 'Golem Dance', page: 144, duration: 'turn', element: 'bolt' },
  { name: 'Griffin Dance', page: 144, duration: 'turn', element: 'air' },
  { name: 'Hydra Dance', page: 144, duration: 'turn' },
  { name: 'Kraken Dance', page: 144, duration: 'instant' },
  { name: 'Lion Dance', page: 144, duration: 'instant' },
  { name: 'Maenad Dance', page: 144, duration: 'instant' },
  { name: 'Myrmidon Dance', page: 145, duration: 'turn', element: 'earth' },
  { name: 'Nightmare Dance', page: 145, duration: 'instant' },
  { name: 'Ouroboros Dance', page: 145, duration: 'instant' },
  { name: 'Peacock Dance', page: 145, duration: 'instant' },
  { name: 'Phoenix Dance', page: 145, duration: 'turn', element: 'fire' },
  { name: 'Satyr Dance', page: 145, duration: 'instant' },
  { name: 'Unicorn Dance', page: 145, duration: 'instant' },
  { name: 'Yeti Dance', page: 145, duration: 'turn', element: 'ice' },
]

export const DURATION_LABELS: Record<DanceDuration, string> = {
  instant: 'Instantaneous',
  turn: 'Until the start of your next turn',
}

/** MP to perform a dance, or after a different dance on your previous turn; Follow My Lead's extra (HF p. 143). */
export const DANCE_MP = 10
export const DANCE_MP_AFTER_OTHER = 5
export const FOLLOW_MY_LEAD_MP = 10
