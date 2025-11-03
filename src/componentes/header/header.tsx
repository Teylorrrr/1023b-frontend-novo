import { useLocation, useNavigate } from 'react-router-dom'
import './header.css'
import { useState, useEffect } from 'react'
import api from '../../api/api'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Função para carregar os itens do carrinho
  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/carrinho')
        setCartItems(response.data.itens || [])
        setCartCount(response.data.itens?.length || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }

  // Carrega o carrinho quando o componente é montado
  useEffect(() => {
    loadCart()
  }, [])

  // Atualiza a contagem do carrinho quando o estado de autenticação muda
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadCart()
    } else {
      setCartItems([])
      setCartCount(0)
    }
  }, [location.pathname]) // Recarrega quando a rota muda

  const handleCartClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}&mensagem=${encodeURIComponent('Por favor, faça login para ver seu carrinho')}`)
      return
    }
    setIsCartOpen(!isCartOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('isAdmin')
    navigate('/')
    window.location.reload() // Recarrega a página para atualizar o estado de autenticação
  }

  const isLoggedIn = !!localStorage.getItem('token')
  const isAdminPage = location.pathname.startsWith('/admin')
  const shouldShowCart = isLoggedIn && !isAdminPage

  return (
    <header>
      <h1 className="site-title">Meus Gostos</h1>
      
      {isLoggedIn && (
        <div className="header-actions">
          {shouldShowCart && (
            <div className="cart-container">
              <button onClick={handleCartClick} className="cart-button">
                🛒 Carrinho {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            </div>
          )}
          <button onClick={handleLogout} className="logout-button" title="Sair">
            <span className="material-symbols-outlined">logout</span>
          </button>
          {isCartOpen && shouldShowCart && (
            <div className="cart-dropdown">
              <h3>Seu Carrinho</h3>
              {cartItems.length === 0 ? (
                <p>Seu carrinho está vazio</p>
              ) : (
                <>
                  <ul>
                    {cartItems.map((item: any) => (
                      <li key={item._id} className="cart-item">
                        <span>{item.produto?.nome} x {item.quantidade}</span>
                        <span>R$ {(item.produto?.preco * item.quantidade).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="checkout-button"
                    onClick={() => navigate('/checkout')}
                  >
                    Finalizar Compra
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header