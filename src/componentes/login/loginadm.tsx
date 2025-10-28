import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
function LoginAdm(){
    const navigate = useNavigate()
    //url   localhost:5123/login?mensagem=Token Inválido
    //para pegar a mensagem passada pela url usamos o useSearchParams()
    const [searchParams] = useSearchParams()
    //Dentro do searchParans eu consigo utilizar o get para pegar 
    // o valor da variável passada pela URL
    const mensagem = searchParams.get("mensagem")

    //Função chamada quando clicamos no botão do formulário
    function handleSubmit(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        //Vamos pegar o que a pessoa digitou no formulário
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const senha = formData.get("senha")

        // Obter a URL de redirecionamento, se existir
        const redirectUrl = searchParams.get('redirect') || '/';
        
        //chamar a API.post para mandar o login e senha
        api.post("/login",{
            email,
            senha
        }).then(resposta=>{
            if(resposta.status===200){
                localStorage.setItem("token",resposta?.data?.token);
                // Redireciona para a URL original ou para a página inicial
                window.location.href = redirectUrl;
            }
        }).catch((error:any)=>{
            const msg = error?.response?.data?.mensagem || 
                       error?.mensagem || 
                       "Erro Desconhecido!"
            // Mantém o parâmetro de redirecionamento na URL de erro
            navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}&mensagem=${encodeURIComponent(msg)}`)
        })
    }


    return(
    <>
    <h1>LoginAdm</h1>
    {mensagem&&<p>{mensagem}</p>}
    <form onSubmit={handleSubmit}>
        <input type="text" name="email" id="email" />
        <input type="password" name="senha" id="senha" />
        <button type="submit">Entrar</button>
    </form>
    </>
    )
}
export default LoginAdm;