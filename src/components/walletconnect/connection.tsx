import contractAbi from '../../config/abi/contractabi.json';
import Web3 from "web3";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import { notifysuccess, notifyerror } from '../../utils/toastHelper';
import { Dispatch } from 'redux';
import * as types from '../../constants/actionConstants';
import { WalletActions, ApprovalActions } from '../../redux/reducer'
import WalletConnectProvider from '@walletconnect/web3-provider';
import random from 'lodash/random'



const REACT_APP_NODE_1 = "https://node1.amechain.io"


const REACT_APP_NODE_2 = "https://node2.amechain.io"


const REACT_APP_NODE_3 = "https://node3.amechain.io"
// const RPC_URL_ROPSTON = 'https://ropsten.infura.io/v3/09bcc0646ff04b2f844b23be91e375f7'

const nodes = [REACT_APP_NODE_1, REACT_APP_NODE_2, REACT_APP_NODE_3]

const getNodeUrl = () => {
    const randomIndex = random(0, nodes.length - 1)
    return nodes[randomIndex]
}

export default function create() {
    return true;
}


const contractAddress = "0x4Fd32530c0b627a42FCc4f1fA90ec3F270661BC9";
const ameContract = "0xeDa21B525Ac789EaB1a08ef2404dd8505FfB973D";
const ameV2Contract = "0xc9D53A339F3c22E016C6fA1E3Eb85AC32c75fED2";
const provider_main = new ethers.providers.JsonRpcProvider(getNodeUrl());

export const mint = async (web3: any) => {


    const signer = web3.getSigner();
    let contract = new ethers.Contract(contractAddress, contractAbi, signer);

    await contract.mint().then(function (res: any, err: any) {
        notifysuccess(`Transaction success!`);
        console.log(res);

    });

}

export const totalSupply = async () => {

    let contract = new ethers.Contract(contractAddress, contractAbi, provider_main);
    let balance = await contract.totalSupply();
    return Number(balance);
}


export const ameBalance = async (account: string) => {
    let amecontract = new ethers.Contract(ameContract, contractAbi, provider_main);
    let balance = await amecontract.balanceOf(account);
    const sortedbalance = ethers.utils.formatUnits(balance, 18);
    return Number(sortedbalance);
}

const getameBalance = async (account: string) => {
    let amecontract = new ethers.Contract(ameContract, contractAbi, provider_main);
    let balance = await amecontract.balanceOf(account);
    const sortedbalance = ethers.utils.formatUnits(balance, 18);
    return Number(sortedbalance);
}

// const ameV2Balanceget = async (account: string) => {
//     let amecontract = new ethers.Contract(ameV2Contract, contractAbi, provider_main);
//     let balance = await amecontract.balanceOf(account);
//     const sortedbalance = ethers.utils.formatUnits(balance, 18);
//     return Number(sortedbalance);
// }

export const disconnectWallet = () => async (dispatch: Dispatch<WalletActions>) => {

    try {
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
        dispatch({
            type: types.HOME_DISCONNECT_WALLET_SUCCESS,
            payload: {
                web3: "",
                loading: false,
                connected: false,
                address: "",
                networkID: Number(process.env.REACT_APP_NETWORK_ID),
                ameBalance: 0,
                isApproved: false,





            }
        })
    } catch (err) {
        notifyerror("dosconnected");
    }

}

export const connectWallet = () => async (dispatch: Dispatch<WalletActions | ApprovalActions>) => {

    try {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        180: getNodeUrl(),
                    },
                    bridge: 'https://bridge.walletconnect.org',
                    qrcode: true,
                },
            }
        };

        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions // required
        });

        const provider = await web3Modal.connect();

        const web3 = new Web3(provider);
        const web3Provider = new providers.Web3Provider(provider);


        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        let networkId = await web3.eth.getChainId();






        const addresstopass = address.toString();



        const getameBalancefromWallet = await web3Provider.getBalance(addresstopass);
        const getameBalancefrom = ethers.utils.formatEther(getameBalancefromWallet);



        dispatch({
            type: types.HOME_CONNECT_WALLET_SUCCESS,
            payload: {
                web3: web3Provider,
                loading: false,
                connected: true,
                address: address,
                networkID: networkId,
                ameBalance: Number(getameBalancefrom),
                isApproved: false,



            }
        });


        const subscribeProvider = (web3Provider: any) => {
            if (!provider.on) {
                return;
            }
            provider.on("accountsChanged", async (accounts: string) => {
                window.location.reload();
                console.log('account changed ' + accounts[0]);
                const getnewameBalancefrom = await getameBalance(accounts[0].toString());

                if (accounts[0]) {

                    dispatch({
                        type: types.HOME_CONNECT_WALLET_RESET,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: true,
                            address: accounts[0],
                            networkID: networkId,
                            ameBalance: 0,
                            isApproved: false,



                        }
                    });
                    dispatch({
                        type: types.APPROVAL_DATA_RESET,
                        payload: {
                            isApproved: false,
                            approveAmount: 0,
                            isApproving: false
                        }
                    });
                } else {

                    dispatch({
                        type: types.HOME_ACCOUNTS_CHANGED,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: false,
                            address: "",
                            networkID: networkId,
                            ameBalance: getnewameBalancefrom,
                            isApproved: false,


                        }
                    })
                }
            });

            // Subscribe to chainId change
            provider.on("chainChanged", async (networkId: any) => {

                // if (networkId === "0x38") {
                //     networkId = 180;
                // }
                if (networkId === 180) {
                    dispatch({
                        type: types.HOME_NETWORK_CHANGED,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: true,
                            address: address,
                            networkID: networkId,
                            ameBalance: Number(getameBalancefrom),
                            isApproved: false,


                        }
                    })
                } else {
                    dispatch({
                        type: types.HOME_NETWORK_CHANGED,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: false,
                            address: address,
                            networkID: networkId,
                            ameBalance: 0,
                            isApproved: false,



                        }
                    })
                }
                window.location.reload();
            });

            // Subscribe to session disconnection
            provider.on("disconnect", async () => {
                window.location.reload();
                dispatch({
                    type: types.HOME_CONNECT_WALLET_SUCCESS,
                    payload: {
                        web3: "",
                        loading: false,
                        connected: false,
                        address: "",
                        networkID: networkId,
                        ameBalance: 0,
                        isApproved: false,



                    }
                })
            });


        };
        subscribeProvider(web3Provider);
    } catch (err) {

        console.log(err);

        notifyerror("Not Connected");
    }

}

export const changeNetwork = () => {
    const chainId = Number(process.env.REACT_APP_NETWORK_ID);
    if (window.ethereum) {
        try {
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(chainId) }],
            }).then().catch()

        } catch (error) {
            console.error(error);
        }
    }
}