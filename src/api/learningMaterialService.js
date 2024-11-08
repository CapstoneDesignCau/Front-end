import { API, FORMAPI } from './axios';

// 학습 자료 생성 API (ADMIN 용)
export const createLearningMaterial = (requestDto, imageFiles) => {
  const formData = new FormData();
  formData.append('learningMaterial', new Blob([JSON.stringify(requestDto)], { type: 'application/json' }));
  if (imageFiles) {
    imageFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }
  return FORMAPI.post('/api/learning-material', formData);
};

// 학습 자료 삭제 API (ADMIN 용)
export const deleteLearningMaterial = (id) => API.delete(`/api/learning-material/${id}`);

// 학습 자료 복구 API (ADMIN 용)
export const restoreLearningMaterial = (id) => API.put(`/api/learning-material/restore/${id}`);

// 학습 자료 세부 정보 조회 API
export const getLearningMaterial = (id) => API.get(`/api/learning-material/${id}`);

// 삭제되지 않은 학습 자료 목록 조회 API
export const getLearningMaterials = () => API.get('/api/learning-material/list');