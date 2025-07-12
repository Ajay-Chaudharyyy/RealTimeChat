import { useContext} from "react";
import ChatBox from "../Components/ChatBox";
import RightSideBar from "../Components/RightSideBar";
import SideBar from "../Components/SideBar";
import { ChatContext } from "../../Context/ChatContext";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  bio: string;
}

const Homepage= ()=>{
    const {selectedUser}=useContext(ChatContext);
    return (
        <div className='border flex justify-center items-center w-full h-screen sm:px-[15%] sm:py-[5%]'>
       <div className={`h-[100%] w-full backdrop-blur-xl border-2 border-gray-300 rounded-2xl overflow-hidden  grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : "md:grid-cols-2"}`}>
        <SideBar/>
        <ChatBox/>
        <RightSideBar />
       </div>
        </div>
    )
}
export default Homepage;