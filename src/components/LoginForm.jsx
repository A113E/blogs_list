// Componente para el formulario de Login
// Componente para agregar notas (estado, manejo de notas y renderizado del formulario)
// Importa los hooks de React que se usarán en el componente.
import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({
    userLogged,
    loginVisible, 
    setLoginVisible
   }) => {

     // Creamos el estado para el manejo de usuarios logeados (Nombre de usuario y contraseña)
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')

      // Función para limpiar el formulario
      const resetForm = () => {
        setUsername('')
        setPassword('')
      }

      const handleLogin = async (event) => {
        event.preventDefault()
        try{
            await userLogged({username, password})
            resetForm()
        } catch (error) {
            console.error('Error de login:', error)
        }
      }

      const hideWhenVisible = {display: loginVisible ? 'none': ''}
      const showWhenVisible = {display: loginVisible ? '' : 'none'}

    return ( 
        <div>
     <h2>Login</h2>
     <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>Log-in</button>
     </div>
     <div style={showWhenVisible}>
     <form onSubmit={handleLogin}>
        <div>
            username
            <input value={username}  onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
            password
            <input type="password" value={password}  onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit">Login</button>
    </form>
    <button onClick={() => setLoginVisible(false)} style={showWhenVisible}>Cancel</button>
    </div>
     </div>
    
)
}

// Definimos los propTypes
LoginForm.propTypes = {
    userLogged: PropTypes.func.isRequired,
    loginVisible: PropTypes.bool.isRequired,
    setLoginVisible: PropTypes.func.isRequired
}
export default LoginForm