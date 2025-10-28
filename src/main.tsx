import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginPage from './pages/LoginPage/LoginPage';
import AdminPage from './pages/Admin/AdminPage';
import Erro from './componentes/erro/erro.tsx'

///////////////// Componentes comuns ////////////////////////////
import Header from './componentes/header/header.tsx'
import Footer from './componentes/footer/footer.tsx'
import './componentes/header/header.css'
import './componentes/footer/footer.css'
///////////////////////////////////////////////////////////////


const PaginaPadrao = ({ children }: { children: React.ReactNode }) => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    alignItems: 'center'
  }}>
    <Header />
    <main style={{
      flex: 1,
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      {children}
    </main>
    <Footer />
  </div>
)

///////////////// Roteador ////////////////////////////
const router = createBrowserRouter([
  {
    path: '/',
    element: <PaginaPadrao><App /></PaginaPadrao>,
    errorElement: <PaginaPadrao><Erro /></PaginaPadrao>
  },
  {
    path: '/login',
    element: <PaginaPadrao><LoginPage /></PaginaPadrao>
  },
  {
    path: '/error',
    element: <PaginaPadrao><Erro /></PaginaPadrao>
  },
  {
    path: '/admin',
    element: <PaginaPadrao><AdminPage /></PaginaPadrao>
  }
]);


///////////////// Renderização ////////////////////////////
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)