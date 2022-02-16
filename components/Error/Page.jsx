import { forwardRef } from 'react';
// material
import { Box } from '@mui/material';

const Page = forwardRef(({ children, title = '', ...other }, ref) => (
  <Box ref={ref} {...other}>
    {children}
  </Box>
));


Page.displayName = 'Page';

export default Page;
