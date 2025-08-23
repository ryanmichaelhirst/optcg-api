import { Outlet } from "@remix-run/react"
import { Navbar } from "./Navbar"

export default function Layout() {
  return (
    <>
      <div className="fixed left-1/2 top-0 z-50 my-5 flex w-fit -translate-x-1/2 transform justify-center space-x-4 rounded-full bg-black px-10 py-2 shadow-lg">
        <Navbar />
      </div>
      <div className="mt-28">
        <Outlet />
      </div>
    </>
  )
}
