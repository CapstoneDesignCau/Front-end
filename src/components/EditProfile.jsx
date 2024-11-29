import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, User, Check, X, Mail, Calendar, Users } from 'lucide-react';
import useUserStore from '../store/userStorage';
import { setRccToken } from '../api/axios';
import { 
  checkNicknameDuplicate, 
  updateNickname, 
  updateProfile, 
  setDefaultProfileImage,
  getProfileImageUrl,
  getUserInfo
} from '../api/userService';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  }
`;

const Header = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: #e5e7eb;
  border-radius: 50%;
  margin-right: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #9ca3af;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d1d5db;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProfileImage}:hover & {
    opacity: 1;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-right: 0.75rem;

  &:hover {
    background-color: #e5e7eb;
    color: #1f2937;
  }

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
    color: white;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  flex-grow: 1;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
  display: block;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FeedbackMessage = styled.span`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserInfoCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 2rem;
`;

const CardHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const CardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #4b5563;
`;

const InfoValue = styled.span`
  color: #1f2937;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #4b5563;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #ef4444;
  margin-top: 2rem;
`;

const EditProfile = () => {
  const { accessToken, profileImageUrl, nickname: currentNickname, setProfileImageUrl, setNickname } = useUserStore();
  const [nickname, setNicknameState] = useState(currentNickname);
  const [profileImage, setProfileImage] = useState(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken === null) {
      alert("유저정보를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        if (response.data.isSuccess) {
          setUserInfo(response.data.result);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (err) {
        setError("Failed to load user information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [accessToken, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setIsProfileImageChanged(true);
      setIsDefaultImage(false);
    }
  };

  const checkNickname = async () => {
    if (!nickname || nickname === currentNickname) return;

    setIsCheckingNickname(true);
    try {
      const response = await checkNicknameDuplicate(nickname);
      if (response.data.isSuccess) {
        setIsNicknameChecked(true);
        setIsNicknameAvailable(!response.data.result);
      } else {
        throw new Error(response.data.message || "닉네임 중복 확인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error checking nickname:", error);
      alert("닉네임 중복 확인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNicknameState(newNickname);
    if (newNickname !== currentNickname) {
      setIsNicknameChecked(false);
    } else {
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
    }
  };

  const updateProfileImageUrl = async () => {
    try {
      const response = await getProfileImageUrl();
      if (response.data.isSuccess) {
        setProfileImageUrl(response.data.result);
      } else {
        throw new Error(response.data.message || "프로필 이미지 URL 조회에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching profile image URL:", error);
    }
  };

  const handleApply = async () => {
    setIsUpdating(true);
    try {
      if (nickname !== currentNickname && isNicknameChecked && isNicknameAvailable) {
        const response = await updateNickname({ nickname });
        if (response.data.isSuccess) {
          setNickname(nickname); // Update the global state with the new nickname
        } else {
          throw new Error(response.data.message || "닉네임 업데이트에 실패했습니다.");
        }
      }

      if (isProfileImageChanged) {
        if (isDefaultImage) {
          await setDefaultProfileImage();
        } else if (profileImage) {
          await updateProfile(profileImage);
        }
        await updateProfileImageUrl();
      }

      alert("프로필이 성공적으로 업데이트되었습니다.");
      navigate("/user/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderProfileImage = () => {
    if (isDefaultImage) {
      return <img src="/default_1.jpg" alt="Default Profile" />;
    } else if (profileImage) {
      return <img src={URL.createObjectURL(profileImage)} alt="Profile" />;
    } else if (profileImageUrl) {
      return <img src={profileImageUrl} alt="Profile" />;
    } else {
      return <User size={48} />;
    }
  };

  const isChanged = nickname !== currentNickname || isProfileImageChanged;

  if (loading) {
    return <LoadingMessage>사용자 정보를 불러오는 중...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>프로필 수정</Header>
      <Description>프로필과 별명을 수정 하실 수 있습니다.</Description>
      <ProfileSection>
        <ProfileImage>
          {renderProfileImage()}
          <ImageOverlay>
            <label htmlFor="imageUpload">
              <Camera size={24} color="white" />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </ImageOverlay>
        </ProfileImage>
        <div>
          <Button onClick={() => document.getElementById('imageUpload').click()}>
            사진변경
          </Button>
          <Button onClick={() => {
            setIsDefaultImage(true);
            setProfileImage(null);
            setIsProfileImageChanged(true);
          }}>
            기본이미지로 설정
          </Button>
        </div>
      </ProfileSection>
      <div>
        <Label htmlFor="nickname">별명</Label>
        <InputGroup>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="별명을 입력하세요"
          />
          <Button onClick={checkNickname} disabled={!nickname || isCheckingNickname || nickname === currentNickname}>
            {isCheckingNickname ? '확인 중...' : '중복확인'}
          </Button>
        </InputGroup>
        {!isNicknameChecked && nickname !== currentNickname && (
          <FeedbackMessage>
            <X size={16} color="orange" />
            <span style={{ color: 'orange' }}>중복 확인이 필요합니다.</span>
          </FeedbackMessage>
        )}
        {isNicknameChecked && nickname !== currentNickname && (
          <FeedbackMessage>
            {isNicknameAvailable ? (
              <>
                <Check size={16} color="green" />
                <span style={{ color: 'green' }}>사용 가능한 별명입니다.</span>
              </>
            ) : (
              <>
                <X size={16} color="red" />
                <span style={{ color: 'red' }}>이미 사용 중인 별명입니다.</span>
              </>
            )}
          </FeedbackMessage>
        )}
      </div>
      <ActionButtons>
        <Button onClick={() => navigate("/user/profile")}>취소</Button>
        <PrimaryButton 
          onClick={handleApply} 
          disabled={isUpdating || !isChanged || (nickname !== currentNickname && (!isNicknameChecked || !isNicknameAvailable))}
        >
          {isUpdating ? '업데이트 중...' : '적용'}
        </PrimaryButton>
      </ActionButtons>

      {userInfo && (
        <UserInfoCard>
          <CardHeader>
            <CardTitle>사용자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoItem>
              <User size={18} />
              <InfoLabel>이름:</InfoLabel>
              <InfoValue>{userInfo.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <Mail size={18} />
              <InfoLabel>이메일:</InfoLabel>
              <InfoValue>{userInfo.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <User size={18} />
              <InfoLabel>별명:</InfoLabel>
              <InfoValue>{userInfo.nickname}</InfoValue>
            </InfoItem>
            <InfoItem>
              <Calendar size={18} />
              <InfoLabel>생년월일:</InfoLabel>
              <InfoValue>{userInfo.birthday}</InfoValue>
            </InfoItem>
            <InfoItem>
              <Users size={18} />
              <InfoLabel>성별:</InfoLabel>
              <InfoValue>{userInfo.gender}</InfoValue>
            </InfoItem>
          </CardContent>
        </UserInfoCard>
      )}
    </Container>
  );
};

export default EditProfile;