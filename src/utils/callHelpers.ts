import contractAbi from '../config/abi/contractabi.json';
import swapcontractAbi from '../config/abi/hpsswapabi.json';
import amecontractAbi from '../config/abi/hpsabi.json';
import qtmsalecontractAbi from '../config/abi/salesContract.json';
import salescontractAbi from '../config/abi/salesContract.json';
import Web3 from "web3";
import { ethers , providers } from "ethers";
import Web3Modal from "web3modal";
import { notifysuccess,notifyerror  } from '../utils/toastHelper';
import { Dispatch } from 'redux';
import * as types from '../constants/actionConstants';
import { WalletActions,ApprovalActions,SwapActions } from '../redux/reducer'
import WalletConnectProvider from '@walletconnect/web3-provider';
import random from 'lodash/random'



const REACT_APP_NODE_1 = "https://node1.amechain.io"


const REACT_APP_NODE_2 = "https://node2.amechain.io"


const REACT_APP_NODE_3 = "https://node3.amechain.io"
// const RPC_URL_ROPSTON = 'https://ropsten.infura.io/v3/09bcc0646ff04b2f844b23be91e375f7'

const nodes = [REACT_APP_NODE_1,REACT_APP_NODE_2,REACT_APP_NODE_3]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export const getNodeUrlexport = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export const provider_main_export = new ethers.providers.JsonRpcProvider(getNodeUrl());



const contractAddress = "0xD19a95493e693CF75d2c8AF741F4874830DC667c";
const ameContract = "0xeDa21B525Ac789EaB1a08ef2404dd8505FfB973D"; 

const QTMSalesContract = "0xD19a95493e693CF75d2c8AF741F4874830DC667c";
const provider_main = new ethers.providers.JsonRpcProvider(getNodeUrl());

export const mint = async (web3:any) => {

    
    const signer = web3.getSigner();
    let contract = new ethers.Contract(contractAddress , contractAbi,signer);
    
  await contract.mint().then(function (res:any, err:any) {
    notifysuccess(`Transaction success!`);
    console.log(res);
    
  });
    
}



export const approval = (web3:any) => async (dispatch: Dispatch<ApprovalActions>) =>  {
    const signer = web3.getSigner();
    let amecontract = new ethers.Contract(ameContract, amecontractAbi, signer);
    await amecontract.approve(QTMSalesContract, ethers.utils.parseEther("80000000")).then(function (res: any, err: any) {
        dispatch({
            type: types.FETCH_APPROVAL_DATA_APPROVING,
            payload: {
                isApproved: false,
                approveAmount: 0,
                isApproving: true
            }
        });
        console.log(res);
    });
}


export const approvalAmount =(account: string) => async (dispatch: Dispatch<ApprovalActions>) => {
    if (account) {
        let contract = new ethers.Contract(ameContract, amecontractAbi, provider_main);
        let balance = await contract.allowance(account, QTMSalesContract);
        const finalApprovalamount = ethers.utils.formatEther(balance);
       // console.log(finalApprovalamount);
        if (Number(finalApprovalamount) > 0) {
           // console.log('approve amount > 0');
        dispatch({
            type: types.FETCH_APPROVAL_DATA_APPROVED,
            payload: {
                isApproved: true,
                approveAmount: Number(finalApprovalamount),
                isApproving: false
            }
        });
        } else {
           // console.log('approve amount < 0');
        dispatch({
                type: types.FETCH_APPROVAL_DATA,
                payload: {
                    isApproved: false,
                    approveAmount: 0,
                    isApproving: false
                }
    });
        }
        return Number(finalApprovalamount);
    }
    return 0;
   
}



export const Swap =(web3: any, ammount: number) => async (dispatch: Dispatch<SwapActions>) => {
    if (Number(ammount) <= 0 ) {
        return;
    } else {
       
        try {
            const signer = web3.getSigner();
            const amountfrom = (ammount).toString();
            console.log(ethers.utils.parseUnits(amountfrom));
        
            const decimals = 18;
            const amountnew = ethers.utils.parseUnits(amountfrom, decimals);
            let swapcontract = new ethers.Contract(QTMSalesContract, qtmsalecontractAbi, signer);
            const params = {
                to: QTMSalesContract,
                value: ethers.utils.parseEther(amountfrom),
            };
            dispatch({
                type: types.SWAP_PENDING,
                payload: {
                    isSwaping: true,
                    isSwaped: false,
                }
            });
        
            await signer.sendTransaction(params).then((transaction: any) => {
            
                console.dir(transaction);
            
            }).catch((error: any) => {
                dispatch({
                type: types.SWAP_PENDING,
                payload: {
                    isSwaping: false,
                    isSwaped: false,
                }
            });
                console.log(error);
                
            });
        } catch (err) {
            dispatch({
                type: types.SWAP_PENDING,
                payload: {
                    isSwaping: false,
                    isSwaped: false,
                }
            });
            console.error(err);
        }
    }
}

