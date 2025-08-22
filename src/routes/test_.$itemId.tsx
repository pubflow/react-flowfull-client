import { Link, createFileRoute } from '@tanstack/react-router'

// Función para simular fetch de datos (como en el ejemplo de la documentación)
const fetchTestItem = ({ data }: { data: string }) => {
  const testItems = {
    '1': { id: '1', title: 'Test Item 1', description: 'This is the first test item', content: 'Contenido detallado del primer item de prueba.' },
    '2': { id: '2', title: 'Test Item 2', description: 'This is the second test item', content: 'Contenido detallado del segundo item de prueba.' },
    '3': { id: '3', title: 'Test Item 3', description: 'This is the third test item', content: 'Contenido detallado del tercer item de prueba.' },
    '4': { id: '4', title: 'Test Item 4', description: 'This is the fourth test item', content: 'Contenido detallado del cuarto item de prueba.' },
    '5': { id: '5', title: 'Test Item 5', description: 'This is the fifth test item', content: 'Contenido detallado del quinto item de prueba.' },
  }
  
  const item = testItems[data as keyof typeof testItems]
  
  if (!item) {
    throw new Error('Item not found')
  }
  
  return item
}

// Componente de error (como en el ejemplo de la documentación)
const TestErrorComponent = ({ error }: { error: Error }) => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
    <p className="text-muted-foreground mb-4">{error.message}</p>
    <Link to="/test" className="text-blue-600 hover:text-blue-800 underline">
      ← Volver a la lista
    </Link>
  </div>
)

export const Route = createFileRoute('/test_/$itemId')({
  loader: ({ params: { itemId } }) => fetchTestItem({ data: itemId }),
  errorComponent: TestErrorComponent,
  component: TestComponent,
  notFoundComponent: () => {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Item No Encontrado</h1>
        <p className="text-muted-foreground mb-4">El item que buscas no existe.</p>
        <Link to="/test" className="text-blue-600 hover:text-blue-800 underline">
          ← Volver a la lista
        </Link>
      </div>
    )
  },
})

function TestComponent() {
  const item = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/test" className="text-blue-600 hover:text-blue-800 underline flex items-center">
            ← Volver a la lista de items
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{item.description}</p>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{item.content}</p>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4 text-lg">Información del Item:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-700">ID:</span>
                <p className="text-gray-900">{item.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Título:</span>
                <p className="text-gray-900">{item.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Descripción:</span>
                <p className="text-gray-900">{item.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <Link 
              to="/test" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver a la lista
            </Link>
            <div className="text-sm text-gray-500 flex items-center">
              URL actual: /test/{item.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
