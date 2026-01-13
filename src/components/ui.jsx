import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react'

// Button component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-400',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-400',
    outline: 'border-2 border-slate-600 hover:border-slate-500 text-slate-100 focus:ring-slate-400',
    ghost: 'hover:bg-slate-800 text-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-400',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

// Input component
export function Input({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          className={`w-full px-4 py-3 bg-slate-700 border-2 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-slate-600'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

// Card component
export function Card({ children, className = '', padding = 'md', ...props }) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div 
      className={`bg-slate-800 border-2 border-slate-700 rounded-2xl ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Alert component
export function Alert({ type = 'info', title, children, onClose, className = '' }) {
  const styles = {
    info: { bg: 'bg-blue-900/50', border: 'border-blue-500', icon: AlertCircle, iconColor: 'text-blue-400' },
    success: { bg: 'bg-emerald-900/50', border: 'border-emerald-500', icon: CheckCircle, iconColor: 'text-emerald-400' },
    warning: { bg: 'bg-amber-900/50', border: 'border-amber-500', icon: AlertCircle, iconColor: 'text-amber-400' },
    error: { bg: 'bg-red-900/50', border: 'border-red-500', icon: AlertCircle, iconColor: 'text-red-400' },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${style.bg} ${style.border} border-2 rounded-xl p-4 ${className}`}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
        <div className="flex-1">
          {title && <h4 className="font-semibold text-slate-100 mb-1">{title}</h4>}
          <div className="text-sm text-slate-300">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Modal component
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-slate-800 border-2 border-slate-700 rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
}

// Progress bar
export function ProgressBar({ value, max = 100, color = 'emerald', size = 'md', showLabel = false }) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div>
      <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{value} / {max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

// Tabs component
export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-800 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Badge component
export function Badge({ children, color = 'slate', size = 'md' }) {
  const colors = {
    slate: 'bg-slate-700 text-slate-300',
    emerald: 'bg-emerald-900 text-emerald-400',
    blue: 'bg-blue-900 text-blue-400',
    amber: 'bg-amber-900 text-amber-400',
    red: 'bg-red-900 text-red-400',
    purple: 'bg-purple-900 text-purple-400',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <Icon className="w-8 h-8 text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  )
}

// Skeleton loader
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-slate-700 rounded animate-pulse ${className}`} />
  )
}

// Divider
export function Divider({ className = '' }) {
  return <hr className={`border-slate-700 ${className}`} />
}
