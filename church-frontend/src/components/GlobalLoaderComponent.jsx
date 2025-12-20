import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const GlobalLoaderComponent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading to true when location changes
    setLoading(true);
    // You might delay the loader or perform an async task here
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default GlobalLoaderComponent;
