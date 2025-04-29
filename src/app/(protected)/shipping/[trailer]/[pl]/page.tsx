'use client'
import { useParams } from 'next/navigation';
import React, { FormEvent, ReactNode, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider';
import { PickListContent, ShippingOrderProductContent, ShippingOrderProductInput } from '@/utils/interfaces';
import Swal from 'sweetalert2';
import { Box, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';
import Details from '@/components/details';
import SubmitButton from '@/components/submit_button';
import { CustomSwicth, NumberField } from '@/style/global';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StatusBadge from '@/components/status_badge';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { convertTimeByTimeZone, handleUploadToBucket, useFindUserByUUID } from '@/utils/functions/main';
import { ImagePreviewDialog } from '@/components/image_preview_dialog';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ImageDropzone from '@/components/image_dropzone';
import AddIcon from '@mui/icons-material/Add';
import TransferList from '@/components/transfer_list';

const PickListDetails = () => {

  const params = useParams();
  const supabase = createClient();
  const findUserByUUID = useFindUserByUUID();
  const { shippings, setIsLaunching, userAccount, products } = useContext(GlobalContext);

  const [open, setOpen] = useState<number | null>(0);
  const [data, setData] = useState<PickListContent>();
  const [completedProducts, setCompletedProducts] = useState<number>(0);
  const [productsSteps, setProductsSteps] = useState<ShippingOrderProductContent[]>();
  const [productIMG, setProductIMG] = useState<File | null>(null);
  const [verifiedSource, setVerifiedSource] = useState<boolean>(false);
  const [productSku, setProductSku] = useState<String>('');
  const [productSkuError, setProductSkuError] = useState<boolean>(false);
  const [serialNumber, setSerialNumber] = useState<String>('');
  const [serialNumberError, setSerialNumberError] = useState<boolean>(false);
  const [productQty, setProductQty] = useState<string>('');
  const [productQtyError, setProductQtyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [closeReason, setCloseReason] = useState<string>('');
  const [closeReasonNotes, setCloseReasonNotes] = useState<string>('');
  const [checked, setChecked] = useState([0]);
  const [modalType, setModalType] = useState<string>();
  const [orderProducts, setOrderProducts] = useState<ShippingOrderProductInput[]>([]);

  const reasons = [
    'Product unavailable',
    'Customer canceled',
    'Goods damaged',
    'Time constraints',
    'Warehouse error',
    'Other'
  ];

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleConfirmClose = async () => {
    try {
      if (!closeReason) {
        throw new Error('Please select a reason.');
      }

      var shipProduct;

      switch (closeReason) {
        case 'Product unavailable':

          if (closeReasonNotes == undefined || closeReasonNotes == '') {
            throw new Error('Please type the unavialble item sku!');
          }

          const updatedProducts = productsSteps?.map((product) => {
            if (product.product_sku === productSku) {
              shipProduct = product.id;
              return { ...product, is_ready: true };
            } else {
              return product;
            }
          });

          if (shipProduct != null) {
            const { error } = await supabase.from('shippings_products').update({
              is_ready: true,
              img_url: null,
              serial_number: null
            }).eq('id', shipProduct);

            if (error) {
              throw new Error(error.message);
            }

            setProductsSteps(updatedProducts);
          }
          break;
        default:
          break;
      }

      if (productsSteps?.length == 0) {
        const completePick = async () => {
          await supabase.from('shippings_pick_list').update({
            status: 'Completed',
            picked_by: userAccount?.user_id,
            notes: `${closeReason} - ${closeReasonNotes}`
          }).eq('id', data?.id);

          setData({
            ...data!,
            'status': 'Completed'
          });
        }
        if (completedProducts == productsSteps?.length) {
          completePick();
        }

        toast.success('Products Voided!');
      }

    } catch (error: any) {
      toast.warning(error.message);
    }
  };

  const handleAddNewProducts = async () => {
    try {
      setIsLoading(true);
      for (var product of orderProducts) {
        const { data: newItemQuery, error } = await supabase.from('shippings_products').insert({
          pick_list_id: data?.id,
          product_sku: product.product_sku,
          product_quantity: product.product_quantity,
          created_by: userAccount?.user_id,
          created_at: convertTimeByTimeZone(userAccount?.sessionTimeZone!)
        }).select().single();

        if (error) {
          throw new Error(error.message);
        }

        setProductsSteps(prev => [ ...prev!, newItemQuery]);
      }

      toast.success('Products Added!');
      handleClose();
      setIsLoading(false);
    } catch (error: any) {
      toast.warning(error.message);
    }
  }

  const handleClickOpen = (type: string) => {
    setModalType(type);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setOrderProducts([]);
  };

  const handleClick = (tab: number) => {
    setOpen(open != tab ? tab : null);
  }

  const handleLoadPickListProducts = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      var productURL: { signedUrl: any; } | null = null;
      var now = new Date().toLocaleString();

      var shipProduct;

      if (productSkuError || productSku == '') {
        throw new Error('Product doesn\'t match!');
      }

      if (productQtyError || productQty == '') {
        throw new Error('Product quantity doesn\'t match!');
      }

      if (serialNumberError || serialNumber == '') {
        setSerialNumberError(true);
        setTimeout(() => {
          setSerialNumberError(false);
        }, 1000);
        throw new Error('Serial Number is required!');
      }

      if (productIMG != null) {
        productURL = await handleUploadToBucket(
          'shippingorders',
          `${data?.id}/${data?.pl_number}/${productSku + now}`,
          productIMG!
        );
      }

      const updatedProducts = productsSteps?.map((product) => {
        if (product.product_sku === productSku) {
          shipProduct = product.id;
          return { ...product, is_ready: true, img_url: productURL != null ? productURL?.signedUrl : null };
        } else {
          return product;
        }
      });

      const { error } = await supabase.from('shippings_products').update({
        is_ready: true,
        img_url: productURL != null ? productURL?.signedUrl : null,
        serial_number: serialNumber
      }).eq('id', shipProduct);

      if (error) {
        throw new Error(error.message);
      }

      setCompletedProducts(completedProducts + 1);

      setOpen(null);
      setProductSku('');
      setProductQty('');
      setSerialNumber('');
      toast.success('Product Loaded!');
      setProductsSteps(updatedProducts);

    } catch (error: any) {
      toast.warning(error.message);
    }
    setIsLoading(false);
  }

  const handleVerifyPickList = async () => {
    try {
      const { error } = await supabase.from('shippings_pick_list').update({
        verified_by: userAccount?.user_id
      }).eq('id', data?.id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Pick List verified!');

    } catch (error: any) {
      toast.warning(error.message);
    }
  }

  useEffect(() => {
    const completePick = async () => {
      await supabase.from('shippings_pick_list').update({
        status: 'Completed',
        picked_by: userAccount?.user_id
      }).eq('id', data?.id);

      setData({
        ...data!,
        'status': 'Completed'
      });
    }
    if (completedProducts == productsSteps?.length) {
      completePick();
    }
  }, [completedProducts])

  useEffect(() => {
    const currentPL = shippings
      ?.flatMap(s => s.shippings_pick_list)
      .find(spl => spl.pl_number === parseInt(params.pl as string));
    if (currentPL != null) {
      setData(currentPL);
      const skuList = currentPL?.shippings_products?.map(product => product
      ) || [];

      const completed = skuList.filter((pick) => pick.is_ready == true);

      setCompletedProducts(completed.length);

      setProductsSteps(skuList);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Opsss!',
        text: 'We couldn\'t find this information'
      });
    }
    setIsLaunching(false);
  }, [params]);

  return (
    <Box>
      <Details title='Pick List' actionButtons={[]}>
        <Grid size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block>
            <Grid container spacing={5}>
              {data?.status == 'Completed' && data?.verified_by == null && userAccount?.accounts_roles?.find((r) => r.role_id == 2 || r.role_id == 3) && (
                <Grid size={12}>
                  <Button fullWidth variant='contained' className='btn-cerulean' onClick={handleVerifyPickList}>Verify</Button>
                </Grid>
              )}
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Typography align='center' fontWeight={'bold'}>PL Number</Typography>
                <Typography align='center' >{data?.pl_number}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>BOL Number</Typography>
                <Typography align='center' >{data?.bol_number}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>Picked By</Typography>
                <Typography align='center' >{findUserByUUID(data?.picked_by!)}</Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Typography align='center' fontWeight={'bold'}>Verified By</Typography>
                <Typography align='center' >{findUserByUUID(data?.picked_by!)}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography align='center' fontWeight={'bold'}>Notes</Typography>
                <Typography align='center' >{data?.notes || '...'}</Typography>
              </Grid>
            </Grid>
          </Block>
        </Grid>
        <Grid size={{ xl: 9, lg: 9, md: 12, sm: 12, xs: 12 }} sx={{ marginBottom: 5 }}>
          <Block>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center' }}>
              <Typography variant='h6' fontWeight='bold'>Products</Typography>
              {data?.status != 'Completed' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant='contained' color='error' onClick={() => handleClickOpen('void')}>Void</Button>
                  <Button onClick={() => handleClickOpen('add-products')} variant='contained' color='info'>
                    <AddIcon />
                  </Button>
                </Box>
              )}
            </Box>
            <List>
              {productsSteps?.map((label: any, index) => (
                <Box key={index}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 5 }}>
                        {open == index ? <ExpandLess /> : <ExpandMore />}
                      </Box>
                    }
                  >
                    <ListItemButton onClick={() => handleClick(index)} sx={{ width: '100%' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', placeItems: 'center', gap: 5 }}>
                            <Typography>{`Product - ${(index + 1)}`}</Typography>
                            <StatusBadge status={label.is_ready ? 'Completed' : 'Pending'} />
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open == index} timeout="auto" unmountOnExit sx={{ width: '100%', background: '#e6e6e6' }}>
                    <Grid container spacing={2} sx={{ margin: 3 }}>
                      <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12 }}>
                        <FormGroup>
                          <FormControlLabel control={
                            <CustomSwicth
                              disabled={label.is_ready}
                              checked={verifiedSource}
                              onChange={(event) => setVerifiedSource(event.target.checked)}
                            />
                          } label="Verify Source?" />
                        </FormGroup>
                        {verifiedSource && (
                          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', placeItems: 'center', justifyContent: 'center' }}>
                            <PriorityHighIcon sx={{ fontSize: 50 }} />
                            <Typography variant='h6' fontWeight='bold'>Create Racks and Locations to take products from there!</Typography>
                          </Box>
                        )}
                      </Grid>
                      <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12 }}>
                        <form onSubmit={handleLoadPickListProducts}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                              fullWidth
                              value={label.is_ready ? label.product_sku : productSku}
                              disabled={label.is_ready}
                              label="Product Sku"
                              helperText={`SKU: ${label.product_sku}`}
                              onChange={(e) => {
                                if (e.target.value.length == label.product_sku.length) {
                                  setProductSku(e.target.value);
                                  if (e.target.value == label.product_sku) {
                                    setProductSkuError(false);
                                  } else {
                                    setProductSkuError(true);
                                  }
                                } else if (e.target.value.length < (label.product_sku.length + 1)) {
                                  setProductSkuError(false);
                                  setProductSku(e.target.value);
                                }
                              }}
                              error={productSkuError}
                            />
                            <TextField
                              fullWidth
                              value={label.serial_number || serialNumber}
                              disabled={label.is_ready}
                              label="Serial Number"
                              helperText={serialNumberError ? 'Serial number is required' : ''}
                              onChange={(e) => setSerialNumber(e.target.value)}
                              error={serialNumberError}
                            />
                            <NumberField
                              fullWidth
                              type='number'
                              value={label.is_ready ? label.product_quantity : productQty}
                              disabled={label.is_ready}
                              slotProps={{
                                input: {
                                  inputProps: {
                                    max: label.product_quantity,
                                  },
                                },
                              }}
                              label="Product Quantity"
                              onChange={(e) => {
                                if (e.target.value <= label.product_quantity) {
                                  setProductQtyError(false);
                                  setProductQty(e.target.value)
                                } else {
                                  setProductQtyError(true);
                                  setProductQty(e.target.value.slice(0, -1));
                                }
                              }}
                              helperText={`Quantity: ${label.product_quantity}`}
                              error={productQtyError}
                            />
                            {label.is_ready ? (
                              label.img_url ? (
                                <ImagePreviewDialog imageUrl={label.img_url} />
                              ) : null
                            ) : (
                              <ImageDropzone
                                productIMG={productIMG}
                                setProductIMG={setProductIMG}
                                maxWidth={100}
                              />
                            )}

                            {!label.is_ready && (
                              <SubmitButton isLoading={isLoading} fullWidth={true} className='btn-munsell' btnText='Load' />
                            )}
                          </Box>
                        </form>
                      </Grid>
                    </Grid>
                  </Collapse>
                  <Divider />
                </Box>
              ))}
            </List>
          </Block>
        </Grid>
      </Details>
      <Dialog
        open={openModal}
        onClose={handleClose}
      >
        {modalType == 'void' ? (
          <Box>
            <DialogTitle>Close Pick List Incomplete</DialogTitle><DialogContent>
              <DialogContentText>
                This pick list is not fully completed. Please select a reason for closing it. This action cannot be undone.
              </DialogContentText>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="close-reason-label">Reason</InputLabel>
                  <Select
                    labelId="close-reason-label"
                    value={closeReason}
                    label="Reason"
                    onChange={(e) => setCloseReason(e.target.value)}
                  >
                    {reasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                { closeReason == 'Product unavailable' && (
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {productsSteps?.map((label: any, index) => {
                      const labelId = `checkbox-list-label-${index}`;
                      return (
                        <ListItem
                          key={index}
                          disablePadding
                        >
                          <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.includes(label.id)}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={label.product_sku} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}

                  </List>
                )}
                <TextField
                  required
                  multiline
                  rows={4}
                  value={closeReasonNotes}
                  onChange={(e) => setCloseReasonNotes(e.target.value)}
                  margin="dense"
                  name="notes"
                  label="Notes"
                  type="email"
                  fullWidth />
              </Box>
            </DialogContent>
          </Box>
        ) : (
          <Box sx={{ minWidth: 500, maxHeight: 600 }}>
            <DialogTitle>Add Products</DialogTitle>
            <DialogContent>
              <TransferList inventory={products!} orderProducts={orderProducts} setOrderProducts={setOrderProducts} />
            </DialogContent>
          </Box>
        )}
        <DialogActions>
          <Button variant='contained' className='btn-gunmetal' onClick={handleClose}>Cancel</Button>
          {modalType == 'void' ? (
            <Button variant='contained' className='btn-munsell' onClick={handleConfirmClose}>Void PL</Button>
          ) : (
            <SubmitButton btnText='Add' isLoading={isLoading} className='btn-munsell' onClick={handleAddNewProducts} />
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PickListDetails