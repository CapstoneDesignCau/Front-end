import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Edit } from 'lucide-react';
import { getUserInfo } from '../api/userService'; // Make sure this path is correct
import { setRccToken } from '../api/axios'; // Make sure this path is correct
import useUserStore from '../store/userStorage'; // Make sure this path is correct

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  align-items: flex-start;
`;

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
  width: 250px;
  height: 250px;
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: url('${props => props.src || '/placeholder-avatar.jpg'}');
  background-size: cover;
  background-position: center;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px #4a5568;
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #4a5568;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatsContainer = styled.div`
  flex-grow: 1;
  margin-left: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
`;

const CardContent = styled.div``;

const ChartContainer = styled.div`
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ChartBar = styled.div`
  width: 30px;
  background-color: #8884d8;
  transition: height 0.3s ease;
`;

const ChartLabel = styled.div`
  text-align: center;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const UserInfoCard = styled(Card)`
  width: 100%;
  margin-top: 2rem;
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #4a5568;
  text-align: center;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: #e53e3e;
  text-align: center;
  margin-top: 2rem;
`;

export default function UserProfile() {
  const navigate = useNavigate();
  const { accessToken } = useUserStore();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleEditProfile = () => {
    navigate('/user/profile/edit');
  };

  if (loading) {
    return <LoadingMessage>Loading user profile...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!userInfo) {
    return null;
  }


  return (
    <ProfileContainer>
      <TopSection>
        <AvatarContainer onClick={handleEditProfile}>
          <Avatar src={userInfo.profileImageUrl} />
          <EditIcon>
            <Edit size={20} color="white" />
          </EditIcon>
        </AvatarContainer>
        <StatsContainer>
          <Card>
            <CardHeader>
              <CardTitle>Daily Photo Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer>
                {/* {photoScores.map((item, index) => (
                  <div key={index}>
                    <ChartBar style={{ height: `${(item.score / maxScore) * 100}%` }} />
                    <ChartLabel>{item.date}</ChartLabel>
                  </div>
                ))} */}
              </ChartContainer>
            </CardContent>
          </Card>
        </StatsContainer>
      </TopSection>
      <UserInfoCard>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Nickname:</strong> {userInfo.nickname}</p>
          <p><strong>Birthday:</strong> {userInfo.birthday}</p>
          <p><strong>Gender:</strong> {userInfo.gender}</p>
        </CardContent>
      </UserInfoCard>
    </ProfileContainer>
  );
}