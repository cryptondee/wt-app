import { useState } from "react";
import axios from "axios";
import Web3 from "web3";
import ShowBalance from "@/components/ShowBalance";
import ShowBalanceRow from "@/components/ShowBalanceRows";

export default function Home() {
  // State variables for the Ethereum addresses, ERC20 contract address, and token balances
  const [addresses, setAddresses] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [balances, setBalances] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const addressList = addresses.split(",");
    const response = await axios.get(
      `/api/balances?addresses=${addressList}&contractAddress=${contractAddress}`
    );
    setBalances(response.data.balances);
    //subscribeToEvents(addressList, contractAddress, setBalances);
  };
  const handleRemoveAddress = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const renderAddresses = () => {
    return addresses.map((address, index) => (
      <div key={index} className="flex items-center">
        <span className="bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded-lg mr-2">
          {formatAddress(address)}
        </span>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleRemoveAddress(index)}
        >
          x
        </button>
      </div>
    ));
  };

  // Render the UI
  return (
    <div>
      <div className="bg-gray-200 min-h-1/4 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Wallets Token Tracker
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="address-list" className="sr-only">
                  Enter Ethereum addresses (separated by commas)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="address-list"
                    name="addresses"
                    type="text"
                    value={addresses}
                    onChange={(event) => setAddresses(event.target.value)}
                    autoComplete="addresses"
                    required
                    className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter Ethereum addresses (separated by commas)"
                  />
                  {addresses && (
                    <button
                      type="button"
                      onClick={() => setAddresses("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      x
                    </button>
                  )}
                  {addresses && (
                    <div className="absolute bottom-full w-full mt-1 rounded-md bg-white shadow-lg z-10">
                      <ul className="py-1">
                        {addresses.split(",").map((address) => (
                          <li
                            key={address}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              setAddresses(
                                addresses
                                  .replace(address, "")
                                  .replace(",,", ",")
                                  .replace(/^,|,$/g, "")
                              )
                            }
                          >
                            <span className="font-medium">
                              {address.slice(0, 4)}...{address.slice(-4)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="contract-address" className="sr-only">
                  Enter ERC20 contract address
                </label>
                <input
                  id="contract-address"
                  name="contractAddress"
                  type="text"
                  value={contractAddress}
                  onChange={(event) => setContractAddress(event.target.value)}
                  autoComplete="contractAddress"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter ERC20 contract address"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v2.586L5.707 5.293A1 1 0 104.293 6.707l3.364 3.364a3 3 0 104.243-1.414L10 7.586l2.293 2.293a3 3 0 104.243 1.414l3.364-3.364a1 1 0 10-1.414-1.414L11 10.586V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Track Tokens
              </button>
            </div>
          </form>
        </div>
      </div>
      {balances && <ShowBalanceRow balances={balances} contractAddress={contractAddress} />}
    </div>
  );
}
