import { RouterProvider } from 'react-router-dom';
import { appRouter } from './presentation/routes';

/**
 * Root app component — mounts the presentation router.
 * Business logic stays in core/data layers, wired via presentation hooks.
 */
function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