export const totalSupply = async () => {

  let contract = new ethers.Contract(contractAddress , contractAbi,provider_main);
  let balance = await contract.totalSupply();
  return Number(balance);
}

export const currentBlock = async () => {
    let blockNumber = await provider_main.getBlockNumber()
    return Number(blockNumber);
}

export const timeToTheBlock = async (block:number) => {
    const timestamp = await provider_main.getBlock(block);
    console.log(timestamp);
    
    return timestamp;
}

export const contractData = (calls: any[]) => { 
    const promises = calls.map((call) => {
        return call
     })
    return Promise.all(promises)
}



export const ameBalanceget = async (account: string,web3Provider: any) => {
    const getameBalancefromWallet = await web3Provider.getBalance(account);
        const getameBalancefrom = ethers.utils.formatEther(getameBalancefromWallet);
//   let amecontract = new ethers.Contract(ameContract , contractAbi,provider_main);
//   let balance = await amecontract.balanceOf(account);
//   const sortedbalance = ethers.utils.formatUnits(balance, 18);
  return Number(getameBalancefrom);
}

// export const ameV2Balanceget = async (account:string) => {
//   let amecontract = new ethers.Contract(ameV2Contract , contractAbi,provider_main);
//   let balance = await amecontract.balanceOf(account);
//   const sortedbalance = ethers.utils.formatUnits(balance, 18);
//   return Number(sortedbalance);
// }

const getameBalance = async (account:string) => {
  let amecontract = new ethers.Contract(ameContract , contractAbi,provider_main);
  let balance = await amecontract.balanceOf(account);
  const sortedbalance = ethers.utils.formatUnits(balance, 18);
  return Number(sortedbalance);
}

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

export const connectWallet = () => async (dispatch: Dispatch<WalletActions>) => {

    try {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        1: 'https://bsc-dataseed.binance.org/',
                        56: 'https://bsc-dataseed.binance.org/',
                        180: 'https://node1.amechain.io',
                        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
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

        

        if (networkId === 86) {
            networkId = Number(process.env.REACT_APP_NETWORK_ID);
        }
        const addresstopass = address.toString();
        const getameBalancefrom = await getameBalance(addresstopass);
       

            dispatch({
                type: types.HOME_CONNECT_WALLET_SUCCESS,
                payload: {
                    web3: web3Provider,
                    loading: false,
                    connected: true,
                    address: address,
                    networkID: networkId,
                    ameBalance: getameBalancefrom,
                    isApproved: false,
                   

                }
            });
        

        const subscribeProvider = (web3Provider: any) => {
            if (!provider.on) {
                return;
            }
            provider.on("accountsChanged", async (accounts: string) => {
               // console.log('account changed ' + accounts[0]);
                if (accounts[0]) {
                    dispatch({
                        type: types.HOME_CONNECT_WALLET_SUCCESS,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: true,
                            address: accounts[0],
                            networkID: networkId,
                            ameBalance: getameBalancefrom,
                            isApproved: false,
                           


                        }
                    })
                } else {
                    dispatch({
                        type: types.HOME_CONNECT_WALLET_SUCCESS,
                        payload: {
                            web3: web3Provider,
                            loading: false,
                            connected: false,
                            address: "",
                            networkID: networkId,
                            ameBalance: getameBalancefrom,
                            isApproved: false,
                            


                        }
                    })
                }
            });

            // Subscribe to chainId change
            provider.on("chainChanged", async (networkId: any) => {
                if (networkId === "0x38") {
                    networkId = 180;
                }
                dispatch({
                    type: types.HOME_NETWORK_CHANGED,
                    payload: {
                        web3: web3Provider,
                        loading: false,
                        connected: true,
                        address: address,
                        networkID: networkId,
                        ameBalance: getameBalancefrom,
                        isApproved: false,
                       


                    }
                })
            });

            // Subscribe to session disconnection
            provider.on("disconnect", async () => {
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
        notifyerror("user rejected");
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