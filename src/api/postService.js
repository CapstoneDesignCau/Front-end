import { API, FORMAPI } from './axios';

// 게시물 생성 API
export const createPost = (postCreateRequestDto, files) => {
  const formData = new FormData();
  formData.append('post', new Blob([JSON.stringify(postCreateRequestDto)], { type: 'application/json' }));
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      formData.append('files', file);
    });
  }
  return FORMAPI.post('/api/post', formData);
};


// 특정 게시물 조회 API
export const getPost = (id) => API.get(`/api/post/${id}`);

// 특정 기간동안 가장 좋아요 수가 많은 게시물 조회 API
export const getTopPosts = () => API.get('/api/post/top');

// 게시물 목록 조회 API
export const getPosts = (pageable) => API.get('/api/post/list', { params: pageable });

// 제목으로 게시물 검색 API
export const searchPostsByTitle = (title, pageable) => API.get('/api/post/search', {
  params: { title, ...pageable },
});

// 게시물 삭제 API
export const deletePost = (id) => API.delete(`/api/post/${id}`);