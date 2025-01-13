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

// Module declarations for the Card components
declare module "@/components/ui/card" {
  export const CardComponent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardContentComponent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardDescriptionComponent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardHeaderComponent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardTitleComponent: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
}

// Module declarations for the Button component
declare module "@/components/ui/button" {
  export const ButtonComponent: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    { variant?: string; size?: string; asChild?: boolean } &
    React.RefAttributes<HTMLButtonElement>
  >;
}

// Module declarations for the Alert components
declare module "@/components/ui/alert" {
  export const AlertComponent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const AlertTitleComponent: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  export const AlertDescriptionComponent: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
}
