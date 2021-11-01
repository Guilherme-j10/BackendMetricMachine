export interface INetwork {
  netweorkInterfaces: Array<{
    ip4: string,
    ip4subnet: string,
    ip6subnet: string, 
    mac: string, 
    operstate: string, 
    speed: string | number | undefined
  }>,
}

export interface IConnectionsNetwork {
  ConnectionProcess: Array<{
    protocol: string,
    localAddress: string,
    localPort: string,
    peerAddress: string,
    pid: number,
    process: string
  }>
}