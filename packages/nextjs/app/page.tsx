"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
     <div className="flex items-center w-full flex-row grow pt-10">
  <div className="grow px-5">
    <h1 className="text-center">
      <span className="block text-2xl mb-2">Приветствуем в </span>
      <span className="block text-4xl font-bold">МАГАЗИНЕ NFT-ТОКЕНОВ</span>
    </h1>
    <div className="flex justify-center items-center space-x-2 flex-row">
      <p className="my-2 font-medium">Подключенный адрес:</p>
      <Address address={connectedAddress} />
    </div>
  </div>

  {/* Измененный контейнер для карточек */}
  <div className="justify-center bg-base-content flex-1 min-h-[calc(100vh-6rem)] mt-16 px-8 py-12 overflow-auto">
    <div className="flex justify-center items-center gap-10 h-full flex-col md:flex-col">
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-6xl">
        <BugAntIcon className="h-10 w-6 fill-secondary" />
        <p>
          Тестируйте и отлаживайте контракт во вкладке{" "}
          <Link href="/debug" passHref className="link">
            Debug Contracts
          </Link>{" "}
          tab.
        </p>
      </div>
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-6xl">
        <MagnifyingGlassIcon className="h-10 w-6 fill-secondary" />
        <p>
          Проверяйте историю транзакций в{" "}
          <Link href="/blockexplorer" passHref className="link">
            Block Explorer
          </Link>{" "}
          tab.
        </p>
      </div>
    </div>
  </div>
</div>
    </>
  );
};

export default Home;
