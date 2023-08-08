import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SignFooter() {
  return (
    <Box component="footer" py={3} borderTop="1px solid #e0e0e0">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="body2">&copy; {new Date().getFullYear()} TIMEGO Inc. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}
