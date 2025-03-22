'use client'
import { Box, Button, Dialog, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
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

const BasicTable = ({ title, data, columns, createForm, createFormTitle }: { title: string, data: Array<any>, columns: GridColDef[], createForm?: ReactElement<any>, createFormTitle?: string }) => {
    const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<GridColDef[]>([]);
  const serachRef = useRef<HTMLInputElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<GridRowId[]>([]);
  const [formData, setFormData] = useState<any>({});
  const tableContent = useRef(null);

  const defaultColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <div className="flex justify-around w-auto">
          {selectedRow.length === 1 && selectedRow[0] === params.row.id && (
            <Box className="flex w-[5rem] justify-around">
              <button className="bg-blue-500 p-1 rounded-md text-white" onClick={() => handleEdit(params.row.id)}>
                <EditIcon />
              </button>
              <button className="bg-blue-500 p-1 rounded-md text-white">
                <VisibilityIcon />
              </button>
            </Box>
          )}
        </div>
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
      const search = data.filter(row => Object.values(row).find(record => record?.toString().toLowerCase().includes(key)));
      setSearchData(search);
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
    if (Object.keys(data).includes('sku') && !Object.keys(data).includes('rackId')) {
      router.push(`${pathname}/${data.sku}`);
    } else if (Object.keys(data).includes('username')) {
      router.push(`${pathname}/${data.username}`);
    } else if (Object.keys(data).includes('rackId')) {
      router.push(`/inventory/${data.sku}`);
    } else if (Object.keys(data).includes('addresses')) {
      router.push(`/customers/${data.id}`);
    } else if (Object.keys(data).includes('order_number')) {
      router.push(`/orders/${data.order_number}`);
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

  const hanldeSelectRow = (selectedRows: GridRowId[]) => {
    setSelectedRow(selectedRows);
  }

  return (
<Box sx={{ minHeight: 400, width: '100%' }}>
      <Grid container spacing={5}>
        <Grid size={4}>
          <Box className="w-full h-full flex items-center">
            <Typography variant='h4'>{title}</Typography>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box className="w-full">
            <TextField
              fullWidth
              onChange={(e) => handleSearch(e.target.value)}
              placeholder='Search'
              disabled={data.length <= 0}
              ref={serachRef}
              InputProps={{
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
              }}
            />
          </Box>
        </Grid>
        <Grid size={4}>
          <Box className="w-full flex">
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              {selectedRow.length >= 1 && (
                <Button variant='contained' className='bg-red-700 hover:bg-red-800 ml-5' onClick={handleDelete}>
                  <DeleteIcon />
                </Button>
              )}
              { createForm !== undefined && (
                <Button variant='contained' startIcon={<AddIcon />} className='btn-munsell ml-5' onClick={() => setOpenModal(true)}>
                  New
                </Button>
              )}
              <Button onClick={handleProfileMenuOpen} variant='contained' className='ml-5 bg-gray-400 hover:bg-gray-500'>
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
              rows={searchData.length >= 1 ? searchData : data}
              columns={mergedColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            //   onRowSelectionModelChange={hanldeSelectRow}
              checkboxSelection
            />
          ) : (
            <Box className="w-full text-center">
              <Typography variant='h3'>No Records yet!</Typography>
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
