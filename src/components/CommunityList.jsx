import React, { useState } from "react";
import styled from "styled-components";
import { Search, Paperclip } from "lucide-react";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f7fafc;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.75rem 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f7fafc;
  }
`;

const RecommendedTr = styled(Tr)`
  background-color: #ebf8ff;
  &:hover {
    background-color: #e6fffa;
  }
`;

const RecommendedBadge = styled.span`
  background-color: #3182ce;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const TitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;

  &:hover {
    background-color: #f7fafc;
  }

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  &:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  &.active {
    background-color: #ebf8ff;
    color: #3182ce;
  }
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
`;

const SearchLabel = styled.div`
  padding: 0.5rem 1rem;
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 500;
  border-right: 1px solid #e2e8f0;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2c5282;
  }
`;

const initialPosts = [
  {
    id: 1,
    title: "게시글 1 - 인기글 테스트 중입니다. 긴 제목의 게시글입니다.",
    author: "작성자1",
    date: "2024.10.01",
    comments: 21,
    likes: 123,
    hasFile: true,
  },
  {
    id: 2,
    title: "게시글 2",
    author: "작성자2",
    date: "2024.10.02",
    comments: 23,
    likes: 111,
    hasFile: false,
  },
  {
    id: 3,
    title: "게시글 3 - 긴 게시글의 제목 Test .",
    author: "작성자3",
    date: "2024.10.03",
    comments: 18,
    likes: 100,
    hasFile: true,
  },
  {
    id: 20,
    title: "게시글 20",
    author: "작성자20",
    date: "2024.10.20",
    comments: 0,
    likes: 8,
    hasFile: false,
  },
  {
    id: 19,
    title: "게시글 19 - 푸앙푸앙",
    author: "작성자19",
    date: "2024.10.19",
    comments: 6,
    likes: 4,
    hasFile: true,
  },
  {
    id: 18,
    title: "게시글 18",
    author: "작성자18",
    date: "2024.10.18",
    comments: 2,
    likes: 7,
    hasFile: false,
  },
  {
    id: 17,
    title: "게시글 17",
    author: "작성자17",
    date: "2024.10.17",
    comments: 1,
    likes: 9,
    hasFile: true,
  },
];

export default function CommunityList() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
  const recommendedPosts = sortedPosts.slice(0, 3);
  const regularPosts = sortedPosts.slice(3);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredPosts = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  return (
    <Container>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: "5%" }}>글 번호</Th>
              <Th style={{ width: "55%" }}>제목</Th>
              <Th style={{ width: "10%" }}>작성자</Th>
              <Th style={{ width: "10%" }}>작성일</Th>
              <Th style={{ width: "10%", textAlign: "center" }}>댓글</Th>
              <Th style={{ width: "10%", textAlign: "center" }}>좋아요</Th>
            </tr>
          </thead>
          <tbody>
            {recommendedPosts.map((post) => (
              <RecommendedTr key={post.id}>
                <Td>
                  <RecommendedBadge>⭐️ 추천 ⭐️</RecommendedBadge>
                </Td>
                <Td>
                  <TitleCell>
                    <TitleText>{post.title}</TitleText>
                    {post.hasFile && (
                      <Paperclip
                        size={16}
                        style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                        aria-label="파일 첨부됨"
                      />
                    )}
                  </TitleCell>
                </Td>
                <Td>{post.author}</Td>
                <Td>{post.date}</Td>
                <Td style={{ textAlign: "center" }}>{post.comments}</Td>
                <Td style={{ textAlign: "center" }}>{post.likes}</Td>
              </RecommendedTr>
            ))}
            {regularPosts.map((post) => (
              <Tr key={post.id}>
                <Td>{post.id}</Td>
                <Td>
                  <TitleCell>
                    <TitleText>{post.title}</TitleText>
                    {post.hasFile && (
                      <Paperclip
                        size={16}
                        style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                        aria-label="파일 첨부됨"
                      />
                    )}
                  </TitleCell>
                </Td>
                <Td>{post.author}</Td>
                <Td>{post.date}</Td>
                <Td style={{ textAlign: "center" }}>{post.comments}</Td>
                <Td style={{ textAlign: "center" }}>{post.likes}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Pagination>
        <PaginationButton>&laquo;</PaginationButton>
        {[1, 2, 3, 4, 5].map((page) => (
          <PaginationButton key={page} className={page === 1 ? "active" : ""}>
            {page}
          </PaginationButton>
        ))}
        <PaginationButton>&raquo;</PaginationButton>
      </Pagination>

      <SearchForm onSubmit={handleSearch}>
        <SearchContainer>
          <SearchLabel>제목</SearchLabel>
          <SearchInput
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit">
            <Search size={20} />
          </SearchButton>
        </SearchContainer>
      </SearchForm>
    </Container>
  );
}
