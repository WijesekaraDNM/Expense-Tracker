import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message,Select } from "antd";
import { registration } from "../Services/userService";

const Registration = () => {
  // const { Option } = Select;
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [prefferedSequence, setPrefferedSequence] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};

    if (!userName) {
      errors.userName = "User Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // if (!prefferedSequence) {
    //   errors.prefferedSequence = "Preffered Sequence is required";
    // }

    return errors;
  };

  const handleRegister = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await registration({
          userName: userName,
          email: email,
          password: password
        });

        localStorage.setItem("user", JSON.stringify(response));
        message.success("User successfully registered");

        setName("");
        setEmail("");
        setPassword("");
        // setPrefferedSequence("");
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/";
          //navigate("/login");
        }, 2000);
      } catch (error) {
        message.error("System Error");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="container mx-auto p-5 pt-20 mt-20 md:p-0">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-incomeBC h-16 w-16"></div>
        </div>
      )}
      <div className="max-w-sm mx-auto bg-white px-10 py-10 rounded-2xl shadow-[0_8px_2px_-4px_#00DDA2,0_10px_20px_0_#334050]">
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-expenseBC">Registration</h1>
        </div>
        <form>
          <div className="relative my-5">
            <input
              type="text"
              value={userName}
              className={`peer m-0 block h-[58px] w-full rounded border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden focus:border-expenseBC bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.userName ? "border-error" : ""}
              `}
              id="exampleFormControlInputText"
              placeholder="Example label"
              onChange={e => setName(e.target.value)}
              required
            />
            <label
              htmlFor="exampleFormControlInputText"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              User Name
            </label>
            {errors.userName &&
              <div className="text-error text-sm">
                {errors.userName}
              </div>}
          </div>
          <div className="relative my-5">
            <input
              type="email"
              value={email}
              className={`peer m-0 border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden block h-[58px] w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
               ${errors.email ? "border-error" : ""} `}
              id="floatingInput"
              placeholder="name@example.com"
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="floatingInput"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Email address
            </label>
            {errors.email &&
              <div className="text-error text-sm">
                {errors.email}
              </div>}
          </div>

          <div className="relative mt-5">
            <input
              type="password"
              value={password}
              className={`peer m-0 block h-[58px] w-full border-[1px] focus:shadow-md border-golden rounded border-solid bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC  focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-incomeBC focus:outline-none peer-focus:text-expenseBC [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.password ? "border-error" : ""}`}
              id="floatingPassword"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear  peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Password
            </label>
            {errors.password &&
              <div className="text-error text-sm">
                {errors.password}
              </div>}
          </div>

          {/* <div className="relative mt-5">
            <input
              type="text"
              value={prefferedSequence}
              className={`peer m-0 block h-[58px] w-full border-[1px] focus:shadow-md border-golden rounded border-solid bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC  focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-incomeBC focus:outline-none peer-focus:text-expenseBC [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.prefferedSequence ? "border-error" : ""}`}
              id="prefferedSequenceInput"
              list="prefferedSequenceList"
              name="prefferedSequenceInput"
              placeholder="prefferedSequence"
              onChange={e => setPrefferedSequence(e.target.value)}
              required
            />
              <datalist id="prefferedSequenceList">
                <option value="Daily">Daily</option>  
                <option value="Monthly">Monthly</option> 
              </datalist>
            <label
              htmlFor="prefferedSequenceInput"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear  peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Preffered Sequence
            </label>
            {errors.prefferedSequence &&
              <div className="text-error text-sm">
                {errors.prefferedSequence}
              </div>}
          </div> */}

          <button
            onClick={handleRegister}
            type="button"
            className="my-4 block w-full rounded bg-incomeBC focus:bg-goldenHover px-6 pb-2 pt-2.5 text-lg font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#4D6178] 
            transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_#BDCDCC,0_4px_18px_0_#B5C6C5] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-[gray] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] "
          >
            Sign Up
          </button>

          <div className="flex gap-3 px-1">
            <p className="justify-start text-sm">Already have an account?</p>
            <p className="items-end text-md hover:underline text-incomeBC font-semibold hover:text-expenseBC">
              <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Registration;
