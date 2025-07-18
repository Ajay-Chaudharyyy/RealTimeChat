import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import CustomLoader from "../lib/CustomLoader";

const ProfilePage = () => {
  const { authUser, updateProfile, changePassword } = useContext(AuthContext);
  const { bio, setBio } = useContext(ChatContext);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName);
  const [loading, setLoading] = useState(false);

  const [password,setPassword] = useState({
    oldPassword:"",
    newPassword:""
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if(password.newPassword !== "" && password.oldPassword !== "")
    {
       const response =  await changePassword(password.newPassword,password.oldPassword);

       if(!response)
       {
        setLoading(false);
        return;
       }

    }
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });

      navigate("/");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64img = reader.result;
      console.log(base64img, "😂😂😂😂");
      await updateProfile({ fullName: name, bio, profilePic: base64img });
    };
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      {loading && (
        <div className="absolute top-0 right-0 w-full h-full bg-[#00000070] z-50">
          <CustomLoader />
        </div>
      )}
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600  flex items-center justify-between ma-sm:flex-col-reverse rounded-lg overflow-y-scroll">
        <form
          className="flex flex-col gap-5 p-10 flex-1"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageChange(e)
              }
              type="file"
              id="avatar"
              accept=".png , .jpg , .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImage ? "rounded-full" : ""}`}
            />
            <p className="cursor-pointer ">Upload profile image</p>
          </label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            placeholder="Write profile bio"
            required
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          <label className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-300">Old Password</p>
            <input
              type="password"
              placeholder="Enter your old password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password.oldPassword}
              onChange={(e)=>setPassword({...password,oldPassword:e.target.value})}
            />
          </label>

          <label className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-300">New Password</p>
            <input
              type="password"
              placeholder="Enter your new password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password.newPassword}
              onChange={(e)=>setPassword({...password,newPassword:e.target.value})}
            />
          </label>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={authUser?.profilePic || assets.logo_icon}
          className={`max-w-44 aspect-squre rounded-full mx-10 mx-sm:mt-10 ${
            selectedImage ? "rounded-full" : ""
          }`}
        />
      </div>
    </div>
  );
};
export default ProfilePage;
