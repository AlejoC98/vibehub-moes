'use client'
import { Avatar, Box, Button, Collapse, Fade, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { PickListContent, ProductContent, ShippingOrderProductInput } from '@/utils/interfaces';
import { NumberField } from '@/style/global';
import SubmitButton from '@/components/submit_button'
import { toast } from 'react-toastify';
// import { createClient } from '@/utils/supabase/client';
import { GlobalContext } from '@/utils/context/global_provider';
// import { convertTimeByTimeZone } from '@/utils/functions/main';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMaskInput } from 'react-imask';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import { createClient } from '@/utils/supabase/client';
import TransferList from '@/components/transfer_list';
import FileDropZone from '../upload_file_form';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { readExcelFile } from '@/utils/functions/main';

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

const requiredHeaders: { [key: string]: string } = {
    'Internal Number': 'pl_number',
    'Item No.': 'bol_number',
    'Picked Quantity': 'shippings_products'
};

const PickListForm = ({
    pickLists,
    setPickLists
}: {
    pickLists: PickListContent[],
    setPickLists: (pick: PickListContent[]) => void
}) => {

    const supabase = createClient();
    const { products, userAccount } = useContext(GlobalContext);

    const [pickList, setPickList] = useState<PickListContent>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orderProducts, setOrderProducts] = useState<ShippingOrderProductInput[]>([]);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [expanded, setExpanded] = useState<boolean[]>([]);
    const [displayForm, setDisplayForm] = useState(true);
    const [displayDropZone, setDisplayDropZone] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDisplayDropZone(true);
        setDisplayForm(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDisplayDropZone(true);
        setDisplayForm(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDisplayDropZone(false);
        setDisplayForm(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDisplayDropZone(false);
        setDisplayForm(true);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            console.log('Dropped files:', files);
            setExcelFile(files[0]);
            setDisplayDropZone(true);
            setDisplayForm(false);
            // Handle your files here
        }
    };

    const handleAddPickListToOrder = () => {
        try {
            setIsLoading(true);

            if (orderProducts.length <= 0) {
                throw new Error('You need to add products to create the record!');
            }

            if (pickList == undefined || Object.values(pickList!).includes('') || Object.values(pickList!).includes(undefined)) {
                throw new Error("We're missing some information");
            }

            const totalQuantity = orderProducts.reduce((sum, item) => sum + item.product_quantity!, 0);

            const updatedPickList = {
                ...pickList!,
                total_products: totalQuantity,
                shippings_products: orderProducts,
            };

            const existingIndex = pickLists.findIndex(p => p.pl_number === pickList!.pl_number);

            if (existingIndex !== -1) {
                const newPickLists = [...pickLists];
                newPickLists[existingIndex] = updatedPickList;
                setPickLists(newPickLists);
            } else {
                setPickLists([...pickLists, updatedPickList]);
            }

            setOrderProducts([]);
            setPickList(undefined);
            // setSelectedProduct(undefined);
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Error adding pick list.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleItem = (index: number) => {
        setExpanded((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const removePick = async (indexToRemove: number) => {

        await supabase.from('shippings_pick_list').delete().eq('id', pickLists[indexToRemove].id);

        setPickLists(pickLists.filter((_, index) => index !== indexToRemove));
        setExpanded((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const editPick = (indexToEdit: number) => {
        setPickList(pickLists[indexToEdit]);
        // setOrderProducts(pickLists[indexToEdit].shippings_products);
    }

    const toggleContentUX = () => {
        if (displayForm) {
            setDisplayForm(false);
            setTimeout(() => {
                setDisplayDropZone(true);
            }, 500);
        }

        if (displayDropZone) {
            setDisplayDropZone(false);
            setTimeout(() => {
                setDisplayForm(true);
            }, 500);
        }
    }

    const loadXSLXFile = async () => {
        try {
            const data = await readExcelFile(excelFile!);

            console.log(data);

            // if (data.length > 0) {
            //     const newPlS: PickListContent[] = [];
            //     for (var record of data) {
            //         const updatedPickList: any = {
            //             total_products: 0,
            //             shippings_products: [],
            //             pl_number: '',
            //             picked_by: '',
            //             verified_by: null,
            //             bol_number: ''
            //         }
            //         for (var header of Object.keys(requiredHeaders)) {
            //             updatedPickList[requiredHeaders[header]] = record[header];
            //         }
            //         newPlS.push(updatedPickList);
            //         toggleContentUX();
            //     }
            //     setPickLists([...pickLists, ...newPlS]);
            // }
        } catch (error: any) {
            console.log(error.message);
            toast.warning("Error loading file.");
        }
    }

    useEffect(() => {
        setExpanded(Array(pickLists.length).fill(false));
    }, [pickLists]);

    return (
        <Box
            sx={{ flexGrow: 1, padding: 5 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            height={500}
            overflow={'auto'}
        >

            <Fade in={displayDropZone} timeout={500} unmountOnExit>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 3,
                    height: '100%',
                }}>
                    <FileDropZone excelFile={excelFile} setExcelFile={setExcelFile} />
                    <Box display='flex' justifyContent='space-between' gap={5} maxWidth={300} margin={'0 auto'}>
                        <Button variant='contained' className='btn-gunmetal' onClick={toggleContentUX}>Cancel</Button>
                        <Button variant='contained' className='btn-munsell' onClick={loadXSLXFile}>Upload</Button>
                    </Box>
                </Box>
            </Fade>
            <Fade in={displayForm} timeout={500} unmountOnExit>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Box display='flex' justifyContent='end'>
                            <Button
                                variant="contained"
                                endIcon={<FileUploadIcon />}
                                onClick={toggleContentUX}
                            >
                                Upload Orders
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{ xl: 9, lg: 9, md: 12, sm: 12, xs: 12 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
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
                                </Box>
                            </Grid>
                            <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12, xs: 12}}>
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
                                <TransferList inventory={products!} orderProducts={orderProducts} setOrderProducts={setOrderProducts} />
                            </Grid>
                            <Grid size={12}>
                                <SubmitButton
                                    btnText='Add'
                                    type='button'
                                    fullWidth={true}
                                    variant='contained'
                                    isLoading={isLoading}
                                    className='btn-munsell'
                                    onClick={handleAddPickListToOrder}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12 }}>
                        <List sx={{ maxHeight: 450, overflowY: 'auto', padding: 0, '& .MuiBox-root': { margin: 0 } }}>
                            {pickLists.map((pick, index) => (
                                <Box key={index} sx={{ width: '100%', margin: '.5rem auto' }}>
                                    <ListItem
                                        sx={{ background: '#eaeaea', width: '100%', borderRadius: 1, marginBottom: 1 }}
                                        secondaryAction={
                                            <Box>
                                                <IconButton onClick={() => toggleItem(index)}>
                                                    {expanded[index] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <ListItemText primary={`PL # - ${pick.pl_number}`} secondary={pick.status || 'New'} />
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
            </Fade>
        </Box>
    )
}

export default PickListForm