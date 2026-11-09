import { parseAbi } from "viem";

// ABI legibles del spike docs/pruebas/spike-fondo-fork.cjs.
export const safeAbi = parseAbi([
  "function setup(address[] _owners,uint256 _threshold,address to,bytes data,address fallbackHandler,address paymentToken,uint256 payment,address paymentReceiver)",
  "function nonce() view returns (uint256)",
  "function getOwners() view returns (address[])",
  "function getThreshold() view returns (uint256)",
  "function isModuleEnabled(address) view returns (bool)",
  "function getModulesPaginated(address,uint256) view returns (address[] array,address next)",
  "function getStorageAt(uint256,uint256) view returns (bytes)",
  "function approveHash(bytes32)",
  "function approvedHashes(address,bytes32) view returns (uint256)",
  "function enableModule(address)",
  "function disableModule(address,address)",
  "function swapOwner(address,address,address)",
  "function getTransactionHash(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 _nonce) view returns (bytes32)",
  "function execTransaction(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,bytes signatures) payable returns (bool)",
  "event ExecutionSuccess(bytes32 indexed txHash, uint256 payment)",
  "event ExecutionFailure(bytes32 indexed txHash, uint256 payment)",
  "event ExecutionFromModuleSuccess(address indexed module)",
]);

export const proxyFactoryAbi = parseAbi([
  "function proxyCreationCode() view returns (bytes)",
  "function createProxyWithNonce(address _singleton,bytes initializer,uint256 saltNonce) returns (address)",
  "event ProxyCreation(address indexed proxy, address singleton)",
]);

export const moduleFactoryAbi = parseAbi([
  "function deployModule(address masterCopy,bytes initializer,uint256 saltNonce) returns (address)",
  "event ModuleProxyCreation(address indexed proxy, address indexed masterCopy)",
]);

// Roles 2.1.1 (557b17d5f0), no la API v3 de main: no tiene isMember.
export const rolesAbi = parseAbi([
  "function setUp(bytes)",
  "function owner() view returns (address)",
  "function avatar() view returns (address)",
  "function target() view returns (address)",
  "function allowances(bytes32) view returns (uint128 refill,uint128 maxRefill,uint64 period,uint128 balance,uint64 timestamp)",
  "function setAllowance(bytes32 key,uint128 balance,uint128 maxRefill,uint128 refill,uint64 period,uint64 timestamp)",
  "function scopeTarget(bytes32 roleKey,address targetAddress)",
  "struct ConditionFlat {uint8 parent;uint8 paramType;uint8 operator;bytes compValue;}",
  "function scopeFunction(bytes32 roleKey,address targetAddress,bytes4 selector,ConditionFlat[] conditions,uint8 options)",
  "function assignRoles(address module,bytes32[] roleKeys,bool[] memberOf)",
  "function isModuleEnabled(address) view returns (bool)",
  "function execTransactionWithRole(address to,uint256 value,bytes data,uint8 operation,bytes32 roleKey,bool shouldRevert) returns (bool)",
]);

export const multiSendCallOnlyAbi = parseAbi([
  "function multiSend(bytes transactions) payable",
]);
