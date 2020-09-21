const Token = artifacts.require("YFMSToken")
const CuraAnnonae = artifacts.require("CuraAnnonae")
const YFMSVault = artifacts.require("YFMSVault")

module.exports = (deployer) => {
  deployer.deploy(Token)
    .then(() => {
      return deployer.deploy(CuraAnnonae, Token.address)
    })
    .then(() => {
      return deployer.deploy(YFMSVault, CuraAnnonae.address)
    })
}
