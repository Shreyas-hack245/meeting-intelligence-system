import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
            "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-accent/10 hover:text-accent": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-indigo-500/50": variant === "gradient",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-lg px-3 text-sm": size === "sm",
            "h-12 rounded-2xl px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
