import {useState} from "react";
import {DisplayTable} from "../components/DisplayTable";
import {CosmWasmClient} from "cosmwasm";
import {
    Alert,
    Backdrop,
    Box,
    CircularProgress,
    createTheme,
    Grid, IconButton,
    Snackbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {ThemeProvider} from "@emotion/react";
import {AddressForm} from "../components/AddressForm";
import {CollectionInfo} from "../components/CollectionInfo";
import {Instructions} from "../components/Instructions";
import Head from "next/head";
const XLSX = require('xlsx')

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const SnapshotTool = () => {
    const [contractAddress, setContractAddress] = useState("")
    const [name, setName] = useState("")
    const [numTokens, setNumTokens] = useState(0)
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")
    const [owners, setOwners] = useState([])
    const [uniqueHolders, setUniqueHolders] = useState('')

    const reset = () => {
        setOwners([])
        setNumTokens(0)
        setName("")
        setContractAddress("")
        setUniqueHolders('')
    }

    const grabList = async (sg721) => {
        let owners = []
        const client = await CosmWasmClient.connect("https://rpc.stargaze-apis.com/");
        const numTokens = await client.queryContractSmart(sg721, { num_tokens: {}})
        const contractInfo = await client.queryContractSmart(sg721, { contract_info: {}})

        if(numTokens === 0){
            setAlertMessage("None of the tokens have been minted yet.")
            setAlertOpen(true)
            setLoading(false);
            return
        }

        for(let i = 1; i <= numTokens.count; i++){
            try {
                const tmp = await client.queryContractSmart(sg721, {
                    owner_of: {
                        token_id: i.toString()
                    },
                })
                owners.push({
                    token_id: i.toString(),
                    owner: tmp.owner
                })
            } catch (e) {
                console.log(e.message)
            }
        }

        // Grab unique owners
        let unique = [];
        owners.filter(function(item){
            let i = unique.findIndex(x => (x.owner === item.owner));
            if(i <= -1){
                unique.push(item);
            }
            return null;
        });
        setUniqueHolders(" " + unique.length.toString())

        setName(contractInfo.name)
        setNumTokens(numTokens.count)
        setOwners(owners)
        setLoading(false);
    }

    const queryContract = async () => {
        setLoading(true);
        setOwners([])
        try {
            const client = await CosmWasmClient.connect("https://rpc.stargaze-apis.com/");
            const configResponse = await client.queryContractSmart(contractAddress, {
                config: {},
            });
            await grabList(configResponse.sg721_address)
        } catch (e) {
            if(e.message.includes("Error parsing into type")){
                try {
                    await grabList(contractAddress)
                } catch (e) {
                    console.log(e.message)
                    setAlertMessage("Please check that you have entered the correct contract address.")
                    setAlertOpen(true)
                    setLoading(false);
                }
            } else {
                console.log(e.message)
                setAlertMessage("Failed to fetch, please try again or contact support.")
                setAlertOpen(true)
                setLoading(false);
            }
        }
    }

    const grabCSV = () => {
        let sheet = XLSX.utils.json_to_sheet(owners);
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, sheet, 'Airdrop List')
        XLSX.writeFile(wb, 'export.xlsx');
    }

    const grabJSON = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(owners)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "export.json";
        link.click();
    }

    return(
        <>
            <Head>
                <title>Stargaze Snapshot Tool</title>
                <meta name="description" content="Tools for Stargaze NFTs" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </Head>
            <ThemeProvider theme={darkTheme}>
                <Box minHeight="100vh" display="flex" justifyContent="center"
                     alignItems="center" flexDirection="column" style={{backgroundImage: `url("https://wallpaperaccess.com/full/219458.jpg")`}}>
                    <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="row">
                        <Grid item xs={10} sm={6} md={6} lg={4} style={{textAlign: "center"}}>
                            <AddressForm numTokens={numTokens} contractAddress={contractAddress} setContractAddress={setContractAddress} loading={loading} queryContract={queryContract} />
                            <CollectionInfo reset={reset} uniqueHolders={uniqueHolders} name={name} numTokens={numTokens} />
                        </Grid>
                    </Grid>
                    <Instructions numTokens={numTokens} />
                    <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="row">
                        <Grid item xs={10} sm={8} md={8} lg={6} style={{paddingTop: 20}}>
                            <DisplayTable owners={owners} grabCSV={grabCSV} grabJSON={grabJSON} />
                        </Grid>
                    </Grid>
                </Box>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Box display="flex" justifyContent="center">
                    <Snackbar open={alertOpen} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                        <Alert
                            severity="error"
                            style={{backgroundColor: "rgba(0, 0, 0, 0.87)", color: "#fffcfa"}}
                            action={
                                <IconButton
                                    aria-label="close"
                                    size="small"
                                    color="inherit"
                                    onClick={() => {
                                        setAlertOpen(false)
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default SnapshotTool