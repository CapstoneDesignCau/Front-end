import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Edit, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getUserInfo } from '../api/userService'; 
import { getUserImageEvaluationStats } from '../api/imageEvaluationService';
import { setRccToken } from '../api/axios'; 
import useUserStore from '../store/userStorage'; 

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 100%;
  background-color: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  align-items: center;
  gap: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
  width: 200px;
  height: 200px;
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

const AverageScoreCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  flex-grow: 1;
`;

const AverageScoreTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const AverageScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #4a5568;
`;

const BottomSection = styled.div`
  width: 100%;
`;

const RecentScoresCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 2rem;
`;

const RecentScoresTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #4a5568;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d3748;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const NoDataMessage = styled.div`
  font-size: 1.2rem;
  color: #4a5568;
  text-align: center;
  margin-top: 1rem;
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

const CustomBar = (props) => {
  const { x, y, width, height, score } = props;
  
  if (score === 0) {
    return null;
  }

  return (
    <rect x={x} y={y} width={width} height={height} fill="#4299e1" />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].value !== 0) {
    return (
      <div style={{ backgroundColor: 'white', padding: '5px 10px', border: '1px solid #ccc' }}>
        <p>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { accessToken } = useUserStore();
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken === null) {
      alert("유저정보를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchData = async () => {
      try {
        const [userInfoResponse, statsResponse] = await Promise.all([
          getUserInfo(),
          getUserImageEvaluationStats()
        ]);

        if (userInfoResponse.data.isSuccess) {
          setUserInfo(userInfoResponse.data.result);
        } else {
          throw new Error("Failed to fetch user info");
        }

        if (statsResponse.data.isSuccess) {
          setStats(statsResponse.data.result);
        } else {
          throw new Error("Failed to fetch image evaluation stats");
        }
      } catch (err) {
        setError("Failed to load user information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (!userInfo || !stats) {
    return null;
  }

  const chartData = stats.recentScores.map((score, index) => ({
    name: `Photo ${index + 1}`,
    score: score
  }));

  return (
    <PageContainer>
      <ProfileContainer>
        <TopSection>
          <AvatarContainer onClick={handleEditProfile}>
            <Avatar src={userInfo.profileImageUrl} />
            <EditIcon>
              <Edit size={20} color="white" />
            </EditIcon>
          </AvatarContainer>
          <AverageScoreCard>
            <AverageScoreTitle>Average Score</AverageScoreTitle>
            {stats.averageScore !== null && stats.averageScore !== undefined ? (
              <AverageScore>{stats.averageScore.toFixed(2)}</AverageScore>
            ) : (
              <NoDataMessage>Get feedback on your photos to see your average score!</NoDataMessage>
            )}
          </AverageScoreCard>
        </TopSection>
        <BottomSection>
          <RecentScoresCard>
            <RecentScoresTitle>Recent Photo Scores</RecentScoresTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" shape={<CustomBar />}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#4299e1" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </RecentScoresCard>
          <Button to="/photo/my">
            <Camera size={20} />
            View Uploaded Photos
          </Button>
        </BottomSection>
      </ProfileContainer>
    </PageContainer>
  );
}