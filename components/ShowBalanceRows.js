import { useState, useEffect } from "react";

export default function ShowBalanceRow({ balances, contractAddress }) {
  const [addressBalances, setAddressBalances] = useState([]);

  useEffect(() => {
    setAddressBalances(balances);
  }, [balances]);

  const handleRemoveAddress = (address) => {
    setAddressBalances((prevBalances) =>
      prevBalances.filter((balance) => balance.address !== address)
    );
  };

  return (
    <div className="flex flex-col mt-8">
      <h3 className="text-lg font-medium mb-4 text-center">Balances</h3>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Ether Balance</th>
            <th className="px-4 py-2 text-left">Token Balance</th>
            <th className="px-4 py-2 text-right">Remove</th>
          </tr>
        </thead>
        <tbody>
          {addressBalances.map(({ address, etherBalance, tokenBalance }) => (
            <tr key={address}>
              <td className="border px-4 py-2"><a href={`https://arbiscan.io/token/${contractAddress}?a=${address}`} className="text-grey-900 hover:text-indigo-400">{address}</a></td>
              <td className="border px-4 py-2">{etherBalance /1e18 }</td>
              <td className="border px-4 py-2">{tokenBalance / 1e18}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleRemoveAddress(address)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
