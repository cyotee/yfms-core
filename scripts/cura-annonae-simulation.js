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
    let amount
    let result

    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts()

    const deployer = accounts[0]
    const receiver = accounts[1]
    const account  = accounts[2]
    const account2 = accounts[3]
    const account3 = accounts[4]
    const account4 = accounts[5]

    // Fetch the deployed token
    const token = await Token.deployed()
    const cura = await CuraAnnonae.deployed(deployer)
    const vault = await YFMSVault.deployed(deployer)

    await wait()

    balance = await token.balanceOf(deployer)
    console.log(`Owner balance: ${weiToEth(balance)}\n`)
    await wait()

    // approve cura & vault for spending
    await token.approve(deployer, tokens(100000), { from: deployer })
    await token.approve(cura.address, tokens(100000), { from: deployer })
    await token.approve(vault.address, tokens(100000), { from: deployer })

    // send 20500 tokens to cura
    await token.transfer(cura.address, tokens(20500), { from: deployer })

    console.log(`[EXPECTED PASS]: Cura balance is: ${weiToEth(balance.toString())} YFMS`)
    await wait()

    // add a vault.
    await cura.addVault("YFMS")
    result = await cura.numberOfVaults()
    console.log(`[EXPECTED PASS]: ${result} vault(s)`)

    // get daily reward.
    await cura.updateDailyReward()
    balance = await cura.getDailyReward()
    if (balance.toString() !== ethToWei(82))
      console.log("[ERROR]: Expected daily reward of 82")
    else 
      console.log("[EXPECTED PASS]: Daily reward is 82")

    // expect failure prompting dailyReward too soon.
    try {
      await cura.updateDailyReward()
      console.log("[UNEXPECTED PASS] Daily reward function called.")
    } catch (err) {
      console.log("[EXPECTED ERROR] Prompted daily reward too soon.")
    }

    // add another vault.
    await cura.addVault("USDT")
    result = await cura.numberOfVaults()
    console.log(`[EXPECTED PASS]: ${result} vault(s)`)

    // transfer funds into receiver & account accs.
    amount = tokens(1000)
    await token.transfer(receiver, amount)
    await token.transfer(account, amount)
    balance = await token.balanceOf(receiver)
    if (weiToEth(balance).toString() === "1000")
      console.log(`[EXPECTED PASS]: ${receiver} received ${weiToEth(amount).toString()} tokens`)
    else
      console.log(`[ERROR]: ${receiver} did not receive tokens.`)

    // stake tokens receiver
    amount = tokens(400)
    await vault.stakeYFMS(amount, receiver)
    // transfer the tokens.
    await token.transfer(vault.address, amount, { from: receiver })

    console.log(`[EXPECTED PASS]: Receiver staked ${weiToEth(amount).toString()}!`)

    // stake tokens account
    amount = tokens(200)
    await vault.stakeYFMS(amount, account)
    await token.transfer(vault.address, amount, { from: account })
    console.log(`[EXPECTED PASS]: Account staked ${weiToEth(amount).toString()}!`)

    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance in vault YFMS is ${weiToEth(balance).toString()}`)

    // check the balance of both the YFMSVault & the receiver.
    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance is ${weiToEth(balance).toString()}`)

    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: YFMSVault balance is ${weiToEth(balance).toString()}`)


    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(account)
    console.log(`[EXPECTED PASS]: Account balance in vault YFMS is ${weiToEth(balance).toString()}`)

    // read the array of stakers.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}`)
    
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

    // ensure user has been popped from stakers array.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}`)
 
    // check the vault balance.
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: Balance of YFMS Vault is: ${weiToEth(balance).toString()}`)

    // transfer rewards
    await cura.distributeRewardsToVault(vault.address, { from: deployer })
    // check the vault balance.
    balance = await token.balanceOf(cura.address)
    console.log(`[EXPECTED PASS]: Balance of Cura Vault is: ${weiToEth(balance).toString()}`)

    // check the burn total in the YFMS vault.
    amount = await vault.burnTotal()
    console.log(`[EXPECTED PASS]: Burn total of YFMS Vault is: ${weiToEth(amount).toString()}`)

    // stake more funds for other accounts.
    await token.transfer(account2, tokens(200), { from: deployer })
    await token.transfer(account3, tokens(199), { from: deployer })
    await token.transfer(account4, tokens(1),   { from: deployer })

    await vault.stakeYFMS(tokens(200), account2)
    await vault.stakeYFMS(tokens(199), account3)
    await vault.stakeYFMS(tokens(1),   account4)

    await token.transfer(vault.address, tokens(200), { from: account2 })
    await token.transfer(vault.address, tokens(199), { from: account3 })
    await token.transfer(vault.address, tokens(1),   { from: account4 })

    console.log(`[EXPECTED PASS]: Account2 staked 200 tokens`)
    console.log(`[EXPECTED PASS]: Account3 staked 199 tokens`)
    console.log(`[EXPECTED PASS]: Account4 staked 1 token`)

    // check the balance of the vault (should be 600)
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: Balance of YFMS Vault is: ${weiToEth(balance).toString()}`)

    // ensure new users have been added to staking array.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}`)

    // test vault rewards distribution function.
    await vault.distributeVaultRewards()
    // get vault balance - expected to be the same.
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: YFMS Vault balance after distribution: ${weiToEth(balance).toString()}`)

    // check the balances inside the vault mapping for users.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver Balance in YFMS Vault: ${weiToEth(balance)}`)
    balance = await vault.getUserBalance(account)
    console.log(`[EXPECTED PASS]: Account Balance in YFMS Vault: ${weiToEth(balance)}`)
    balance = await vault.getUserBalance(account2)
    console.log(`[EXPECTED PASS]: Account2 Balance in YFMS Vault: ${weiToEth(balance)}`)
    balance = await vault.getUserBalance(account3)
    console.log(`[EXPECTED PASS]: Account3 Balance in YFMS Vault: ${weiToEth(balance)}`)
    balance = await vault.getUserBalance(account4)
    console.log(`[EXPECTED PASS]: Account4 Balance in YFMS Vault: ${weiToEth(balance)}`)

    // unstake all account users.
    try {
      await vault.unstakeYFMS(account)
      console.log(`[UNEXPECTED PASS]: Receiver has staked`)
    } catch (err) {
      console.log(`[EXPECTED FAIL]: Receiver has no staked funds.`)
    }

  // ------------------------------------------------------- //
  } catch (err) {
    console.log(err)
  }

  callback()
}
