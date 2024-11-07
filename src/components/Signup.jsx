import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Mail, Lock, User, UserCircle, Cake, Users } from "lucide-react";
import {
  signUp,
  checkEmailDuplicate,
  checkNicknameDuplicate,
} from "../api/userService";

const SignUpContainer = styled.div`
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
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0051cc;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.875rem;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  color: #666;
`;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const navigate = useNavigate();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const nicknameInputRef = useRef(null);
  const genderSelectRef = useRef(null);
  const yearSelectRef = useRef(null);
  const monthSelectRef = useRef(null);
  const daySelectRef = useRef(null);
  const submitButtonRef = useRef(null);

  const checkDuplicate = async (type, value) => {
    try {
      if (type === "email") {
        const isValid = await trigger("email");
        if (!isValid) {
          return;
        }
      }

      let response;
      if (type === "email") {
        response = await checkEmailDuplicate(value);
      } else {
        response = await checkNicknameDuplicate(value);
      }

      if (response.data.isSuccess) {
        if (response.data.result) {
          setError(type, {
            type: "manual",
            message: `이미 사용 중인 ${
              type === "email" ? "이메일" : "닉네임"
            }입니다.`,
          });
          if (type === "email") {
            setEmailChecked(false);
            emailInputRef.current.focus();
          } else {
            setNicknameChecked(false);
            nicknameInputRef.current.focus();
          }
        } else {
          clearErrors(type);
          if (type === "email") {
            setEmailChecked(true);
            passwordInputRef.current.focus();
          } else {
            setNicknameChecked(true);
            genderSelectRef.current.focus();
          }
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setServerError(
        `${
          type === "email" ? "이메일" : "닉네임"
        } 중복 확인 중 오류가 발생했습니다: ${error.message}`
      );
      if (type === "email") {
        emailInputRef.current.focus();
      } else {
        nicknameInputRef.current.focus();
      }
    }
  };

  const onSubmit = async (data) => {
    if (!emailChecked || !nicknameChecked) {
      setServerError("이메일과 닉네임 중복 확인을 모두 완료해주세요.");
      return;
    }

    const birthday = `${data.year}-${data.month.padStart(
      2,
      "0"
    )}-${data.day.padStart(2, "0")}`;

    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        gender: data.gender,
        birthday: birthday,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setServerError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "password" || name === "passwordConfirm") {
        setPasswordMatch(
          value.password === value.passwordConfirm && value.password !== ""
        );
      }
      if (name === "email") setEmailChecked(false);
      if (name === "nickname") setNicknameChecked(false);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleKeyDown = async (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (field) {
        case "email":
          checkDuplicate("email", watch("email"));
          break;
        case "password":
          const isPasswordValid = await trigger("password");
          if (isPasswordValid) {
            passwordConfirmInputRef.current.focus();
          }
          break;
        case "passwordConfirm":
          if (passwordMatch) {
            nameInputRef.current.focus();
          } else {
            passwordInputRef.current.focus();
          }
          break;
        case "name":
          nicknameInputRef.current.focus();
          break;
        case "nickname":
          checkDuplicate("nickname", watch("nickname"));
          break;
        case "gender":
          yearSelectRef.current.focus();
          break;
        case "year":
          monthSelectRef.current.focus();
          break;
        case "month":
          daySelectRef.current.focus();
          break;
        case "day":
          const isValid = await trigger();
          if (isValid) {
            submitButtonRef.current.click();
          } else {
            // 에러가 발생한 갖을 찾아서 해당 input에 focus
            const errorFields = [
              "email",
              "password",
              "passwordConfirm",
              "name",
              "nickname",
              "gender",
              "year",
              "month",
              "day",
            ];
            for (const field of errorFields) {
              if (errors[field]) {
                document.getElementsByName(field)[0].focus();
                break;
              }
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <SignUpContainer>
      <h2>회원가입</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Icon>
            <Mail size={20} />
          </Icon>
          <Input
            type="email"
            placeholder="이메일"
            {...register("email", {
              required: "이메일은 필수 입력 항목입니다.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "유효한 이메일 주소를 입력하세요.",
              },
            })}
            onKeyDown={(e) => handleKeyDown(e, "email")}
            ref={(e) => {
              register("email").ref(e);
              emailInputRef.current = e;
            }}
          />
          <Button
            type="button"
            onClick={() => checkDuplicate("email", watch("email"))}
          >
            중복 확인
          </Button>
        </InputGroup>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        {emailChecked && (
          <SuccessMessage>사용 가능한 이메일입니다.</SuccessMessage>
        )}

        <InputGroup>
          <Icon>
            <Lock size={20} />
          </Icon>
          <Input
            type="password"
            placeholder="비밀번호"
            {...register("password", {
              required: "패스워드는 필수 입력 항목입니다.",
              minLength: {
                value: 8,
                message: "패스워드는 8자 이상 16자 이하로 입력해야 합니다.",
              },
              maxLength: {
                value: 16,
                message: "패스워드는 8자 이상 16자 이하로 입력해야 합니다.",
              },
            })}
            onKeyDown={(e) => handleKeyDown(e, "password")}
            ref={(e) => {
              register("password").ref(e);
              passwordInputRef.current = e;
            }}
          />
        </InputGroup>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}

        <InputGroup>
          <Icon>
            <Lock size={20} />
          </Icon>
          <Input
            type="password"
            placeholder="비밀번호 확인"
            {...register("passwordConfirm", {
              required: "비밀번호 확인은 필수입니다.",
              validate: (value) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
            onKeyDown={(e) => handleKeyDown(e, "passwordConfirm")}
            ref={(e) => {
              register("passwordConfirm").ref(e);
              passwordConfirmInputRef.current = e;
            }}
          />
        </InputGroup>
        {errors.passwordConfirm && (
          <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
        )}
        {!passwordMatch && watch("passwordConfirm") && (
          <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
        )}
        {passwordMatch && (
          <SuccessMessage>비밀번호가 일치합니다.</SuccessMessage>
        )}

        <InputGroup>
          <Icon>
            <User size={20} />
          </Icon>
          <Input
            type="text"
            placeholder="이름"
            {...register("name", {
              required: "이름은 필수 입력 항목입니다.",
              maxLength: {
                value: 30,
                message: "이름은 최대 30자까지 입력할 수 있습니다.",
              },
            })}
            onKeyDown={(e) => handleKeyDown(e, "name")}
            ref={(e) => {
              register("name").ref(e);
              nameInputRef.current = e;
            }}
          />
        </InputGroup>
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <InputGroup>
          <Icon>
            <UserCircle size={20} />
          </Icon>
          <Input
            type="text"
            placeholder="닉네임"
            {...register("nickname", {
              required: "닉네임은 필수 입력 항목입니다.",
              maxLength: {
                value: 15,
                message: "닉네임은 최대 15자까지 입력할 수 있습니다.",
              },
            })}
            onKeyDown={(e) => handleKeyDown(e, "nickname")}
            ref={(e) => {
              register("nickname").ref(e);
              nicknameInputRef.current = e;
            }}
          />
          <Button
            type="button"
            onClick={() => checkDuplicate("nickname", watch("nickname"))}
          >
            중복 확인
          </Button>
        </InputGroup>
        {errors.nickname && (
          <ErrorMessage>{errors.nickname.message}</ErrorMessage>
        )}
        {nicknameChecked && (
          <SuccessMessage>사용 가능한 닉네임입니다.</SuccessMessage>
        )}

        <InputGroup>
          <Icon>
            <Users size={20} />
          </Icon>
          <Select
            {...register("gender", {
              required: "성별은 필수 입력 항목입니다.",
            })}
            onKeyDown={(e) => handleKeyDown(e, "gender")}
            ref={(e) => {
              register("gender").ref(e);
              genderSelectRef.current = e;
            }}
          >
            <option value="">성별 선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </Select>
        </InputGroup>
        {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}

        <InputGroup>
          <Icon>
            <Cake size={20} />
          </Icon>
          <Select
            {...register("year", { required: "년도를 선택해주세요." })}
            onKeyDown={(e) => handleKeyDown(e, "year")}
            ref={(e) => {
              register("year").ref(e);
              yearSelectRef.current = e;
            }}
          >
            <option value="">년도</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Select
            {...register("month", { required: "월을 선택해주세요." })}
            onKeyDown={(e) => handleKeyDown(e, "month")}
            ref={(e) => {
              register("month").ref(e);
              monthSelectRef.current = e;
            }}
          >
            <option value="">월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            {...register("day", { required: "일을 선택해주세요." })}
            onKeyDown={(e) => handleKeyDown(e, "day")}
            ref={(e) => {
              register("day").ref(e);
              daySelectRef.current = e;
            }}
          >
            <option value="">일</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </InputGroup>
        {(errors.year || errors.month || errors.day) && (
          <ErrorMessage>생일을 모두 선택해주세요.</ErrorMessage>
        )}

        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

        <Button
          type="submit"
          disabled={!emailChecked || !nicknameChecked}
          ref={submitButtonRef}
        >
          회원가입
        </Button>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;
