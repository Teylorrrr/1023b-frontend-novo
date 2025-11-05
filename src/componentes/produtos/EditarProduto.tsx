import React, { useState, useEffect } from 'react';
import api from '../../api/api';
//import './EditarProduto.css';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
}

interface EditarProdutoProps {
  produto: Produto;
  onSalvar: () => void;
  onCancelar: () => void;
}

const EditarProduto: React.FC<EditarProdutoProps> = ({ produto, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nome: produto.nome,
    preco: produto.preco.toString(),
    descricao: produto.descricao,
    urlfoto: produto.urlfoto
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

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
        ...formData,
        preco: parseFloat(formData.preco)
      };

      await api.put(`/produtos/${produto._id}`, produtoData);
      setMensagem({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
      onSalvar();
    } catch (error: any) {
      setMensagem({ 
        texto: error.response?.data?.error || 'Erro ao atualizar produto', 
        tipo: 'erro' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-produto">
      <h2>Editar Produto</h2>
      {mensagem && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        {/* Outros campos... */}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button type="button" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarProduto;