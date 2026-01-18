import { useEffect } from 'react'
import './SuccessNotification.css'

interface SuccessNotificationProps {
  message: string | null
  onClose: () => void
}

export const SuccessNotification = ({ message, onClose }: SuccessNotificationProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="success-notification">
      <div className="success-content">
        <span className="success-icon">✓</span>
        <span className="success-message">{message}</span>
        <button className="success-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}
