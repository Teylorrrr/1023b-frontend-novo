import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

interface CartItem {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  urlfoto: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantidade'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/carrinho');
      setCart(response.data.itens || []);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantidade'>) => {
    try {
      await api.post('/carrinho/adicionar', { 
        produtoId: item.produtoId,
        quantidade: 1 
      });
      await fetchCart();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await api.delete(`/carrinho/remover/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    try {
      await api.put(`/carrinho/atualizar/${productId}`, { quantidade: quantity });
      await fetchCart();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/carrinho/limpar');
      setCart([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        total,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
