'use client'
import React, { useContext, useEffect, useState } from 'react'
import { calculateRevenue } from '@/utils/functions/main'
import { GlobalContext } from '@/utils/context/global_provider'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import GroupsIcon from '@mui/icons-material/Groups';
import Metrics from '@/components/dashboard/metrics';
import DiscountIcon from '@mui/icons-material/Discount';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { NumericFormat } from 'react-number-format'
import Block from '@/components/block'
import LineChartComponent from '@/components/charts/line-chart'
import { format } from 'date-fns-tz'

const Dashboard = () => {
  const { products, orders, shippings, users, setIsLaunching } = useContext(GlobalContext);
  const [revenue, setRevenue] = useState<number | string>();
  const [chartShippingData, setChartShippingData] = useState<{ month: string; shipped: number }[]>([]);


  useEffect(() => {
    const total = calculateRevenue(orders!);

    if (total) {
      setRevenue(total);
    }
  }, [orders])

  useEffect(() => {

    const shippingData = shippings?.filter(s => s.status == 'Shipped');
    const monthlyTotals: { month: string; shipped: number }[] = [];

    const orderedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get current month index (0-based, so April = 3)
    const currentMonthIndex = new Date().getMonth();

    // Slice months up to current month (inclusive)
    const visibleMonths = orderedMonths.slice(0, currentMonthIndex + 1);

    visibleMonths.forEach(month => {
      const monthOrders = shippingData?.filter(s => {
        const date = new Date(s.closed_at!);
        return format(date, 'MMM') === month;
      });

      monthlyTotals.push({ month: month, shipped: monthOrders!.length });
    });

    setChartShippingData(monthlyTotals);

  }, [shippings]);

  useEffect(() => {
    setIsLaunching(false);
  }, [])

  return (
    <Box>
      <Grid container spacing={7}>
        <Grid size={{ xl: 4, lg: 4, md: 6, sm: 12, xs: 12 }}>
          <Metrics
            color='#FFFFFF'
            title='Products Available'
            icon={
              <DiscountIcon sx={{ fontSize: '5rem', color: 'rgba(225, 225, 225, .8)', position: 'absolute', top: 20, right: 10 }} />
            }
            content={products?.length}
            footer="Subio"
            inAnimationDelay={'1.5s'}
          />
        </Grid>
        <Grid size={{ xl: 4, lg: 4, md: 6, sm: 12, xs: 12 }}>
          <Metrics
            color='#FFFFFF'
            title='Orders Shipped'
            icon={
              <LocalShippingIcon sx={{ fontSize: '5rem', color: 'rgba(225, 225, 225, .8)', position: 'absolute', top: 20, right: 10 }} />
            }
            content={shippings?.filter(s => s.status == 'Shipped').length}
            footer="Last month"
            inAnimationDelay={'1.8s'}
          />
        </Grid>
        <Grid size={{ xl: 4, lg: 4, md: 6, sm: 12, xs: 12 }}>
          <Metrics
            color='#FFFFFF'
            title='Active Users'
            icon={
              <GroupsIcon sx={{ fontSize: '5rem', color: 'rgba(225, 225, 225, .8)', position: 'absolute', top: 20, right: 10 }} />
            }
            content={users?.length}
            footer="Last month"
            inAnimationDelay={'2.1s'}
          />
        </Grid>
        <Grid size={12}>
          <Block>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant='h5' fontWeight='bold'>Shipped Products</Typography>
            </Box>
            <LineChartComponent data={chartShippingData} />
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
