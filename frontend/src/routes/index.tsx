import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public.routes';
import { syndicRoutes } from './syndic.routes';
import { adminRoutes } from './admin.routes';
import { ownerRoutes } from './owner.routes';

const router = createBrowserRouter([
  ...publicRoutes,
  ...syndicRoutes,
  ...adminRoutes,
  ...ownerRoutes,
]);

export default router;