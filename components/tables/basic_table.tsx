'use client'
import { Box, Button, Dialog, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { usePathname, useRouter } from 'next/navigation';
import React, { cloneElement, MouseEvent, ReactElement, useRef, useState } from 'react';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deepSearch } from '../../utils/functions/main';

const BasicTable = ({
  title,
  data,
  columns,
  createForm,
  createFormTitle,
} : { 
  title: string,
  data: Array<any>,
  columns: GridColDef[],
  createForm?: ReactElement<any>,
  createFormTitle?: string,
}) => {
    const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<GridColDef[]>([]);
  const serachRef = useRef<HTMLInputElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<GridRowId | null>(null);
  const [formData, setFormData] = useState<any>({});
  const tableContent = useRef(null);

  const defaultColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Box>
          {selectedRow === params.row.id && (
            <Box >
              <IconButton onClick={() => handleEdit(params.row.id)}>
                <EditIcon fontSize='small' />
              </IconButton>
              <IconButton onClick={() => handleViewDetails(params.row)}>
                <VisibilityIcon fontSize='small' />
              </IconButton>
            </Box>
          )}
        </Box>
      ),
    },
  ];

  const mergedColumns: GridColDef[] = [...columns, ...defaultColumns];

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpenModal(false);
    setFormData([]);
  };

  const renderOptions = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <ReactToPrint
        trigger={() => <MenuItem>PRINT</MenuItem>}
        content={() => tableContent.current}
      /> */}
      <MenuItem>IMPORT</MenuItem>
      <MenuItem>EXPORT</MenuItem>
    </Menu>
  );

  const handleSearch = (key: string) => {
    if (key !== "") {
      key = key.toLowerCase();
      var content = deepSearch(data, key);
      setSearchData(content);
    } else {
      setSearchData([]);
    }
  }

  const handleCleanSearch = () => {
    setSearchData([]);
    serachRef.current!.querySelector('input')!.value = "";
  }

  const handleEdit = (id: number) => {
    const dataFind = data.find(r => r.id === id);
    if (dataFind) {
      setFormData(dataFind);
      setOpenModal(true);
    }
  }

  const handleViewDetails = (data: any) => {
    if (Object.keys(data).includes('sku')) {
      router.push(`${pathname}/${data.sku}`);
    } else if (Object.keys(data).includes('username')) {
      router.push(`${pathname}/${data.username}`);
    } else if (Object.keys(data).includes('racks_locations')) {
      router.push(`/inventory/${data.id}`);
    } else if (Object.keys(data).includes('addresses')) {
      router.push(`/customers/${data.id}`);
    } else if (Object.keys(data).includes('order_number')) {
      router.push(`/orders/${data.order_number}`);
    } else if (Object.keys(data).includes('po_number')) {
      router.push(`${pathname}/${data.po_number}`);
    }
  }

  const handleDelete = () => {
    console.log('Sisa');
    // Swal.fire({
    //   title: 'Warning',
    //   text: 'Are you sure you want to delete this user?',
    //   icon: 'question',
    //   confirmButtonText: 'Procceed',
    //   showCancelButton: true,
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     axios.post('/api/delete', {
    //       ids: selectedRow,
    //       model: 'user',
    //       status: true
    //     }).then((res) => {
    //       if (res.data) {
    //         toast.success('User deleted!');
    //         data = data.filter(u => !selectedRow.includes(u.id));
    //       }
    //     }).catch((err) => {
    //       toast.warning(err);
    //     });
    //   }
    // })
  }

  const hanldeSelectRow = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    setSelectedRow(rowSelectionModel[0]);
  }

  return (
<Box sx={{ minHeight: 400, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Box sx={{display: 'flex', width: '100%', height: '100%', alignItems: 'center'}} >
            <Typography variant='h4'>{title}</Typography>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={{ width: '100%'}}>
            <TextField
              fullWidth
              onChange={(e) => handleSearch(e.target.value)}
              placeholder='Search'
              disabled={data.length <= 0}
              ref={serachRef}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchData.length > 0 && (
                        <IconButton onClick={handleCleanSearch}>
                          <CloseIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={{display: 'flex', width: '100%'}}>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{display: 'flex', gap: 1}}>
              {selectedRow != null && (
                <Button variant='contained' className='bg-red-700 hover:bg-red-800 ml-5' onClick={handleDelete}>
                  <DeleteIcon />
                </Button>
              )}
              { createForm !== undefined && (
                <Button variant='contained' startIcon={<AddIcon />} className='btn-munsell ml-5' onClick={() => setOpenModal(true)}>
                  New
                </Button>
              )}
              <Button onClick={handleProfileMenuOpen} variant='contained'>
                <MoreVertIcon />
              </Button>
              {renderOptions}
            </Box>
          </Box>
        </Grid>
        <Grid size={12}>
          {data.length > 0 ? (
            <DataGrid
              ref={tableContent}
              disableMultipleRowSelection
              rows={searchData.length >= 1 ? searchData : data}
              columns={mergedColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              onRowSelectionModelChange={hanldeSelectRow}
              checkboxSelection
            />
          ) : (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200}}>
              <Typography variant='h4'>No Records yet!</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      { createForm !== undefined && (
        <Dialog onClose={handleClose} open={openModal} fullWidth>
          <DialogTitle>
            <Typography>{createFormTitle}</Typography>
          </DialogTitle>
          {cloneElement(createForm, { defaultData: formData, setOpenModal: setOpenModal })}
        </Dialog>
      )}
    </Box>
  )
}

export default BasicTable
