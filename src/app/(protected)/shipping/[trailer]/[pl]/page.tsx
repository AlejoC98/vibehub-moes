'use client'
import { useParams } from 'next/navigation';
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/utils/context/global_provider';
import { PickListContent, ShippingOrderProductContent } from '@/utils/interfaces';
import Swal from 'sweetalert2';
import { Box, Button, Collapse, Divider, FormControlLabel, FormGroup, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Block from '@/components/block';
import UploadImageForm from '@/components/forms/upload_image_form';
import Details from '@/components/details';
import SubmitButton from '@/components/submit_button';
import { CustomSwicth, NumberField } from '@/style/global';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StatusBadge from '@/components/status_badge';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { handleUploadToBucket, useFindUserByUUID } from '@/utils/functions/main';

const PickListDetails = () => {

  const params = useParams();
  const supabase = createClient();
  const findUserByUUID = useFindUserByUUID();
  const { shippings, setIsLaunching, userAccount } = useContext(GlobalContext);

  const [open, setOpen] = useState<number | null>(0);
  const [data, setData] = useState<PickListContent>();
  const [completedProducts, setCompletedProducts] = useState<number>(0);
  const [productsSteps, setProductsSteps] = useState<ShippingOrderProductContent[]>();
  const [productIMG, setProductIMG] = useState<File | null>(null);
  const [verifiedSource, setVerifiedSource] = useState<boolean>(false);
  const [productSku, setProductSku] = useState<String>('');
  const [productSkuError, setProductSkuError] = useState<boolean>(false);
  const [productQty, setProductQty] = useState<string>('');
  const [productQtyError, setProductQtyError] = useState<boolean>(false);

  const handleClick = (tab: number) => {
    setOpen(open != tab ? tab : null);
  }

  const handleLoadPickListProducts = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      var productURL = null;
      var now = new Date().toLocaleString();
      var error_message = '';

      var shipProduct;

      if (productSkuError || productSku == '')
        error_message = 'Product doesn\'t match!';

      if (productQtyError || productQty == undefined)
        error_message = 'Product quantity doesn\'t match!';

      if (error_message != '')
        Swal.fire({
          icon: 'info',
          title: "Almost There!",
          text: 'Product doesn\'t match!',
          confirmButtonColor: '#549F93',
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });

        const updatedProducts = productsSteps?.map((product) => {
          if (product.product_sku === productSku) {
            shipProduct = product.id;
            return { ...product, is_ready: true };
          } else {
            return product;
          }
        });

      if (productIMG) {
        productURL = await handleUploadToBucket(
          'shippingorders',
          `${data?.id}/${data?.pl_number}/${productSku + now}`,
          productIMG!
        );
      }

      const { data: newSP, error } = await supabase.from('shippings_products').update({
        is_ready: true,
        img_url: productURL?.signedUrl
      }).eq('id', shipProduct);

      if (error) {
        throw new Error(error.message);
      }

      setCompletedProducts(completedProducts + 1);

      setOpen(null);
      setProductSku('');
      setProductQty('');
      toast.success('Product Loaded!');
      setProductsSteps(updatedProducts);

    } catch (error: any) {
      toast.warning(error.message);
    }
  }

  const handleVerifyPickList = async() => {
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
    const completePick = async() => {
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
              { data?.status == 'Completed' && data?.verified_by == null && (
                <Grid size={12}>
                  <Button fullWidth variant='contained' className='btn-cerulean' onClick={handleVerifyPickList}>Verify</Button>
                </Grid>
              ) }
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
            <Typography variant='h6' fontWeight='bold'>Products</Typography>
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
                  <Collapse in={open == index} timeout="auto" unmountOnExit sx={{ width: '100%', background: '#e6e6e6'}}>
                    <Grid container spacing={2} sx={{ margin: 3}}>
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
                          <Box>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos soluta ad quos libero. Ipsa eveniet accusamus praesentium fugit temporibus officia odio. Aspernatur quaerat vel ullam ipsum distinctio, quibusdam veritatis eveniet.
                          </Box>
                        )}
                      </Grid>
                      <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12 }}>
                        <form onSubmit={handleLoadPickListProducts}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <NumberField
                              fullWidth
                              type='number'
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
                              <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                <img
                                  src={label.img_url}
                                  alt="Preview"
                                  style={{
                                    maxWidth: 200,
                                    borderRadius: '8px',
                                    display: 'block'
                                  }}
                                />
                              </Box>
                            ) : (
                              <UploadImageForm productIMG={productIMG} setProductIMG={setProductIMG} maxWidth={100} />
                            )}
                            { !label.is_ready && (
                              <SubmitButton fullWidth={true} className='btn-munsell' btnText='Load' />
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
    </Box>
  )
}

export default PickListDetails