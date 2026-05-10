# Temp Ionic - Task Board Management Application

Aplikasi web responsif untuk manajemen tugas dengan antarmuka kanban board yang modern. Dibangun menggunakan React, Ionic, dan Vite dengan dukungan mobile melalui Capacitor.

## Fitur Utama

- **Kanban Board**: Kelola tugas dengan visual board system
- **Task Management**: Buat, edit, dan hapus tugas dengan detail lengkap
- **Checklist**: Tambahkan sub-task dalam checklist
- **Drag & Drop**: Reorder tugas antar kolom dengan mudah
- **Filter & Label**: Organisir tugas dengan label dan filter
- **Avatar Group**: Kolaborasi dengan multiple user/assignee
- **Responsive Design**: Optimal di desktop, tablet, dan mobile

## Tech Stack

### Frontend Framework
- **React**: 19.0.0 - UI library
- **Vite**: Build tool dan dev server
- **TypeScript**: Type-safe development
- **React Router**: Navigasi aplikasi

### UI Components
- **Ionic**: 8.5.0 - Component library
- **Ionicons**: Icon set
- **Capacitor**: Cross-platform bridge untuk mobile

### State Management & Utils
- **Zustand**: State management
- **@dnd-kit**: Drag and drop functionality
- **date-fns**: Date manipulation
- **uuid**: Generate unique identifiers

### Testing dan Quality
- **Cypress**: E2E testing
- **Vitest**: Unit testing
- **ESLint**: Code linting
- **React Testing Library**: Component testing

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── BoardHeader       # Header navigasi board
│   ├── ColumnContainer   # Container untuk kolom kanban
│   ├── TaskCard         # Kartu individual task
│   ├── CreateTaskModal  # Modal pembuatan task baru
│   ├── TaskDetailModal  # Modal detail task
│   ├── FilterBar        # Filter controls
│   ├── ChecklistSection # Sub-task checklist
│   ├── LabelBadge      # Label display
│   ├── AvatarGroup      # User avatars
│   └── ExploreContainer # Container explore
├── pages/               # Page components
│   ├── BoardPage        # Main board page
│   └── Home            # Home page
├── store/              # State management
│   └── useTaskStore    # Zustand task store
├── data/               # Data seeds
│   └── seed.ts        # Initial data
├── models/             # Type definitions
│   └── types.ts       # TypeScript interfaces
├── utils/              # Utility functions
├── theme/              # Styling & variables
└── main.tsx           # Entry point aplikasi
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd test-fe_adhivasindo

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run dev
# Akses di http://localhost:5173
```

### Build

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run unit tests
npm run test.unit

# Run E2E tests dengan Cypress
npm run test.e2e

# ESLint check
npm lint
```

## Mobile Development

Project ini menggunakan Capacitor untuk cross-platform mobile development:

```bash
# Dokumentasi Capacitor
# https://capacitorjs.com/docs
```

## Theme dan Styling

CSS variables dan theme colors tersimpan di:
- `src/theme/variables.css` - Variabel warna dan font

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Start development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run test.unit` | Jalankan unit tests |
| `npm run test.e2e` | Jalankan E2E tests Cypress |
| `npm run lint` | ESLint code checking |

## Komponen Utama

### BoardPage
Page utama yang menampilkan kanban board dengan kolom-kolom task.

### TaskCard
Komponen kartu individual yang menampilkan task dengan detail dan aksi.

### CreateTaskModal
Modal untuk membuat task baru dengan form input.

### TaskDetailModal
Modal untuk melihat dan edit detail task secara lengkap.

### Filter Bar
Komponen filter untuk menyaring task berdasarkan label dan status.

## State Management

Menggunakan Zustand untuk global state management:
- Task store di `src/store/useTaskStore.ts`
- Centralized task operations dan state

## Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request
