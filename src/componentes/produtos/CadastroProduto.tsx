import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './CadastroProduto.css';

interface ProdutoFormData {
  nome: string;
  preco: string;
  descricao: string;
  urlfoto: string;
}

interface Produto {
  _id?: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
}

interface CadastroProdutoProps {
  produto?: Produto | null;
  onProdutoCadastrado?: () => void;
  onProdutoAtualizado?: () => void;
  onCancelarEdicao?: () => void;
}

const CadastroProduto: React.FC<CadastroProdutoProps> = ({
  produto,
  onProdutoCadastrado,
  onProdutoAtualizado,
  onCancelarEdicao
}) => {
  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    preco: '',
    descricao: '',
    urlfoto: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        preco: produto.preco.toString(),
        descricao: produto.descricao,
        urlfoto: produto.urlfoto
      });
    } else {
      setFormData({ nome: '', preco: '', descricao: '', urlfoto: '' });
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const produtoData = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        descricao: formData.descricao,
        urlfoto: formData.urlfoto
      };

      if (produto && produto._id) {
        await api.put(`/produtos/${produto._id}`, produtoData);
        setMensagem({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
        onProdutoAtualizado?.();
      } else {
        await api.post('/produtos', produtoData);
        setMensagem({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
        onProdutoCadastrado?.();
      }

      setFormData({ nome: '', preco: '', descricao: '', urlfoto: '' });
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      setMensagem({
        texto: error.response?.data?.mensagem || 'Erro ao salvar produto. Tente novamente.',
        tipo: 'erro'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-produto">
      {mensagem && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}

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

        <div className="botoes-form">
          <button type="submit" disabled={loading} className="btn-cadastrar">
            {loading
              ? produto
                ? 'Atualizando...'
                : 'Cadastrando...'
              : produto
              ? 'Atualizar Produto'
              : 'Cadastrar Produto'}
          </button>

          {produto && onCancelarEdicao && (
            <button
              type="button"
              className="btn-cancelar"
              onClick={onCancelarEdicao}
              disabled={loading}
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CadastroProduto;
