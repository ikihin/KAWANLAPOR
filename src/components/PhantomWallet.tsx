import { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface PhantomWalletProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function PhantomWallet({ onConnect, onDisconnect }: PhantomWalletProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        const address = response.publicKey.toString();
        setWalletAddress(address);
        onConnect(address);
      }
    } catch (error) {
      console.log('Wallet not auto-connected');
    }
  };

  const connectWallet = async () => {
    const { solana } = window as any;
    
    if (!solana) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const response = await solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      onConnect(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window as any;
    if (solana) {
      await solana.disconnect();
      setWalletAddress(null);
      onDisconnect();
    }
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-white/30 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </span>
          </div>
        </div>
        <Button 
          onClick={disconnectWallet}
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-xl shadow-lg gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl gap-2 px-6"
      size="lg"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? 'Connecting...' : 'Connect Phantom'}
    </Button>
  );
}
