import { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import 'leaflet-draw'
import { useMapStore } from '../store/useMapStore'
import { SHAPE_LIMITS, SHAPE_COLORS, ShapeType } from '../config/shapeConfig'
import { validatePolygonalFeature, layerToGeoJSON } from '../utils/geometryUtils'
import { DrawnFeature } from '../types/feature'
import './MapContainer.css'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export const MapContainer = () => {
  const mapRef = useRef<L.Map | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null)
  const { features, activeDrawMode, addFeature, setError, setSuccess, getFeaturesByType } = useMapStore()

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map('map').setView([51.505, -0.09], 13)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Initialize feature group for drawn items
      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)

      mapRef.current = map
      drawnItemsRef.current = drawnItems
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !drawnItemsRef.current) return

    const map = mapRef.current
    const drawnItems = drawnItemsRef.current

    // Remove existing draw controls
    map.eachLayer((layer) => {
      if (layer instanceof L.Control.Draw) {
        map.removeControl(layer)
      }
    })

    if (!activeDrawMode) return

    // Configure draw control based on active mode
    const drawOptions: any = {
      position: 'topright',
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    }

    // Enable only the active drawing mode with enhanced styling
    switch (activeDrawMode) {
      case 'polygon':
        drawOptions.draw.polygon = {
          shapeOptions: { 
            color: SHAPE_COLORS.polygon,
            fillColor: SHAPE_COLORS.polygon,
            fillOpacity: 0.2,
            weight: 3,
          },
          showArea: true,
        }
        break
      case 'rectangle':
        drawOptions.draw.rectangle = {
          shapeOptions: { 
            color: SHAPE_COLORS.rectangle,
            fillColor: SHAPE_COLORS.rectangle,
            fillOpacity: 0.2,
            weight: 3,
          },
          showArea: true,
        }
        break
      case 'circle':
        drawOptions.draw.circle = {
          shapeOptions: { 
            color: SHAPE_COLORS.circle,
            fillColor: SHAPE_COLORS.circle,
            fillOpacity: 0.2,
            weight: 3,
          },
          showRadius: true,
        }
        break
      case 'linestring':
        drawOptions.draw.polyline = {
          shapeOptions: { 
            color: SHAPE_COLORS.linestring,
            weight: 4,
          },
          showLength: true,
        }
        break
    }

    const drawControl = new L.Control.Draw(drawOptions)
    map.addControl(drawControl)

    // Handle draw created event
    const onDrawCreated = (e: L.LeafletEvent) => {
      const drawEvent = e as L.DrawEvents.Created
      const layer = drawEvent.layer
      const type = drawEvent.layerType as string
      
      // Map Leaflet draw types to our shape types
      let shapeType: ShapeType
      if (type === 'polyline') {
        shapeType = 'linestring'
      } else if (type === 'rectangle') {
        shapeType = 'rectangle'
      } else {
        shapeType = type as ShapeType
      }

      // Check shape limit
      const currentCount = getFeaturesByType(shapeType).length
      if (currentCount >= SHAPE_LIMITS[shapeType]) {
        // CRITICAL: Remove the layer that Leaflet-Draw already added
        map.removeLayer(layer)
        setError(`Maximum ${SHAPE_LIMITS[shapeType]} ${shapeType}s allowed`)
        return
      }

      // Convert layer to GeoJSON geometry
      const geometry = layerToGeoJSON(layer)
      if (!geometry) {
        // CRITICAL: Remove the layer that Leaflet-Draw already added
        map.removeLayer(layer)
        setError('Failed to convert shape to GeoJSON')
        return
      }

      // Validate polygonal features (not linestrings)
      if (shapeType !== 'linestring') {
        const validation = validatePolygonalFeature(geometry, features)
        
        if (!validation.valid) {
          // CRITICAL: Remove the layer that Leaflet-Draw already added
          map.removeLayer(layer)
          setError(validation.error || 'Invalid shape')
          return
        }

        // If geometry was trimmed, replace the layer with trimmed version
        if (validation.trimmedGeometry && validation.trimmedGeometry !== geometry) {
          // CRITICAL: Remove the original layer first
          map.removeLayer(layer)
          
          // Create new layer with trimmed geometry
          const trimmedLayer = L.geoJSON(validation.trimmedGeometry, {
            style: { 
              color: SHAPE_COLORS[shapeType],
              fillColor: SHAPE_COLORS[shapeType],
              fillOpacity: 0.2,
              weight: 3,
            },
          })
          
          // Add trimmed layer to map
          trimmedLayer.eachLayer((l: L.Layer) => {
            drawnItems.addLayer(l)
            
            // Create feature with trimmed geometry
            const feature: DrawnFeature = {
              id: `${shapeType}-${Date.now()}`,
              type: shapeType,
              geometry: validation.trimmedGeometry!,
              properties: {
                name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${currentCount + 1}`,
                color: SHAPE_COLORS[shapeType],
                createdAt: new Date().toISOString(),
              },
              leafletId: L.stamp(l),
            }
            
            addFeature(feature)
            setSuccess(`${feature.properties.name} added successfully (trimmed)!`)
          })
          
          return
        }
      }

      // Add original layer to map (it's already there, but we add to drawnItems for management)
      drawnItems.addLayer(layer)

      // Create feature
      const feature: DrawnFeature = {
        id: `${shapeType}-${Date.now()}`,
        type: shapeType,
        geometry,
        properties: {
          name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${currentCount + 1}`,
          color: SHAPE_COLORS[shapeType],
          createdAt: new Date().toISOString(),
        },
        leafletId: L.stamp(layer),
      }

      addFeature(feature)
      
      // Show success message
      setSuccess(`${feature.properties.name} added successfully!`)
    }

    map.on(L.Draw.Event.CREATED, onDrawCreated)

    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated)
      map.removeControl(drawControl)
    }
  }, [activeDrawMode, features, addFeature, setError, setSuccess, getFeaturesByType])

  return <div id="map" className="map-container" />
}
