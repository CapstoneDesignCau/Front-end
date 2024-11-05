import { API, FORMAPI } from "./axios";

// 회원가입 API
export const signUp = (userSignUpRequestDto) =>
  API.post("/api/user/signUp", userSignUpRequestDto);

// 로그인 API
export const login = (loginRequestDto) =>
  API.post("/api/user/login", loginRequestDto);

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = (nickname) =>
  API.get("/api/user/check-duplicate/nickname", {
    params: { nickname },
  });

// 이메일 중복 확인 API
export const checkEmailDuplicate = (email) =>
  API.get("/api/user/check-duplicate/email", {
    params: { email },
  });

// 유저 역할 조회 API
export const getUserRole = () => API.get("/api/user/role");

// 닉네임 업데이트 API
export const updateNickname = (nicknameUpdateRequestDto) =>
  API.put("/api/user/nickname", nicknameUpdateRequestDto);

// 프로필 업데이트 API
export const updateProfile = (profileImage) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);
  return FORMAPI.put("/api/user/profile", formData);
};

// 기본 프로필 이미지로 설정 API
export const setDefaultProfileImage = () =>
  API.put("/api/user/profile/default");

// 비밀번호 업데이트 API
export const updatePassword = (passwordUpdateRequestDto) =>
  API.put("/api/user/password", passwordUpdateRequestDto);

// 유저 정보 조회 API
export const getUserInfo = () => API.get("/api/user/info");

// 프로필 이미지 URL 조회 API
export const getProfileImageUrl = () => API.get("/api/user/profile/image");
