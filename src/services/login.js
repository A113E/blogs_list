// Servicio para manejar el loggin
// Importa la librería Axios, que se utiliza para realizar solicitudes HTTP de manera sencilla.
import axios from "axios"
const baseUrl = '/api/login'

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}
export default {login}