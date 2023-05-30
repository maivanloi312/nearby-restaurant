const Transactions=artifacts.require('Transactions.sol')
module.exports = async function (deployer,network,address) {
    await deployer.deploy(Transactions)
};
