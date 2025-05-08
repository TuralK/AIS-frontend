import React, { useState } from 'react'
export const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false)
  
    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        >
          {children}
        </div>
        {isVisible && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded shadow-lg z-50 whitespace-normal max-w-[200px] text-left">
            {content}
            <div className="absolute top-full left-3 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    )
  }