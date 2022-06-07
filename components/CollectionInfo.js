import {Button, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export const CollectionInfo = (props) => {
    if(props.numTokens > 0){
        return (
            <Paper sx={{py: 5, px: 10}} elevation={3}>
                <Typography variant="h5" gutterBottom component="div">
                    {props.name}
                </Typography>
                <Typography variant="body1" gutterBottom component="div">
                    Collection Size: {props.numTokens}
                </Typography>
                <Typography variant="body1" gutterBottom component="div">
                    Unique Holders:
                    {
                        props.uniqueHolders === '' ?
                            <>
                                <Button color="info" variant="outlined" onClick={props.grabUnique}
                                        size="small" style={{marginLeft: 10}}
                                >View</Button>
                            </>
                            :
                            <>
                        {props.uniqueHolders}
                            </>
                    }
                </Typography>
                <Button color="info" variant="outlined" onClick={props.reset}
                        size="large" style={{marginTop: 20}} startIcon={<ArrowBackIcon />}>Go Back</Button>
            </Paper>
        )
    }
}