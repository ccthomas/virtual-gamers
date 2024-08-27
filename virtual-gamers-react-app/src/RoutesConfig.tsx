import HealthPage from './pages/Health';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export type RouteConfig = {
  path: string;
  element: JSX.Element;
};

const routeConfigs: Record<string, RouteConfig> = {
  // Home
  home: {
    path: '/',
    element: <Home />,
  },
  // Admin
  health: {
    path: '/admin/health',
    element: <HealthPage />,
  },
  // User Routes
  signIn: {
    path: '/user/signin',
    element: <SignIn />,
  },
  signUp: {
    path: '/user/signup',
    element: <SignUp />,
  },
};

export default routeConfigs;
