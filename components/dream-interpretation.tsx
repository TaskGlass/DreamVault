"use client"

import React from 'react'
import { Brain } from 'lucide-react'

interface DreamInterpretationProps {
  title?: string
  content: string
  showTitle?: boolean
}

export function DreamInterpretation({ title = "Dream Interpretation", content, showTitle = true }: DreamInterpretationProps) {
  const sections = content.split(/\*\*(.+?)\*\*/g)
  
  const renderContent = () => {
    const symbolSections: React.ReactElement[] = []
    const otherSections: React.ReactElement[] = []
    
    for (let i = 0; i < sections.length; i += 2) {
      const header = sections[i]
      const body = sections[i + 1]
      
      if (header && body) {
        // Determine section type and styling
        const isEmotional = header.toLowerCase().includes("emotional") || header.toLowerCase().includes("summary")
        const isSymbol = !isEmotional
        
        let sectionClass = "bg-purple-500/10 border-l-4 border-purple-400"
        let headerClass = "text-xl font-bold text-purple-200 mb-1"
        
        if (isEmotional) {
          sectionClass = "bg-blue-500/10 border-l-4 border-blue-400"
          headerClass = "text-lg font-bold text-blue-300"
        } else {
          // Make symbol headers more prominent and title-like
          headerClass = "text-2xl font-bold text-purple-100 mb-2 pb-2 border-b border-purple-400/30"
        }
        
        const sectionElement = (
          <div key={i} className={`${sectionClass} rounded-lg p-4 mb-4`}>
            <h3 className={headerClass}>
              {header}
            </h3>
            <div className="mt-3 text-gray-300 leading-relaxed text-sm">
              {body.trim().split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? (
                  <p key={idx} className="mb-2 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        )
        
        // Sort sections by type
        if (isSymbol) {
          symbolSections.push(sectionElement)
        } else {
          otherSections.push(sectionElement)
        }
      } else if (header && !body) {
        // Handle intro text without headers
        const introElement = (
          <div key={i} className="bg-gray-500/10 border-l-4 border-gray-400 rounded-lg p-4 mb-4">
            <div className="text-gray-300 leading-relaxed text-sm">
              {header.trim().split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? (
                  <p key={idx} className="mb-2 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        )
        otherSections.push(introElement)
      }
    }
    
    // Combine sections in order: symbols first, then others
    const allSections = [...symbolSections, ...otherSections]
    
    return allSections.length > 0 ? allSections : (
      <div className="bg-gray-500/10 border-l-4 border-gray-400 rounded-lg p-4">
        <div className="text-gray-300 leading-relaxed text-sm">
          {content.split('\n').map((paragraph: string, idx: number) => (
            paragraph.trim() ? (
              <p key={idx} className="mb-2 last:mb-0">
                {paragraph.trim()}
              </p>
            ) : null
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {showTitle && (
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
            <Brain className="h-6 w-6 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-purple-300">{title}</h2>
        </div>
      )}
      
      <div className="space-y-4">
        {renderContent()}
      </div>
    </div>
  )
} 