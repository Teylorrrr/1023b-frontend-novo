
import './App.css'
import { useEffect, useState } from 'react'
type produtoType = {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
}
function App() {

const [produtos, setProdutos] = useState<produtoType[]>([])
useEffect(() => {
  fetch('/api/produtos')
    .then(response => response.json())
    .then(data => setProdutos(data))
    .catch(error => console.error('Error fetching data:', error));
}, [])
return(
  <>
  <div>TERERERERERERERERREEREREERRERERERERERRER</div>
  {
    produtos.map(produto => (
      <div key={produto._id}>
        <h2>{produto.nome}</h2>
        <p>Preço: {produto.preco}</p>
        <p>Descrição: {produto.descricao}</p>
        <img src={produto.urlfoto} alt={produto.nome} />
      </div>
    ))
  }
  </>
)
}

export default App
