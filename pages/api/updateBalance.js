import Web3 from "web3";

const rpcURL = process.env.rpcURL;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

export const getBalances = async (addresses, contractAddress) => {
  const contractABI = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      type: "function",
    },
  ];
  const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

  try {
    // Get initial balances
    const balances = await Promise.all(
      addresses.map(async (address) => {
        const etherBalance = await web3.eth.getBalance(address);
        const tokenBalance = await contractInstance.methods
          .balanceOf(address)
          .call();
        return { address, etherBalance, tokenBalance };
      })
    );

    // Send initial balances to the client
    return balances;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const subscribeToEvents = async (
  addresses,
  contractAddress,
  callback
) => {
  const web3ws = new Web3(
    new Web3.providers.WebsocketProvider(rpcURL.replace(/^https?/, "wss"))
  );
  const contractInstance = new web3ws.eth.Contract(
    [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
    ],
    contractAddress
  );

  addresses.forEach((address) => {
    contractInstance.events.Transfer(
      {
        filter: { _from: address },
        fromBlock: "latest",
      },
      (error, event) => {
        if (!error) {
          console.log(`Received transfer event for address ${address}`);
          updateBalance(address);
        }
      }
    );
  });

  const updateBalance = async (address) => {
    const etherBalance = await web3.eth.getBalance(address);
    const tokenBalance = await contractInstance.methods
      .balanceOf(address)
      .call();
    const updatedBalance = { address, etherBalance, tokenBalance };
    callback(updatedBalance);
  };
};
