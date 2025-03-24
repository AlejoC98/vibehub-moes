'use client'
import { AppBar, Box, InputBase, Paper, TextField, alpha, styled } from "@mui/material";

export const WhiteTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#ffffff !important',
    },
    '& label': {
        color: '#ffffff',
    },
    '&:hover label': {
        color: '#AEAEAE',
    },
    '& .MuiOutlinedInput-root': {
        color: '#ffffff',
        '& fieldset': {
            borderColor: 'white'
        },
        '&:hover fieldset': {
            borderColor: '#AEAEAE'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ffffff'
        }
    },
});

export const VibeNavbar = styled(AppBar)({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: '#000000',
    height: '5rem',
    display: 'flex',
    justifyContent: 'center'
});

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    paddingRight: 5,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '40ch',
        // [theme.breakpoints.up('md')]: {
        //     width: '20ch',
        //     '&:focus': {
        //         width: '40ch',
        //     },
        // },
    },
}));

export const NumberField = styled(TextField)({
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
  });

export const Block = styled(Box)(({ theme }) => ({
    background: '#F4F4F4',
    padding: theme.spacing(2),
    ...theme.typography.body1,
    borderRadius: 10,
    boxShadow: '5px 10px 10px 0px rgba(0,0,0,0.35)',
    height: '100%',
}));

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));