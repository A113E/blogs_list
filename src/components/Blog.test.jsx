// Pruebas para el componente Blog
import { render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// Prueba que verifica que se muestren el título y el autor del blog pero no la URL ni los likes por defecto
test('renders title and author, but not URL or likes by default', () => {
    // Creamos un nuevo blog
    const blog = {
        title: 'Testing React Blog App',
        author: 'Noelia Dayana Marrero López',
        url: 'https://react-testing.com',
        like: 0
    }

    // Renderizamos el componente
    const { container } = render(<Blog blog={blog} />)

    // Verificamos que el título y el autor están visibles dentro del div con clase 'blog-summary'
    const summary = container.querySelector('.blog-summary')
    expect(summary).toBeDefined()
    

    // Verificamos que el div con la clase 'blog-details' NO esté en el DOM por defecto
    const details = container.querySelector('.blog-details')
    expect(details).toBeNull()
})

// Prueba que verifica que la URL del blog y el número de likes se muestran cuando se hace clic en el botón que controla los detalles mostrados
test('shows URL and likes when "View" button is clicked', async () => {
    // Creamos un nuevo blog
    const blog = {
        title: 'Another React test',
        author: 'Jany Adelayda',
        url: 'https://react-testing.com',
        like: 0
    }
    // Renderizamos el componente
    const { container } = render(<Blog blog={blog} />)

   // Se inicia una sesión de usuario para interactuar con el componente renderizado
   const user = userEvent.setup()

    // Verificamos que la url y los likes no estén visibles por defecto
    const hideDetails = container.querySelector('.blog-details')
    expect(hideDetails).toBeNull()

    // Simulamos un clic en el botón view
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    // Verificar que la URL y los likes ahora están visibles
    const showDetails = container.querySelector('.blog-details')
    expect(showDetails).toBeDefined()
})

// Prueba que verifica que garantice que si se hace clic dos veces en el botón like, se llama dos veces al controlador de eventos que el componente recibió como props
test('if the like button is clicked twice, the event handler that the component received as props is called twice', async () => {
    // Creamos un nuevo blog
    const blog = {
        title: 'Test handlers events',
        author: 'Daniel Padrón',
        url: 'https://react-testing.com',
        like: 0
    }

    // Controlador de eventos simulada (mockHandler)
    const mockHandler = vi.fn()

    // Renderizamos el componente
    const { container } = render(<Blog blog={blog} handleLikeChange={mockHandler} />)

    // Se inicia una sesión de usuario para interactuar con el componente renderizado
    const user = userEvent.setup()

    // Verificamos que el título y el autor están visibles dentro del div con clase 'blog-summary'
    const summary = container.querySelector('.blog-summary')
    expect(summary).toBeDefined()

    // Verificamos que la url y los likes no estén visibles por defecto
    const hideDetails = container.querySelector('.blog-details')
    expect(hideDetails).toBeNull()
   
    // Simulamos un clic en el botón view
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    
    // Verificar que la URL y los likes ahora están visibles
    const showDetails = container.querySelector('.blog-details')
    expect(showDetails).toBeDefined()

    // Buscamos el botón basado en el texto que lo contiene
    const likeButton = screen.getByText('Like')
    await user.dblClick(likeButton)

    // Verificamos que la función simulada se haya llamado exactamente dos veces
    expect(mockHandler).toHaveBeenCalledTimes(2)
})