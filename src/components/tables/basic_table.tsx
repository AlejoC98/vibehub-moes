'use client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { usePathname, useRouter } from 'next/navigation';
import React, { cloneElement, MouseEvent, ReactElement, useContext, useRef, useState } from 'react';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deepSearch, exportShippingToExcel, exportToExcel } from '@/utils/functions/main';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { GlobalContext } from '@/utils/context/global_provider';
import { createClient } from '@/utils/supabase/client';
import FileDropZone from '../forms/upload_file_form';

const BasicTable = ({
  title,
  data,
  columns,
  created_column = false,
  source,
  createForm,
  createFormTitle,
}: {
  title: string,
  data: Array<any>,
  columns: GridColDef[],
  created_column?: boolean,
  source?: string,
  createForm?: ReactElement<any>,
  createFormTitle?: string,
}) => {

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { setIsLaunching, users } = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openImportModal, setOpenImportModal] = useState<boolean>(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [searchData, setSearchData] = useState<GridColDef[]>([]);
  const serachRef = useRef<HTMLInputElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<GridRowId | null>(null);
  const [formData, setFormData] = useState<any>({});
  const tableContent = useRef(null);

  const defaultColumns: GridColDef[] = [
    ...(created_column
      ? [{
        field: 'created_by', headerName: 'Created By', renderCell: (params: any) => {
          var userName;
          if (params.row.created_by == 1) {
            userName = { username: 'Alejoc98' }
          } else {
            userName = users?.find(u => u.user_id == params.row.created_by);
          }
          return userName?.username || params.row.created_by;
        }
      },]
      : []),
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
    setFormData({});
  };

  const handleOpenImportDialog = async () => {
    handleMenuClose();
    setOpenImportModal(true);
  }

  const handleCloseImport = () => {
    setExcelFile(null);
    setOpenImportModal(false);
  };

  const handleUploadImportFile = () => {
    try {
      if (excelFile == null) {
        throw new Error('Please select a valid file!');
      }
      handleCloseImport();

      switch (source) {
        case 'products':
          console.log('Products');
          break;
        case 'shippings_orders':
          console.log('Shipping Orders');
          break;
        default:
          throw new Error('We couldn\'t proccess')
          break;
      }

    } catch (error: any) {
      toast.warning(error.message);
    }
  }

  const handleCreateXlsxFile = async () => {
    try {
      if (selectedRow == null) {
        exportToExcel(data, [...columns, ...defaultColumns]);
      } else {

        switch (source) {
          case 'shippings_orders':
            const { data: tableQuery, error } = await supabase.from(source!).select('*, shippings_pick_list(*, shippings_products(*))').eq('id', selectedRow).single();

            if (error) {
              throw new Error(error.message);
            }
            exportShippingToExcel(tableQuery, users!);
            break;
          default:
            toast.warning('Error creating file, please try again later!');
            break;
        }
      }
    } catch (error: any) {
      toast.warning(error.message);
    }
  }

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
      <MenuItem onClick={handleOpenImportDialog}>IMPORT</MenuItem>
      <MenuItem onClick={handleCreateXlsxFile}>EXPORT</MenuItem>
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
    setIsLaunching(true);
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
    } else if (Object.keys(data).includes('trailer_number')) {
      router.push(`${pathname}/${data.trailer_number}`);
    } else if (Object.keys(data).includes('pl_number')) {
      router.push(`${pathname}/${data.pl_number}`);
    }
  }

  const handleDelete = () => {
    try {
      Swal.fire({
        title: 'Warning',
        text: 'Are you sure you want to delete this user?',
        icon: 'question',
        confirmButtonText: 'Procceed',
        confirmButtonColor: '#f9564f',
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { error } = await supabase.from(source!).update({
            'deleted': true
          }).eq('id', selectedRow);
          // const { error } = await supabase.from(source!).delete().eq('id', selectedRow); 
          if (error) {
            throw new Error(error.message);
          }
          toast.success('Record Deleted');
        }
      });
    } catch (error) {
      toast.warning('Error deleting record!');
    }
  }

  const hanldeSelectRow = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    setSelectedRow(rowSelectionModel[0]);
  }

  return (
    <Box sx={{ minHeight: 400, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
          <Box sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }} >
            <Typography variant='h4'>{title}</Typography>
          </Box>
        </Grid>
        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
          <Box sx={{ width: '100%' }}>
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
        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{
              display: 'flex',
              gap: 1,
              justifyContent: { lg: 'end', md: 'end', sm: 'end', xs: 'end' }
            }}>
              {selectedRow != null && (
                <Button variant='contained' className='bg-red-700 hover:bg-red-800 ml-5' onClick={handleDelete}>
                  <DeleteIcon />
                </Button>
              )}
              {createForm !== undefined && (
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
              pageSizeOptions={[5, 10, 25, 50]}
              onRowSelectionModelChange={hanldeSelectRow}
              checkboxSelection
            />
          ) : (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
              <Typography variant='h4'>No Records yet!</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      {createForm !== undefined && (
        <Box sx={{ background: 'red', width: 800 }}>
          <Dialog fullWidth maxWidth='lg' onClose={handleClose} open={openModal}>
            <DialogTitle>
              <Typography align='center' fontWeight='bold' sx={{ fontSize: 25 }}>{createFormTitle}</Typography>
            </DialogTitle>
            {cloneElement(createForm, { defaultData: formData, setOpenModal: setOpenModal })}
          </Dialog>
        </Box>
      )}
      <Dialog fullWidth maxWidth='sm' onClose={handleCloseImport} open={openImportModal}>
        <DialogTitle>
          <Typography align='center' fontWeight='bold' sx={{ fontSize: 25 }}>Import File</Typography>
        </DialogTitle>
        <DialogContent>
          <FileDropZone
            excelFile={excelFile}
            setExcelFile={setExcelFile}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant='contained' onClick={handleCloseImport} className='btn-gunmetal'>Close</Button>
          <Button variant='contained' onClick={handleUploadImportFile} className='btn-munsell' autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BasicTable
