import { ProductContent, ShippingContent, ShippingOrderProductContent, ShippingOrderProductInput } from '@/utils/interfaces'
import { Avatar, Box, Button, Fade, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import RemoveIcon from '@mui/icons-material/Remove';
import { NumberField } from '@/style/global';
import { GlobalContext } from '@/utils/context/global_provider';
import Grid from '@mui/material/Grid2';


const TransferList = ({ inventory, orderProducts, setOrderProducts } :
  { inventory: ProductContent[], orderProducts: ShippingOrderProductInput[], setOrderProducts: (product: ShippingOrderProductInput[]) => void }) => {

    const { userAccount } = useContext(GlobalContext);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [right, setRight] = useState<ShippingOrderProductInput[]>(orderProducts);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [displayList, setDisplayList] = useState<boolean>(true);
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  // New Item Fields
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>();

  const toggleContentUX = () => {
    if (displayList) {
      setDisplayList(false);
      setTimeout(() => {
        setDisplayForm(true);
      }, 500);
    }
    if (displayForm) {
      setDisplayForm(false);
      setTimeout(() => {
        setDisplayList(true);
      }, 500);
    }
  }

  const handleTransfer = () => {
    // if (!selectedId) return;

    // const sourceItem = inventory.find(item => item.id === selectedId);
    // if (!sourceItem) return;
    // if (transferAmount <= 0 || transferAmount > sourceItem.quantity) {
    //   alert('Invalid transfer amount.');
    //   return;
    // }

    // // Update Left
    // const updatedLeft = inventory.map(item =>
    //   item.id === selectedId ? { ...item, amount: item.quantity - transferAmount } : item
    // ).filter(item => item.quantity > 0);

    // // Update Right
    // const existingInRight = right.find(item => item.id === selectedId);
    // let updatedRight: ShippingOrderProductContent[];

    // if (existingInRight) {
    //   updatedRight = right.map(item =>
    //     item.id === selectedId
    //       ? {
    //           ...item,
    //           product_quantity: item.product_quantity + transferAmount,
    //           created_at: new Date().toISOString(),
    //           created_by: userAccount?.user_id
    //         }
    //       : item
    //   );
    // } else {
    //   const newProduct: ShippingOrderProductContent = {
    //     id: sourceItem.id,
    //     product_item: sourceItem.product_item,
    //     product_quantity: transferAmount,
    //     is_ready: sourceItem.is_ready ?? false,
    //     shipping_order_id: sourceItem.shipping_order_id ?? 0,
    //     serial_number: sourceItem.serial_number ?? '',
    //     img_url: sourceItem.img_url ?? '',
    //     created_at: convertTimeByTimeZone(userAccount?.sessionTimeZone!),
    //     created_by: userAccount?.user_id ?? 'system'
    //   };
    
    //   updatedRight = [...right, newProduct];
    // }

    // setOrderProducts(updatedRight);
    // setRight(updatedRight);
    // setSelectedId(null);
    // setTransferAmount(0);
  };

  const skuExists = (sku: string): boolean => {
    return right.some(item => item.product_item.toLowerCase() === sku.toLowerCase());
  };

  const handleAddNewItem = () => {
    const trimmedSku = newItemName.trim();
  
    if (!trimmedSku || newItemAmount! <= 0) {
      toast.warning('Please enter valid item name and amount.');
      return;
    }
  
    if (skuExists(trimmedSku)) {
      toast.warning('A product with this SKU already exists.');
      return;
    }
  
    const newItem: ShippingOrderProductInput = {
      is_ready: false,
      product_quantity: newItemAmount!,
      product_item: trimmedSku,
      shipping_order_id: 0,
    };
  
    setOrderProducts([...right, newItem]);
    setRight(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemAmount(0);
  };

  useEffect(() => {
    setRight(orderProducts);
  }, [orderProducts]);

  return (
    <Grid
  container
  spacing={4}
  alignItems="flex-start"
  justifyContent="center"
  sx={{ padding: '1rem 0' }}
>
  {/* Left Panel */}
  <Grid size={{ md: 6, xs:12 }}>
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Available Items
        </Typography>
        <IconButton onClick={toggleContentUX}>
          {displayList ? <AddIcon /> : <RemoveIcon />}
        </IconButton>
      </Box>

      <Fade in={displayList} timeout={500} unmountOnExit>
        <Box width="100%">
          <List sx={{ height: 200, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 2 }}>
            {inventory.map(item => (
              <ListItemButton
                key={item.id}
                component="button"
                selected={selectedId === item.id}
                onClick={() => setSelectedId(item.id!)}
                disabled={item.quantity == 0}
                sx={{ textAlign: 'left' }}
              >
                <ListItemAvatar>
                  <Avatar src={item.img_url} />
                </ListItemAvatar>
                <ListItemText primary={`${item.name} (${item.quantity})`} />
              </ListItemButton>
            ))}
          </List>

          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              label="Amount to Transfer"
              type="number"
              size="small"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              disabled={!selectedId}
            />
            <Button
              variant="contained"
              onClick={handleTransfer}
              disabled={!selectedId || transferAmount <= 0}
            >
              Transfer →
            </Button>
          </Stack>
        </Box>
      </Fade>

      <Fade in={displayForm} timeout={500} unmountOnExit>
        <Box mt={4} display="flex" flexDirection="column" gap={2} width="100%">
          <Typography variant="subtitle1">Add New Item</Typography>
          <TextField
            label="Item Name"
            size="small"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <NumberField
            label="Initial Amount"
            type="number"
            size="small"
            value={newItemAmount || ''}
            onChange={(e) => setNewItemAmount(Number(e.target.value))}
          />
          <Button variant="outlined" onClick={handleAddNewItem}>
            Add Item
          </Button>
        </Box>
      </Fade>
    </Box>
  </Grid>

  {/* Right Panel */}
  <Grid size={{ md: 6, xs:12 }}>
    <Box width="100%">
      <Typography variant="h6" gutterBottom>
        Transferred Items
      </Typography>
      <List sx={{ height: 200, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 2 }}>
        {right.map((item: any, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar src="/static/img/default_product.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={`${item.name || item.product_item} (${item.amount || item.product_quantity})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </Grid>
</Grid>

  )
}

export default TransferList
