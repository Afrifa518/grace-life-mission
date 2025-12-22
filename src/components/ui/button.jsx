import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary/95 hover:shadow-md hover:shadow-black/15',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm shadow-black/10 hover:bg-destructive/95 hover:shadow-md hover:shadow-black/15',
				outline:
					'border border-input/80 bg-background/70 backdrop-blur-sm hover:bg-accent/70 hover:text-accent-foreground',
				secondary:
					'bg-secondary/80 text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary hover:shadow-md hover:shadow-black/10',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-11 px-5 py-2.5 text-[0.95rem]',
				sm: 'h-10 rounded-lg px-4 text-[0.9rem]',
				lg: 'h-12 rounded-xl px-8 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
