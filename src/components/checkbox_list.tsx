'use client';
import React, { useState } from 'react';
import { Avatar, Box, Checkbox, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const CheckboxList = ({ data }: { data: any[] }) => {

    const [checked, setChecked] = useState([0]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <Box>
            <List>
                {data.map((item, index) => (
                    <ListItemButton
                        key={index}
                        selected={checked.includes(index)}
                        onClick={handleToggle(index)}
                        dense
                    >
                        <ListItemAvatar>
                            <Avatar src={item.img_url} />
                        </ListItemAvatar>
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default CheckboxList
