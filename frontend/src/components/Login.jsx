// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import Cookies from "js-cookie";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// import loginImage from "../assets/image.jpg";
// import { validateLoginForm } from "../validation/LoginValidation";
// import { accountLogin } from "../Redux/AuthReducer/AuthSlice";

// const Login = () => {
//   const [formData, setFormData] = useState({ emailId: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
// const[profile,setProfile]=useState('')
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateLoginForm(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const loginResponse = await dispatch(accountLogin(formData)).unwrap();
//       // console.log(loginResponse,'login')
      
//       const accessToken = await loginResponse.accessToken;

//       // Store accessToken in cookies (refreshToken is set by the backend in HTTP-only cookies)
    
// if(loginResponse?.success){
//   setProfile(loginResponse.user.firstname)
//     Cookies.set("access", accessToken, {
//         //expires: 1, // 1 day expiry
//         // path: "/",
//         path: "/",
//                 secure: true,
//                 sameSite: "Strict",
//                 domain: "localhost",
//       });
//   toast.success(loginResponse?.message, { position: "top-right", autoClose: 3000 });


//     navigate("/home");

// }
     
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Login failed!", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   return (
//     <div className="flex h-screen relative">
//       <div className="absolute top-4 right-6 text-xl font-bold text-black-600">FlowTask</div>

    

//       <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6">
//         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
//           <form onSubmit={handleSubmit} noValidate className="space-y-4">
//             <input
//               type="email"
//               name="emailId"
//               placeholder="Email ID"
//               value={formData.emailId}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
//             />
//             {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}

//             <div className="relative w-full">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//             {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

//             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
//               Login
//             </button>
//           </form>

//           <p className="text-center text-gray-600 mt-4">
//             Not signed up?
//             <Link to="/signup" className="text-blue-600 hover:underline ml-1">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { validateLoginForm } from "../validation/LoginValidation";
import { accountLogin } from "../Redux/AuthReducer/AuthSlice";

const Login = () => {
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const loginResponse = await dispatch(accountLogin(formData)).unwrap();
      const accessToken = loginResponse?.accessToken;

      if (loginResponse?.success) {
        setProfile(loginResponse.user.firstname);
        Cookies.set("access", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
          domain: "localhost",
        });

        toast.success(loginResponse?.message, { position: "top-right", autoClose: 1500 ,onClose: () => navigate("/home"),});
        
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed!", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <input
            type="email"
            name="emailId"
            placeholder="Email ID"
            value={formData.emailId}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Not signed up? 
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">Sign Up</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
