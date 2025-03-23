'use client'
import { useParams } from 'next/navigation';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../../../../../utils/context/global_provider';
import { GridColDef } from '@mui/x-data-grid';
import { ProductContent } from '../../../../../utils/interfaces';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../../style/global';
import PrintIcon from '@mui/icons-material/Print';
import Barcode from 'react-barcode';
import { NumericFormat } from 'react-number-format';
import BasicTable from '../../../../../components/tables/basic_table';
import Details from '../../../../../components/details';
import ProductsForm from '../../../../../components/forms/products_form';

const InventoryDetails = () => {
    const params = useParams();
  const { products, users, racks } = useContext(GlobalContext);
  

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        
      </Grid>
    </Grid>
  )
}

export default InventoryDetails
