import * as turf from '@turf/turf'
import * as L from 'leaflet'
import { DrawnFeature } from '../types/feature'

/**
 * Check if two polygonal features overlap
 * Uses Turf.js to detect intersection between polygons
 */
export const checkOverlap = (
  feature1: GeoJSON.Geometry,
  feature2: GeoJSON.Geometry
): boolean => {
  try {
    const poly1 = turf.polygon((feature1 as GeoJSON.Polygon).coordinates)
    const poly2 = turf.polygon((feature2 as GeoJSON.Polygon).coordinates)
    
    const intersection = turf.intersect(turf.featureCollection([poly1, poly2]))
    return intersection !== null
  } catch (error) {
    console.error('Error checking overlap:', error)
    return false
  }
}

/**
 * Check if one polygon fully encloses another
 * Returns true if feature1 completely contains feature2
 */
export const checkFullEnclosure = (
  feature1: GeoJSON.Geometry,
  feature2: GeoJSON.Geometry
): boolean => {
  try {
    const poly1 = turf.polygon((feature1 as GeoJSON.Polygon).coordinates)
    
    // Check if poly1 contains all vertices of poly2
    const coords2 = (feature2 as GeoJSON.Polygon).coordinates[0]
    const allPointsInside = coords2.every(coord => {
      const point = turf.point(coord)
      return turf.booleanPointInPolygon(point, poly1)
    })
    
    return allPointsInside
  } catch (error) {
    console.error('Error checking enclosure:', error)
    return false
  }
}

/**
 * Auto-trim overlapping polygon by removing the intersection area
 * Returns the trimmed geometry or null if trimming fails
 */
export const trimOverlap = (
  newFeature: GeoJSON.Geometry,
  existingFeature: GeoJSON.Geometry
): GeoJSON.Geometry | null => {
  try {
    const newPoly = turf.polygon((newFeature as GeoJSON.Polygon).coordinates)
    const existingPoly = turf.polygon((existingFeature as GeoJSON.Polygon).coordinates)
    
    // Use difference to remove overlapping area
    const difference = turf.difference(turf.featureCollection([newPoly, existingPoly]))
    
    if (difference && difference.geometry) {
      return difference.geometry
    }
    
    return null
  } catch (error) {
    console.error('Error trimming overlap:', error)
    return null
  }
}

/**
 * Validate if a new polygonal feature can be added
 * Checks for overlaps and full enclosures with existing features
 */
export const validatePolygonalFeature = (
  newGeometry: GeoJSON.Geometry,
  existingFeatures: DrawnFeature[]
): { valid: boolean; error?: string; trimmedGeometry?: GeoJSON.Geometry } => {
  // Filter only polygonal features (exclude linestrings)
  const polygonalFeatures = existingFeatures.filter(
    f => f.type !== 'linestring'
  )
  
  let currentGeometry = newGeometry
  
  for (const existing of polygonalFeatures) {
    // Check if new feature fully encloses existing feature
    if (checkFullEnclosure(currentGeometry, existing.geometry)) {
      return {
        valid: false,
        error: 'Cannot draw a polygon that fully encloses another polygon',
      }
    }
    
    // Check if existing feature fully encloses new feature
    if (checkFullEnclosure(existing.geometry, currentGeometry)) {
      return {
        valid: false,
        error: 'Cannot draw a polygon inside another polygon',
      }
    }
    
    // Check for overlap and auto-trim
    if (checkOverlap(currentGeometry, existing.geometry)) {
      const trimmed = trimOverlap(currentGeometry, existing.geometry)
      if (trimmed) {
        currentGeometry = trimmed
      } else {
        return {
          valid: false,
          error: 'Failed to trim overlapping area',
        }
      }
    }
  }
  
  return {
    valid: true,
    trimmedGeometry: currentGeometry,
  }
}

/**
 * Convert Leaflet layer to GeoJSON geometry
 * Handles special cases like rectangles and circles
 */
export const layerToGeoJSON = (layer: L.Layer & { getBounds?: () => L.LatLngBounds; getLatLng?: () => L.LatLng; getRadius?: () => number; toGeoJSON?: () => any }): GeoJSON.Geometry | null => {
  try {
    // Handle rectangle - convert bounds to polygon
    if (layer instanceof L.Rectangle && layer.getBounds) {
      const bounds = layer.getBounds()
      const coords = [
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()],
        [bounds.getWest(), bounds.getNorth()],
        [bounds.getWest(), bounds.getSouth()], // Close the polygon
      ]
      return {
        type: 'Polygon',
        coordinates: [coords],
      }
    }
    
    // Handle circle - convert to polygon approximation
    if (layer instanceof L.Circle && layer.getLatLng && layer.getRadius) {
      const center = layer.getLatLng()
      const radius = layer.getRadius()
      const centerPoint = turf.point([center.lng, center.lat])
      const circlePolygon = turf.circle(centerPoint, radius, { steps: 64, units: 'meters' })
      return circlePolygon.geometry
    }
    
    // Standard conversion for other shapes
    if (layer.toGeoJSON) {
      const geoJSON = layer.toGeoJSON()
      return geoJSON.geometry
    }
    
    return null
  } catch (error) {
    console.error('Error converting layer to GeoJSON:', error)
    return null
  }
}
