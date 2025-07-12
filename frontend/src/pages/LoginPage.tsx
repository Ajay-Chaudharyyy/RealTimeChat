import { useContext, useState } from "react";
import assets from "../assets/assets";
import ToggleSwitch from "../lib/ToggleSwitch";
import { AuthContext } from "../../Context/AuthContext"
import logo from "/chatLogo.svg"

const LoginPage = () => {
  const {login} = useContext(AuthContext);
  const [currentState, setCurrentState] = useState("login");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    isDataSubmitted: false,
  });
  

  const submitHandler=(e:any)=>{
    e.preventDefault();
    if(currentState === "Sign Up" && !formData?.isDataSubmitted)
    {
        setFormData((prev)=>({...prev,isDataSubmitted:true}));
        return;
    }
    login(currentState === "Sign Up" ? "signup" : "login", formData)
  }

  
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* LEFT */}
      <div className="flex flex-col items-center justify-center gap-2">
        <img src={logo} alt="" className="w-[min(30vw,250px)]" />
        <p className="text-2xl text-white ">Welcome To NexTalk</p>
      </div>
      {/* RIGHT */}
      <form
      onSubmit={(e)=>submitHandler(e)}
        action=""
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}

        {formData.isDataSubmitted &&  <img onClick={()=>setFormData((prev)=>({...prev,isDataSubmitted:false}))} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
        </h2>
        {currentState === "Sign Up" && !formData.isDataSubmitted && (
          <input
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
            placeholder="Full Name"
            required
            onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
          />
        )}
        {!formData.isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
            <input
              type="password"
              placeholder="Enter Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </>
        )}
        {
            currentState === "Sign Up" && formData?.isDataSubmitted && (
                <textarea onChange={(e)=>setFormData((prev)=>({...prev,bio:e.target.value}))} rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
                placeholder="Provide a short bio..."></textarea>
            )
        }
        <button className="py-3 bg-gradient-to-r from-[#35C1FF] to-[#005DFF] text-white rounded-md cursor-pointer">
            {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
            {/* <input type="checkbox" className="" /> */}
            <ToggleSwitch/>
            <p>Agree to terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-2">
            {currentState==="Sign Up" ? (<p className="text-sm text-gray-600">Already Have and Account <span className="font-medium text-[#079CFF] cursor-pointer" onClick={()=>{setCurrentState("Login"); setFormData((prev)=>({...prev,isDataSubmitted:false}))}}>Login Here</span></p>):(<p className="text-sm text-gray-600">Create an account <span className="font-medium text-[#079CFF] cursor-pointer" onClick={()=>{setCurrentState("Sign Up"); setFormData((prev)=>({...prev,isDataSubmitted:false}))}}>Click Here</span></p>)}
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
