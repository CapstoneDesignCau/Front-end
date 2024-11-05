import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../api/userService";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setFocus, trigger } = useForm();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const response = await login({ email, password });
      if (response) {
        console.log(response.data)
        navigate("/"); // 홈 화면으로 이동
      }
    } catch (error) {
      setLoginError("비밀번호가 일치하지 않습니다");
    }
  };

  const handleKeyDown = async (e, inputType) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const email = watch("email");
      const password = watch("password");

      if (inputType === "email") {
        const isEmailValid = await trigger("email");
        if (isEmailValid) {
          setFocus("password");
        }
      } else if (inputType === "password") {
        if (!email) {
          setLoginError("이메일을 입력해주세요");
          setFocus("email");
        } else if (!password) {
          setLoginError("비밀번호를 입력해주세요");
        } else {
          onSubmit({ email, password });
        }
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            onKeyDown={(e) => handleKeyDown(e, "email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true })}
            onKeyDown={(e) => handleKeyDown(e, "password")}
          />
        </div>
        {loginError && <p>{loginError}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
