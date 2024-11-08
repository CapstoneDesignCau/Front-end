import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Upload, X, Image as ImageIcon, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
`;

const FilmStrip = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 20px 0;
  background-color: #000;
  border-radius: 8px;
  position: relative;
  
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #333;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #888;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 15px;
    background-image: 
      linear-gradient(
        to right,
        #fff 0px,
        #fff 12px,
        transparent 12px,
        transparent 25px
      );
    background-size: 25px 100%;
    background-repeat: repeat-x;
    z-index: 1;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
`;

const PhotoFrame = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 200px;
  height: 150px;
  margin: 0 0.5rem;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
  z-index: 2;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const DateLabel = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  z-index: 2;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4a4a4a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', Courier, monospace;

  &:hover {
    background-color: #5a5a5a;
  }

  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

export default function PhotoUpload() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dummyPhotos = Array.from({ length: 20 }, (_, i) => ({
      file: new File([""], `dummy${i + 1}.jpg`, { type: "image/jpeg" }),
      uploadDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    }));
    setUploadedPhotos(dummyPhotos);
    setRecentPhotos(dummyPhotos.slice(0, 5));
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addNewPhotos(files);
    }
  };

  const addNewPhotos = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/')).map(file => ({
      file,
      uploadDate: new Date()
    }));
    setNewPhotos(prevPhotos => [...prevPhotos, ...imageFiles]);
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    setUploadedPhotos(prevPhotos => [...newPhotos, ...prevPhotos]);
    setRecentPhotos(prevPhotos => [...newPhotos, ...prevPhotos].slice(0, 5));
    setNewPhotos([]);
  };

  const handleViewAllPhotos = () => {
    navigate('/photo/my');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '.');
  };

  const renderPhoto = (photo, index, isNewUpload = false) => (
    <PhotoFrame key={index} style={index === 1 ? { margin: '0 1rem' } : {}}>
      <Photo 
        src={URL.createObjectURL(photo.file)} 
        alt={`Photo ${index}`} 
        onClick={() => setSelectedPhoto(photo)}
      />
      <DateLabel>{formatDate(photo.uploadDate)}</DateLabel>
      {isNewUpload && (
        <RemoveButton onClick={(e) => {
          e.stopPropagation();
          removeNewPhoto(index);
        }}>
          <X size={16} />
        </RemoveButton>
      )}
    </PhotoFrame>
  );

  return (
    <UploadContainer>
      <Title>PHOTO UPLOAD</Title>
      
      <Section>
        <SectionTitle>
          TODAY UPLOADS
          <Button onClick={handleViewAllPhotos}>
            <Grid size={16} />
            VIEW ALL
          </Button>
        </SectionTitle>
        <FilmStrip>
          {recentPhotos.map((photo, index) => renderPhoto(photo, index))}
        </FilmStrip>
      </Section>

      <Section>
        <SectionTitle>NEW UPLOADS</SectionTitle>
        <Button onClick={handleUploadClick} style={{ marginBottom: '1rem' }}>
          <Upload size={16} />
          SELECT PHOTOS
        </Button>
        <HiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          multiple
        />
        {newPhotos.length > 0 && (
          <FilmStrip>
            {newPhotos.map((photo, index) => renderPhoto(photo, index, true))}
          </FilmStrip>
        )}
        {newPhotos.length > 0 && (
          <Button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
            <ImageIcon size={16} />
            UPLOAD PHOTOS
          </Button>
        )}
      </Section>

      {selectedPhoto && (
        <Modal onClick={() => setSelectedPhoto(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={URL.createObjectURL(selectedPhoto.file)} alt="Enlarged photo" />
            <CloseButton onClick={() => setSelectedPhoto(null)}>
              <X size={20} />
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </UploadContainer>
  );
}