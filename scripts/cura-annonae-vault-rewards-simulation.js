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
  const milliseconds = 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// NOTE: please set lastRewardUpdate in CuraAnnonae to 5 seconds.

module.exports = async function(callback) {
  try {
    let balance
    let amount
    let result

    const kek = "❌ "

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
    balance = await token.balanceOf(cura.address)

    console.log(`✔️  [NYAEH]: Cura balance is: ${weiToEth(balance).toString()} YFMS`)
    await wait()

    // add a vault.
    await cura.addVault("YFMS")
    result = await cura.numberOfVaults()
    console.log(`✔️  [NYAEH]: ${result} vault(s) - YFMS\n`)
    await wait()

    // get daily reward.
    for (let i = 0; i < 20; i++) {
      await wait()
      try {
        await cura.updateDailyReward() // set the currentDailyReward variable.
        // distribute the rewards to vaults that call upon the address.
        // [TODO] implement a check to ensure vaults don't call twice.
        await cura.distributeRewardsToVault(vault.address, { from: deployer })
        balance = await token.balanceOf(vault.address) // ensure the vault got paid.
        result = await cura.getDailyReward()
        console.log(`✔️  [NYAEH]: Daily reward is ${weiToEth(result)}`)
        console.log(`✔️  [NYAEH]: YFMS Vault balance is: ${weiToEth(balance)}\n`)
      } catch (err) {
        console.log("✔️  [HEAYN]: Called daily reward too soon.")
      }
    }
    // add another vault.
    await cura.addVault("USDT")
    result = await cura.numberOfVaults()
    console.log(`[EXPECTED PASS]: ${result} vault(s) - YFMS & USDT\n`)
    await wait()

    // transfer funds into receiver & account accs.
    amount = tokens(1000)
    await token.transfer(receiver, amount)
    await token.transfer(account, amount)
    balance = await token.balanceOf(receiver)
    if (weiToEth(balance).toString() === "1000")
      console.log(`[EXPECTED PASS]: Receiver received ${weiToEth(amount).toString()} tokens`)
    else
      console.log(`[ERROR]: ${receiver} did not receive tokens.`)
    await wait()

    // stake tokens receiver
    amount = tokens(400)
    await vault.stakeYFMS(amount, receiver)
    // transfer the tokens.
    await token.transfer(vault.address, amount, { from: receiver })
    console.log(`[EXPECTED PASS]: Receiver staked ${weiToEth(amount).toString()} YFMS`)
    await wait()

    // stake tokens account
    amount = tokens(200)
    await vault.stakeYFMS(amount, account)
    await token.transfer(vault.address, amount, { from: account })
    console.log(`[EXPECTED PASS]: Account staked ${weiToEth(amount).toString()} YFMS\n`)
    await wait()

    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance in vault YFMS is ${weiToEth(balance).toString()}`)
    await wait()

    // check the balance of both the YFMSVault & the receiver.
    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver balance is ${weiToEth(balance).toString()}`)
    await wait()

    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: YFMSVault balance is ${weiToEth(balance).toString()}`)
    await wait()

    // check the balance of the address inside the contract.
    balance = await vault.getUserBalance(account)
    console.log(`[EXPECTED PASS]: Account balance in vault YFMS is ${weiToEth(balance).toString()}\n`)
    await wait()
    
    // unstake receiver coins.
    result = await vault.unstakeYFMS(receiver)
    console.log(`[EXPECTED PASS]: Receiver unstaked.`)
    await wait()

    // transfer the funds.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver YFMSVault balance: ${weiToEth(balance).toString()}`)
    await wait()

    balance = await token.balanceOf(receiver)
    console.log(`[EXPECTED PASS]: Receiver YFMS Balance: ${weiToEth(balance).toString()}`)
    await wait()

    // [FAIL] try to unstake tokens with 0 staked.
    try {
      await vault.unstakeYFMS(receiver)
      console.log(`[UNEXPECTED PASS]: Receiver has staked`)
    } catch (err) {
      console.log(`[EXPECTED FAIL]: Receiver has no staked funds.\n`)
    }
    await wait()

    // ensure user has been popped from stakers array.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}\n`)
    await wait()
 
    // check the vault balance.
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: Balance of YFMS Vault is: ${weiToEth(balance).toString()}`)
    await wait()

    // check the vault balance.
    balance = await token.balanceOf(cura.address)
    console.log(`[EXPECTED PASS]: Balance of Cura Vault is: ${weiToEth(balance).toString()}`)
    await wait()

    // check the burn total in the YFMS vault.
    amount = await vault.burnTotal()
    console.log(`[EXPECTED PASS]: Burn total of YFMS Vault is: ${weiToEth(amount).toString()}\n`)
    await wait()

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
    await wait()
    console.log(`[EXPECTED PASS]: Account3 staked 199 tokens`)
    await wait()
    console.log(`[EXPECTED PASS]: Account4 staked 1 token\n`)
    await wait()

    // check the balance of the vault (should be 600)
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: Balance of YFMS Vault is: ${weiToEth(balance).toString()}`)
    await wait()

    // ensure new users have been added to staking array.
    result = await vault.getStakers()
    console.log(`[EXPECTED PASS]: YFMSVault participants: \n ${result}\n`)
    await wait()

    // test vault rewards distribution function.
    await cura.distributeRewardsToVault(vault.address, { from: deployer })
    // get vault balance - expected to be the same.
    balance = await token.balanceOf(vault.address)
    console.log(`[EXPECTED PASS]: YFMS Vault balance after distribution: ${weiToEth(balance).toString()}\n`)
    await wait()

    // distribute staking rewards.
    await vault.distributeVaultRewards()

    // check the balances inside the vault mapping for users.
    balance = await vault.getUserBalance(receiver)
    console.log(`[EXPECTED PASS]: Receiver Balance in YFMS Vault: ${weiToEth(balance)}`)
    await wait()
    balance = await vault.getUserBalance(account)
    console.log(`[EXPECTED PASS]: Account Balance in YFMS Vault: ${weiToEth(balance)}`)
    await wait()
    balance = await vault.getUserBalance(account2)
    console.log(`[EXPECTED PASS]: Account2 Balance in YFMS Vault: ${weiToEth(balance)}`)
    await wait()
    balance = await vault.getUserBalance(account3)
    console.log(`[EXPECTED PASS]: Account3 Balance in YFMS Vault: ${weiToEth(balance)}`)
    await wait()
    balance = await vault.getUserBalance(account4)
    console.log(`[EXPECTED PASS]: Account4 Balance in YFMS Vault: ${weiToEth(balance)}\n`)
    await wait()

    // [HELPER] get YFMS vault balance.
    const getVaultBalance = async () => {
      balance = await token.balanceOf(vault.address)
      console.log(`[EXPECTED PASS]: YFMS Vault balance: ${weiToEth(balance).toString()}`)
    }
    await wait()

    // [HELPER] unstaked balance is 0.
    const userVaultBalance = async (address, name) => {
      balance = await vault.getUserBalance(address)
      console.log(`[EXPECTED PASS]: ${name} Vault Balance: ${weiToEth(balance).toString()}`)
    }
    await wait()

    // [HELPER] check the balance in the YFMS Vault.
    const userYFMSBalance = async (address, name) => {
      balance = await token.balanceOf(address)
      console.log(`[EXPECTED PASS]: ${name} YFMS balance: ${weiToEth(balance).toString()}\n`)
    }
    await wait()

    // account
    try {
      await vault.unstakeYFMS(account)
      console.log(`[EXPECTED PASS]: Account has unstaked`)
    } catch (err) {
      console.log(`[UNEXPECTED FAIL]: Account has no staked funds.`)
    }
    await wait()
    getVaultBalance()
    userVaultBalance(account, "Account")
    userYFMSBalance(account, "Account")
    // account2
    try {
      await vault.unstakeYFMS(account2)
      console.log(`[EXPECTED PASS]: Account2 has unstaked`)
    } catch (err) {
      console.log(`[UNEXPECTED FAIL]: Account2 has no staked funds.`)
    }
    await wait()
    getVaultBalance()
    userVaultBalance(account2, "Account2")
    userYFMSBalance(account2, "Account2")
    await wait()
    // account3
    try {
      await vault.unstakeYFMS(account3)
      console.log(`[EXPECTED PASS]: Account3 has unstaked`)
    } catch (err) {
      console.log(`[UNEXPECTED FAIL]: Account3 has no staked funds.`)
    }
    // account4
    await wait()
    getVaultBalance()
    userVaultBalance(account3, "Account3")
    userYFMSBalance(account3, "Account3")
    await wait()
    try {
      await vault.unstakeYFMS(account4)
      console.log(`[EXPECTED PASS]: Account4 has unstaked`)
    } catch (err) {
      console.log(`[UNEXPECTED FAIL]: Account4 has no staked funds.`)
    }
    // check the vault balance (should be 0).
    await wait()
    getVaultBalance()
    userVaultBalance(account4, "Account4")
    userYFMSBalance(account4, "Account4")
    await wait()

    // log the burned amount.
    balance = await vault.burnTotal()
    console.log(`[EXPECTED PASS]: YFMS burn total: ${weiToEth(balance).toString()}`)
    */
  // ------------------------------------------------------- //
  } catch (err) {
    console.log(err)
  }

  callback()
}
