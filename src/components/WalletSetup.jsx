import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { sepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = '746d2320e6b61ad0d27cf8305e74ac56'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Sepolia NFT Marketplace',
  description: 'Testnet NFTs to get hand on experience about NFT',
  url: 'http://localhost/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [sepolia]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true, // default to true
  }
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}