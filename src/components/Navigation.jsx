import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Menu, X } from "lucide-react";

const MobileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen"
})`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 250px;
  background-color: #282c34;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #282c34;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #61dafb;
  }

  &.active {
    color: #61dafb;
  }
`;

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // 현재 위치 정보 가져오기

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavItems = () => (
    <>
      <StyledLink to="/weekly-photo" className={location.pathname === "/weekly-photo" ? "active" : ""}>이주의 사진</StyledLink>
      <StyledLink to="/photo/feedback" className={location.pathname === "/photo/feedback" ? "active" : ""}>사진 피드백</StyledLink>
      <StyledLink to="/photo/upload" className={location.pathname === "/photo/upload" ? "active" : ""}>사진 업로드</StyledLink>
      <StyledLink to="/learning" className={location.pathname === "/learning" ? "active" : ""}>학습자료</StyledLink>
      <StyledLink to="/community" className={location.pathname === "/community" ? "active" : ""}>커뮤니티</StyledLink>
    </>
  );

  return (
    <NavBar>
      <Logo>
        <StyledLink to="/" className={location.pathname === "/" ? "active" : ""}>Char 칵</StyledLink>
      </Logo>
      <NavLinks>
        <NavItems />
        <StyledLink to="/user/profile" className={location.pathname === "/user/profile" ? "active" : ""}>
          <ProfileImage src="/default_1.jpg" alt="User Profile" />
        </StyledLink>
        <StyledLink to="/login" className={location.pathname === "/login" ? "active" : ""}>로그아웃</StyledLink>
      </NavLinks>
      <MobileMenuButton onClick={toggleMobileMenu} aria-label="모바일 메뉴 열기">
        <Menu />
      </MobileMenuButton>
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="모바일 메뉴 닫기">
          <X />
        </MobileMenuButton>
        <MobileNavLinks>
          <NavItems />
          <StyledLink to="/user/profile" className={location.pathname === "/user/profile" ? "active" : ""}>
            <ProfileImage src="/default_1.jpg" alt="User Profile" />
            프로필
          </StyledLink>
          <StyledLink to="/login" className={location.pathname === "/login" ? "active" : ""}>로그인/로그아웃</StyledLink>
        </MobileNavLinks>
      </MobileMenu>
    </NavBar>
  );
}

export default Navigation;
