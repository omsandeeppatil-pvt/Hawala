// Extend the global `window` interface to include `ethereum`
declare global {
  interface Ethereum {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  }

  interface Window {
    ethereum?: Ethereum;
  }
}

// Ensure the file is treated as a module
export {};

// Module declarations for the Card components
declare module "@/components/ui/card" {
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
}

// Module declarations for the Button component
declare module "@/components/ui/button" {
  export const Button: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> & 
    {
      variant?: string; 
      size?: string; 
      asChild?: boolean;
    } & 
    React.RefAttributes<HTMLButtonElement>
  >;
}

// Module declarations for the Alert components
declare module "@/components/ui/alert" {
  export const Alert: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
}
