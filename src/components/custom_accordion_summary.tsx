import React from 'react'
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
      {
        transform: 'rotate(90deg)',
      },
    [`& .${accordionSummaryClasses.content}`]: {
      marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

  interface PanelsInterface {
    question: string;
    answer: string;
  }

const CustomAccordionSummary = ({ panels, openDefault = false } : { panels: PanelsInterface[], openDefault?: string | false }) => {

    const [expanded, setExpanded] = React.useState<string | false>(openDefault);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box>
        { panels.map((panle, index) => (
            <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography component="span">{ panle.question }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                { panle.answer }
                </Typography>
            </AccordionDetails>
            </Accordion>
        )) }
    </Box>
  )
}

export default CustomAccordionSummary
