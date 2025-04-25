import { GlobalContext } from '@/utils/context/global_provider';
import { UpdateReportContent } from '@/utils/interfaces';
import { List, ListItem } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'

const UpdatesReportsList = () => {

    const { updateReports } = useContext(GlobalContext);

  return (
    <List>
        { updateReports?.map((report) => (
            <ListItem key={report.id}>{report.title}</ListItem>
        ))}
    </List>
  )
}

export default UpdatesReportsList
