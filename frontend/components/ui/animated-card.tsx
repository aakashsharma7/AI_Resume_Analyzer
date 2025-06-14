import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  duration?: number
  hoverScale?: number
  hoverRotate?: number
  hoverShadow?: boolean
  children: React.ReactNode
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    delay = 0, 
    duration = 0.3, 
    hoverScale = 1.02, 
    hoverRotate = 0, 
    hoverShadow = true,
    children, 
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration, 
          delay,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: hoverScale, 
          rotate: hoverRotate,
          boxShadow: hoverShadow ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none",
          transition: { duration: 0.2 }
        }}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard } 