import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Autocomplete, Box, Button, Collapse, IconButton, List, ListItem, ListItemText, Step, StepIconProps, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { HugeiconsIcon } from '@hugeicons/react';
import { createClient } from '@/utils/supabase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GlobalContext } from '@/utils/context/global_provider';
import { PickListContent, PickListInput, ProductContent, ShippingContent, ShippingInput } from '@/utils/interfaces';
import { ShippingCenterIcon, AddToListIcon, UploadSquare02Icon } from '@hugeicons/core-free-icons';
import { ColorlibStepIconRoot, QontoConnector } from '@/style/global';
import { toast } from 'react-toastify';
import { convertTimeByTimeZone, useFindUserByUUID } from '@/utils/functions/main';
import SubmitButton from '@/components/submit_button';
import CreateOrderForm from './create_order_form';
import PickListForm from './pick_list_form';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const stepsIcons = {
  1: <HugeiconsIcon icon={ShippingCenterIcon} />,
  2: <HugeiconsIcon icon={AddToListIcon} />,
  3: <HugeiconsIcon icon={UploadSquare02Icon} />,
}

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  const icons: { [index: string]: ReactElement } = stepsIcons;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}


const ShippingForm = ({ defaultData, setOpenModal }: { defaultData?: ShippingContent, setOpenModal?: (status: boolean) => void }) => {

  const supabase = createClient();
  const findUserByUUID = useFindUserByUUID();
  const { userAccount } = useContext(GlobalContext);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shippingOrder, setShippingOrder] = useState<ShippingContent>();
  const [orderPickList, setOrderPickList] = useState<PickListContent[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>([]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInput>({
    defaultValues: {
      ...defaultData
    }
  });

  const toggleItem = (index: number) => {
      setExpanded((prev) => {
          const updated = [...prev];
          updated[index] = !updated[index];
          return updated;
      });
  };

  const steps = ['Order Details', 'Pick Lists', 'Review'];
  const stepsContent = [
    <CreateOrderForm defaultData={defaultData} register={register} setValue={setValue} errors={errors} />,
    <PickListForm pickLists={orderPickList} setPickLists={setOrderPickList} />,
    <Box sx={{ flexGrow: 1, padding: 5, overflowY: 'auto', maxHeight: 500}}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Typography fontWeight='bold'>Carrier</Typography>
          <Typography>{ shippingOrder?.carrier }</Typography>
        </Grid>
        <Grid size={4}>
          <Typography fontWeight='bold'>Door #</Typography>
          <Typography>{ shippingOrder?.dock_door }</Typography>
        </Grid>
        <Grid size={4}>
          <Typography fontWeight='bold'>Trailer #</Typography>
          <Typography>{ shippingOrder?.trailer_number }</Typography>
        </Grid>
        <Grid size={4}>
          <Typography fontWeight='bold'>Assign To</Typography>
          <Typography>{ findUserByUUID(shippingOrder?.assign_to!) }</Typography>
        </Grid>
        <Grid size={4}>
          <Typography fontWeight='bold'>Total Pick Lists</Typography>
          <Typography>{ orderPickList.length }</Typography>
        </Grid>
        <Grid size={12}>
          <List>
            { orderPickList.map((pick, index) => (
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
            )) }
          </List>
        </Grid>
      </Grid>
    </Box>,
  ];

  const createShippingOrder: SubmitHandler<ShippingInput> = async (formData) => {
    try {
      setIsLoading(true);

      const { data: upsertOrder, error: orderError } = await supabase.from('shippings_orders').upsert({
        id: formData.id,
        carrier: formData.carrier,
        dock_door: formData.dock_door,
        trailer_number: formData.trailer_number,
        assign_to: formData.assign_to,
        ...(Object.keys(defaultData!).length === 0 && {
          status: 'Incomplete',
          closed_by: null,
          created_by: userAccount?.user_id,
          created_at: convertTimeByTimeZone(userAccount?.sessionTimeZone!),
        }),
      }, { onConflict: 'id' }).select().single();

      if (orderError) {
        throw new Error(orderError.message);
      }

      setShippingOrder(upsertOrder);
      setActiveStep(activeStep + 1);

    } catch (error: any) {
      toast.warning(error.message);
    }
    setIsLoading(false);
  }

  const validateOrderPicklist = async () => {
    try {
      setIsLoading(true);
      if (orderPickList.length == 0) {
        throw new Error('You need at least one pick list!');
      }

      for (var pickOrder of orderPickList) {
        const { data: newPick, error: pickError} = await supabase.from('shippings_pick_list').upsert({
          'id': pickOrder.id,
          'pl_number': pickOrder.pl_number,
          'bol_number': pickOrder.bol_number,
          'notes': pickOrder.notes,
          'shipping_order_id': shippingOrder?.id,
          'total_products': pickOrder.total_products,
          'created_by': userAccount?.user_id,
          'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
        }, { onConflict: 'id'}).select().single();

        if (pickError) {
          throw new Error(pickError.message);
        }

        await supabase.from('shippings_products').delete().eq('pick_list_id', newPick['id']);

        for (var product of pickOrder.shippings_products) {
          const newSPStatus = await supabase.from('shippings_products').insert({
            'pick_list_id': newPick['id'],
            'product_sku': product['sku'] || product['product_sku'],
            'product_quantity': product['quantity'] || 
            product['product_quantity'],
            'created_by': userAccount?.user_id,
            'created_at': convertTimeByTimeZone(userAccount?.sessionTimeZone!)
          });

          if (newSPStatus.error != null) {
            await supabase.from('shippings').delete().eq('id', newPick['id']);
            throw new Error(newSPStatus.error.message);
          }
        }
      }

      setActiveStep(activeStep + 1);

    } catch (error: any) {
      toast.warning(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const completeShippingOrder = async() => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from('shippings_orders').update({
        'status': 'Pending'
      }).eq('id', shippingOrder?.id);

      if (error) {
        throw new Error('Error creating order!');
      }

      setOpenModal!(false);
      toast.success('Shipping order created!');

    } catch (error: any) {
      toast.warning(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const stepsValidations: SubmitHandler<any>[] = [
    createShippingOrder,
    validateOrderPicklist,
    completeShippingOrder
  ];

  useEffect(() => {
    setExpanded(Array(orderPickList.length).fill(false));
  }, [orderPickList]);

  useEffect(() => {
    if (defaultData != undefined && Object.keys(defaultData).length > 0) {
      setOrderPickList(defaultData.shippings_pick_list || []);
    }
  }, [defaultData])

  return (
    <Box>
      <Stepper activeStep={activeStep} connector={<QontoConnector />} alternativeLabel >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel slots={{ stepIcon: ColorlibStepIcon }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(stepsValidations[activeStep])}>
        <Box sx={{ margin: '2rem auto' }}>
          {stepsContent[activeStep]}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', borderTop: '1px solid #aeaeae', padding: 1, background: '#eaeaea' }}>
          {activeStep > 0 && (
            <Button className='btn-gunmetal-dark' variant='contained' onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
          )}
          <SubmitButton
            type='submit'
            btnText={(activeStep + 1) == steps.length ? 'Complete' : 'Next'}
            isLoading={isLoading}
            className='btn-cyan-dark'
          />
        </Box>
      </form>
    </Box>
  )
}

export default ShippingForm