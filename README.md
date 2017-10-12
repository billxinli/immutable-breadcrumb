# Immutable Breadcrumb

Decentralized mechanism for proof of existence of documents via the blockchain

## geth

Assume the blockchain data is stored at: `~/eth/rinkeby`

Then run the node as: `geth --datadir ~/eth/rinkeby --rinkeby --fast --rpc --rpcaddr "0.0.0.0"  --rpcapi="db,eth,net,web3,personal"`

## ipfs

Assume the ipfs path is at: `~/eth/ipfs`

Then run the ipfs initializer as: `IPFS_PATH=~/eth/ipfs ipfs init`

Then run the ipfs daemon as: `IPFS_PATH=~/eth/ipfs ipfs daemon`

## License

GPLv3

