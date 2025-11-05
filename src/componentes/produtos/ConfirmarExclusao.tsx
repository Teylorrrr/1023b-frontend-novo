import React from 'react';
//import './ConfirmarExclusao.css';

interface ConfirmarExclusaoProps {
  produtoNome: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  loading: boolean;
}

const ConfirmarExclusao: React.FC<ConfirmarExclusaoProps> = ({ 
  produtoNome, 
  onConfirmar, 
  onCancelar,
  loading 
}) => {
  return (
    <div className="confirmar-exclusao">
      <div className="confirmar-conteudo">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o produto <strong>{produtoNome}</strong>?</p>
        <p className="aviso">Esta ação não pode ser desfeita.</p>
        
        <div className="botoes">
          <button 
            onClick={onConfirmar} 
            disabled={loading}
            className="btn-confirmar"
          >
            {loading ? 'Excluindo...' : 'Sim, Excluir'}
          </button>
          <button 
            onClick={onCancelar} 
            disabled={loading}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarExclusao;