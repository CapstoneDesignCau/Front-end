import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, RefreshCw, X, Upload, Save } from 'lucide-react';

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

const MaterialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MaterialItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
`;

const MaterialTitle = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const RestoreButton = styled(Button)`
  background-color: #2196f3;

  &:hover {
    background-color: #1e88e5;
  }
`;

const AddMaterialButton = styled(Button)`
  margin-top: 1rem;
`;

const EditMaterialBox = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
`;

const MaterialTitleInput = styled.input`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PhotoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: #e0e0e0;
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
  background-color: #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ContentSection = styled.div`
  margin-bottom: 1rem;
`;

const ContentTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

export default function AdminLearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [deletedMaterials, setDeletedMaterials] = useState([]);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    id: null,
    title: '',
    photos: [],
    content: {
      reference: '',
      keywords: '',
      tips: '',
      extraTips: '',
    },
  });

  useEffect(() => {
    // 여기서 실제로는 API를 통해 학습 자료 데이터를 가져와야 합니다.
    const dummyMaterials = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Learning Material ${i + 1}`,
    }));
    setMaterials(dummyMaterials);
  }, []);

  const handleDeleteMaterial = (id) => {
    const materialToDelete = materials.find(m => m.id === id);
    setMaterials(materials.filter(m => m.id !== id));
    setDeletedMaterials([...deletedMaterials, materialToDelete]);
  };

  const handleRestoreMaterial = (id) => {
    const materialToRestore = deletedMaterials.find(m => m.id === id);
    setDeletedMaterials(deletedMaterials.filter(m => m.id !== id));
    setMaterials([...materials, materialToRestore]);
  };

  const handleAddMaterial = () => {
    setIsAddingMaterial(true);
    setNewMaterial({
      id: Date.now(),
      title: '',
      photos: [],
      content: {
        reference: '',
        keywords: '',
        tips: '',
        extraTips: '',
      },
    });
  };

  const handleTitleChange = (e) => {
    setNewMaterial({ ...newMaterial, title: e.target.value });
  };

  const handleContentChange = (contentType, newContent) => {
    setNewMaterial({
      ...newMaterial,
      content: {
        ...newMaterial.content,
        [contentType]: newContent,
      },
    });
  };

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMaterial({
        ...newMaterial,
        photos: [
          ...newMaterial.photos,
          {
            id: Date.now(),
            url: URL.createObjectURL(file),
            file: file,
          },
        ],
      });
    }
  };

  const handleRemovePhoto = (photoId) => {
    setNewMaterial({
      ...newMaterial,
      photos: newMaterial.photos.filter(photo => photo.id !== photoId),
    });
  };

  const handleSaveNewMaterial = () => {
    setMaterials([...materials, newMaterial]);
    setIsAddingMaterial(false);
  };

  return (
    <AdminContainer>
      <Title>관리자 페이지: 학습 자료</Title>
      
      {/* 삭제 섹션 */}
      <MaterialList>
        {materials.map((material) => (
          <MaterialItem key={material.id}>
            <MaterialTitle>{material.title}</MaterialTitle>
            <ButtonGroup>
              <DeleteButton onClick={() => handleDeleteMaterial(material.id)}>
                <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                Delete
              </DeleteButton>
            </ButtonGroup>
          </MaterialItem>
        ))}
      </MaterialList>

      {/* 복구 섹션 */}
      {deletedMaterials.length > 0 && (
        <>
          <Title>삭제된 학습 자료</Title>
          <MaterialList>
            {deletedMaterials.map((material) => (
              <MaterialItem key={material.id}>
                <MaterialTitle>{material.title}</MaterialTitle>
                <ButtonGroup>
                  <RestoreButton onClick={() => handleRestoreMaterial(material.id)}>
                    <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                    Restore
                  </RestoreButton>
                </ButtonGroup>
              </MaterialItem>
            ))}
          </MaterialList>
        </>
      )}

      {/* 생성 섹션 */}
      <AddMaterialButton onClick={handleAddMaterial}>
        <Plus size={16} style={{ marginRight: '0.5rem' }} />
        Add New Material
      </AddMaterialButton>
      {isAddingMaterial && (
        <EditMaterialBox>
          <MaterialTitleInput
            value={newMaterial.title}
            onChange={handleTitleChange}
            placeholder="Enter material title"
          />
          <PhotoGrid>
            {newMaterial.photos.map((photo) => (
              <PhotoItem key={photo.id}>
                <Photo src={photo.url} alt={`Photo ${photo.id}`} />
                <RemoveButton onClick={() => handleRemovePhoto(photo.id)}>
                  <X size={16} />
                </RemoveButton>
              </PhotoItem>
            ))}
            <AddPhotoButton>
              <Upload size={24} />
              <span>Add Photo</span>
              <HiddenInput type="file" accept="image/*" onChange={handleAddPhoto} />
            </AddPhotoButton>
          </PhotoGrid>
          <ContentSection>
            <ContentTitle>이럴 때 참고하세요!</ContentTitle>
            <TextArea
              value={newMaterial.content.reference}
              onChange={(e) => handleContentChange('reference', e.target.value)}
              placeholder="이럴 때 참고하세요..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>핵심 키워드!</ContentTitle>
            <TextArea
              value={newMaterial.content.keywords}
              onChange={(e) => handleContentChange('keywords', e.target.value)}
              placeholder="핵심 키워드..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>사진 예쁘게 찍는 법</ContentTitle>
            <TextArea
              value={newMaterial.content.tips}
              onChange={(e) => handleContentChange('tips', e.target.value)}
              placeholder="사진 예쁘게 찍는 법..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>추가 꿀팁!</ContentTitle>
            <TextArea
              value={newMaterial.content.extraTips}
              onChange={(e) => handleContentChange('extraTips', e.target.value)}
              placeholder="추가 꿀팁..."
            />
          </ContentSection>
          <Button onClick={handleSaveNewMaterial}>
            <Save size={16} style={{ marginRight: '0.5rem' }} />
            Save New Material
          </Button>
        </EditMaterialBox>
      )}
    </AdminContainer>
  );
}