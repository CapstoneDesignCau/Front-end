import { API } from './axios';

// 댓글 생성 API
export const createComment = (commentCreateRequestDto) => 
  API.post('/api/comment', commentCreateRequestDto);

// 댓글 조회 API
export const getComment = (id) => 
  API.get(`/api/comment/${id}`);

// 댓글 삭제 API
export const deleteComment = (id) => 
  API.delete(`/api/comment/${id}`);