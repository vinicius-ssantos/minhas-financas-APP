import React from 'react'

import AuthService from '../app/service/authService';
import ApiService from '../app/apiservice';
import jwt from 'jsonwebtoken'

export const AuthContext = React.createContext()
export const AuthConsumer = AuthContext.Consumer;

const AuthProvider = AuthContext.Provider;

class ProvedorAutenticacao extends React.Component{

    state = {
        usuarioAutenticado: null,
        isAutenticado: false,
        isLoading:true
    }

    iniciarSessao = (tokenDTO) => {
        const token = tokenDTO.token
        const claims = jwt.decode(token);
        console.log(claims)
        const usuario = {
            id:claims.userid,
            nome:claims.nome
        }
        ApiService.registrarToken(token);
        AuthService.logar(usuario,token);
        this.setState({ isAutenticado: true, usuarioAutenticado: usuario })
    }

    encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        this.setState({ isAutenticado: false, usuarioAutenticado: null})
    }


   async componentDidMount(){
        const isAutenticado = AuthService.isUsuarioAutenticado()
        if(isAutenticado){
           const usuario = await AuthService.refreshSession()
            this.setState({
                isAutenticado:true,
                usuarioAutenticado:usuario,
                isLoading:false
            })
        }else{
            this.setState(previousState=>{
                return{
                    ...previousState,
                    isLoading:false
                }
            })
        }
    }
    
    render(){
        if(this.state.isLoading){
            return null;
        }


        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            isAutenticado: this.state.isAutenticado,
            iniciarSessao: this.iniciarSessao,
            encerrarSessao: this.encerrarSessao
        }

        return(
            <AuthProvider value={contexto} >
                {this.props.children}
            </AuthProvider>
        )
    }
}

export default ProvedorAutenticacao;