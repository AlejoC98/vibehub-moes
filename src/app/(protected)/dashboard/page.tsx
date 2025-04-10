'use client'
import React, { useContext, useEffect, useState } from 'react'
import { calculateRevenue } from '@/utils/functions/main'
import { GlobalContext } from '@/utils/context/global_provider'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2';
import Metrics from '@/components/dashboard/metrics';
import DiscountIcon from '@mui/icons-material/Discount';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { NumericFormat } from 'react-number-format'

const Dashboard = () => {
const { products, orders, shippings, setIsLaunching } = useContext(GlobalContext);
  const [revenue, setRevenue] = useState<number | string>();

  const data = [
    {
      "country": "AD",
      "hot dog": 8,
      "hot dogColor": "hsl(355, 70%, 50%)",
      "burger": 107,
      "burgerColor": "hsl(345, 70%, 50%)",
      "sandwich": 159,
      "sandwichColor": "hsl(235, 70%, 50%)",
      "kebab": 173,
      "kebabColor": "hsl(308, 70%, 50%)",
      "fries": 99,
      "friesColor": "hsl(211, 70%, 50%)",
      "donut": 20,
      "donutColor": "hsl(91, 70%, 50%)"
    },
    {
      "country": "AE",
      "hot dog": 54,
      "hot dogColor": "hsl(155, 70%, 50%)",
      "burger": 8,
      "burgerColor": "hsl(220, 70%, 50%)",
      "sandwich": 65,
      "sandwichColor": "hsl(342, 70%, 50%)",
      "kebab": 4,
      "kebabColor": "hsl(133, 70%, 50%)",
      "fries": 28,
      "friesColor": "hsl(144, 70%, 50%)",
      "donut": 96,
      "donutColor": "hsl(13, 70%, 50%)"
    },
    {
      "country": "AF",
      "hot dog": 21,
      "hot dogColor": "hsl(309, 70%, 50%)",
      "burger": 76,
      "burgerColor": "hsl(128, 70%, 50%)",
      "sandwich": 128,
      "sandwichColor": "hsl(48, 70%, 50%)",
      "kebab": 129,
      "kebabColor": "hsl(303, 70%, 50%)",
      "fries": 151,
      "friesColor": "hsl(246, 70%, 50%)",
      "donut": 11,
      "donutColor": "hsl(71, 70%, 50%)"
    },
    {
      "country": "AG",
      "hot dog": 186,
      "hot dogColor": "hsl(56, 70%, 50%)",
      "burger": 12,
      "burgerColor": "hsl(148, 70%, 50%)",
      "sandwich": 107,
      "sandwichColor": "hsl(191, 70%, 50%)",
      "kebab": 28,
      "kebabColor": "hsl(255, 70%, 50%)",
      "fries": 44,
      "friesColor": "hsl(156, 70%, 50%)",
      "donut": 173,
      "donutColor": "hsl(352, 70%, 50%)"
    },
    {
      "country": "AI",
      "hot dog": 189,
      "hot dogColor": "hsl(184, 70%, 50%)",
      "burger": 89,
      "burgerColor": "hsl(253, 70%, 50%)",
      "sandwich": 145,
      "sandwichColor": "hsl(359, 70%, 50%)",
      "kebab": 18,
      "kebabColor": "hsl(91, 70%, 50%)",
      "fries": 91,
      "friesColor": "hsl(227, 70%, 50%)",
      "donut": 69,
      "donutColor": "hsl(357, 70%, 50%)"
    },
    {
      "country": "AL",
      "hot dog": 80,
      "hot dogColor": "hsl(321, 70%, 50%)",
      "burger": 70,
      "burgerColor": "hsl(189, 70%, 50%)",
      "sandwich": 36,
      "sandwichColor": "hsl(197, 70%, 50%)",
      "kebab": 128,
      "kebabColor": "hsl(88, 70%, 50%)",
      "fries": 185,
      "friesColor": "hsl(221, 70%, 50%)",
      "donut": 119,
      "donutColor": "hsl(176, 70%, 50%)"
    },
    {
      "country": "AM",
      "hot dog": 177,
      "hot dogColor": "hsl(280, 70%, 50%)",
      "burger": 177,
      "burgerColor": "hsl(326, 70%, 50%)",
      "sandwich": 75,
      "sandwichColor": "hsl(170, 70%, 50%)",
      "kebab": 186,
      "kebabColor": "hsl(140, 70%, 50%)",
      "fries": 195,
      "friesColor": "hsl(284, 70%, 50%)",
      "donut": 126,
      "donutColor": "hsl(51, 70%, 50%)"
    }
  ];

  useEffect(() => {
    const total = calculateRevenue(orders!);

    if (total) {
      setRevenue(total);
    }
  }, [orders])

  useEffect(() => {
    setIsLaunching(false);
  }, [])

  return (
    <Box>
      <Grid container spacing={7}>
        <Grid size={{ xl:3 ,lg: 3, md:6, sm:12, xs: 12}}>
        <Metrics
            color='#60992D'
            title='Products Available'
            icon={
              <DiscountIcon sx={{ fontSize: '5rem', color: 'rgba(255, 255, 255, .5)', position: 'absolute', top: 20, right: 10}} />
            }
            content={'N/A'}
            footer="Subio"
          />
        </Grid>
        <Grid size={{ xl:3 ,lg: 3, md:6, sm:12, xs: 12}}>
        <Metrics
            color='#F07167'
            title='Orders Shipped'
            icon={
              <LocalShippingIcon sx={{ fontSize: '5rem', color: 'rgba(255, 255, 255, .5)', position: 'absolute', top: 20, right: 10}} />
            }
            content={shippings?.length}
            footer="Last month"
          />
        </Grid>
        <Grid size={{ xl:3 ,lg: 3, md:6, sm:12, xs: 12}}>
        <Metrics
            color='#0892A5'
            title='Returns'
            icon={
              <AssignmentReturnIcon sx={{ fontSize: '5rem', color: 'rgba(255, 255, 255, .5)', position: 'absolute', top: 20, right: 10}} />
            }
            content={'N/A'}
            footer="Last month"
          />
        </Grid>
        <Grid size={{ xl:3 ,lg: 3, md:6, sm:12, xs: 12}}>
        <Metrics
            color='#373F47'
            title='Month Revenue'
            icon={
              <AttachMoneyIcon sx={{ fontSize: '5rem', color: 'rgba(255, 255, 255, .5)', position: 'absolute', top: 20, right: 10}} />
            }
            content={'N/A'}
            footer="Last month"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
