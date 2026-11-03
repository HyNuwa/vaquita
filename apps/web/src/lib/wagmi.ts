import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet, valoraWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { celo } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!projectId) throw new Error("Falta NEXT_PUBLIC_WC_PROJECT_ID en el .env de la raíz.");

const connectors = connectorsForWallets(
  [{ groupName: "Billeteras", wallets: [valoraWallet, metaMaskWallet, walletConnectWallet, injectedWallet] }],
  { appName: "La Vaquita", projectId },
);

export const wagmiConfig = createConfig({
  chains: [celo],
  connectors,
  transports: { [celo.id]: http("https://forno.celo.org") },
  ssr: true,
});
