'use client'
import { GlobalContext } from '@/utils/context/global_provider';
import { Box, BoxProps, styled } from '@mui/material';
import React, { FC, useContext } from 'react';

const StyledBlock = styled(Box)(({ theme }) => ({
  background: '#F4F4F4',
  padding: theme.spacing(2),
  ...theme.typography.body1,
  borderRadius: 10,
  boxShadow: '5px 10px 10px 0px rgba(0,0,0,0.35)',
  maxHeight: '100%',
}));

const Block: FC<BoxProps> = ({ children, ...rest }) => {

  const { isLaunching } = useContext(GlobalContext);

  if (!isLaunching) {
      return (
        <StyledBlock className='animate__animated animate__fadeInUpBig' {...rest}>
          {children}
        </StyledBlock>
      );
  }
};

export default Block;