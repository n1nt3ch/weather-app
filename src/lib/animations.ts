import { cn } from "./utils"

export const buttonAnimation = cn(
  "transition-all duration-300 ease-out",
  "hover:scale-105 hover:-translate-y-0.5",
  "active:scale-95 active:translate-y-0"
)

export const themeButtonAnimation = cn(
  "duration-300 ease-out",
  "hover:scale-105 hover:-translate-y-0.5",
)