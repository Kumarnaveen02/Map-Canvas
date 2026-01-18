import { useMapStore } from '../store/useMapStore'
import { SHAPE_LIMITS, ShapeType, SHAPE_COLORS } from '../config/shapeConfig'
import { downloadGeoJSON } from '../utils/exportUtils'
import './Toolbar.css'

export const Toolbar = () => {
  const { features, activeDrawMode, setActiveDrawMode, setSuccess } = useMapStore()

  const handleDrawClick = (type: ShapeType) => {
    setActiveDrawMode(activeDrawMode === type ? null : type)
  }

  const handleExport = () => {
    if (features.length === 0) {
      return
    }
    downloadGeoJSON(features)
    setSuccess(`Successfully exported ${features.length} feature${features.length > 1 ? 's' : ''}!`)
  }

  const getFeatureCount = (type: ShapeType): number => {
    return features.filter(f => f.type === type).length
  }

  const isLimitReached = (type: ShapeType): boolean => {
    return getFeatureCount(type) >= SHAPE_LIMITS[type]
  }

  const shapeButtons: Array<{ type: ShapeType; label: string; icon: string }> = [
    { type: 'polygon', label: 'Polygon', icon: '⬢' },
    { type: 'rectangle', label: 'Rectangle', icon: '▢' },
    { type: 'circle', label: 'Circle', icon: '◯' },
    { type: 'linestring', label: 'Line', icon: '⤴' },
  ]

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        <h2>🗺️ Map Drawing</h2>
      </div>

      <div className="toolbar-section">
        <h3>Draw Shapes</h3>
        {shapeButtons.map(({ type, label, icon }) => {
          const count = getFeatureCount(type)
          const limit = SHAPE_LIMITS[type]
          const limitReached = isLimitReached(type)
          const isActive = activeDrawMode === type

          return (
            <button
              key={type}
              className={`tool-button ${isActive ? 'active' : ''} ${limitReached ? 'disabled' : ''}`}
              onClick={() => handleDrawClick(type)}
              disabled={limitReached && !isActive}
              style={{
                color: SHAPE_COLORS[type],
              }}
            >
              <span className="tool-icon">{icon}</span>
              <span className="tool-label">{label}</span>
              <span className="tool-count">
                {count}/{limit}
              </span>
            </button>
          )
        })}
      </div>

      <div className="toolbar-section">
        <h3>Features ({features.length})</h3>
        <div className="feature-list">
          {features.length === 0 ? (
            <p className="empty-message">No features drawn yet</p>
          ) : (
            features.map(feature => (
              <div key={feature.id} className="feature-item">
                <span
                  className="feature-color"
                  style={{ 
                    backgroundColor: feature.properties.color,
                    color: feature.properties.color,
                  }}
                />
                <span className="feature-name">{feature.properties.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="toolbar-footer">
        <button
          className="export-button"
          onClick={handleExport}
          disabled={features.length === 0}
        >
          <span>📥</span>
          <span>Export GeoJSON</span>
        </button>
      </div>
    </div>
  )
}
