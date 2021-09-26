export interface IBlockchainAddresses {
  data: Record<string, {
    transactions: string[]
  }>
}

export interface IBlockchainTransactions {
  data: Record<string, {
    outputs: Array<{
      type: 'nulldata' | 'pubkeyhash' | 'scripthash'
      script_hex: string
    }>
  }>
}

export type IBlockchainData = Record<string, string[]>
