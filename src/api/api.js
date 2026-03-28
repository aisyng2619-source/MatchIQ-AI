import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export async function checkHealth() {
  const res = await api.get('/health')
  return res.data
}

export async function fetchMatchSetup() {
  const res = await api.get('/match/setup')
  return res.data
}

export async function generateRecommendation(payload) {
  const res = await api.post('/generate-recommendation', payload)
  return res.data
}

export async function fetchPlayerInsight(playerName) {
  const res = await api.get(`/player-insight/${encodeURIComponent(playerName)}`)
  return res.data
}

export async function fetchSimulationState() {
  const res = await api.get('/simulation-state')
  return res.data
}

export default api
