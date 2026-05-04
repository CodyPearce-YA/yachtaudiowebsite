import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import Projects from './pages/Projects'
import LegalNotice from './pages/LegalNotice'

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/projects', Component: Projects },
  { path: '/legal-notice', Component: LegalNotice },
])
