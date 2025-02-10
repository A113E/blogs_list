import axios from "axios";


const baseUrl = '/api/blogs';

// Variable privada
let token = null

// Definimos la funcion para cambiar el valor de la variable privada token
const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

// Función para crear un nuevo blog en el servidor. (Usando async/await)
const create = async newBlog => {
     // Establece el token en el encabezado Authorization. 
     const config = {
        headers: {Authorization: token}
     }
      // Realiza una solicitud POST a la URL base, enviando el nuevo objeto como cuerpo de la solicitud.
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
};

const update = async (id, updatedData) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedData)
    return response.data
};

const remove = async (id) => {
     // Establece el token en el encabezado Authorization. 
  const config = {
    headers: { Authorization: token },
  }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

const like = async id => {
    const response = await axios.post(`${baseUrl}/${id}/like`)
    return response.data
}

export default {
    getAll,
    create,
    update,
    remove,
    setToken, 
    like
};
