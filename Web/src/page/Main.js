import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const handleNavigateToTest = () => {
    navigate('/Test');
  };

  return (
    <div>
      <h1>Main Page</h1>
      <button onClick={handleNavigateToTest}>Go to Test Page</button>
    </div>
  );
}

export default Main;
