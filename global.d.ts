// Extend the global `window` interface to include `ethereum`
declare global {
  interface Ethereum {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  }

  interface Window {
    ethereum?: Ethereum;
  }
}

// Ensure the file is treated as a module
export {};

// Module declarations for UI components
declare module "@/components/ui/card" {
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
}

// Module declarations for UI components
declare module "@/components/ui/button" {
  // Use a unique alias to avoid conflicts
  export const UIButton: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    { variant?: string; size?: string; asChild?: boolean } &
    React.RefAttributes<HTMLButtonElement>
  >;
}


declare module "@/components/ui/alert" {
  export const Alert: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}
