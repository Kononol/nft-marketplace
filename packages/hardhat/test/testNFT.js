const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nftMarketplace;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMarketplace.owner()).to.equal(owner.address);
    });
  });

  describe("Listing NFTs", function () {
    it("Should allow to list an NFT", async function () {
      await expect(nftMarketplace.connect(addr1).listNFT(1, ethers.utils.parseEther("1")))
        .to.emit(nftMarketplace, "NFTListed")
        .withArgs(addr1.address, 1, ethers.utils.parseEther("1"));
    });

    it("Should fail when price is zero", async function () {
      await expect(nftMarketplace.connect(addr1).listNFT(2, 0))
        .to.be.revertedWith("Price must be greater than zero");
    });

    it("Should fail when not the NFT owner tries to list", async function () {
      await expect(nftMarketplace.connect(addr2).listNFT(1, ethers.utils.parseEther("1")))
        .to.be.revertedWith("Not the NFT owner");
    });
  });

  describe("Buying NFTs", function () {
    before(async function () {
      // List NFT for tests
      await nftMarketplace.connect(addr1).listNFT(3, ethers.utils.parseEther("1.5"));
    });

   it("Should allow to buy an NFT", async function () {
  await expect(
    nftMarketplace.connect(addr2).buyNFT(3, { value: ethers.utils.parseEther("1.5") })
  ) // <-- Закрывающая скобка для expect()
    .to.emit(nftMarketplace, "NFTSold")
    .withArgs(addr1.address, addr2.address, 3, ethers.utils.parseEther("1.5"));
});

it("Should fail with incorrect price", async function () {
  await expect(
    nftMarketplace.connect(addr2).buyNFT(3, { value: ethers.utils.parseEther("1") })
  ).to.be.revertedWith("Incorrect ETH sent");
});

it("Should fail when buying non-existent listing", async function () {
  await expect(
    nftMarketplace.connect(addr2).buyNFT(999, { value: ethers.utils.parseEther("1") })
  ).to.be.revertedWith("NFT not listed");
});
  });

  describe("Withdrawing funds", function () {
    before(async function () {
      // Create a sale to have funds to withdraw
      await nftMarketplace.connect(addr1).listNFT(4, ethers.utils.parseEther("2"));
      await nftMarketplace.connect(addr2).buyNFT(4, { value: ethers.utils.parseEther("2") });
    });

    it("Should allow owner to withdraw", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await nftMarketplace.withdrawFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(tx.gasPrice);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.closeTo(
        initialBalance.add(ethers.utils.parseEther("2")).sub(gasUsed),
        ethers.utils.parseEther("0.1")
      );
    });

    it("Should fail when non-owner tries to withdraw", async function () {
      await expect(nftMarketplace.connect(addr1).withdrawFunds())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});