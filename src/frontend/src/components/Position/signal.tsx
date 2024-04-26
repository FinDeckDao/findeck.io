import { signal } from "@preact/signals-react"
import { Position } from './index'

export const position = signal<Position | null>(null)