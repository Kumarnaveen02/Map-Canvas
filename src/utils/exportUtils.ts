import { DrawnFeature } from '../types/feature'

/**
 * Export all drawn features as GeoJSON FeatureCollection
 * Includes geometry and properties for each feature
 */
export const exportToGeoJSON = (features: DrawnFeature[]): string => {
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: features.map(feature => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        id: feature.id,
        type: feature.type,
        name: feature.properties.name,
        color: feature.properties.color,
        createdAt: feature.properties.createdAt,
      },
    })),
  }
  
  return JSON.stringify(featureCollection, null, 2)
}

/**
 * Download GeoJSON as a file
 */
export const downloadGeoJSON = (features: DrawnFeature[]): void => {
  const geoJSON = exportToGeoJSON(features)
  const blob = new Blob([geoJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `map-features-${new Date().toISOString()}.geojson`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
