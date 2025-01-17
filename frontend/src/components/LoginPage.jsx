import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { gapi } from "gapi-script";
import { GoogleLogin } from "@react-oauth/google";
import { googleLoginTo } from '../Services/userService';

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState({message:"", severity:""});
  const navigate = useNavigate();
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
 //console.log("GOOGLE_CLIENT_ID :", CLIENT_ID);
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID, // Replace with your Google Client ID
        scope: "email profile",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const handleSuccess = async(response) => {
    //console.log("Google Login Success:", response);
    if (!response?.credential) {
      console.error("Google login failed: No credential received.");
      setSnackMessage({ message: "Google login failed.", severity: "error" });
      return;
    };

    const googleToken = response.credential;
    // console.log("Sending data in useAuth :", data);
    await googleLogin(googleToken)
    .then((response) => {
      
      setSnackMessage({ message: "Login Successful!", severity: "success" });
      setTimeout(() => navigate("/home"), 2000);
    })
    .catch((error) => {
      console.error("Google login error:", error);
      setSnackMessage({ message: "Google login failed.", severity: "error" });
    });
    
  };

  const handleFailure = (error) => {
    //console.error("Google Login Failed:", error);
    alert("Google login failed. Please try again.");
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
    setFormData({
      ...formData,
      [name]: value
    });

    const fieldError = validateForm(name, value);

    setErrors(prev => {
      // If no error for this field, remove it from the errors object
      if (!fieldError[name]) {
        const { [name]: _, ...rest } = prev; // Exclude the current field's error
        return rest;
      }
      // Otherwise, update the error for this field
      return { ...prev, ...fieldError };
    });
  };


  const validateForm = (name, value) => {
    const errors = {};
    switch(name){
      case "email":  
        if (!value) {
          errors.email = "Email is required";
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // General email syntax
          const specificDomainRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/; // Specific domains
          if (!emailRegex.test(value)) {
            errors.email = "Email is invalid";
          } else if (!specificDomainRegex.test(value)) {
            errors.email = "Only emails from gmail.com, yahoo.com, or outlook.com are allowed.";
          }
        };
        break;
      case "password":  
        if (!value) {
          errors.password = "Password is required";
        } else if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(value)) {
          errors.password = "Password must be at least 6 characters long and include a special character";
        };
        break;
      default:
        break;  
    };
    return errors;
  };

  const validateFormData = formData => {
    const errors = {};

    // Validate top-level fields
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateForm(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      let message = {message:"Please correct the highlighted errors.", severity:"error"};
      setSnackMessage(message);
      //console.log("Validation Errors:", errors);
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData);
      setSnackMessage({ message: "Login Successful!", severity: "success" });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || // API-provided error message
        "Login failed! Please check your credentials."; // Default fallback message

      setSnackMessage({ message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(snackMessage.message !== ""){
      setOpen(true);
    }
  },[snackMessage]);

  return (
    <div className="flex h-screen">
       {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-[#4B71F0] h-16 w-16"></div>
        </div>
      )}
      {/* Left Side: Image */}
      <div className="hidden md:flex justify-center items-center w-1/2 bg-cover bg-center">
        {/* Optionally, you can add text or overlay styles here */}
        <div className=" w-full h-3/4 bg-cover bg-center" style={{ backgroundImage: "url('/loginnew1.JPG')" }}></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-white md:px-10 py-10 ">
        <div className="text-center flex mb-8">
          <h1 className="font-bold text-4xl text-[#14bbb0]">Login</h1>
        </div>
        <form className=" w-2/3">
          <div className="relative my-5">
            <input
              type="email"
              value={formData.email}
              className={`peer m-0 block h-[58px] border-[1px] focus:shadow border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[1px] focus:pt-[1px] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
               ${errors.email? "border-error": ""} `}
              id="floatingEmail"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label
              htmlFor="floatingEmail"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Email address
            </label>
            {errors.email && (
              <div className="text-error text-sm">{errors.email}</div>
            )}
          </div>

          <div className="relative mt-5 mb-4 sm:mb-8">
            <input
              type={passwordVisible? "text": "password"}
              value={formData.password}
              className={`peer m-0 block h-[58px] border-[1px] focus:shadow border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.password? "border-error": ""}`}
              id="floatingPassword"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Password
            </label>
            <button
              type="button"
              onClick={()=>setPasswordVisible(!passwordVisible)}
              className="absolute top-7 right-3 text-gray-600"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <div className="text-error text-sm">{errors.password}</div>
            )}
            <p className="text-xs cursor-pointer hover:underline mt-2">
              <Link to="/forgot-password" className="text-[#14bbb0] hover:underline hover:font-semibold">
                Forgot Password?
              </Link>
            </p>
          </div>

          <button
            onClick={handleLogin}
            type="button"
            className="my-2 block w-full rounded bg-[#4B71F0] hover:bg-[#3e67f0] sm:px-6 px-3 pb-2 pt-2.5 text-lg font-medium  leading-normal text-white hover:shadow focus:shadow focus:outline-none focus:ring-0 active:bg-[gray] active:shadow transition duration-150 ease-in-out "
          >
            Sign In
          </button>
          
          <h4 className="text-center my-4 font-semibold">Or</h4>

          <GoogleLogin
            className="lg:px-4 px-2 py-2 my-2  md:my-5 border flex items-center justify-center gap-2  w-full rounded-md text-slate-700  hover:border-[#14bbb0] border-goldenHover hover:text-slate-900  hover:shadow"
            clientId="396443551248-3os8ou634p30ft44cbq9mclbiv0l0i4t.apps.googleusercontent.com" // Replace with your Client ID
            buttonText="Sign in with Google"
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
          />
          <div className="flex md:gap-3 gap-1 ">
            <p className="justify-start text-sm">Still not registered? </p>
            <p className="items-end text-md hover:underline text-[#14bbb0] font-semibold hover:shadow">
              <Link to="/register">Register</Link>
            </p> 
          </div>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          onClose={handleClose}
          autoHideDuration={1800}
        >
          <Alert
            onClose={handleClose}
            severity={snackMessage.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >{snackMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default LoginPage;
