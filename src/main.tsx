import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './componentes/login/login.tsx'
import Erro from './componentes/erro/erro.tsx'

///////////////// Componentes comuns ////////////////////////////
import Header from './componentes/header/header.tsx'
import Footer from './componentes/footer/footer.tsx'
import './componentes/header/header.css'
import './componentes/footer/footer.css'
///////////////////////////////////////////////////////////////


const PaginaPadrao = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)

///////////////// Roteador ////////////////////////////
const router = createBrowserRouter([
  {
    path: '/',
    element: <PaginaPadrao><App /></PaginaPadrao>
  },
   {
    path: '/Login',
    element: <PaginaPadrao><Login /></PaginaPadrao>
  },
  {
    path: '/Erro',
    element: <PaginaPadrao><Erro /></PaginaPadrao>
  }
]);


///////////////// Renderização ////////////////////////////
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)