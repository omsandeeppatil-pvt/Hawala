interface Window {
  ethereum: any; // Add this to avoid TypeScript errors with window.ethereum
}

// Add module declarations for components
declare module "@/components/ui/card" {
  export const Card: React.FC<any>;
  export const CardContent: React.FC<any>;
  export const CardDescription: React.FC<any>;
  export const CardHeader: React.FC<any>;
  export const CardTitle: React.FC<any>;
}

declare module "@/components/ui/button" {
  export const Button: React.FC<any>;
}

declare module "@/components/ui/alert" {
  export const Alert: React.FC<any>;
  export const AlertDescription: React.FC<any>;
}
