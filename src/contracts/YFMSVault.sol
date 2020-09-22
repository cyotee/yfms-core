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

interface CuraAnnonaes {
  function getRewardsBalance() external view returns (uint256);
  function getDailyReward() external view returns (uint256);
  function getNumberOfVaults() external view returns (uint256);
  function getUserBalanceInVault(string calldata vault, address user) external view returns (uint256);
  function stake(string calldata vault, address sender, uint256 amount) external returns (bool);
  function unstake(string calldata vault, address sender) external;
  function transferFunds(address from, address to, uint256 amount) external returns (bool);
}

// https://en.wikipedia.org/wiki/Cura_Annonae
contract YFMSVault {
  using SafeMath for uint256;

  // variables.
  address public owner;
  address[] public stakers; // tracks all addresses in vault.
  CuraAnnonaes public CuraAnnonae;

  // mappings
  mapping(address => uint256) public _balanceOf;

  constructor(address _wallet) public {
    owner = msg.sender;
    CuraAnnonae = CuraAnnonaes(_wallet);
  }

  // balance of a user in the vault.
  function getUserBalance(address _from) public view returns (uint256) {
    return CuraAnnonae.getUserBalanceInVault("YFMS", _from);
  }

  function getRewards() public view returns (uint256) {
    return CuraAnnonae.getRewardsBalance();
  }

  function getStakers() public view returns (address[] memory) {
    return stakers; 
  }

  function getUnstakingFee(address _user) public view returns (uint256) {
    uint256 _balance = getUserBalance(_user);
    require(_balance >= 10000);
    return _balance / 10000 * 250;
  }

  function stakeYFMS(uint256 _amount, address _from) public {
    // add user to stakers array if not currently present.
    if (getUserBalance(_from) == 0)
      stakers.push(_from);
    // transfer occurs outside of contract.
    require(CuraAnnonae.stake("YFMS", _from, _amount));
  }

  function unstakeYFMS(address _to) public {
    CuraAnnonae.unstake("YFMS", _to);
  }
}
