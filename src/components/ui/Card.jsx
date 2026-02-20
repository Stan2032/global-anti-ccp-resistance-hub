import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  compact = false,
  onClick,
  ...props 
}) => {
  const baseClasses = compact 
    ? 'bg-white shadow-sm border border-gray-100 p-3' 
    : 'bg-white shadow-sm border border-gray-100 p-6'
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} transition-all duration-200 ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export { Card }
export default Card
