import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

interface PasswordResetOtpProps {
  form:{ email: string,
    newPassword: string,
    confirmPassword: string},

    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    setTimer:React.Dispatch<React.SetStateAction<number>>


}

const PasswordResetOtp: React.FC<PasswordResetOtpProps> = ({
    form, setLoading,setTimer
}) => {
  const [otp, setOtp] = useState("");
  const {handlePasswordOTP, resetPassword, login} = useContext(AuthContext);


  const sendOtp = async(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    setLoading(true);
    const success=  await handlePasswordOTP(form.email);
    if(success)
        setTimer(300)
    setLoading(false);
  };

  const handleVerify = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
   const success =  await resetPassword(form.email,form.newPassword,form.confirmPassword,otp);

   if(success)
   {
    await login("login",{email:form.email, password:form.newPassword})
   }
    
    setLoading(false);
  };
  return (
    <div className="h-full bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <form
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
        onSubmit={(e)=>handleVerify(e)}
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
          <p className="text-sm text-gray-600">
            Didn't get the OTP?{" "}
            <span
              className="font-medium text-[#079CFF] cursor-pointer"
              onClick={(e)=>sendOtp(e)}
            >
              Resend OTP
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetOtp;
