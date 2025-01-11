// Declare window.ethereum to prevent TypeScript errors
interface Window {
  ethereum: any; // Use 'any' for simplicity, or refine the type if needed
}

// Add module declarations for components
declare module "@/components/ui/card" {
  export const Card: React.FC<React.ComponentProps<'div'>>; // Adjust the type based on your actual component
  export const CardContent: React.FC<React.ComponentProps<'div'>>;
  export const CardDescription: React.FC<React.ComponentProps<'div'>>;
  export const CardHeader: React.FC<React.ComponentProps<'div'>>;
  export const CardTitle: React.FC<React.ComponentProps<'h2'>>; // or use a more specific type
}

declare module "@/components/ui/button" {
  export const Button: React.FC<React.ComponentProps<'button'>>; // Adjust based on the component's props
}

declare module "@/components/ui/alert" {
  export const Alert: React.FC<React.ComponentProps<'div'>>;
  export const AlertDescription: React.FC<React.ComponentProps<'div'>>;
}
