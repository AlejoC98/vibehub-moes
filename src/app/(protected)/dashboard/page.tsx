'use client'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import SideBar from '../../../../components/layout/sidebar'
import Navbar from '../../../../components/layout/navbar'

const Dashboard = () => {

const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <Box sx={{ display: 'flex'}}>
        <SideBar open={openMenu} setOpen={setOpenMenu} />
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100vh'}}>
            <Navbar open={openMenu} setOpen={setOpenMenu} />
            <Box sx={{height: '100%', padding: '10px 25px'}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nam corporis, accusamus accusantium eaque possimus ratione voluptates cupiditate alias. Alias cupiditate tempora, ipsum culpa animi quo saepe! Nisi veniam reprehenderit at? Maxime et aspernatur corporis facilis beatae aperiam harum pariatur quaerat quam autem, iure architecto cupiditate esse excepturi reprehenderit rerum nam ea, quos aut eos labore. Velit, quam recusandae illum molestiae soluta in vero ullam explicabo amet accusamus itaque aspernatur ea dicta alias. Cupiditate commodi in facere dolorum cumque impedit! Vitae necessitatibus delectus reiciendis, molestiae temporibus quidem nobis. Similique vitae unde doloribus aliquid quidem minima eligendi quasi ut iste excepturi error dignissimos dolorum impedit vero quo facere dolores recusandae, voluptates cumque laudantium optio ipsam non? Sint, possimus. Qui optio fugiat odio porro itaque adipisci cumque. Eveniet quasi ea, illum accusantium fugiat, aspernatur eligendi esse aut velit, ex deleniti! Illum saepe laudantium explicabo laboriosam impedit? Quidem ducimus sed nemo fugit laborum rem, odio laboriosam, sequi optio necessitatibus voluptas et quibusdam ipsum illo. Nostrum, delectus itaque. Voluptates iusto repellat deleniti nulla repudiandae, ipsa saepe sit quasi eius sapiente beatae cum necessitatibus, quisquam voluptas minima magnam magni minus explicabo cupiditate. Veritatis nemo magni obcaecati eligendi veniam repellendus harum rem consequuntur ad beatae! Eius!
            </Box>
        </Box>
    </Box>
  )
}

export default Dashboard
