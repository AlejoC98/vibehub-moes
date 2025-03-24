'use client'
import { Box, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Block } from '../../../../style/global'
import BasicTable from '../../../../components/tables/basic_table'
import ProductsForm from '../../../../components/forms/products_form'
import { GridColDef } from '@mui/x-data-grid'
import RacksForm from '../../../../components/forms/racks_form'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../../utils/context/global_provider'
import { ProductContent, RackLocationContent } from '../../../../utils/interfaces'

const Inventory = () => {
    const { products, racks } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [locationData, setLocationData] = useState<RackLocationContent[]>([]);

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
        { field: 'sku', headerName: 'Sku'},
        { field: 'name', headerName: 'Name'},
        { field: 'products', headerName: 'Product', renderCell: (params) => {
          return params.row.racks_locations_products.length > 0 ? params.row.racks_locations_products[0].products.name : 'Empty';
        }},
        { field: 'quantity', headerName: 'Quantity', renderCell: (params) => {
          return params.row.racks_locations_products.length > 0 ? params.row.racks_locations_products[0].quantity : 0;
        }},
        // { field: 'columns', headerName: 'Columns'},
        // { field: 'rows', headerName: 'Rows'},
        // { field: 'deleted', headerName: 'Status', renderCell: (params) => (
        //   <Box className={`${params.row.deleted ? 'bg-red-800' : 'bg-green-800'} text-white px-2 py-1 rounded-lg`}>{params.row.deleted ? 'Inactive' : 'Active'}</Box>
        // )}
      ];

      const organizeLocationData = async () => {
        setLocationData(racks?.flatMap(r => r.racks_locations)!);
        setIsLoading(false);
      }


      useEffect(() => {
        organizeLocationData();
      }, [])
  return (
    <Box>
      { isLoading ? (
        <Skeleton></Skeleton>
      ) : (
        <Grid container spacing={10}>
        <Grid size={{ xs:12, sm:12, md:12, lg:6, xl:6, }}>
          <Block>
            <BasicTable title='Inventory' data={products || []} columns={productsColumns} createForm={<ProductsForm />} createFormTitle="New Item" />
          </Block>
        </Grid>
        <Grid size={{ xs:12, sm:12, md:12, lg:6, xl:6, }}>
          <Block>
          <BasicTable title='Rack Locations' data={locationData || []} columns={racksColumns} createForm={racks?.length! > 0 ? <RacksForm /> : <RacksForm />} createFormTitle={"New Rack Section"} />
          </Block>
        </Grid>
      </Grid>
      )}
  </Box>
  )
}

export default Inventory
