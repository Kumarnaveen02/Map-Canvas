import { MapContainer } from './components/MapContainer'
import { Toolbar } from './components/Toolbar'
import { ErrorNotification } from './components/ErrorNotification'
import { SuccessNotification } from './components/SuccessNotification'
import { useMapStore } from './store/useMapStore'
import './App.css'

function App() {
  const { success, clearSuccess } = useMapStore()

  return (
    <div className="app">
      <Toolbar />
      <MapContainer />
      <ErrorNotification />
      <SuccessNotification message={success} onClose={clearSuccess} />
    </div>
  )
}

export default App
