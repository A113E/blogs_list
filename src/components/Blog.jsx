import { useState } from 'react'
import PropTypes from 'prop-types';

// Componente para los Blogs registrados
const Blog = ({blog, handleLikeChange, onDelete, user}) => {
  const [viewDetails, setViewDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    fontSize: 20
  }
  // Verifica si el usuario actual es el creador del blog
  const isCreator = blog.user && user && blog.user.username === user.username

  return (
    <div style={blogStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Title:</strong> {blog.title}
        </div>
        <div>
          {viewDetails ? (
            <button onClick={() => setViewDetails(false)}>Hide</button>
          ) : (
            <button onClick={() => setViewDetails(true)}>View</button>
          )}
        </div>
      </div>

      {viewDetails && (
        <div>
          <strong>Author:</strong> {blog.author} <br />
          <strong>URL:</strong> {blog.url} <br />
          <strong>Likes:</strong> {blog.like}  <button onClick={() => handleLikeChange(blog.id)}>Like</button><br />
          {isCreator && ( // Mostrar el botón "Eliminar" solo si el usuario es el creador
            <button onClick={() => onDelete(blog.id)}>Delete Blog</button>
          )}
        </div>
      )}
    </div>
  )
}

// Definimos los proptypes
Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string,
    like: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  }).isRequired,
  handleLikeChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
}

export default Blog