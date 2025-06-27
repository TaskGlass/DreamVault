import type React from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glow?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glow, className, ...props }) => {
  return (
    <div {...props} className={`glass-card rounded-xl p-8 ${glow ? "glow" : ""} ${className || ""}`}>
      {children}
    </div>
  )
}
