// Componente para buscar blogs
const SearchBlog = ({searchBlog, onSearchChange}) => (
    <div className="search">
        Filter shown with: <input className="sbar" value={searchBlog} onChange={onSearchChange}/>
    </div>
);
// Exportar el componente
export default SearchBlog