import { Link, createFileRoute } from '@tanstack/react-router'

// Función para simular fetch de datos de la lista
const fetchTestItems = () => {
  const testItems = [
    { id: '1', title: 'Test Item 1', description: 'This is the first test item' },
    { id: '2', title: 'Test Item 2', description: 'This is the second test item' },
    { id: '3', title: 'Test Item 3', description: 'This is the third test item' },
    { id: '4', title: 'Test Item 4', description: 'This is the fourth test item' },
    { id: '5', title: 'Test Item 5', description: 'This is the fifth test item' },
  ]

  return testItems
}

export const Route = createFileRoute('/test')({
  loader: async () => fetchTestItems(),
  component: TestComponent,
})

function TestComponent() {
  const items = Route.useLoaderData()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Items</h1>
        <p className="text-muted-foreground">Lista de elementos de prueba para routing dinámico. Haz clic en cualquier item para navegar a su página individual.</p>
      </div>

      {/* Grid de items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to="/test/$itemId"
            params={{
              itemId: item.id,
            }}
            className="block p-6 border rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.description}
            </div>
            <div className="mt-4 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Haz clic para ver detalles →
            </div>
          </Link>
        ))}

        {/* Item que no existe para probar el error */}
        <Link
          to="/test/$itemId"
          params={{
            itemId: 'no-existe',
          }}
          className="block p-6 border border-red-200 rounded-lg hover:shadow-md hover:border-red-300 transition-all duration-200 group"
        >
          <div className="font-semibold text-lg mb-2 text-red-600 group-hover:text-red-700 transition-colors">
            Item No Existente
          </div>
          <div className="text-sm text-red-500">
            Para probar manejo de errores
          </div>
          <div className="mt-4 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Haz clic para ver error →
          </div>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Información sobre el Routing Dinámico:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Cada item navega a una página individual completa</li>
          <li>• Los parámetros dinámicos se definen con <code className="bg-gray-200 px-1 rounded">$paramName</code></li>
          <li>• El último item demuestra el manejo de errores</li>
          <li>• Cada página tiene su propia URL única</li>
        </ul>
      </div>
    </div>
  )
}
