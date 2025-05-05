'use client'
import { useParams } from 'next/navigation';
import React, { FormEvent, ReactNode, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider';
import { PickListContent, ShippingOrderProductContent, ShippingOrderProductInput } from '@/utils/interfaces';
import Swal from 'sweetalert2';
import { Box, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
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
  const [productSkuMap, setProductSkuMap] = useState<Record<number, string>>({});
  const [productSkuError, setProductSkuError] = useState<boolean>(false);
  const [serialNumberMap, setSerialNumberMap] = useState<Record<number, string>>({});
  const [serialNumberError, setSerialNumberError] = useState<boolean>(false);
  const [productQtyMap, setProductQtyMap] = useState<Record<number, string>>({});
  const [productQtyError, setProductQtyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [closeReason, setCloseReason] = useState<string>('');
  const [closeReasonNotes, setCloseReasonNotes] = useState<string>('');
  const [modalType, setModalType] = useState<string>();
  const [orderProducts, setOrderProducts] = useState<ShippingOrderProductInput[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [PLNotes, setPLNotes] = useState<string>('');

  const reasons = [
    'Product unavailable',
    'Customer canceled',
    'Product Short',
    'Goods damaged',
    'Time constraints',
    'Warehouse error',
    'Other'
  ];

  const handleSelectToggle = (value: number) => () => {
    const currentIndex = selected.indexOf(value);
    const newChecked = [...selected];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelected(newChecked);
  };

  const handleConfirmClose = async () => {
    try {

      var defaultQuantity = 0;
      var defautlSerial = '';

      if (!closeReason) {
        throw new Error('Please select a reason.');
      }

      switch (closeReason) {
        case 'Product Short':
          if (serialNumberMap[selected[0]] == '' || (serialNumberMap[selected[0]] == undefined)) {
            throw new Error('Serial Number can\'t be empty');
          }
          defautlSerial = serialNumberMap[selected[0]];
          defaultQuantity = parseInt(productQtyMap[selected[0]]);
          break;
        default:
          break;
      }

      const updatedProducts = productsSteps?.map((product) => {
        if (selected.includes(product.id!)) {
          return { ...product, is_ready: true, img_url: null, product_quantity: defaultQuantity, serial_number: defautlSerial};
        } else {
          return product;
        }
      });

      setProductsSteps(updatedProducts);

      const { error } = await supabase.from('shippings_products').update({
        is_ready: true,
        img_url: null,
        serial_number: null,
        product_quantity: 0
      }).in('id', selected);

      if (error) {
        throw new Error(error.message);
      }

      const newContent = `${findUserByUUID(userAccount?.user_id!)} voided this pick product for the following reason '${closeReason}', details: ${closeReasonNotes}`;

      setPLNotes((prev) => prev ? `${prev} - ${newContent}` : newContent);

      setOpen(null);
      setCloseReason('');
      const updateCompletedProducts = updatedProducts!.filter(p => p.is_ready == true).length;
      setCompletedProducts(updateCompletedProducts);
      if (updateCompletedProducts == productsSteps?.length) {
        completePick(true);
      }
      setSelected([]);
    } catch (error: any) {
      setCloseReason('');
      console.log(error.message);
      toast.warning("Error Closing Task");
    }
    handleClose();
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

        setProductsSteps(prev => [...prev!, newItemQuery]);
      }

      toast.success('Products Added!');
      handleClose();
      setIsLoading(false);
    } catch (error: any) {
      console.log(error.message);
      toast.warning('Error adding new product.');
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

  const handleLoadPickListProducts = async (e: FormEvent<HTMLFormElement>, productId: number, label: ShippingOrderProductContent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const sku = productSkuMap[productId];
      const serial = serialNumberMap[productId];
      const qty = productQtyMap[productId];

      if (!sku || sku !== label.product_sku) throw new Error('Product doesn\'t match!');
      if (!serial) throw new Error('Serial Number is required!');
      if (!qty || parseInt(qty) < label.product_quantity!) throw new Error('Product quantity doesn\'t match!');

      var productURL: { signedUrl: any; } | null = null;
      var now = new Date().toLocaleString();

      var shipProduct;

      if (productIMG != null) {
        productURL = await handleUploadToBucket(
          'shippingorders',
          `${data?.id}/${data?.pl_number}/${sku + now}`,
          productIMG!
        );
      }

      const updatedProducts = productsSteps?.map((product) => {
        if (product.product_sku === sku) {
          shipProduct = product.id;
          return { ...product, is_ready: true, img_url: productURL != null ? productURL?.signedUrl : null };
        } else {
          return product;
        }
      });

      const { error } = await supabase.from('shippings_products').update({
        is_ready: true,
        img_url: productURL != null ? productURL?.signedUrl : null,
        serial_number: serial
      }).eq('id', shipProduct);

      if (error) {
        throw new Error(error.message);
      }

      setCompletedProducts(completedProducts + 1);

      setOpen(null);
      toast.success('Product Loaded!');
      setProductsSteps(updatedProducts);

    } catch (error: any) {
      console.log(error.message);
      toast.warning("Something went wrong.");
    }
    setIsLoading(false);
  }

  const handleVerifyPickList = async () => {
    try {
      const { error } = await supabase.from('shippings_pick_list').update({
        verified_by: userAccount?.user_id,
        status: 'Completed',
      }).eq('id', data?.id);

      setData({
        ...data!,
        'status': 'Completed'
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsReady(false);
      toast.success('Pick List verified!');
    } catch (error: any) {
      console.log(error.message);
      toast.warning('something went wrong.');
    }
  }

  const completePick = async (isVoided?: boolean) => {
    await supabase.from('shippings_pick_list').update({
      status: data!.verified_by == null ? 'Awaiting Verification' : 'Completed',
      picked_by: userAccount?.user_id,
      notes: PLNotes,
    }).eq('id', data?.id);

    setData({
      ...data!,
      'status': data!.verified_by == null ? 'Awaiting Verification' : 'Completed'
    });

    setIsReady(true);
  }

  useEffect(() => {
    if (completedProducts == productsSteps?.length) {
      completePick();
    }
  }, [completedProducts])

  useEffect(() => {
    if (data?.status === 'Completed') {
      if (data?.verified_by == null) {
        if (userAccount?.accounts_roles?.find(r => r.role_id === 2 || r.role_id === 3)) {
          setIsReady(true);
        }
      }
    }
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
              {isReady && (
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
                  {selected.length > 0 && (
                    <Button variant='contained' color='error' onClick={() => handleClickOpen('void')}>Void</Button>
                  )}
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
                      <IconButton onClick={() => handleClick(index)}>
                        {open == index ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    }
                  >
                    {!label.is_ready && (
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          onChange={handleSelectToggle(label.id)}
                          checked={selected.includes(label.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                    )}
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
                        <form onSubmit={(e) => handleLoadPickListProducts(e, label.id, label)}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                              fullWidth
                              value={
                                label.is_ready
                                  ? label.product_sku ?? ''
                                  : productSkuMap?.[label.id ?? -1] ?? ''
                              }
                              disabled={label.is_ready}
                              label="Product Sku"
                              helperText={`SKU: ${label.product_sku}`}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProductSkuMap((prev) => ({ ...prev, [label.id]: value }));
                                setProductSkuError(value !== label.product_sku);
                              }}
                              error={productSkuError}
                            />

                            <TextField
                              fullWidth
                              value={
                                label.is_ready
                                  ? label.serial_number ?? ''
                                  : serialNumberMap?.[label.id ?? -1] ?? ''
                              }
                              disabled={label.is_ready}
                              label="Serial Number"
                              onChange={(e) => {
                                const value = e.target.value;
                                setSerialNumberMap((prev) => ({ ...prev, [label.id]: value }));
                              }}
                              error={serialNumberError}
                            />
                            <NumberField
                              fullWidth
                              type='number'
                              value={
                                label.is_ready
                                  ? label.product_quantity ?? ''
                                  : productQtyMap?.[label.id ?? -1] ?? ''
                              }
                              disabled={label.is_ready}
                              label="Product Quantity"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value <= label.product_quantity) {
                                  setProductQtyError(false);
                                  setProductQtyMap((prev) => ({ ...prev, [label.id]: value }));
                                } else {
                                  setProductQtyError(true);
                                  setProductQtyMap((prev) => ({ ...prev, [label.id]: value.slice(0, -1) }));
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
            <DialogTitle>Close Pick List Product</DialogTitle><DialogContent>
              <DialogContentText>
                This product is not fully completed. Please select a reason for closing it. This action cannot be undone.
              </DialogContentText>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="close-reason-label">Reason</InputLabel>
                  <Select
                    labelId="close-reason-label"
                    value={closeReason}
                    label="Reason"
                    onChange={(e) => {
                      if (e.target.value == 'Product Short') {
                        if (selected.length != 1) {
                          handleClose();
                          toast.warning('You can only mark one product as short at a time.!');
                        } else {
                          setCloseReason(e.target.value);
                        }
                      } else {
                        setCloseReason(e.target.value);
                      }
                    }}
                  >
                    {reasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {closeReason == 'Product Short' && (
                  <NumberField
                  fullWidth
                  type='number'
                  value={productQtyMap[selected[0]] || ''}
                  label="Product Quantity"
                  onChange={(e) => {
                    const value = e.target.value;
                    setProductQtyMap((prev) => ({ ...prev, [selected[0]]: value }));
                  }}
                  error={productQtyError}
                />
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