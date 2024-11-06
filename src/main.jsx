import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar.jsx'
import { AppKitProvider } from './components/WalletSetup.jsx'

const AppLayout = () => {
  return (
    <div className='font-poppins bg-[#013A63] w-full h-full'>
      <Navbar />
      <Outlet />
    </div>
  );
}

const routerDom = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <App /> },
    ]
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Provider store={store}>
  <AppKitProvider>
  <RouterProvider router={routerDom} />
  </AppKitProvider>
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
