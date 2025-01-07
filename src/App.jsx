// Importar el estado de la aplicación
import {useState, useEffect} from 'react'
// Importar la librería de Axios
import axios from 'axios'
// Importar los componentes 
import Blog from './components/Blog'
import BlogsList from './components/BlogsList'
import BlogForm from './components/BlogForm'
import SearchBlog from './components/SearchBlog'
import Notification from './components/Notification'
import Footer from './components/Footer'
// Importar los servicios 
import blogService from './services/blogsServices'

const App = () => {
  // Creamos el primer estado de la aplicación para el registro de todos los blogs
  const [blogs, setBlogs] = useState([]) // Inicialmente es un array o lista vacío (AQUÍ SE ALMACENA LOS CAMPOS title, author, url and likes)
  
 // Creamos el estado de la aplicación para registrar titulos de los blogs
 const [newTitle, setNewTitle] = useState('') // Inicialmente vacio

 // Creamos el estado de la aplicación para registrar el autor de los blogs
 const [newAuthor, setNewAuthor] = useState('') // Inicialmente está vacío

 // Creamos el estado de la aplicación para registrar la Url de los blog
 const [newUrl, setNewUrl] = useState('') // Inicialmente está vacío

 // Creamos el estado para buscar titulos de blogs 
 const [searchBlog, setSearchBlog] = useState('') // Inicialmente está vacío

 // Creamos el estado para mostrar Notificaciones
 const [notification, setNotification] = useState({message: '', type:''}) // Toma dos parámetros el mensaje y tipo

 // Hook useEffect: se ejecuta una vez al cargar el componente para obtener todas los blogs desde el servidor.
 useEffect(() => {
  blogService
  .getAll()
  .then(initialBlogs =>{
    setBlogs(initialBlogs)
  })
 },[])

 
 // Controladores de evento
 // Manejador de evento para la creación de un nuevo titulo de un blog
 const handleTitleChange = (event) => setNewTitle(event.target.value) // Agrega un nuevo titulo
 // Manejador de evento para la creación de un nuevo autor de un blog
 const handleAuthorChange = (event) => setNewAuthor(event.target.value) // Agrega un nuevo autor
 // Manejador de evento para la creación de un nuevo URL de un blog
 const handleUrlChange = (event) => setNewUrl(event.target.value) // Agrega una nueva URL
  // Función para manejar los "Likes"
  const handleLikeChange = (id) => {
    const updatedBlogs = blogs.map((blog) =>
      blog.id === id ? { ...blog, like: blog.like + 1 } : blog
    );
  
    setBlogs(updatedBlogs);
  
    const updatedBlog = updatedBlogs.find((blog) => blog.id === id);
  
    blogService.update(id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) =>
          blog.id !== id ? blog : returnedBlog
        ));
        showNotification('Like agregado exitosamente', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar los likes:', error);
        showNotification('Error al agregar el like', 'error');
      });
  };
  

 // Manejador de eventos para buscar titulos de blogs
 const handleSearchChange = (event) => setSearchBlog(event.target.value) // Busca un blog
 
 // Función para mostrar las Notificaciones
 const showNotification = (message, type) => { // Toma los dos parámetros
  setNotification({message,type}) // Llama al estado con los parámetros
  setTimeout(() =>{ // Establece un tiempo para el mensaje
    setNotification({message:'', type:''}); 
  }, 5000) // 5 SEGUNDOS
 }

// Función para añadir blogs
const addBlog = (event) => {
  event.preventDefault() // Evita que se recargue la página

  // Función para evitar duplicados
  const blogExist = 
  // Usamos el método some para verificar si newBlog ya está en la lista de blogs
  blogs.find((blog) => blog.title === newTitle);
  // Condicional
  if (blogExist) {
    const confirmUpdate = window.confirm(
      `${newTitle} is already added, replace the old title with a new one?`
    );
    if(confirmUpdate) {
      // Creamos un nuevo blog con los campos actualizados
      const blogUpdated = { ...blogExist, author: newAuthor, url: newUrl, like: 0 };

      blogService.update(blogExist.id, blogUpdated)
        .then((returnedBlog) => {
          setBlogs(blogs.map((blog) =>
            blog.id !== blogExist.id ? blog : returnedBlog
          ));
          setNewTitle('');
          setNewAuthor('');
          setNewUrl('');
          showNotification(`Updated ${returnedBlog.title}`, 'success');
        })
        .catch((error) => {
          console.error('Error updating blog:', error);
          showNotification(
            `Information of ${newTitle} has already been removed from the server`,
            'error'
          );
          setBlogs(blogs.filter((blog) => blog.id !== blogExist.id));
        });
      
    }
  } else {
    
  
    // Crea un nuevo objeto para un nuevo blog
    const newBlog = { title: newTitle, author: newAuthor, url: newUrl, like: 0};

    // Realizamos la solicitud Post para añadir un nuevo registro en el servidor (db.json)
    blogService
    .create(newBlog)
    .then((returnedBlog) => {
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      showNotification(`Added ${returnedBlog.title}`, 'success');
    })
    .catch((error) => {
      console.error('Error adding blog:', error);
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, 'error');
      } else {
        showNotification('Error adding blog. Please try again.', 'error');
      }
    });
  
}
};

// Función para mostrar los blogs de la Barra de Búsqueda
const blogsToShow = searchBlog ? blogs.filter(blog=>
  blog.title.toLowerCase().includes(searchBlog.toLowerCase())) : blogs;

// Función para eliminar Blogs
const handleDeleteBlog = (id) => {
  const deleteBlog = blogs.find(blog => blog.id === id); // Encuentra el blog a eliminar por el ID
  if (window.confirm(`Are you sure you want to delete ${deleteBlog.title}?`)) {
    blogService
    .remove(id)
    .then(() =>{
      setBlogs(blogs.filter(blog => blog.id !==id)) // Entonces reinicia el array con los cambios realizados
      showNotification(`Deleted ${deleteBlog.title}`, 'success'); // Muestra un mensaje confirmando la eliminación
    })
    .catch(error => { // En caso de error muestra un mensaje
      console.error('Error deleting blog:', error);
      showNotification('Error deleting blog. Please try again.', 'error');
    });
  }
}
  

  

   
  
  return (
    <div>
      <h1 className='h1_1'>Blogs</h1>
      <Notification message={notification.message} type={notification.type}/>
      <SearchBlog searchBlog={searchBlog} onSearchChange={handleSearchChange}/>
      <h1 className='h1_1'>Register Blog</h1>
      <BlogForm
      newTitle={newTitle}
      newAuthor={newAuthor}
      newUrl={newUrl}
      onTitleChange={handleTitleChange}
      onAuthorChange={handleAuthorChange}
      onUrlChange={handleUrlChange}
      onSubmit={addBlog}
      />
      <h1>Blogs List</h1>
      <BlogsList blogs={blogsToShow} handleLikeChange={handleLikeChange} onDelete={handleDeleteBlog}/>
      <Footer/>
    </div>
  )
}
export default App






