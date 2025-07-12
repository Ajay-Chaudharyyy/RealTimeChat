import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import {AuthProvider} from "../Context/AuthContext.tsx"
import {ChatProvider} from "../Context/ChatContext.tsx"
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
    <ChatProvider>
    <App />
    </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)
