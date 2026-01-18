# MapCanvas

MapCanvas is a **React + TypeScript** web application for drawing and managing geometrical features on **OpenStreetMap**, with enforced **non-overlapping constraints for polygonal shapes**.

---

## 🌐 Live Demo

👉 https://map-canvas.vercel.app/

---

## Screenshots

## Main Interface
<img width="1916" height="868" alt="image" src="https://github.com/user-attachments/assets/1287d543-f7d2-474a-8310-c2daf7dc8392" />

## Drawing Shapes
<img width="1918" height="875" alt="image" src="https://github.com/user-attachments/assets/c1754226-b23e-497f-9a24-26ba4bbd1844" />

## Error message for overlap 
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/637cfd4c-03b3-4522-82dd-1b7e34710def" />




## ✨ Features

- **Interactive Map** using OpenStreetMap free tiles
- **Multiple Shape Types**:
  - Polygon
  - Rectangle
  - Circle
  - LineString
- **Smart Overlap Prevention**:
  - Prevents overlapping polygonal features using spatial validation
- **Dynamic Shape Limits**:
  - Configurable maximum shapes per type
- **GeoJSON Export**:
  - Export all drawn features with geometry and metadata
- **Clean & Modern UI**:
  - Sidebar toolbar with real-time feature tracking

---

## 📋 Prerequisites

- Node.js **v18 or higher**
- npm or yarn package manager

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Kumarnaveen02/Map-Canvas.git
cd Map-Canvas
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run development server
```bash
npm run dev
```

### 4️⃣ Build for production
```bash
npm run build
```

The application will be available at:  
👉 http://localhost:5173

---

## 🎯 Usage

### Drawing Features

1. Select a shape from the left toolbar
2. Active mode is highlighted
3. Draw on the map:
   - **Polygon**: Click to add points, double-click to finish
   - **Rectangle**: Click and drag
   - **Circle**: Click center, drag to set radius
   - **LineString**: Click to add points, double-click to finish

---

### Shape Limits

Each shape type has a configurable maximum limit:

- Polygons: **10**
- Rectangles: **10**
- Circles: **5**
- LineStrings: **15**

Limits can be changed in:
```
src/config/shapeConfig.ts
```

---

### Exporting Features

Click **“Export GeoJSON”** in the toolbar to download all drawn features as a GeoJSON file.

---

## 🧠 Polygon Overlap Logic

The application enforces spatial constraints **only for polygonal features**:
- Polygon
- Rectangle
- Circle

### ✅ Overlap Detection
- Uses **Turf.js `intersect()`**
- Compares new geometry with existing polygonal features

### 🚫 Overlap Blocking
When overlap is detected:
- The new shape is **blocked**
- It is **not added to the map**
- A clear error message is shown
- Existing shapes remain unchanged

### 🔒 Full Enclosure Prevention
- Prevents polygons drawn **inside** or **around** another polygon
- Ensures spatial integrity

### ➖ LineString Exception
- LineStrings are **excluded from overlap rules**
- They can freely cross polygons or other lines

---

## 📁 Project Structure

```text
mapcanvas/
├── src/
│   ├── components/
│   │   ├── MapContainer.tsx
│   │   ├── Toolbar.tsx
│   │   └── ErrorNotification.tsx
│   ├── store/
│   │   └── useMapStore.ts
│   ├── utils/
│   │   ├── geometryUtils.ts
│   │   └── exportUtils.ts
│   ├── types/
│   │   └── feature.ts
│   ├── config/
│   │   └── shapeConfig.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Configuration

### Adjust Shape Limits
```ts
// src/config/shapeConfig.ts
export const SHAPE_LIMITS = {
  polygon: 10,
  rectangle: 10,
  circle: 5,
  linestring: 15,
}
```

### Customize Colors
```ts
export const SHAPE_COLORS = {
  polygon: '#8b5cf6',
  rectangle: '#f59e0b',
  circle: '#10b981',
  linestring: '#06b6d4',
}
```

---

## 📦 Dependencies

### Core Libraries
- **React 18**
- **TypeScript 5**
- **Vite**

### Mapping Libraries
- **Leaflet**
- **Leaflet-Draw**
- **React-Leaflet**

### Spatial Operations
- **Turf.js**

### State Management
- **Zustand**

---

## 🧾 Sample GeoJSON Export

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [77.5946, 12.9716],
            [77.5950, 12.9716],
            [77.5950, 12.9720],
            [77.5946, 12.9720],
            [77.5946, 12.9716]
          ]
        ]
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
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
```
Upload the `dist/` folder to Netlify.

---

## 🌍 Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## 👨‍💻 Author

**Naveen Kumar**

Built as a frontend development assignment showcasing React, TypeScript, spatial validation, and clean architecture.
