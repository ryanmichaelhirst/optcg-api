import { Outlet } from "@remix-run/react"
import { Navbar } from "./Navbar"

export default function Layout() {
  return (
    <>
      <div className="flex justify-center bg-gray-300 p-4">
        <Navbar />
      </div>
      <Outlet />
    </>
  )
}
