# MapCanvas

A React + TypeScript web application for drawing and managing geometrical features on OpenStreetMap with intelligent non-overlapping polygon constraints.

## Live Demo

[View Live Application](https://your-vercel-url.vercel.app)

## Screenshots

<!-- Add your project screenshots here -->

## Features

- Interactive Map with OpenStreetMap free tiles
- Multiple Shape Types: Draw Polygons, Rectangles, Circles, and Line Strings
- Smart Overlap Prevention: Automatic trimming of overlapping polygonal features
- Dynamic Limits: Configurable maximum shapes per type
- GeoJSON Export: Export all drawn features with geometry and properties
- Modern UI: Clean sidebar toolbar with real-time feature tracking

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository
   git clone <your-repo-url>
   cd mapcanvas

2. Install dependencies
   npm install

3. Run development server
   npm run dev

4. Build for production
   npm run build

The application will be available at http://localhost:5173

## Usage

### Drawing Features

1. Click on any shape button in the left sidebar (Polygon, Rectangle, Circle, or Line)
2. The button will highlight to indicate active drawing mode
3. Click on the map to start drawing:
   - Polygon: Click to add vertices, double-click to finish
   - Rectangle: Click and drag to create
   - Circle: Click center point and drag to set radius
   - Line String: Click to add points, double-click to finish

### Shape Limits

Each shape type has a configurable maximum limit:
- Polygons: 10
- Rectangles: 10
- Circles: 5
- Line Strings: 15

### Exporting Features

Click the "Export GeoJSON" button at the bottom of the toolbar to download all drawn features as a GeoJSON file.

## Polygon Overlap Logic

The application implements intelligent overlap prevention for polygonal features only (Polygon, Rectangle, Circle):

### Overlap Detection
- Uses Turf.js intersect() to detect if two polygons share any area
- Checks all existing polygonal features against new drawings

### Auto-Trimming
When overlap is detected:
- Uses Turf.js difference() operation to subtract the overlapping area
- The new polygon is automatically trimmed to remove the intersection
- The trimmed polygon is then added to the map

### Full Enclosure Prevention
- Blocks polygons that completely contain another polygon
- Shows error message for invalid operations

### Line String Exception
- Line Strings are excluded from overlap rules
- Can freely cross or overlap any polygons or other lines

## Project Structure

mapcanvas/
├── src/
│   ├── components/          # React components
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── config/             # Configuration
│   └── App.tsx             # Root component
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

## Configuration

### Adjusting Shape Limits

Edit src/config/shapeConfig.ts:

export const SHAPE_LIMITS = {
  polygon: 10,
  rectangle: 10,
  circle: 5,
  linestring: 15,
}

### Customizing Colors

Edit src/config/shapeConfig.ts:

export const SHAPE_COLORS = {
  polygon: '#8b5cf6',
  rectangle: '#f59e0b',
  circle: '#10b981',
  linestring: '#06b6d4',
}

## Dependencies

### Core Libraries
- React 18.3: UI framework
- TypeScript 5.3: Type safety
- Vite 5.1: Build tool and dev server

### Mapping Libraries
- Leaflet 1.9.4: Interactive map rendering
- Leaflet Draw 1.0.4: Drawing tools
- React Leaflet 4.2.1: React bindings for Leaflet

### Spatial Operations
- Turf.js 7.1: Geospatial analysis and geometry operations

### State Management
- Zustand 4.5: Lightweight state management

## Sample GeoJSON Export

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[...]]]
      },
      "properties": {
        "id": "polygon-1705234567890",
        "type": "polygon",
        "name": "Polygon 1",
        "color": "#8b5cf6",
        "createdAt": "2026-01-14T10:30:00.000Z"
      }
    }
  ]
}

## Deployment

### Vercel
npm install -g vercel
vercel

### Netlify
npm run build
Drag and drop 'dist' folder to Netlify

### GitHub Pages
npm run build
Deploy 'dist' folder to gh-pages branch

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Author

**Naveen Kumar**

Built as a frontend development assignment demonstrating React, TypeScript, spatial operations, and clean code architecture.