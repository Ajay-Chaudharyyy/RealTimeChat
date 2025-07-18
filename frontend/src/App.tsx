import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import { useContext} from 'react';
import { AuthContext } from '../Context/AuthContext';
import textureBg from "./assets/textureBg.jpg"
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const { authUser} = useContext(AuthContext);



  return (
    <div
      className="h-full w-full bg-cover"
      style={{ backgroundImage: `url(${textureBg})` }}
    >
      
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
