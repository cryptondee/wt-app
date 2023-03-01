import React from "react";

export default function ShowBalance({ balances }) {
  return (
    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Token Balances
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {balances.map((balance, index) => (
            <div
              key={index}
              className={`bg-${
                index % 2 ? "gray" : "white"
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {balance.address}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Ether Balance
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {balance.etherBalance / 1e18}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Token Balance
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {balance.tokenBalance == 0 ? (
                  <span>No balance</span>
                ) : (
                  <span>{balance.tokenBalance / 1e18}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
