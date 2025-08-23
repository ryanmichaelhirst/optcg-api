import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="relative z-10">
      <hr className="mx-auto w-1/2 border-white" />
      <div className="container mx-auto flex items-center justify-center py-8">
        <p className="text-sm text-white">
          &copy; {new Date().getFullYear()} ryanmichaelhirst.optcg-api.com. All rights reserved.
        </p>
        <p className="ml-8 mr-2 font-bold text-white">|</p>
        <Button
          onClick={() => window.open("https://github.com/ryanmichaelhirst/optcg-api", "_blank")}
          className="text-white hover:no-underline"
          variant="ghost"
        >
          Github
        </Button>
      </div>
    </footer>
  )
}
