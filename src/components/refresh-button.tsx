import { RefreshCwIcon } from "lucide-react"
import { useCallback, useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

interface Props extends Omit<ComponentProps<typeof Button>, "onClick"> {
  onClick?: () => Promise<unknown>
}

export function RefreshButton({
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: Props) {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleClick = useCallback(() => {
    if (isSpinning) {
      return
    }

    setIsSpinning(true)
    void onClick?.().then(() => {
      setTimeout(() => {
        setIsSpinning(false)
      }, 600)
      return undefined
    })
  }, [isSpinning, onClick])

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "size-4 cursor-pointer p-0.5",
        className,
        isSpinning && "animate-spin-once"
      )}
      onClick={handleClick}
      {...props}
    >
      <RefreshCwIcon className="size-full" />
    </Button>
  )
}
