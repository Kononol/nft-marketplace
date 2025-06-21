import { useState } from "react";
import Image from "next/image";
import { NFT, useContract, useNFTs } from "@thirdweb-dev/react";

// Добавлен импорт Image из Next.js

export default function NFTMarketplace() {
  const [price, setPrice] = useState<string>("");
  const [tokenURI, setTokenURI] = useState<string>("");
  const { contract } = useContract("0xYourDeployedContractAddress");
  const { data: nfts, isLoading } = useNFTs(contract);

  const mintNFT = async () => {
    await contract?.call("mintNFT", [tokenURI, price]);
  };

  const buyNFT = async (tokenId: string) => {
    await contract?.call("buyNFT", [tokenId], { value: price });
  };

  // Функция для безопасного отображения цены
  const formatPrice = (price: unknown): string => {
    if (typeof price === "number") return price.toString();
    if (typeof price === "string") return price;
    return "0";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">NFT Marketplace</h1>

      {/* Форма для минта */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Create NFT</h2>
        <input
          type="text"
          placeholder="Token URI (IPFS)"
          className="input input-bordered w-full mb-2"
          value={tokenURI}
          onChange={e => setTokenURI(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price in ETH"
          className="input input-bordered w-full mb-2"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button onClick={mintNFT} className="btn btn-primary">
          Mint NFT
        </button>
      </div>

      {/* Список NFT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading NFTs...</p>
        ) : (
          nfts?.map((nft: NFT) => {
            const imageUrl = (nft.metadata.image as string) || "/placeholder-nft.png";
            const altText = nft.metadata.name || "NFT image";
            const priceDisplay = formatPrice(nft.metadata?.price);

            return (
              <div key={nft.metadata.id} className="card bg-base-100 shadow-xl">
                <figure>
                  <Image
                    src={imageUrl}
                    alt={String(altText)} // Явное преобразование в строку
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                    priority={false}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{nft.metadata.name || "Untitled NFT"}</h2>
                  <p>Price: {priceDisplay} ETH</p>
                  <div className="card-actions justify-end">
                    <button onClick={() => buyNFT(nft.metadata.id)} className="btn btn-secondary">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
