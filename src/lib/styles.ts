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
  'm-0 p-0 z-100 w-71 top-14 rounded absolute px-1 bg-white text-xs border-neutral-300 border-1'
)