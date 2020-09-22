pragma solidity 0.6.0;

library SafeMath {
  /**
  * @dev Multiplies two unsigned integers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
        return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // Solidity only automatically asserts when dividing by 0
    require(b > 0);
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two unsigned integers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

interface ERC20 {
  function balanceOf(address who) external view returns (uint256);
  function transfer(address to, uint value) external  returns (bool success);
  function transferFrom(address from, address to, uint value) external returns (bool success);
}

// https://en.wikipedia.org/wiki/Cura_Annonae
contract CuraAnnonae {
  using SafeMath for uint256;

  // variables.
  ERC20 public YFMSToken;
  address public owner;
  uint256 public numberOfVaults;
  uint256 public rewardsBalance;

  // mappings.
  mapping(string => mapping(address => uint256)) internal vaults_data; // { VaultName: { UserAddress: value }}

  constructor(address _wallet) public {
    owner = msg.sender;
    YFMSToken = ERC20(_wallet);
  }

  // view the number of tokens left to distribute.
  function getRewardsBalance() public view returns (uint256) {
    return YFMSToken.balanceOf(address(this));
  }

  // calculate the daily reward.
  function getDailyReward() public view returns (uint256) {
    require(msg.sender == owner);
    return YFMSToken.balanceOf(address(this)) / 10000 * 40;
  }

  function getNumberOfVaults() public view returns (uint256) {
    require(msg.sender == owner);
    return numberOfVaults;
  }

  // get user balance in specific vault.
  function getUserBalanceInVault(string memory _vault, address _user) public view returns (uint256) {
    require(vaults_data[_vault][_user] >= 0);
    return vaults_data[_vault][_user];
  }

  function getBurnFee(uint256 _burnFee) public view returns (uint256) {
    return _burnFee;
  }

  // enables users to stake stable coins/ YFMS from their respective vaults.
  function stake(string memory _vault, address _sender, uint256 _amount) public returns (bool) {
    // ensure it is a valid amount.
    require(YFMSToken.balanceOf(_sender) >= _amount);
    // update mapping.
    vaults_data[_vault][_sender] = vaults_data[_vault][_sender].add(_amount);
    return true;
  }

  // enables users to unstake staked coins at a 2.5% cost (tokens will be burned).
  function unstake(string memory _vault, address _sender) public {
    uint256 stakedAmount = vaults_data[_vault][_sender];
    require(stakedAmount >= 10000); // won't break divison below.
    // get 2.5% burn fee.
    uint256 burnFee = stakedAmount / 10000 * 25;
    // remove staked balance.
    vaults_data[_vault][_sender] = 0;
  }

  // add a vault.
  function addVault(string memory name) public {
    require(msg.sender == owner);
    // initialize new vault.
    vaults_data[name][msg.sender] = 0; 
    // increment number of vaults.
    numberOfVaults = numberOfVaults.add(1);
  }
}
