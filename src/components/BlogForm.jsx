// Componente para el formulario
const BlogForm = ({newTitle, newAuthor, newUrl, onTitleChange, onAuthorChange, onUrlChange, onSubmit}) => (
    <form onSubmit={onSubmit}>
      <div className="formt">
        Title: <input className="fbar" value={newTitle} onChange={onTitleChange} />
      </div>
      <div className="formt">
        Author: <input className="fbar" value ={newAuthor} onChange={onAuthorChange}/>
      </div>
      <div className="formt">
        URL: <input className="fbar" value = {newUrl} onChange={onUrlChange}/>
      </div>
      <button className="addb" type="submit">Add</button>
    </form>
)

// Exportar el componente
export default BlogForm