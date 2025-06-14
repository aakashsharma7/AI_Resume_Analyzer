import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabs = Tabs

export interface AnimatedTabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string
  onTabChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={className}
    {...props}
  />
))
AnimatedTabsList.displayName = "AnimatedTabsList"

export interface AnimatedTabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  activeTab?: string
  onTabChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger>
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={className}
    {...props}
  />
))
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger"

export interface AnimatedTabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeTab?: string
  children: React.ReactNode
}

const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => (
  <TabsContent
    ref={ref}
    className={className}
    {...props}
  >
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  </TabsContent>
))
AnimatedTabsContent.displayName = "AnimatedTabsContent"

export { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } 