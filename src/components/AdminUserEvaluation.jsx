import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { X, Upload, Save} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import useUserStore from '../store/userStorage';
import { setRccToken } from '../api/axios';
import { createPhotoRank } from '../api/photoRankService';


const AdminContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PhotoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const AddPhotoButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const DatePickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DatePickerLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export default function AdminWeeklyPhotos() {
  const [photos, setPhotos] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const { accessToken, role } = useUserStore();

  useEffect(() => {
    if (accessToken === null) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (role !== 'ADMIN') {
      alert("접근 권한이 없습니다.");
      navigate("/");
      return;
    }

    setRccToken(accessToken);

  }, [accessToken, role, navigate]);

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 16 - photos.length;
    const newPhotos = files.slice(0, remainingSlots).map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const handleSave = async () => {
    try {
      const photoRankCreateRequestDto = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      const files = photos.map(photo => photo.file).filter(Boolean);

      const response = await createPhotoRank(photoRankCreateRequestDto, files);

      if (response.data.isSuccess) {
        alert('Changes saved successfully!');
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  return (
    <AdminContainer>
      <Title>관리자 페이지: 이주의 사진</Title>
      <PhotoGrid>
        {photos.map((photo) => (
          <PhotoItem key={photo.id}>
            <Photo src={photo.url} alt={`Photo ${photo.id}`} />
            <RemoveButton onClick={() => handleRemovePhoto(photo.id)}>
              <X size={16} />
            </RemoveButton>
          </PhotoItem>
        ))}
        {photos.length < 16 && (
          <AddPhotoButton>
            <Upload size={24} />
            <span>Add Photos</span>
            <HiddenInput 
              type="file" 
              accept="image/*" 
              onChange={handleAddPhotos} 
              multiple 
            />
          </AddPhotoButton>
        )}
      </PhotoGrid>
      <DatePickerContainer>
        <DatePickerWrapper>
          <DatePickerLabel>시작 날짜</DatePickerLabel>
          <StyledDatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </DatePickerWrapper>
        <DatePickerWrapper>
          <DatePickerLabel>종료 날짜</DatePickerLabel>
          <StyledDatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </DatePickerWrapper>
      </DatePickerContainer>
      <SaveButton onClick={handleSave}>
        <Save size={16} style={{ marginRight: '0.5rem' }} />
        Save Changes
      </SaveButton>
    </AdminContainer>
  );
}