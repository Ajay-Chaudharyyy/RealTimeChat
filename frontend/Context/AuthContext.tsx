// eslint-disable-next-line @typescript-eslint/no-unused-vars

import  {
  createContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// ✅ Define user type
type User = {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic?: string;
};

// ✅ Define context shape
type AuthContextType = {
  axios: typeof axios;
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  loading: boolean;
  login: (state: string, credentials: any) => Promise<void>;
  logout: (showToast?: boolean) => Promise<void>;
  updateProfile: (body: any) => Promise<void>;
  handleOTP : (email:string,fullName:string)=>Promise<boolean|undefined>;
  handlePasswordOTP : (email:string)=>Promise<boolean|undefined>;
  resetPassword: (email:string,password:string,confirmPassword:string,otp:string)=>Promise<boolean|undefined>;
  changePassword:(newpassword:string,oldPassword:string) =>Promise<boolean>

};

// ✅ Default context
export const AuthContext = createContext<AuthContextType>({
  axios,
  authUser: null,
  onlineUsers: [],
  socket: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  handleOTP : async () => false,
  handlePasswordOTP : async () => false,
  resetPassword: async () => false,
  changePassword: async () => false
});

interface AuthProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Set axios auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ✅ Check if token is valid
  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/v1/check");
      if (response.data?.success) {
        setAuthUser(response.data.user);
        connectSocket(response.data.user);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await logout(false); // token expired
      } else {
        toast.error("Could not verify session.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordOTP = async (email:string) =>
  {
    try{
      if(!email) return;
      const response = await axios.post("api/v1/resetPasswordOtp",{email});
      if(response?.data?.success)
      {
        toast.success("OTP sent to your email");
        return true;
      }
      else{
        toast.error(response?.data?.message)
        return false;
      }
    }catch(err)
    {
      if(err instanceof Error)
        toast.error(err.message)
      return false;
    }
  }
  
  const changePassword = async (newPassword:string,oldPassword:string) => {
    try{
      if(!newPassword || !oldPassword)
      {
        toast.error("Password fields can not be empty")
        return false;
      }

      const response = await axios.put("/api/v1/changePassword",{newPassword, oldPassword});

      if(response?.data?.success)
      {
        return true
      }
      else{
        toast.error(response?.data?.message)
        return false
      }
    } catch(err:any)
    {
      if (err.response?.data?.message) {
      // ✅ Custom backend message like "Old password is not correct"
      toast.error(err.response.data.message);
    } else if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong");
    }
    return false;
  }
  }

  const resetPassword = async (email:string, password:string, confirmPassword:string,otp:string) => {

    try{

      if(!email || !password || !confirmPassword || !otp)
      {
        return;
      }

      const response = await axios.post("/api/v1/forgotPassword",{email,password,confirmPassword,otp});

      if(response?.data?.success)
      {
        toast.success("Password Reset SuccessFully");
        return true;
      }
      else{
        toast.error(response?.data?.message);
        return false;
      }
    }catch(err)
    {
      if(err instanceof Error)
        toast.error(err.message)
      return false;
    }
  }

    const handleOTP = async (email:string,fullName:string) => {
    try{
      if(!email) {
        toast.error("Email is required for OTP");
        return;
      }
      const data = await axios.post("/api/v1/otp", {email,fullName})

      if(data?.data?.success) {
        toast.success("OTP sent to your email");
        return true;
      } else {
        toast.error("Failed to send OTP");
        return false;
      }
    }catch(err)
    {
      if(err instanceof Error)
      toast.error(err?.message || "OTP request failed");
    return false;
    }
  }

  // ✅ Login
  const login = async (state: string, credentials: any) => {
    try {
      const { data } = await axios.post(`/api/v1/${state}`, credentials);
      if (data?.success) {
        setAuthUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  // ✅ Logout
  const logout = async (showToast: boolean = true) => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      socket?.disconnect();
      if (showToast) toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout error");
    }
  };

  // ✅ Update Profile
  const updateProfile = async (body: any) => {
  try {
    const { data } = await axios.put("/api/v1/update-profile", body);

    const user = data.user || data.data; // ✅ fallback to correct key

    if (data.success && user) {
      setAuthUser(user);
      toast.success("Profile updated successfully");
      navigate("/");
    } else {
      toast.error("Invalid response from server.");
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Update failed");
  }
};



  // ✅ Setup socket
  const connectSocket = (userData: User) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  };

  // ✅ Run auth check on mount
  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ✅ Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo<AuthContextType>(
    () => ({
      axios,
      authUser,
      onlineUsers,
      socket,
      loading,
      login,
      logout,
      updateProfile,
      handleOTP,
      handlePasswordOTP,
      resetPassword,
      changePassword
    }),
    [authUser, onlineUsers, socket, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
