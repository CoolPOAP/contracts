module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("CoolPOAP", {
    from: deployer,
    args: ["CoolPOAP", "POAP"],
    log: true,
  });
};

module.exports.tags = ["coolpoap"];
