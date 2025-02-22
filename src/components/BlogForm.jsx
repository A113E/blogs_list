// Importa los hooks de react que se usarán en el componente
import { useState } from 'react'
import PropTypes from 'prop-types'
// Componente para el formulario
const BlogForm = ({createBlog}) => { 
    
 // Creamos el estado de la aplicación para registrar titulos de los blogs
 const [newTitle, setNewTitle] = useState('') // Inicialmente vacio

 // Creamos el estado de la aplicación para registrar el autor de los blogs
 const [newAuthor, setNewAuthor] = useState('') // Inicialmente está vacío

 // Creamos el estado de la aplicación para registrar la Url de los blog
 const [newUrl, setNewUrl] = useState('') // Inicialmente está vacío

 // Instancia para resetear el formulario
 const resetForm = () => {
  setNewTitle('')
  setNewAuthor('')
  setNewUrl('')
 }

 const addBlog = (event) => {
   event.preventDefault() // Evita que se recargue la página
    createBlog({
    title: newTitle,
    author: newAuthor,
    url: newUrl,
    like: 0
   })
   resetForm()
     }

  return ( 
    <div className='formDiv'>
    <h2>Register a Blog</h2>
    <form onSubmit={addBlog}>
      <div>
        Title: <input  value={newTitle} onChange={event => setNewTitle(event.target.value)} id='title-input' />
      </div>
      <div>
        Author: <input  value ={newAuthor} onChange={event => setNewAuthor(event.target.value)} id='author-input'/>
      </div>
      <div>
        URL: <input value = {newUrl} onChange={event => setNewUrl(event.target.value)} id='url-input'/>
      </div>
      <button type="submit">Add</button>
    </form>
    </div>
)
}

// Definimos el PropTypes
BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}
// Exportar el componente
export default BlogForm