import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Search, Paperclip, PlusCircle } from "lucide-react";
import useUserStore from "../store/userStorage";
import { getTopPosts, getPosts, searchPostsByTitle } from "../api/postService";
import { setRccToken } from "../api/axios";

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
    cursor: pointer;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  align-items: center;
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

const EllipsisSpan = styled.span`
  padding: 0.5rem 0.75rem;
`;

const CreatePostButton = styled.button`
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  margin-top: 1rem;
  margin-left: auto;
  &:hover {
    background-color: #2c5282;
  }
  svg {
    margin-right: 0.5rem;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export default function CommunityList() {
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useUserStore();

  useEffect(() => {
    if (accessToken === null) {
      alert("커뮤니티를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchPosts = async () => {
      try {
        const [topPostsResponse, postsResponse] = await Promise.all([
          getTopPosts(),
          getPosts({ page: currentPage, size: 10 }),
        ]);

        if (topPostsResponse.data.isSuccess && postsResponse.data.isSuccess) {
          setTopPosts(topPostsResponse.data.result);
          setPosts(postsResponse.data.result.content);
          setTotalPages(postsResponse.data.result.totalPages);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("게시물을 불러오는데 실패했습니다. 다시 시도해 주세요.");
      }
    };

    if (!isSearching) {
      fetchPosts();
    }
  }, [accessToken, navigate, currentPage, isSearching]);

  useEffect(() => {
    const searchPosts = async () => {
      if (isSearching && shouldSearch) {
        try {
          const response = await searchPostsByTitle(searchTerm, {
            page: currentPage,
            size: 10,
          });
          if (response.data.isSuccess) {
            setPosts(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
          } else {
            throw new Error("Failed to search posts");
          }
        } catch (error) {
          console.error("Error searching posts:", error);
          alert("게시물 검색에 실패했습니다. 다시 시도해 주세요.");
        }
        setShouldSearch(false);
      }
    };

    searchPosts();
  }, [isSearching, shouldSearch, searchTerm, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      setShouldSearch(true);
      setCurrentPage(0);
    } else {
      setIsSearching(false);
      setShouldSearch(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setIsSearching(false);
      setShouldSearch(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    let startPage, endPage;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage + 1 ? "active" : ""}
        >
          {i}
        </PaginationButton>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <EllipsisSpan key="start-ellipsis">...</EllipsisSpan>
      );
      pageNumbers.unshift(
        <PaginationButton key={1} onClick={() => handlePageChange(1)}>
          1
        </PaginationButton>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<EllipsisSpan key="end-ellipsis">...</EllipsisSpan>);
      pageNumbers.push(
        <PaginationButton
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    return pageNumbers;
  };

  return (
    <Container>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: "5%" }}>글 번호</Th>
              <Th style={{ width: "55%" }}>제목</Th>
              <Th style={{ width: "18%" }}>작성자</Th>
              <Th style={{ width: "10%" }}>작성일</Th>
              <Th style={{ width: "6%", textAlign: "center" }}>댓글</Th>
              <Th style={{ width: "6%", textAlign: "center" }}>좋아요</Th>
            </tr>
          </thead>
          <tbody>
            {!isSearching &&
              topPosts.map((post) => (
                <RecommendedTr
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                >
                  <Td>
                    <RecommendedBadge>⭐️ 추천 ⭐️</RecommendedBadge>
                  </Td>
                  <Td>
                    <TitleCell>
                      <TitleText>{post.title}</TitleText>
                      {post.hasFiles && (
                        <Paperclip
                          size={16}
                          style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                          aria-label="파일 첨부됨"
                        />
                      )}
                    </TitleCell>
                  </Td>
                  <Td>{post.writerNickname}</Td>
                  <Td>{formatDate(post.createdAt)}</Td>
                  <Td style={{ textAlign: "center" }}>{post.commentCount}</Td>
                  <Td style={{ textAlign: "center" }}>{post.likeCount}</Td>
                </RecommendedTr>
              ))}
            {posts.map((post) => (
              <Tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <Td>{post.id}</Td>
                <Td>
                  <TitleCell>
                    <TitleText>{post.title}</TitleText>
                    {post.hasFiles && (
                      <Paperclip
                        size={16}
                        style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                        aria-label="파일 첨부됨"
                      />
                    )}
                  </TitleCell>
                </Td>
                <Td>{post.writerNickname}</Td>
                <Td>{formatDate(post.createdAt)}</Td>
                <Td style={{ textAlign: "center" }}>{post.commentCount}</Td>
                <Td style={{ textAlign: "center" }}>{post.likeCount}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <CreatePostButton onClick={() => navigate("/community/create")}>
          <PlusCircle size={20} />
          게시글 작성
        </CreatePostButton>
      </div>

      <Pagination>
        <PaginationButton
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 0}
        >
          &laquo;
        </PaginationButton>
        {renderPaginationButtons()}
        <PaginationButton
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages - 1}
        >
          &raquo;
        </PaginationButton>
      </Pagination>

      <SearchForm onSubmit={handleSearch}>
        <SearchContainer>
          <SearchLabel>제목</SearchLabel>
          <SearchInput
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e);
              }
            }}
          />
          <SearchButton type="submit">
            <Search size={20} />
          </SearchButton>
        </SearchContainer>
      </SearchForm>
    </Container>
  );
}