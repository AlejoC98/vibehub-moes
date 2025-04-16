'use client'
import { Avatar, Box, Button, Collapse, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { PickListContent, ProductContent } from '@/utils/interfaces';
import { NumberField } from '@/style/global';
import SubmitButton from '@/components/submit_button'
import { toast } from 'react-toastify';
// import { createClient } from '@/utils/supabase/client';
import { GlobalContext } from '@/utils/context/global_provider';
// import { convertTimeByTimeZone } from '@/utils/functions/main';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMaskInput } from 'react-imask';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

interface OrderProductInput extends ProductContent {
    quantity?: number,
}

interface CustomMaskProps {
    name: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
}

const MaskedInput = forwardRef<HTMLInputElement, CustomMaskProps>(
    function MaskedInput(props, ref) {
        const { onChange, ...other } = props;

        return (
            <IMaskInput
                {...other}
                mask="MOES00000000"
                placeholderChar=' '
                definitions={{
                    a: /[a-zA-Z]/,
                }}
                overwrite
                lazy={false}
                inputRef={ref}
                prepare={(str) => str.toUpperCase()}
                onAccept={(value: any) =>
                    onChange({ target: { name: props.name, value } })
                }
            />
        );
    }
);

const PickListForm = ({
    pickLists,
    setPickLists
}: {
    pickLists: PickListContent[],
    setPickLists: (pick: PickListContent[]) => void
}) => {

    const { products, users, userAccount } = useContext(GlobalContext);

    const [keyword, setKeyWord] = useState<string>('');
    const [pickList, setPickList] = useState<PickListContent>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCustomProduct, setIsCustomProduct] = useState<boolean>(false);
    const [orderProducts, setOrderProducts] = useState<OrderProductInput[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<OrderProductInput>();
    const [customProduct, setCustomProduct] = useState<OrderProductInput>();
    const [displayData, setDisplayData] = useState<OrderProductInput[]>(products!);
    const [selectedProductQuantity, setSelectedProductQuantity] = useState<number>();
    const [expanded, setExpanded] = useState<boolean[]>([]);

    const handleAddPickListToOrder = () => {
        try {
          setIsLoading(true);
      
          if (orderProducts.length <= 0) {
            throw new Error('You need to add products to create the record!');
          }
          
          if (pickList == undefined || Object.values(pickList!).includes('') || Object.values(pickList!).includes(undefined)) {
            throw new Error("We're missing some information");
          }
      
          const totalQuantity = orderProducts.reduce((sum, item) => sum + item.quantity!, 0);
      
          const updatedPickList = {
            ...pickList!,
            total_products: totalQuantity,
            shippings_products: orderProducts,
          };
      
          const existingIndex = pickLists.findIndex(p => p.pl_number === pickList!.pl_number);
      
          if (existingIndex !== -1) {
            // Update existing
            const newPickLists = [...pickLists];
            newPickLists[existingIndex] = updatedPickList;
            setPickLists(newPickLists);
          } else {
            // Add new
            setPickLists([...pickLists, updatedPickList]);
          }
      
          setOrderProducts([]);
          setPickList(undefined);
          setSelectedProduct(undefined);
        } catch (error: any) {
          toast.warning(error.message);
        } finally {
          setIsLoading(false);
        }
      };      

    const handleSearch = () => {
        if (keyword == '' || keyword == null) {
            setDisplayData(products!);
        } else {
            const matches = products?.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(keyword.toLowerCase())
                )
            );

            setDisplayData(matches || []);
        }
    }

    const handleCleanSearch = () => {
        setKeyWord('');
        setDisplayData([]);
    }

    const handleAddProductToOrder = (product: OrderProductInput, quantity: number) => {
        if (quantity == undefined || quantity <= 0) {
          toast.warning('Set a quantity!');
          return;
        }
      
        const alreadyExists = orderProducts.some(p => p.sku === product.sku);
        if (alreadyExists) {
          toast.warning('This product is already in the order!');
          return;
        }
      
        setOrderProducts([...orderProducts, { ...product, quantity }]);
        setSelectedProductQuantity(undefined);
    };      

    const handleAddCustomProductToOrder = () => {
        if (customProduct?.quantity == undefined || customProduct.quantity <= 0) {
          toast.warning('Set a quantity!');
          return;
        }
      
        const alreadyExists = orderProducts.some(p => p.sku === customProduct.sku);
        if (alreadyExists) {
          toast.warning('This product is already in the order!');
          return;
        }
      
        setOrderProducts([
          ...orderProducts,
          {
            sku: customProduct.sku,
            quantity: customProduct.quantity,
            created_at: new Date().toDateString(),
            created_by: userAccount?.user_id!,
          },
        ]);
      
        setIsCustomProduct(false);
        setCustomProduct(undefined);
        setSelectedProductQuantity(undefined);
      };
      

    const handleRemoveProduct = (skuToRemove: string) => {
        setOrderProducts(orderProducts.filter(product => product.sku !== skuToRemove));
    };

    const toggleItem = (index: number) => {
        setExpanded((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const removePick = (indexToRemove: number) => {
        setPickLists(pickLists.filter((_, index) => index !== indexToRemove));
        setExpanded((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const editPick = (indexToEdit: number) => {
        setPickList(pickLists[indexToEdit]);
        setOrderProducts(pickLists[indexToEdit].shippings_products);
    }

    useEffect(() => {
        setExpanded(Array(pickLists.length).fill(false));
    }, [pickLists]);

    return (
        <Box sx={{ flexGrow: 1, padding: 5 }}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Grid container spacing={3}>
                        <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                            <NumberField
                                fullWidth
                                label="PL Number"
                                type='number'
                                value={pickList?.pl_number || ''}
                                onChange={(e) => setPickList((prev) => ({
                                    ...prev!,
                                    pl_number: parseInt(e.target.value),
                                }))}
                            />
                        </Grid>
                        <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                            <TextField
                                fullWidth
                                label="BOL Number"
                                variant="outlined"
                                value={pickList?.bol_number || ''}
                                onChange={(e) => setPickList((prev) => ({
                                    ...prev!,
                                    bol_number: e.target.value,
                                }))}
                                slotProps={{
                                    input: {
                                        inputComponent: MaskedInput as any,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label='Notes'
                                value={pickList?.notes || ''}
                                onChange={
                                    (e) => setPickList((prev) => ({
                                        ...prev!,
                                        notes: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid size={12}>
                            <Grid container spacing={2}>
                                <Grid size={10}>
                                    <TextField
                                        fullWidth
                                        placeholder='Search...'
                                        disabled={isCustomProduct}
                                        value={keyword}
                                        onChange={(e) => {
                                            setKeyWord(e.target.value);
                                            handleSearch();
                                        }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position='start' className="text-white">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            disabled={isCustomProduct}
                                                            onClick={handleCleanSearch}
                                                        >
                                                            <CloseIcon fontSize='small' />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                                        <IconButton className='btn-bittersweet' onClick={() => setIsCustomProduct(!isCustomProduct)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                {isCustomProduct && (
                                    <Grid size={12}>
                                        <Box sx={{ margin: '0 auto', maxWidth: 400 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={12}>
                                                    <TextField
                                                        fullWidth
                                                        label='Sku'
                                                        defaultValue={customProduct?.sku}
                                                        onChange={(e) => {
                                                            setCustomProduct((prev) => ({
                                                                ...prev!,
                                                                sku: e.target.value,
                                                            }));
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={12}>
                                                    <NumberField
                                                        fullWidth
                                                        label='Quantity'
                                                        defaultValue={customProduct?.quantity}
                                                        onChange={(e) => {
                                                            setCustomProduct((prev) => ({
                                                                ...prev!,
                                                                quantity: parseInt(e.target.value),
                                                            }));
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ display: 'grid', placeItems: 'center' }}>
                                                        <Button
                                                            variant='contained'
                                                            className='btn-munsell'
                                                            onClick={handleAddCustomProductToOrder}>Create</Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                )}

                                {!isCustomProduct && (
                                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                            {displayData?.map((pro, index) => {
                                                if (!orderProducts?.find(op => op.id == pro.id)) {
                                                    return <Box key={index}>
                                                        <ListItem secondaryAction={
                                                            selectedProduct == pro && (
                                                                <IconButton edge="end" aria-label="add" size='small' className='bg-cyan-dark' onClick={() => handleAddProductToOrder(pro, selectedProductQuantity!)}>
                                                                    <AddIcon fontSize='small' />
                                                                </IconButton>
                                                            )
                                                        }>
                                                            <ListItemAvatar>
                                                                <Avatar src={pro.img_url} />
                                                            </ListItemAvatar>
                                                            <ListItemButton
                                                                sx={{ width: '100%' }}
                                                                selected={pro == selectedProduct}
                                                                onClick={() => setSelectedProduct(pro != selectedProduct ? pro : undefined)}
                                                            >
                                                                <ListItemText primary={`${pro.name} - ${pro.sku}`} secondary={pro.item} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                        <Collapse
                                                            timeout="auto"
                                                            unmountOnExit
                                                            in={pro == selectedProduct}
                                                        >
                                                            <ListItem>
                                                                <NumberField
                                                                    fullWidth
                                                                    defaultValue={selectedProductQuantity}
                                                                    onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value))}
                                                                    size='small'
                                                                    type='number'
                                                                    label='Quantity'
                                                                />
                                                            </ListItem>
                                                        </Collapse>
                                                    </Box>
                                                }
                                            })}
                                        </List>
                                    </Grid>
                                )}
                                {!isCustomProduct && (
                                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <List sx={{ maxHeight: 300, overflowY: 'auto'}}>
                                            {orderProducts?.map((pro, index) => (
                                                <ListItem key={index} secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveProduct(pro.sku!)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }>
                                                    <ListItemAvatar>
                                                        <Avatar src={pro.img_url} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${pro.name || ''} - ${pro.sku}`} secondary={`${pro.item || ''} - Qty ${pro.quantity}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid size={12} sx={{ display: 'grid', placeItems: 'center' }}>
                            {!isCustomProduct && (
                                <SubmitButton
                                    btnText='Add'
                                    type='button'
                                    fullWidth={false}
                                    variant='contained'
                                    isLoading={isLoading}
                                    className='btn-munsell'
                                    onClick={handleAddPickListToOrder}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={4}>
                    <Typography>Pick Lists</Typography>
                    <List>
                        {pickLists.map((pick, index) => (
                            <Box key={index} sx={{ width: '100%', margin: '.5rem auto' }}>
                                <ListItem
                                    sx={{ background: '#eaeaea', width: '100%', borderRadius: 1 }}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => toggleItem(index)}>
                                                {expanded[index] ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText primary={`PL # - ${pick.pl_number}`} />
                                </ListItem>

                                <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                                    <Box sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            {expanded[index] && (
                                                <Grid size={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                                                    <IconButton onClick={() => removePick(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => editPick(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Grid>
                                            )}
                                            <Grid size={12}>
                                                <Typography fontWeight='bold'>BOL #</Typography>
                                                <Typography>{pick.bol_number}</Typography>
                                            </Grid>
                                            <Grid size={12}>
                                                <Typography fontWeight='bold'>Total products</Typography>
                                                <Typography>{pick.total_products}</Typography>
                                            </Grid>
                                            <Grid size={12}>
                                                <Typography fontWeight='bold'>Notes</Typography>
                                                <Typography>{pick.notes}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Collapse>
                            </Box>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PickListForm
