// Componente para mostrar la lista de blogs
// Importa el componente Blog (IMPORTANTE)
import Blog from "./Blog";

const BlogsList = ({blogs, handleLikeChange, onDelete}) => (
    <div>
        {blogs.map((blog)=>(
            <Blog  key={blog.id} // Usamos el ID único del blog como clave
            blog={blog} 
            handleLikeChange={handleLikeChange}
            onDelete={onDelete} />
        ))}
    </div>
);

// Exportar el componente
export default BlogsList