// Pruebas para el componente BlogForm
import { render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// Prueba que verifica que el formulario llama al controlador de eventos que recibió como props con los detalles correctos cuando se crea un nuevo blog.
test ('the form calls the event handler it received as props with the correct details when a new blog is created', async () => {
    // Creamos un mock de función simulada para createBlog
    const createBlog = vi.fn()
    // Configuramos un usuario simulado para interactuar con la UI
    const user = userEvent.setup()
    // Renderizamos el componente BlogForm 
    const { container } = render(<BlogForm createBlog={createBlog} />)
    // Seleccionamos el campo de entrada (input) del formulario mediante el id (método querySelector)
    const inputTitle = container.querySelector('#title-input')
    const inputAuthor = container.querySelector('#author-input')
    const inputUrl = container.querySelector('#url-input')
    // Seleccionamos el botón del envío que tiene el texto add
    const addButton = screen.getByText('Add')
    // Log: cómo se ven las llamadas almacenadas por el objeto simulado
    console.log(createBlog.mock.calls)

    // Simulamos la escritura de un texto en el input
    await user.type(inputTitle, 'testing blog form...')
    await user.type(inputAuthor, 'Testing author...')
    await user.type(inputUrl, 'https://www.test...')

    // Simulamos un clic en el botón de añadir
    await user.click(addButton)

    // Verificamos que la función createBlog fue llamada una vez
    expect(createBlog.mock.calls).toHaveLength(1)
    // Verificamos cada argumento de la linea con el texto de prueba
    expect(createBlog.mock.calls[0][0].title).toBe('testing blog form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Testing author...')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.test...')
})