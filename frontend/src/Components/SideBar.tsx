
import { useNavigate } from 'react-router-dom'
import logo from "/chatLogo.svg"
import menuIcon from '../assets/menu_icon.png'
import searchIcon from '../assets/search_icon.png'
import assets from '../assets/assets'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { ChatContext } from '../../Context/ChatContext'

const SideBar = () => {
  const {selectedUser,setSelectedUser,getUsers,users,unseenMessages,setUnseenMessages}=useContext(ChatContext);
  const {logout, onlineUsers}= useContext(AuthContext);
  const [name,setName]=useState("");
   const menuRef = useRef<HTMLDivElement>(null);

  const filteredUsers = name ? users.filter((user)=>user.fullName.toLowerCase().includes(name.toLocaleLowerCase())) : users;
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    getUsers();
  },[onlineUsers])
  const navigate = useNavigate();

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  return (
    <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <div className="flex items-center justify-center gap-2">
        <img src={logo} alt="" className="w-[min(30vw,25px)]" />
        <p className="text-sm text-white ">NEXTALK</p>
      </div>
          <div className ="relative py-2" ref={menuRef}>
            <img src={menuIcon} alt="logo" className="max-w-5 cursor-pointer" onClick={()=>setOpen(prev=>!prev)}/>
            {open && <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#062B65] border border-gray-600 text-gray-100"><p className='cursor-pointer text-sm' onClick={()=>navigate('/profile')}>Edit Profile</p>
            <hr className="my-2 border-t border-gray-500"/>
            <p className = "cursor-pointer text-sm" onClick={()=>logout()}> Logout</p>
            </div>
}
          </div>
        </div>
        <div className="bg-[#062B65] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={searchIcon} alt="search" className='w-3'/>
          <input type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder="Search User..." onChange={(e)=>setName(e.target.value)} value={name}/>
        </div>

      </div>
      <div className="flex flex-col">
        {
          filteredUsers.map((user, index) => {
            return (
              <div  onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev,[user._id]:0}))}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser === user && "bg-[#282142]/50"}`}>
                <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
                <div className='flex flex-col leading-5'>
                  <p>{user.fullName}</p>
                  {
                    onlineUsers.includes(user?._id)
                    ?
                    <span className="text-green-400 text-xs">Online</span>
                    :
                    <span className="text-neutral-400 text-xs">Offline</span>
                  }

                </div>
                {
                  unseenMessages[user._id] > 0 &&
                  <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SideBar