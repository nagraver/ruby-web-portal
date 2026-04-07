import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FlashMessage from './FlashMessage'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FlashMessage />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
