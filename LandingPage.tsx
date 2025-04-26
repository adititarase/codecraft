import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Container = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const Button = styled(Link)`
  padding: 0.75rem 2rem;
  background-color: ${props => props.theme.primary};
  color: white;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
  }
`;

import { View } from '../App';

const LandingPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  return (
    <>
      <Navbar currentView={currentView} onViewChange={handleViewChange} />
      <Container>
        <Title>Welcome to Java Classroom</Title>
        <Description>
          Explore, learn, and practice Java programming with our interactive platform.
        </Description>
        <ButtonGroup>
          <Button to="/login">Login</Button>
          <Button to="/login">Sign Up</Button>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default LandingPage;
