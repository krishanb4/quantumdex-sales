import React from "react";



export const calculateStartTime = (currentBlock:number,startBlock:number) => {
    const blockdifference = startBlock - currentBlock;

    return blockdifference * 5

}