import HealthPage from './pages/Health';
import Home from './pages/Home';
import SignInUp from './pages/SignInUp';
import UnauthorizedPage from './pages/Unauthorized';

export type RouteConfig = {
  path: string;
  element: JSX.Element;
  isPrivate?: boolean;
};

const routeConfigs: Record<string, RouteConfig> = {
  // Home
  home: {
    path: '/',
    element: <Home />,
  },
  unauthorized: {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  // Admin
  health: {
    path: '/admin/health',
    element: <HealthPage />,
    isPrivate: true,
  },
  // User Routes
  signIn: {
    path: '/user/signin',
    element: <SignInUp authType='SIGN_IN' />,
  },
  signUp: {
    path: '/user/signup',
    element: <SignInUp authType='SIGN_UP' />,
  },
};

export default routeConfigs;
