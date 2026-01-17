// Address labels for common protocols and DEXs
// Format: address (lowercase) -> { name, type, logo }

export interface AddressLabel {
  name: string;
  type: "DEX" | "Bridge" | "Lending" | "Staking" | "Wallet" | "Other";
  description?: string;
}

type AddressLabels = {
  [address: string]: AddressLabel;
};

// Ethereum mainnet addresses
const ethereumLabels: AddressLabels = {
  // Uniswap
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": {
    name: "Uniswap V3 Router",
    type: "DEX",
  },
  "0xe592427a0aece92de3edee1f18e0157c05861564": {
    name: "Uniswap V3 Router",
    type: "DEX",
  },
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {
    name: "Uniswap V2 Router",
    type: "DEX",
  },
  // 1inch
  "0x1111111254eeb25477b68fb85ed929f73a960582": {
    name: "1inch V5 Router",
    type: "DEX",
  },
  // Curve
  "0xd51a44d3fae010294c616388b506acda1bfaae46": {
    name: "Curve Tricrypto",
    type: "DEX",
  },
  // Aave
  "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9": {
    name: "Aave V2 Pool",
    type: "Lending",
  },
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": {
    name: "Aave V3 Pool",
    type: "Lending",
  },
  // SushiSwap
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f": {
    name: "SushiSwap Router",
    type: "DEX",
  },
  // Compound
  "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b": {
    name: "Compound Comptroller",
    type: "Lending",
  },
  // Balancer
  "0xba12222222228d8ba445958a75a0704d566bf2c8": {
    name: "Balancer Vault",
    type: "DEX",
  },
  // 0x Protocol
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff": {
    name: "0x Exchange Proxy",
    type: "DEX",
  },
  // OpenSea
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc": {
    name: "OpenSea Seaport",
    type: "Other",
  },
};

// BSC addresses
const bscLabels: AddressLabels = {
  // PancakeSwap
  "0x10ed43c718714eb63d5aa57b78b54704e256024e": {
    name: "PancakeSwap Router",
    type: "DEX",
  },
  "0x13f4ea83d0bd40e75c8222255bc855a974568dd4": {
    name: "PancakeSwap V3 Router",
    type: "DEX",
  },
  // 1inch
  "0x1111111254eeb25477b68fb85ed929f73a960582": {
    name: "1inch V5 Router",
    type: "DEX",
  },
  // Venus
  "0xfd36e2c2a6789db23113685031d7f16329158384": {
    name: "Venus Comptroller",
    type: "Lending",
  },
};

export const addressLabels: AddressLabels = {
  ...ethereumLabels,
  ...bscLabels,
};

export function getAddressLabel(address: string): AddressLabel | null {
  const label = addressLabels[address.toLowerCase()];
  return label || null;
}
