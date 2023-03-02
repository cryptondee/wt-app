import Web3 from "web3";

const rpcURL = process.env.rpcURL;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

export default async function handler(req, res) {
  const addresses = req.query.addresses.split(",");
  const contractAddress = req.query.contractAddress;

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
    res.status(200).json({ balances });

    // Subscribe to transfer events for each address and update balances in real time
    // const subscribeToEvents = async (addresses, contractAddress) => {
    //   const web3ws = new Web3(
    //     new Web3.providers.WebsocketProvider(rpcURL.replace(/^https?/, "wss"))
    //   );
    //   const contractInstance = new web3ws.eth.Contract(
    //     contractABI,
    //     contractAddress
    //   );

    //   addresses.forEach((address) => {
    //     contractInstance.events.Transfer(
    //       {
    //         filter: { _from: address },
    //         fromBlock: "latest",
    //       },
    //       (error, event) => {
    //         if (!error) {
    //           console.log(`Received transfer event for address ${address}`);
    //           updateBalance(address);
    //         }
    //       }
    //     );
    //   });

    //   const updateBalance = async (address) => {
    //     const etherBalance = await web3.eth.getBalance(address);
    //     const tokenBalance = await contractInstance.methods
    //       .balanceOf(address)
    //       .call();
    //     const updatedBalance = { address, etherBalance, tokenBalance };
    //     res.write(`data: ${JSON.stringify({ balance: updatedBalance })}\n\n`);
    //   };
    // };

    // subscribeToEvents(addresses, contractAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
