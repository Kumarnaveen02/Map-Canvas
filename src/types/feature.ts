import { ShapeType } from '../config/shapeConfig'

export interface DrawnFeature {
  id: string
  type: ShapeType
  geometry: GeoJSON.Geometry
  properties: {
    name: string
    color: string
    createdAt: string
  }
  leafletId?: number
}

export interface FeatureCollection {
  type: 'FeatureCollection'
  features: DrawnFeature[]
}
