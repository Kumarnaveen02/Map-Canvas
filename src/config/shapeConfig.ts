// Dynamic configuration for maximum shapes per type
// Easily adjustable limits for each shape type
export const SHAPE_LIMITS = {
  polygon: 10,
  rectangle: 10,
  circle: 5,
  linestring: 15,
} as const

export type ShapeType = keyof typeof SHAPE_LIMITS

export const SHAPE_COLORS = {
  polygon: '#8b5cf6',
  rectangle: '#f59e0b',
  circle: '#10b981',
  linestring: '#06b6d4',
} as const
