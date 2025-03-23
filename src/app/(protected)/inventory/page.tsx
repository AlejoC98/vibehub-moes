'use client'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../style/global'
import BasicTable from '../../../../components/tables/basic_table'
import ProductsForm from '../../../../components/forms/products_form'
import { GridColDef } from '@mui/x-data-grid'
import RacksForm from '../../../../components/forms/racks_form'
import { useContext } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider'
import { ProductContent } from '../../../../utils/interfaces'

const Inventory = () => {
    const { products, racks } = useContext(GlobalContext);

    // const products:Array<ProductContent> = [];

    const productsColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID'},
        { field: 'name', headerName: 'Name'},
        // { field: 'quantity', headerName: 'Quantity', valueGetter: (params) => {
        //   return products?.reduce((total, product) => {
        //     return total + product.positions.reduce((positionTotal, position) => positionTotal + position.quantity, 0);
        //   }, 0);
        // }},
        { field: 'unit_price', headerName: 'Unit Price'},
        { field: 'total_price', headerName: 'Total Price'},
        { field: 'deleted', headerName: 'Status', renderCell: (params) => (
          <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
        )}
      ];
      
      const racksColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID'},
        // { field: 'sku', headerName: 'Sku'},
        { field: 'name', headerName: 'Name'},
        { field: 'columns', headerName: 'Columns'},
        { field: 'rows', headerName: 'Rows'},
        { field: 'deleted', headerName: 'Status', renderCell: (params) => (
          <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
        )}
      ];
  return (
    <Box>
    <Grid container spacing={2}>
      <Grid size={{ xs:12, sm:12, md:12, lg:6, xl:6, }}>
        <Block>
          <BasicTable title='Inventory' data={products || []} columns={productsColumns} createForm={<ProductsForm />} createFormTitle="New Item" />
        </Block>
      </Grid>
      <Grid size={{ xs:12, sm:12, md:12, lg:6, xl:6, }}>
        <Block>
        <BasicTable title='Rack Locations' data={racks || []} columns={racksColumns} createForm={racks?.length! > 0 ? <RacksForm /> : <RacksForm />} createFormTitle={"New Rack Section"} />
        </Block>
      </Grid>
    </Grid>
  </Box>
  )
}

export default Inventory
