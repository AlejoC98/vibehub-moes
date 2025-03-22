import { Box, Skeleton, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Box>
            <Skeleton variant="rounded" width={'100%'} height={60} />
        </Box>
    )
}