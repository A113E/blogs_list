// Componente para los Blogs registrados
const Blog = ({blog, handleLikeChange, onDelete}) => {
    return (
    <li>
      <strong>Title:</strong> {blog.title} |
      <strong>Author:</strong> {blog.author} |
      <strong>URL:</strong> {blog.url} |
      <strong>Likes:</strong> {blog.like} 
      <button onClick={() => handleLikeChange(blog.id)}>Like</button>
      <button onClick={() => onDelete(blog.id)}>Delete Blog</button>

       </li>
    )
}
export default Blog