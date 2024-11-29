import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Upload, X, Send } from 'lucide-react';
import useUserStore from '../store/userStorage';
import { setRccToken } from '../api/axios';
import { createPost } from '../api/postService';


const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PostTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #cbd5e0;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #c53030;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CommunityPostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { accessToken } = useUserStore();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('게시글 제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('게시글 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setRccToken(accessToken);
      
      const postCreateRequestDto = {
        title: title.trim(),
        content: content.trim()
      };

      const response = await createPost(postCreateRequestDto, files);
      
      if (response.data.isSuccess) {
        navigate(`/community/${response.data.result}`);
      } else {
        throw new Error(response.data.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('게시글 작성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostContainer>
      <PostHeader>
        <PostTitle>새 게시글 작성</PostTitle>
      </PostHeader>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <FileInputLabel>
          <Upload size={18} />
          사진 첨부
          <FileInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </FileInputLabel>
        <ImagePreviewContainer>
          {files.map((file, index) => (
            <ImagePreview key={index}>
              <PreviewImage src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
              <RemoveButton onClick={() => handleRemoveFile(index)}>
                <X size={12} />
              </RemoveButton>
            </ImagePreview>
          ))}
        </ImagePreviewContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isLoading}>
          <Send size={18} />
          {isLoading ? '게시 중...' : '게시하기'}
        </Button>
      </Form>
    </PostContainer>
  );
};

export default CommunityPostCreate;