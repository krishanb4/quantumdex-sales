import * as types from '../constants/actionConstants';

export interface ApprovalDefualts {
    isApproved: boolean,
    approveAmount: number,
    isApproving: boolean,
}

export interface SwapDefualts {
    isSwaping: boolean,
    isSwaped: boolean,
}

const defaultApprovestate: ApprovalDefualts = {
    isApproved: false,
    approveAmount: 0,
    isApproving: false
}

const defaultSwapstate: SwapDefualts = {
    isSwaping: false,
    isSwaped: false,
}

export interface DefaultStateI {
    web3: any,
    loading: boolean,
    connected: boolean,
    address: string,
    networkID: number,
    ameBalance: number,

}

const defaultState: DefaultStateI = {
    web3: "",
    loading: false,
    connected: false,
    address: '',
    networkID: 0,
    ameBalance: 0,

};

export interface ConnectedWallet {
    type: typeof types.HOME_CONNECT_WALLET_SUCCESS;
    payload: DefaultStateI
}

export interface DisconnectedWallet {
    type: typeof types.HOME_DISCONNECT_WALLET_SUCCESS;
    payload: DefaultStateI
}

interface ConnectingWallet {
    type: typeof types.HOME_CONNECT_WALLET_BEGIN;
    payload: DefaultStateI;
}
interface NetworkChange {
    type: typeof types.HOME_NETWORK_CHANGED;
    payload: DefaultStateI;
}
interface AccountChange {
    type: typeof types.HOME_ACCOUNTS_CHANGED;
    payload: DefaultStateI;
}

interface ApprovedState {
    type: typeof types.FETCH_APPROVAL_DATA;
    payload: ApprovalDefualts;
}
interface ApprovedTrue {
    type: typeof types.FETCH_APPROVAL_DATA_APPROVED;
    payload: ApprovalDefualts;
}

interface IsApproving {
    type: typeof types.FETCH_APPROVAL_DATA_APPROVING;
    payload: ApprovalDefualts;
}


interface WalletReset {
    type: typeof types.HOME_CONNECT_WALLET_RESET;
    payload: typeof defaultState;
}

interface ApprovalReset {
    type: typeof types.APPROVAL_DATA_RESET;
    payload: typeof defaultApprovestate;
}

interface SwapPending {
    type: typeof types.SWAP_PENDING;
    payload: typeof defaultSwapstate;
}

interface SwapDone {
    type: typeof types.SWAP_DONE;
    payload: typeof defaultSwapstate;
}
interface SwapBefore {
    type: typeof types.BEFORE_SWAP;
    payload: typeof defaultSwapstate;
}





export type WalletActions = ConnectedWallet | ConnectingWallet | DisconnectedWallet | NetworkChange | AccountChange | WalletReset;
export type ApprovalActions = ApprovedState | ApprovedTrue | IsApproving | ApprovalReset;
export type SwapActions = SwapPending | SwapDone | SwapBefore;


export const swapreducer = (state: SwapDefualts = defaultSwapstate, action: SwapActions) => {
    switch (action.type) {
        case types.BEFORE_SWAP:
            return defaultSwapstate;
        case types.SWAP_PENDING:
            return {
                ...state,
                isSwaping: true,
                isSwaped: false,
            }
        case types.SWAP_DONE:
            return {
                ...state,
                isSwaping: false,
                isSwaped: true,
            }

        default:
            return state;

    }
}

export const approvalreducer = (state: ApprovalDefualts = defaultApprovestate, action: ApprovalActions) => {
    switch (action.type) {
        case types.APPROVAL_DATA_RESET:
            return defaultApprovestate;
        case types.FETCH_APPROVAL_DATA:
            return {
                ...state,
                isApproved: false,
                approveAmount: 0,
                isApproving: false

            }
        case types.FETCH_APPROVAL_DATA_APPROVED:
            return {
                ...state,
                isApproved: true,
                approveAmount: action.payload.approveAmount,
                isApproving: false

            }
        case types.FETCH_APPROVAL_DATA_APPROVING:
            return {
                ...state,
                isApproved: false,
                approveAmount: 0,
                isApproving: true
            }
        default:
            return state;
    }
}

export const reducer = (state: DefaultStateI = defaultState, action: WalletActions): DefaultStateI => {
    switch (action.type) {
        case types.HOME_CONNECT_WALLET_RESET:
            return defaultState;
        case types.HOME_CONNECT_WALLET_SUCCESS:
            return {
                ...state,
                web3: action.payload.web3,
                loading: false,
                connected: true,
                address: action.payload.address,
                networkID: action.payload.networkID,
                ameBalance: action.payload.ameBalance,


            }

        case types.HOME_DISCONNECT_WALLET_SUCCESS:
            return {
                ...state,
                web3: action.payload.web3,
                loading: false,
                connected: false,
                address: action.payload.address,
                networkID: action.payload.networkID,
                ameBalance: action.payload.ameBalance,



            }
        case types.HOME_NETWORK_CHANGED:
            return {
                ...state,
                web3: action.payload.web3,
                loading: true,
                connected: true,
                address: action.payload.address,
                networkID: action.payload.networkID,
                ameBalance: action.payload.ameBalance,



            }
        case types.HOME_ACCOUNTS_CHANGED:
            return {
                ...state,
                web3: action.payload.web3,
                loading: true,
                connected: true,
                address: action.payload.address,
                networkID: action.payload.networkID,
                ameBalance: action.payload.ameBalance,

            }
        default:
            return state;
    }
}