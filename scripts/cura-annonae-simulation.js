const Token       = artifacts.require("YFMSToken")
const CuraAnnonae = artifacts.require("CuraAnnonae")
const YFMSVault   = artifacts.require("YFMSVault")

// Utils
const ether = n => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), "ether")
  )
}
const tokens = n => ether(n)

const weiToEth = n => web3.utils.fromWei(n.toString(), "ether")
const ethToWei = n => web3.utils.toWei(n.toString(), "ether")

const wait = () => {
  const milliseconds = 500
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async function(callback) {
  try {
    let balance
    let result

    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts()

    const deployer = accounts[0]
    const receiver = accounts[1]
    const sender   = accounts[2]

    // Fetch the deployed token
    const token = await Token.deployed()
    const cura = await CuraAnnonae.deployed(accounts[0])
    const vault = await YFMSVault.deployed(accounts[0])

    // approve cura & vault for spending
    await token.approve(cura.address, tokens(20500), { from: deployer })
    await token.approve(vault.address, tokens(50000), { from: deployer })
    await token.approve(receiver, tokens(20500), { from: deployer })
    await token.approve(sender, tokens(20500), { from: deployer })

    // send 20500 tokens to cura
    await token.transfer(cura.address, tokens(20500))

    // check the balance of cura
    //balance = await cura.rewardsBalance()
    balance = await vault.getRewards()
   
    console.log(`[EXPECTED PASS]: Cura balance is: ${weiToEth(balance.toString())} YFMS`)
    await wait()

    // add a vault.
    await cura.addVault("YFMS")
    result = await cura.numberOfVaults()
    console.log(`[EXPECTED PASS]: ${result} vault(s)`)

    // get daily reward.
    balance = await cura.getDailyReward()
    if (balance.toString() !== ethToWei(82))
      console.log("[ERROR]: Expected daily reward of 82")
    else 
      console.log("[EXPECTED PASS]: Daily reward is 82")

    // add another vault.
    await cura.addVault("USDT")
    result = await cura.numberOfVaults()
    console.log(`[EXPECTED PASS]: ${result} vault(s)`)

    // transfer funds into receiver acc. then stake tokens.
    await token.transfer(receiver, tokens(1000));
    balance = await token.balanceOf(receiver)
    if (weiToEth(balance).toString() === "1000")
      console.log(`[EXPECTED PASS]: ${receiver} received 1000 tokens`)
    else
      console.log(`[ERROR]: ${receiver} did not receive tokens.`)

    // stake tokens.
    await vault.stakeYFMS(tokens(100), receiver)
    console.log(`[EXPECTED PASS]: Tokens staked!`)

    // check the balance of both the YFMSVault & the receiver.
    /*
    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance is ${weiToEth(balance).toString()}`)

    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: YFMSVault balance is ${weiToEth(balance).toString()}`)
    */

  // ------------------------------------------------------- //
  } catch (err) {
    console.log(err)
  }

  callback()
}
