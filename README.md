# HotelsWeb

💻 **HotelsWeb** is a premium, zoneless Angular Single Page Application (SPA)! 🎨 Crafted with a sleek Apple-inspired glassmorphic design, it features signals-driven state management, maps integration, and smooth interactive debounced search for seamless hotel discovery! 🌟✨

---

## 🚀 Key Features

*   🎨 **Apple Glassmorphic Design**: Sleek gradients, dynamic blurs (`backdrop-filter`), micro-animations, and custom typography.
*   ⚡ **Zoneless Change Detection**: Highly optimized change detection without Zone.js (`provideZonelessChangeDetection`), utilizing Angular Signals and reactive streams for minimized bundle size and maximized performance.
*   🔍 **Server-Side Debounced Search**: Interacts with the Hot Chocolate GraphQL API using a dynamic `contains` matching query, debounced for `500ms` when typing in the search bar.
*   📍 **Interactive Geolocation Maps**: Connects directly to Google Maps navigation for each hotel's precise latitude and longitude.
*   📦 **Signals State Pipeline**: Clean tracking of loading, pagination, filters, and modal events.
*   🏗️ **Apple-Style Modals**: Interactive details card popups and hotel registration forms with smooth closing transitions.

---

## 🛠️ Tech Stack

*   **Framework**: Angular 19+ (Zoneless)
*   **State Management**: Angular Signals (`signal`, `computed`, `effect`)
*   **Styling**: Vanilla CSS with curated custom variables
*   **API Protocol**: GraphQL (via Angular HTTP and RxJS Observables)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── core/                  # Core services, models, configurations
│   │   ├── config/            # app.constants.ts (central configuration)
│   │   ├── services/          # graphql.service.ts, auth.service.ts
│   │   └── models/            # hotel.model.ts
│   ├── features/              # Feature modules
│   │   └── dashboard/         # Hotels dashboard container component
│   ├── shared/                # Reusable UI components
│   │   ├── components/
│   │   │   ├── header/        # Application navigation header
│   │   │   ├── filter-bar/    # Debounced search & filtering dropdowns
│   │   │   ├── hotel-card/    # Uniform aspect-ratio hotel preview cards
│   │   │   ├── hotel-modal/   # Interactive details modal (Google Maps link)
│   │   │   └── add-hotel-modal/ # Dynamic registration form
│   └── app.component.ts       # Application shell
├── assets/                    # Static assets
└── styles.css                 # Global glassmorphic stylesheet definition
```

---

## ⚙️ Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

### 2. Install Dependencies
Navigate to the project directory and install the packages:
```bash
npm install
```

### 3. Run Development Server
Start the local development server:
```bash
npm run start
```
By default, the application will run at **`http://localhost:4200`**.

To bind the server to a specific IP address (e.g., to test on mobile or local network devices):
```bash
npx ng serve --host 192.168.0.10 --port 4200
```

### 4. Build for Production
Generate optimized production bundles:
```bash
npm run build
```
The output will be written to the `dist/HotelsWeb` directory.

---

## ⚙️ Configuration constants

All key constants, dropdown options, and endpoints are defined in a single source of truth located at [`src/app/core/config/app.constants.ts`](file:///Users/arunrs/Desktop/Docker/Task/HotelsWeb/src/app/core/config/app.constants.ts). 

To change the GraphQL backend URL, adjust `API_URL` inside this file.
