import { App } from '@/App'
import '@/styles/main/index.scss'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { KanbanBoardContextComponent } from '@/context/KanbanBoardContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KanbanBoardContextComponent>
      <App />
    </KanbanBoardContextComponent>
  </StrictMode>,
)
