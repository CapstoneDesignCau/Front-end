import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Trash2, RefreshCw, X, Upload, Save } from 'lucide-react';
import useUserStore from '../store/userStorage';
import { setRccToken } from '../api/axios';
import {
  getAllLearningMaterials,
  createLearningMaterial,
  deleteLearningMaterial,
  restoreLearningMaterial
} from '../api/learningMaterialService';

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

const MaterialTitle = styled(Link)`
  font-size: 1.2rem;
  color: #333;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    referenceInfo: '',
    tips: '',
    prettyManner: '',
    keyword: '',
    photos: [],
  });

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
    fetchMaterials();
  }, [accessToken, role, navigate]);

  const fetchMaterials = async () => {
    try {
      const response = await getAllLearningMaterials();
      if (response.data.isSuccess) {
        setMaterials(response.data.result);
      } else {
        throw new Error(response.data.message || "Failed to fetch learning materials");
      }
    } catch (error) {
      console.error("Error fetching learning materials:", error);
      alert("학습 자료를 불러오는데 실패했습니다.");
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const response = await deleteLearningMaterial(id);
      if (response.data.isSuccess) {
        fetchMaterials();
      } else {
        throw new Error(response.data.message || "Failed to delete learning material");
      }
    } catch (error) {
      console.error("Error deleting learning material:", error);
      alert("학습 자료 삭제에 실패했습니다.");
    }
  };

  const handleRestoreMaterial = async (id) => {
    try {
      const response = await restoreLearningMaterial(id);
      if (response.data.isSuccess) {
        fetchMaterials();
      } else {
        throw new Error(response.data.message || "Failed to restore learning material");
      }
    } catch (error) {
      console.error("Error restoring learning material:", error);
      alert("학습 자료 복구에 실패했습니다.");
    }
  };

  const handleAddMaterial = () => {
    setIsAddingMaterial(true);
    setNewMaterial({
      title: '',
      referenceInfo: '',
      tips: '',
      prettyManner: '',
      keyword: '',
      photos: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      setNewMaterial(prev => ({
        ...prev,
        photos: [
          ...prev.photos,
          {
            id: Date.now(),
            url: URL.createObjectURL(file),
            file: file,
          },
        ],
      }));
    });
  };

  const handleRemovePhoto = (photoId) => {
    setNewMaterial(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId),
    }));
  };

  const handleSaveNewMaterial = async () => {
    if (!newMaterial.title || !newMaterial.referenceInfo || !newMaterial.tips || !newMaterial.prettyManner || !newMaterial.keyword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const requestDto = {
        title: newMaterial.title,
        referenceInfo: newMaterial.referenceInfo,
        tips: newMaterial.tips,
        prettyManner: newMaterial.prettyManner,
        keyword: newMaterial.keyword,
      };

      const imageFiles = newMaterial.photos.map(photo => photo.file);
      console.log(imageFiles);

      const response = await createLearningMaterial(requestDto, imageFiles);
      
      if (response.data.isSuccess) {
        setIsAddingMaterial(false);
        fetchMaterials();
        alert("학습 자료가 성공적으로 생성되었습니다.");
      } else {
        throw new Error(response.data.message || "Failed to create learning material");
      }
    } catch (error) {
      console.error("Error creating learning material:", error);
      alert("학습 자료 생성에 실패했습니다.");
    }
  };

  return (
    <AdminContainer>
      <Title>관리자 페이지: 학습 자료</Title>
      
      <MaterialList>
        {materials.map((material) => (
          <MaterialItem key={material.id}>
            <MaterialTitle to={`/learning/admin/${material.id}`}>
              {material.title} (ID: {material.id})
            </MaterialTitle>
            <ButtonGroup>
              {material.isDeleted ? (
                <RestoreButton onClick={() => handleRestoreMaterial(material.id)}>
                  <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                  Restore
                </RestoreButton>
              ) : (
                <DeleteButton onClick={() => handleDeleteMaterial(material.id)}>
                  <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                  Delete
                </DeleteButton>
              )}
            </ButtonGroup>
          </MaterialItem>
        ))}
      </MaterialList>

      <AddMaterialButton onClick={handleAddMaterial}>
        <Plus size={16} style={{ marginRight: '0.5rem' }} />
        Add New Material
      </AddMaterialButton>
      {isAddingMaterial && (
        <EditMaterialBox>
          <MaterialTitleInput
            name="title"
            value={newMaterial.title}
            onChange={handleInputChange}
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
              <HiddenInput type="file" accept="image/*" onChange={handleAddPhoto} multiple />
            </AddPhotoButton>
          </PhotoGrid>
          <ContentSection>
            <ContentTitle>이럴 때 참고하세요!</ContentTitle>
            <TextArea
              name="referenceInfo"
              value={newMaterial.referenceInfo}
              onChange={handleInputChange}
              placeholder="이럴 때 참고하세요..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>핵심 키워드!</ContentTitle>
            <TextArea
              name="keyword"
              value={newMaterial.keyword}
              onChange={handleInputChange}
              placeholder="핵심 키워드..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>사진 예쁘게 찍는 법</ContentTitle>
            <TextArea
              name="prettyManner"
              value={newMaterial.prettyManner}
              onChange={handleInputChange}
              placeholder="사진 예쁘게 찍는 법..."
            />
          </ContentSection>
          <ContentSection>
            <ContentTitle>추가 꿀팁!</ContentTitle>
            <TextArea
              name="tips"
              value={newMaterial.tips}
              onChange={handleInputChange}
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