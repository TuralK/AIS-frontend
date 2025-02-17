import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import PropTypes from "prop-types"

import { cn } from "../../utils/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef(function DropdownMenuSubTrigger(props, ref) {
  const { className, inset, children, ...restProps } = props
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        inset && "pl-8",
        className,
      )}
      {...restProps}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
})

DropdownMenuSubTrigger.propTypes = {
  className: PropTypes.string,
  inset: PropTypes.bool,
  children: PropTypes.node,
}

const DropdownMenuSubContent = React.forwardRef(function DropdownMenuSubContent(props, ref) {
  const { className, ...restProps } = props
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...restProps}
    />
  )
})

DropdownMenuSubContent.propTypes = {
  className: PropTypes.string,
}

const DropdownMenuContent = React.forwardRef(function DropdownMenuContent(props, ref) {
  const { className, sideOffset = 4, ...restProps } = props
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...restProps}
      />
    </DropdownMenuPrimitive.Portal>
  )
})

DropdownMenuContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
}

const DropdownMenuItem = React.forwardRef(function DropdownMenuItem(props, ref) {
  const { className, inset, ...restProps } = props
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...restProps}
    />
  )
})

DropdownMenuItem.propTypes = {
  className: PropTypes.string,
  inset: PropTypes.bool,
}

const DropdownMenuCheckboxItem = React.forwardRef(function DropdownMenuCheckboxItem(props, ref) {
  const { className, children, checked, ...restProps } = props
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      checked={checked}
      {...restProps}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})

DropdownMenuCheckboxItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  checked: PropTypes.bool,
}

const DropdownMenuRadioItem = React.forwardRef(function DropdownMenuRadioItem(props, ref) {
  const { className, children, ...restProps } = props
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...restProps}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})

DropdownMenuRadioItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const DropdownMenuLabel = React.forwardRef(function DropdownMenuLabel(props, ref) {
  const { className, inset, ...restProps } = props
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...restProps}
    />
  )
})

DropdownMenuLabel.propTypes = {
  className: PropTypes.string,
  inset: PropTypes.bool,
}

const DropdownMenuSeparator = React.forwardRef(function DropdownMenuSeparator(props, ref) {
  const { className, ...restProps } = props
  return (
    <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...restProps} />
  )
})

DropdownMenuSeparator.propTypes = {
  className: PropTypes.string,
}

const DropdownMenuShortcut = function DropdownMenuShortcut(props) {
  const { className, ...restProps } = props
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...restProps} />
}

DropdownMenuShortcut.propTypes = {
  className: PropTypes.string,
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

