import { cn } from "./utils/cn"

export const buttonAnimation = cn(
  "transition-all duration-300 ease-out",
  "hover:scale-105 hover:-translate-y-0.5",
  "active:scale-95 active:translate-y-0"
)

export const themeButtonAnimation = cn(
  "duration-300 ease-out",
  "hover:scale-105 hover:-translate-y-0.5",
)

export const bgDarkTheme = cn(
  'background-color: #161617'
)

export const autocompleteInput = cn(
  'm-0 p-0 z-100 w-71 top-14 rounded absolute text-xs border-1'
)

export const autocompleteInputDark = cn(
  'bg-neutral-800 border-neutral-600 hover:bg-neutral-900'
)

export const autocompleteInputLight = cn(
  'bg-blue-100 border-neutral-400 hover:bg-blue-200'
)