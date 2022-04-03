const { expect } = require("chai");
const { ethers } = require("hardhat");

const setupTest = async () => {
  const [deployer] = await ethers.getSigners();

  const CoolPOAP = await ethers.getContractFactory("CoolPOAP");
  const cp = await CoolPOAP.deploy("CoolPOAP", "POAP");
  await cp.deployed();

  return {
    cp,
    deployer,
  };
};

describe("CoolPOAP", function () {
  beforeEach(async () => {
    await ethers.provider.send("hardhat_reset", []);
  });

  it("should be deployed correctly", async () => {
    const { cp } = await setupTest();
    expect(await cp.symbol()).to.equal("POAP");
  });

  it("should be that everyone can create an event and become an event host", async () => {
    const { cp } = await setupTest();
    const [deployer, alice, bob] = await ethers.getSigners();

    const URI = "https://test.uri/metadata.json";
    let tx = await cp.createEvent(URI, alice.address);
    await tx.wait();
    expect(await cp.getEventURIById(1)).to.equal(URI);

    // Admin can mint
    tx = await cp.connect(alice).mint(1, [deployer.address, bob.address]);
    await tx.wait();
    expect(await cp.ownerOf(1)).to.equal(deployer.address);
    expect(await cp.ownerOf(2)).to.equal(bob.address);

    // Others can't
    await expect(cp.mint(1, [bob.address])).to.be.reverted;
  });

  it("should be that the event admin can set and update tokenURI", async () => {
    const { cp } = await setupTest();
    const [deployer, alice, bob, chloe] = await ethers.getSigners();

    // Create the 1st event and mint tokens
    const tokenURI1 = "https://denver.eth/metadata.json";
    let tx = await cp.createEvent(tokenURI1, deployer.address);
    await tx.wait();
    tx = await cp.mint(1, [alice.address, bob.address]);
    await tx.wait();
    expect(await cp.tokenURI(1)).to.equal(tokenURI1);
    expect(await cp.tokenURI(2)).to.equal(tokenURI1);

    // Create the 2nd event and mint tokens
    const tokenURI2 = "https://tokyo.eth/metadata.json";
    tx = await cp.createEvent(tokenURI2, deployer.address);
    await tx.wait();
    tx = await cp.mint(2, [alice.address]);
    await tx.wait();
    expect(await cp.tokenURI(3)).to.equal(tokenURI2);

    // Now let's update the 2nd event's URI
    const newTokenURI2 = "https://tokyo.eth2/metadata.json";
    await expect(cp.setEventURI(1, newTokenURI2))
      .to.emit(cp, "CP_EventURIUpdated")
      .withArgs(1, newTokenURI2);
    expect(await cp.tokenURI(1)).to.equal(newTokenURI2);
    expect(await cp.tokenURI(2)).to.equal(newTokenURI2);
  });

  it("should be that host can transfer his/her permission", async () => {
    const { cp } = await setupTest();
    const [deployer, alice, bob] = await ethers.getSigners();

    // Create an event and mint tokens
    const tokenURI = "https://denver.eth/metadata.json";
    let tx = await cp.createEvent(tokenURI, deployer.address);
    await tx.wait();
    tx = await cp.mint(1, [alice.address]);
    await tx.wait();

    // Now let's transfer the host role to another address
    await expect(cp.setEventHost(1, alice.address))
      .to.emit(cp, "CP_EventHostUpdated")
      .withArgs(1, alice.address);
    tx = await cp.connect(alice).mint(1, [bob.address]);
    await tx.wait();
  });
});
