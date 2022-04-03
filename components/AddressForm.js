import {Button, TextField} from "@mui/material";
import Paper from "@mui/material/Paper";


export const AddressForm = (props) => {
    if(props.numTokens === 0){
        return (
            <Paper sx={{py: 5, px: 10}} elevation={3}>
                <TextField fullWidth value={props.contractAddress} onChange={(e) => props.setContractAddress(e.target.value)} label="Contract Address" variant="outlined" />
                <Button color="info" variant="outlined" disabled={props.loading} onClick={props.queryContract} size="large" style={{marginTop: 20}}>Grab List</Button>
            </Paper>
        )
    }
}