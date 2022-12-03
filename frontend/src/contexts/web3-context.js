import React, { useReducer } from "react";
import { createContext } from "react";
import {
  SET_WEB3_PROVIDER,
  SET_ADDRESS,
  SET_CHAIN_ID,
  RESET_WEB3_PROVIDER,
} from "./web3-constants";

export const Web3CreateContext = createContext({});

export const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case SET_WEB3_PROVIDER:
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    case SET_CHAIN_ID:
      return {
        ...state,
        chainId: action.chainId,
      };
    case RESET_WEB3_PROVIDER:
      return initialState;
    default:
      throw new Error();
  }
}

export const Web3ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Web3CreateContext.Provider value={{ state, dispatch }}>
      {children}
    </Web3CreateContext.Provider>
  );
};
