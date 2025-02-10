// Importar el estado de la aplicación
import {useState, useEffect, useRef} from 'react'
// Importar los componentes 
import BlogsList from './components/BlogsList'
import BlogForm from './components/BlogForm'
import SearchBlog from './components/SearchBlog'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
// Importar los servicios 
import blogService from './services/blogsServices'
import loginService from './services/login'


const App = () => {
  // Creamos el primer estado de la aplicación para el registro de todos los blogs
  const [blogs, setBlogs] = useState([]) // Inicialmente es un array o lista vacío (AQUÍ SE ALMACENA LOS CAMPOS title, author, url and likes)
 
 // Creamos el estado para buscar titulos de blogs 
 const [searchBlog, setSearchBlog] = useState('') // Inicialmente está vacío

 // Creamos el estado para mostrar Notificaciones
 const [notification, setNotification] = useState({message: '', type:''}) // Toma dos parámetros el mensaje y tipo

 // Creamos el estado para almacenar los usuarios logeados
 const [user, setUser] = useState(null)
 
 // Creamos el estado para visualizar los formularios
 const [loginVisible, setLoginVisible] = useState(false) // Inicialmente no se muestra
 

 // Mecanismo de ref de React, que ofrece una referencia al componente.
 const blogFormRef = useRef()
 
 // Hook useEffect: se ejecuta una vez al cargar el componente para obtener todas los blogs desde el servidor. (usando async/await)
 useEffect(() => {
  // Función asincrónica
  const fetchBlogs = async () => {
    const initialBlogs = await blogService.getAll() // Espera la respuesta del servidor
    setBlogs(initialBlogs) // Actualiza el estado con los blogs obtenidos
  }
  fetchBlogs() // Llama a la función asincrónica
 },[])  // El array vacío asegura que esto solo se ejecute al montar el componente.

 // Hook  useEffect:  se ejecuta una vez al cargar el componente la aplicación verifique si los detalles de un usuario que inició sesión ya se pueden encontrar en el local storage.
 useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
 }, []) // El array vacío como parámetro del effect hook asegura que el hook se ejecute solo cuando el componente es renderizado por primera vez

 
 // Controladores de evento
  // Función para manejar los "Likes"
  const handleLikeChange = async (id) => {
    try { 
      setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => blog.id === id ? {...blog, like: blog.like + 1} : blog )
      )

      const returnedBlog = await blogService.like(id)
      // Actualiza el estado con la respuesta del servidor para mantener la consistencia
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => blog.id !== id ? blog : returnedBlog)
      )
      showNotification('Like agregado exitosamente', 'success')
    } catch (exception) {
      showNotification('Error like blog', 'error')
      console.error('Error al dar like', exception)
    }
      }
  

 // Manejador de eventos para buscar titulos de blogs
 const handleSearchChange = (event) => setSearchBlog(event.target.value) // Busca un blog
 
 // Función para mostrar las Notificaciones
 const showNotification = (message, type) => { // Toma los dos parámetros
  setNotification({message,type}) // Llama al estado con los parámetros
  setTimeout(() =>{ // Establece un tiempo para el mensaje
    setNotification({message:'', type:''}); 
  }, 5000) // 5 SEGUNDOS
 }

 const addBlog = async (blogObject) => {
   try {
    blogFormRef.current.toggleVisibility() // Ocultar el formulario al registrar un blog
    // Verifica si el titulo del blog existe
    const existingBlog = blogs.find(blog => blog.title.toLowerCase() === blogObject.title.toLowerCase())

    // Mensaje de confirmación
    if(existingBlog) {
      if(window.confirm(`The blog "${existingBlog.title}" already exists. Do you want to replace it?`)) { 
        // Si el usuario acepta, actualiza el blog
      const updatedBlog = {
        ...existingBlog,
        author: blogObject.author,
        url: blogObject.url,
        like: 0 
      }
      // Llamamos al servicio Update
      const returnedBlog = await blogService.update(existingBlog.id, updatedBlog)

      // Actualiza el estado con el blog reemplazado
      setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
      blog.id === existingBlog.id ? returnedBlog : blog
      )
      )
      showNotification(`Replaced Blog "${returnedBlog.title}"`, 'success')
    }
  } else { 
    // Llama al servivio create, para añadir un blog
    const returnedBlog = await blogService.create(blogObject)
    
    // Agrega el nuevo blog (usando el método prevBlogs)
    setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog))
    showNotification(`Added ${returnedBlog.title}`, 'success')
  }
   } catch (exception) {
    showNotification('Failed to add blog', 'error')
      console.error('Error al añadir blog:', exception)
   }
  }

 


// Función para mostrar los blogs de la Barra de Búsqueda -- Enumerar la lista de blogs por número de likes
const blogsToShow = searchBlog 
  ? blogs
  .filter(blog=> blog.title.toLowerCase().includes(searchBlog.toLowerCase())) 
  .sort((a,b) => b.like - a.like) // Ordenar por likes
  : blogs.sort((a,b) => b.like - a.like) // Ordenar por likes si no hay búsqueda activa

// Función para eliminar Blogs
const handleDeleteBlog = async (id) => {

  try { 
  const blogToDelete = blogs.find(blog => blog.id === id) // Encuentra el blog por ID

  if (!blogToDelete) {
    showNotification('Blog not found. Please refresh and try again.', 'error');
    return
  }

  if (window.confirm(`Are you sure you want to delete ${blogToDelete.title}?`)) {
    await blogService.remove(id)

      setBlogs(blogs.filter(blog => blog.id !== id)) // Actualiza el estado eliminando el blog
      showNotification(`Deleted ${blogToDelete.title}`, 'success') // Confirmación de eliminación
  }
    } catch (exception) {
      showNotification('Error deleting blog. Please try again.', 'error') // Si la eliminación falla
      console.error('Error al eliminar', exception)
    }
  }

// Funcion para manejar el inicio de sesion (Login)
const handleLogin = async ({username, password}) => {
  try {
    const user = await loginService.login({
      username, password
    })
    // Guardando el token en el local storage del navegador
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user) // Los valores guardados en el storage son DOMstrings-se debe de formatear (stringify) en formato json
    )
    blogService.setToken(user.token)
    setUser(user)
  // Notificación de éxito
  showNotification(`Welcome back, ${user.name || user.username}!`, 'success');
} catch (exception) {
  // Notificación de error más específica si es posible
  showNotification('Invalid username or password. Please try again.', 'error');
  console.error('Login error:', exception);
}
}

  

  

   
  
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification.message} type={notification.type}/>
         
         {!user && 
         <LoginForm
         userLogged={handleLogin}
        loginVisible={loginVisible}
      setLoginVisible={setLoginVisible}
    />}
        {user && <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel = "new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog}
      />
      </Togglable>
          </div>
          }
       
      <SearchBlog searchBlog={searchBlog} onSearchChange={handleSearchChange}/>
   
     
      <h1>Blogs List</h1>
      <BlogsList blogs={blogsToShow} handleLikeChange={handleLikeChange} onDelete={handleDeleteBlog} user={user} />
      <Footer/>
    </div>
  )
}
export default App






