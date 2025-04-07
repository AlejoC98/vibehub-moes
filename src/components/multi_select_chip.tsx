import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import {
    Box,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Chip,
    SelectChangeEvent,
    SelectProps,
} from '@mui/material';

interface CustomSelectMultiChipProps extends Omit<SelectProps<number[]>, 'value' | 'onChange'> {
    options: any[];
    value: number[];
    onChange: (value: number[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(id: number, selectedIds: readonly number[], theme: Theme) {
    return {
        fontWeight: selectedIds.includes(id)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function MultipleSelectChip({
    options,
    value,
    onChange,
    ...rest }: CustomSelectMultiChipProps) {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<number[]>) => {
        const {
            target: { value },
        } = event;
        const selected = typeof value === 'string' ? value.split(',').map(Number) : value;
        onChange(selected);
    };

    const getNameById = (id: number) => options.find(n => n.id === id)?.name || id;

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">Select Names</InputLabel>
            <Select
                {...rest}
                multiple
                value={value}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Select Names" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                            const found = options.find((opt) => opt.id === id);
                            return found ? <Chip key={id} label={found.name} /> : null;
                        })}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {options.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        style={getStyles(item.id, value, theme)}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
