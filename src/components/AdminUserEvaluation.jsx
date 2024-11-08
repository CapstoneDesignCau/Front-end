import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Upload, Save, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AdminContainer = styled.div`
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

  useEffect(() => {
    // 여기서 실제로는 API를 통해 사진 데이터를 가져와야 합니다.
    const dummyPhotos = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      url: `/placeholder.svg?height=200&width=200&text=Photo+${i + 1}`,
    }));
    setPhotos(dummyPhotos);
  }, []);

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

  const handleSave = () => {
    // 여기서 실제로는 API를 통해 변경된 사진 데이터를 서버에 저장해야 합니다.
    console.log('Saving photos:', photos);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    alert('Changes saved successfully!');
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