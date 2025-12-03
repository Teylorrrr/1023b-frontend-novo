import React from 'react';
import { useCart } from '../../contexts/CartContext';
import './BotaoCarrinho.css';

interface BotaoCarrinhoProps {
  produto: {
    _id: string;
    nome: string;
    preco: number;
    urlfoto?: string;
  };
}

const BotaoCarrinho: React.FC<BotaoCarrinhoProps> = ({ produto }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      produtoId: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      urlfoto: produto.urlfoto || ''
    });
  };

  return (
    <button 
      className="botao-adicionar-carrinho"
      onClick={handleAddToCart}
      aria-label={`Adicionar ${produto.nome} ao carrinho`}
    >
      <span className="icone-carrinho">🛒</span>
      <span className="texto-adicionar">Adicionar</span>
    </button>
  );
};

export default BotaoCarrinho;
