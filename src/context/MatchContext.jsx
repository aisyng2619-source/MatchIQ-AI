import React, { createContext, useContext, useState } from 'react'

const MatchContext = createContext(null)

export function MatchProvider({ children }) {
  const [matchSetup, setMatchSetup] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <MatchContext.Provider value={{
      matchSetup, setMatchSetup,
      recommendation, setRecommendation,
      loading, setLoading,
      error, setError,
    }}>
      {children}
    </MatchContext.Provider>
  )
}

export function useMatch() {
  const ctx = useContext(MatchContext)
  if (!ctx) throw new Error('useMatch must be used within MatchProvider')
  return ctx
}
