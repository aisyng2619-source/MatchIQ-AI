import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import MatchSetupPage from './pages/MatchSetupPage'
import AnalysisLoadingPage from './pages/AnalysisLoadingPage'
import CaptainBriefPage from './pages/CaptainBriefPage'
import PlayerInsightPage from './pages/PlayerInsightPage'
import SimulationPage from './pages/SimulationPage'
import { MatchProvider } from './context/MatchContext'

export default function App() {
  return (
    <MatchProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface-900 text-slate-200 font-body">
          <Navbar />
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/setup"      element={<MatchSetupPage />} />
            <Route path="/analyzing"  element={<AnalysisLoadingPage />} />
            <Route path="/brief"      element={<CaptainBriefPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/player/:name" element={<PlayerInsightPage />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MatchProvider>
  )
}
