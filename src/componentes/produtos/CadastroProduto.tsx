import React, { useState } from 'react';
import api from '../../api/api';
import './CadastroProduto.css';

interface ProdutoFormData {
  nome: string;
  preco: string;
  descricao: string;
  urlfoto: string;
}

interface CadastroProdutoProps {
  onProdutoCadastrado?: () => void;
}

const CadastroProduto: React.FC<CadastroProdutoProps> = ({ onProdutoCadastrado }) => {
  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    preco: '',
    descricao: '',
    urlfoto: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco)
      };

      const response = await api.post('/produtos', produtoData);
      
      if (response.status === 201) {
        setMensagem({ 
          texto: 'Produto cadastrado com sucesso!', 
          tipo: 'sucesso' 
        });
        setMensagem({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
        setFormData({
          nome: '',
          preco: '',
          descricao: '',
          urlfoto: ''
        });
        
        // Chama a função de callback se fornecida
        if (onProdutoCadastrado) {
          onProdutoCadastrado();
        }
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      setMensagem({ 
        texto: error.response?.data?.error || 'Erro ao cadastrar produto. Tente novamente.', 
        tipo: 'erro' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-produto">
      <h2>Cadastrar Novo Produto</h2>
      
      {mensagem && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Camiseta"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preco">Preço (R$)</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            placeholder="Ex: 59.90"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Descreva o produto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="urlfoto">URL da Imagem</label>
          <input
            type="url"
            id="urlfoto"
            name="urlfoto"
            value={formData.urlfoto}
            onChange={handleChange}
            required
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-cadastrar">
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
};

export default CadastroProduto;
