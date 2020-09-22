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

const burnAddress = '0x0000000000000000000000000000000000000000'

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
    const account  = accounts[2]
    const vaultOwner = accounts[3]

    // Fetch the deployed token
    const token = await Token.deployed()
    const cura = await CuraAnnonae.deployed(accounts[0])
    const vault = await YFMSVault.deployed(accounts[0])

    // approve cura & vault for spending
    await token.approve(cura.address, tokens(20500), { from: deployer })

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

    // transfer funds into receiver & account accs.
    await token.transfer(receiver, tokens(1000));
    await token.transfer(account, tokens(1000));
    balance = await token.balanceOf(receiver)
    if (weiToEth(balance).toString() === "1000")
      console.log(`[EXPECTED PASS]: ${receiver} received 1000 tokens`)
    else
      console.log(`[ERROR]: ${receiver} did not receive tokens.`)

    // stake tokens receiver
    await vault.stakeYFMS(tokens(200), receiver)
    await vault.stakeYFMS(tokens(200), receiver)
    await token.transfer(vaultOwner, tokens(200), { from: receiver })
    await token.transfer(vaultOwner, tokens(200), { from: receiver })
    console.log(`[EXPECTED PASS]: Tokens staked!`)

    // stake tokens account
    await vault.stakeYFMS(tokens(200), account)
    await token.transfer(vaultOwner, tokens(200), { from: account })
    console.log(`[EXPECTED PASS]: Tokens staked!`)

    // check the balance of both the YFMSVault & the receiver.
    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance is ${weiToEth(balance).toString()}`)

    balance = await token.balanceOf(vaultOwner)
    console.log(`[EXPECTED PASS]: YFMSVault balance is ${weiToEth(balance).toString()}`)

    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance in vault YFMS is ${weiToEth(balance).toString()}`)

    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(account)
    console.log(`[EXPECTED PASS]: Account balance in vault YFMS is ${weiToEth(balance).toString()}`)

    // read the array of stakers.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}`)
    
    // calculate the 2.5% unstaking fee & burn.
    let fee = await vault.getUnstakingFee(receiver)
    await token.transfer(burnAddress, fee, { from: vaultOwner })
    console.log(`[EXPECTED PASS]: Unstaking fee for Receiver: ${weiToEth(fee).toString()}`)

    // transfer the tokens
    balance = await vault.getUserBalance(receiver)
    await token.transfer(receiver, String(balance - fee), { from: vaultOwner })

    // unstake receiver coins.
    result = await vault.unstakeYFMS(receiver)
    console.log(`[EXPECTED PASS]: Receiver unstaked.`)

    // transfer the funds.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver YFMSVault balance: ${weiToEth(balance).toString()}`)

    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver YFMS Balance: ${weiToEth(balance).toString()}`)

    // [FAIL] try to unstake tokens with 0 staked.
    try {
      await vault.unstakeYFMS(receiver)
      console.log(`[UNEXPECTED PASS]: Receiver has staked`)
    } catch (err) {
      console.log(`[EXPECTED FAIL]: Receiver has no staked funds.`)
    }

    // check the vault balance.
    balance = await token.balanceOf(vaultOwner)
    console.log(`[EXPECTED PASS]: Balance of YFMS Vault is: ${weiToEth(balance).toString()}`)

    // transfer rewards
    await cura.distributeRewardsToVaults(vaultOwner, tokens(82), { from: deployer })
    // check the vault balance.
    balance = await token.balanceOf(cura.address)
    console.log(`[EXPECTED PASS]: Balance of Cura Vault is: ${weiToEth(balance).toString()}`)
  // ------------------------------------------------------- //
  } catch (err) {
    console.log(err)
  }

  callback()
}
