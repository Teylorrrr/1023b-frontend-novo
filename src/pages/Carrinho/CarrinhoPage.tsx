import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CarrinhoPage.css';

interface CartItem {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  urlfoto?: string;
}

const Carrihange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (loading) {
    return <div className="carrinho-loading">Carregando carrinho...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="carrinho-vazio">
        <h2>Seu carrinho está vazio</h2>
        <button onClick={() => navigate('/')} className="btn-continuar-comprando">
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <h2>Meu Carrinho</h2>
      <div className="carrinho-itens">
        {cart.map((item: CartItem) => (
          <div key={item.produtoId} className="carrinho-item">
            <img 
              src={item.urlfoto || 'https://via.placeholder.com/100'} 
              alt={item.nome}
              className="item-imagem"
            />
            <div className="item-detalhes">
              <h3>{item.nome}</h3>
              <p>R$ {item.preco.toFixed(2)}</p>
              <div className="item-quantidade">
                <button 
                  onClick={() => handleQuantityChange(item.produtoId, item.quantidade - 1)}
                  className="btn-quantidade"
                >
                  -
                </button>
                <span className="quantidade">{item.quantidade}</span>
                <button 
                  onClick={() => handleQuantityChange(item.produtoId, item.quantidade + 1)}
                  className="btn-quantidade"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.produtoId)}
                className="btn-remover"
              >
                Remover
              </button>
            </div>
            <div className="item-subtotal">
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="carrinho-resumo">
        <div className="total">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleFinalizarPedido}
          className="btn-finalizar"
          disabled={cart.length === 0}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="carrinho-container">
      <h2>Meu Carrinho</h2>
      <div className="carrinho-itens">
        {cart.map((item) => (
          <div key={item.produtoId} className="carrinho-item">
            <img 
              src={item.urlfoto || 'https://via.placeholder.com/100'} 
              alt={item.nome}
              className="item-imagem"
            />
            <div className="item-detalhes">
              <h3>{item.nome}</h3>
              <p>R$ {item.preco.toFixed(2)}</p>
              <div className="item-quantidade">
                <button 
                  onClick={() => handleQuantityChange(item.produtoId, item.quantidade - 1)}
                  className="btn-quantidade"
                >
                  -
                </button>
                <span className="quantidade">{item.quantidade}</span>
                <button 
                  onClick={() => handleQuantityChange(item.produtoId, item.quantidade + 1)}
                  className="btn-quantidade"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.produtoId)}
                className="btn-remover"
              >
                Remover
              </button>
            </div>
            <div className="item-subtotal">
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="carrinho-resumo">
        <div className="total">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleFinalizarPedido}
          className="btn-finalizar"
          disabled={cart.length === 0}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default CarrinhoPage;                  disabled={item.quantidade <= 1}
                >
                  -
                </button>
                <span>{item.quantidade}</span>
                <button onClick={() => updateQuantity(item.produtoId, item.quantidade + 1)}>
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.produtoId)}
                className="btn-remover"
              >
                Remover
              </button>
            </div>
            <div className="item-subtotal">
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="carrinho-total">
        <h3>Total: R$ {total.toFixed(2)}</h3>
        <button 
          onClick={handleFinalizarPedido}
          className="btn-finalizar"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default CarrinhoPage;
