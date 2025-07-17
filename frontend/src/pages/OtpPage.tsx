import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";


interface formData{
     fullName: string,
    email: string,
    password: string,
    bio: string,
    isDataSubmitted: boolean,
}
interface otpPageTypes{
    formData:formData,
    currentState:string,
    setCurrentState:React.Dispatch<React.SetStateAction<string>>,
    setFormData:React.Dispatch<React.SetStateAction<formData>>,
    loading:boolean,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    setTimer:React.Dispatch<React.SetStateAction<number>>;
}
const OtpPage :React.FC<otpPageTypes>= ({formData,setLoading,setTimer}) => {
  const { login} = useContext(AuthContext);
  const [otp, setOtp] = useState("");

  const {handleOTP}= useContext(AuthContext);
  const sendOtp = async() => {
    try{
      setLoading(true);
      const success = await handleOTP(formData?.email,formData?.fullName);
      if(success)
        setTimer(300);

    }catch(err)
    {
      if(err instanceof Error)
        toast.error(err.message)
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="h-full bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <form
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if(!otp) return;
          login("signup", {...formData, otp});
        }}
      >
        <h2 className="font-medium text-2xl">Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB]"
        />
        <button
          type="submit"
          className="bg-[#0047AB] text-white p-2 rounded-md hover:bg-[#003a8b] cursor-pointer"
        >
          Verify OTP
        </button>
        <div className="flex flex-col gap-2">

          <p className="text-sm text-gray-600">Didn't get the OTP ? <span className="font-medium text-[#079CFF] cursor-pointer" onClick={sendOtp}>Resend OTP</span></p>
            {/* <p className="text-sm text-gray-600">Already Have and Account <span className="font-medium text-[#079CFF] cursor-pointer" onClick={()=>{setCurrentState("Login"); setFormData((prev)=>({...prev,isDataSubmitted:false}))}}>Login Here</span></p> */}


        </div>
      </form>
    </div>
  );
};

export default OtpPage;
