import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { login } from "../api/userService";
import { Eye, EyeOff } from "lucide-react";

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  padding-right: ${(props) =>
    props.type === "password" ? "2.5rem" : "0.5rem"};
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051cc;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RememberMeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const { email, password, rememberMe } = data;
    setLoginError("");
    try {
      const response = await login({ email, password });
      if (response) {
        console.log(response.data);
        if (rememberMe) {
          // Implement remember me functionality here
          localStorage.setItem("rememberMe", email);
        } else {
          localStorage.removeItem("rememberMe");
        }
        navigate("/"); // 홈 화면으로 이동
      }
    } catch (error) {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
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
          handleSubmit(onSubmit)();
        }
      }
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <InputWrapper>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 주소를 입력해주세요",
                },
              })}
              onKeyDown={(e) => handleKeyDown(e, "email")}
            />
          </InputWrapper>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <InputWrapper>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 8,
                  message: "비밀번호는 최소 8자 이상이어야 합니다",
                },
              })}
              onKeyDown={(e) => handleKeyDown(e, "password")}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputWrapper>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </InputGroup>
        <RememberMeLabel>
          <input type="checkbox" {...register("rememberMe")} />
          로그인 상태 유지
        </RememberMeLabel>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </Form>
      <SignUpLink>
        계정이 없으신가요? <a href="/user/terms">회원가입</a>
      </SignUpLink>
    </LoginContainer>
  );
};

export default Login;
