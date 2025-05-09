'use client'
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, BoxProps, styled, useMediaQuery, useTheme } from '@mui/material';
import React, { FC, useContext } from 'react';

const StyledBlock = styled(Box)(({ theme }) => ({
  borderRadius: 10,
  background: '#F4F4F4',
  padding: theme.spacing(2),
  ...theme.typography.body1,
  boxShadow: '5px 10px 10px 0px rgba(0,0,0,0.35)',
}));

const Block: FC<BoxProps> = ({ children, ...rest }) => {

  const { isLaunching } = useContext(GlobalContext);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  if (!isLaunching) {
      return (
        <StyledBlock className='animate__animated animate__fadeInUpBig' sx={{ height: isLargeScreen ? '100%' : 'auto' }} {...rest}>
          {children}
        </StyledBlock>
      );
  }
};

export default Block;