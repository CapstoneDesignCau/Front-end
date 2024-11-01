import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Menu, X } from "lucide-react";

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

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 250px;
  background-color: #282c34;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${props => (props.active ? "#61dafb" : "white")};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
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
      <StyledLink to="/photo/feedback" active={location.pathname === "/photo/feedback" ? "true" : "false"}>사진 피드백</StyledLink>
      <StyledLink to="/photo/upload" active={location.pathname === "/photo/upload" ? "true" : "false"}>사진 업로드</StyledLink>
      <StyledLink to="/learning" active={location.pathname === "/learning" ? "true" : "false"}>학습자료</StyledLink>
      <StyledLink to="/community" active={location.pathname === "/community" ? "true" : "false"}>커뮤니티</StyledLink>
    </>
  );

  return (
    <NavBar>
      <Logo>
        <StyledLink to="/" active={location.pathname === "/" ? "true" : "false"}>Char 칵</StyledLink>
      </Logo>
      <NavLinks>
        <NavItems />
        <StyledLink to="/user/profile" active={location.pathname === "/user/profile" ? "true" : "false"}>
          <ProfileImage src="/default_1.jpg" alt="User Profile" />
        </StyledLink>
        <StyledLink to="/login" active={location.pathname === "/login" ? "true" : "false"}>로그아웃</StyledLink>
      </NavLinks>
      <MobileMenuButton onClick={toggleMobileMenu} aria-label="모바일 메뉴 열기">
        <Menu />
      </MobileMenuButton>
      <MobileMenu isopen={isMobileMenuOpen.toString()}>
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="모바일 메뉴 닫기">
          <X />
        </MobileMenuButton>
        <MobileNavLinks>
          <NavItems />
          <StyledLink to="/user/profile" active={location.pathname === "/user/profile" ? "true" : "false"}>
            <ProfileImage src="/default_1.jpg" alt="User Profile" />
            프로필
          </StyledLink>
          <StyledLink to="/login" active={location.pathname === "/login" ? "true" : "false"}>로그인/로그아웃</StyledLink>
        </MobileNavLinks>
      </MobileMenu>
    </NavBar>
  );
}

export default Navigation;