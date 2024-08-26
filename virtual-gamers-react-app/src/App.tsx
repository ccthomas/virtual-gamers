import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const routes: { path: string; element: JSX.Element, isPrivate?: boolean | undefined }[] = [
  {
    path: '/',
    element: <Home />,
  },
];

const App = () => (
  <Router>
    <Routes>
      {routes.map(((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      )))}
    </Routes>
  </Router>
);

export default App;
