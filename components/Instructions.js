import {Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";


export const Instructions = (props) => {
    if(props.numTokens === 0){
        return (
            <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="row" sx={{marginTop: 5}}>
                <Grid item xs={10} sm={6} md={6} lg={5} style={{textAlign: "center"}}>
                    <Paper sx={{py: 5, px: 10}} elevation={3}>
                        <Typography variant="h5" gutterBottom component="div">
                            Instructions
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Please enter the SG-721 or minter contract address for your Stargaze NFT collection.
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        Note: Taking a snapshot of large collections may take some time. Wait for the loading spinner to finish, then export to XLSX or JSON.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}