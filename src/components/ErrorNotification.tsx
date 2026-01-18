import { useEffect } from 'react'
import { useMapStore } from '../store/useMapStore'
import './ErrorNotification.css'

export const ErrorNotification = () => {
  const { error, clearError } = useMapStore()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  if (!error) return null

  return (
    <div className="error-notification">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{error}</span>
        <button className="error-close" onClick={clearError}>
          ✕
        </button>
      </div>
    </div>
  )
}
