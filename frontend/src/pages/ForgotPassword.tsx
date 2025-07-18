import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import logo from "/chatLogo.svg";
import CustomLoader from "../lib/CustomLoader";
import { useNavigate } from "react-router-dom";
import PasswordResetOtp from '../Components/PasswordResetOtp'

const ForgotPassword = () => {
  const { handlePasswordOTP } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(300);
  
    useEffect(() => {
      if (!openOTP) return;
  
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, [openOTP]);
  
    useEffect(()=>{
      if(timer === 0)
        setOpenOTP(false);
    },[timer])

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const success = await handlePasswordOTP(form.email);
    setLoading(false);
    if (success) {
      setOpenOTP(true);
      setTimer(300);
    }
  };
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl relative">
      {loading && (
        <div className="absolute top-0 right-0 w-full h-full bg-[#00000070] z-50">
          <CustomLoader />
        </div>
      )}

      {/* LEFT */}
      <div className="flex flex-col items-center justify-center gap-2">
        <img src={logo} alt="logo" className="w-[min(30vw,250px)]" />
        <p className="text-2xl text-white">Forgot Password</p>
      </div>

      {/* RIGHT */}
      {openOTP ? 
     <div className="flex flex-col  items-center justify-center gap-4">
         <PasswordResetOtp
       form={form}
        setLoading={setLoading}
        setTimer={setTimer}
      />
     
          <p className="text-sm text-gray-600">
            OTP expires in{" "}
            <span className="font-medium text-[#079CFF] cursor-pointer">
              {formatTime(timer)}
            </span>
          </p>
         </div>
        
      :<div className="flex flex-col items-center justify-center gap-4">
        <form
          onSubmit={submitHandler}
          className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
        >
          <h2 className="font-medium text-2xl flex justify-between items-center">
            Reset Password
          </h2>

          <input
            type="email"
            placeholder="Enter your registered email"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
          />

          <input
            type="password"
            placeholder="Enter new password"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            value={form.newPassword}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            value={form.confirmPassword}
          />

          <button className="py-3 bg-gradient-to-r from-[#35C1FF] to-[#005DFF] text-white rounded-md cursor-pointer">
            Reset Password
          </button>

          <p className="text-sm text-gray-600">
            Do not have an Account?{" "}
            <span
              className="font-medium text-[#079CFF] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>}
    </div>
  );
};

export default ForgotPassword;
