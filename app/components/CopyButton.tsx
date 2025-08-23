import { Button } from "@/components/ui/button"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"

interface CopyButtonProps {
  text: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function CopyButton({
  text,
  variant = "ghost",
  size = "sm",
  className = "",
  showText = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      console.log("CopyButton: Attempting to copy text:", text)
      await navigator.clipboard.writeText(text)
      setCopied(true)

      console.log("CopyButton: Text copied successfully, showing toast")
      // Show success toast message
      toast.success("Content copied to clipboard", {
        description: "The text has been copied to your clipboard",
        duration: 2000,
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("CopyButton: Failed to copy text: ", err)

      // Show error toast
      toast.error("Failed to copy content", {
        description: "Please try copying manually",
        duration: 3000,
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      className={className}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <IconCheck className="h-4 w-4" />
          {showText && <span className="ml-2">Copied!</span>}
        </>
      ) : (
        <>
          <IconCopy className="h-4 w-4" />
          {showText && <span className="ml-2">Copy</span>}
        </>
      )}
    </Button>
  )
}
