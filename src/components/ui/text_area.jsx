import * as React from "react"
import { cn } from "../../utils/utils.js"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const [height, setHeight] = React.useState('auto');

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
      setHeight(`${ref.current.scrollHeight}px`);
    }
  }, [props.value, ref]);

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      style={{ height }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }  