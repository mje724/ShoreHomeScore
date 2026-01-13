import React from 'react'
import { motion } from 'framer-motion'

export function ScoreGauge({ score, maxScore, size = 'lg' }) {
  const percentage = Math.min((score / maxScore) * 100, 100)
  
  const sizes = {
    sm: { width: 120, stroke: 8, fontSize: 'text-2xl' },
    md: { width: 180, stroke: 12, fontSize: 'text-4xl' },
    lg: { width: 260, stroke: 16, fontSize: 'text-6xl' },
  }
  
  const config = sizes[size]
  const radius = (config.width - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const getGrade = () => {
    if (percentage >= 80) return { color: '#34d399', bg: '#065f46', text: 'FORTRESS', desc: 'Excellent protection' }
    if (percentage >= 60) return { color: '#60a5fa', bg: '#1e40af', text: 'PROTECTED', desc: 'Good protection' }
    if (percentage >= 40) return { color: '#fbbf24', bg: '#92400e', text: 'EXPOSED', desc: 'Some vulnerabilities' }
    return { color: '#f87171', bg: '#991b1b', text: 'VULNERABLE', desc: 'Needs attention' }
  }
  
  const grade = getGrade()

  return (
    <div 
      className="relative flex items-center justify-center"
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Resilience Score: ${Math.round(percentage)}%. Status: ${grade.text}`}
    >
      <svg 
        width={config.width} 
        height={config.width} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth={config.stroke}
        />
        {/* Progress arc */}
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={grade.color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.div 
          className={`font-black tracking-tight ${config.fontSize}`}
          style={{ color: grade.color }}
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {Math.round(percentage)}
        </motion.div>
        {size !== 'sm' && (
          <>
            <div className="text-slate-400 text-sm font-medium tracking-wide mt-1">
              RESILIENCE SCORE
            </div>
            <div 
              className="mt-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
              style={{ backgroundColor: grade.bg, color: grade.color }}
            >
              {grade.text}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function MiniScore({ score, maxScore, label }) {
  const percentage = Math.min((score / maxScore) * 100, 100)
  
  const getColor = () => {
    if (percentage >= 80) return '#34d399'
    if (percentage >= 60) return '#60a5fa'
    if (percentage >= 40) return '#fbbf24'
    return '#f87171'
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg width="48" height="48" className="transform -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#334155" strokeWidth="4" />
          <motion.circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={getColor()}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={125.6}
            initial={{ strokeDashoffset: 125.6 }}
            animate={{ strokeDashoffset: 125.6 - (percentage / 100) * 125.6 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-200">{Math.round(percentage)}</span>
        </div>
      </div>
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  )
}
