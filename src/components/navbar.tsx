"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white m-auto shadow-sm w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* --- LOGO --- */}
          <div className="md:flex md:items-center md:gap-12">
            <Link href="/" className="block text-teal-600">
              <span className="sr-only">Home</span>
              <div className="bg-gray-800 rounded-lg w-35 h-10 flex">
                <img src="/cu.png" alt="Logo" />
              </div>
            </Link>
          </div>

          {/* --- NAV LINKS --- */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* --- BUTTONS + HAMBURGER --- */}
          <div className="flex items-center gap-4 relative">
            {/* Sign in (always visible) */}
            <Link
              href="/signin"
              className="rounded-md bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-600 transition"
            >
              Sign in
            </Link>

            {/* Get Started (hidden on small screens) */}
            <div className="hidden sm:flex">
              <Link
                href="/signup"
                className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-green-500 hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Hamburger for small screens */}
            <div className="block sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-800"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Dropdown when open */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                  <Link
                    href="/signup"
                    className="block text-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-green-600 hover:bg-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

{/* export function Navbar() {
  return (
<header className="bg-white m-auto shadow-sm width-full ">
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="md:flex md:items-center md:gap-12">
        <a className="block text-teal-600" href="/">
          <span className="sr-only">Home</span>

          <div className="bg-gray-800  rounded-lg w-35 h-10 flex"><img src="/cu.png" alt="Logo" /></div>
        </a>
      </div>

      <div className="hidden md:block">
        <nav aria-label="Global">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/"> Home </a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/"> About </a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/"> Contact </a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/"> Services </a>
            </li>

            {/*<li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a>
            </li>
*
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="sm:flex sm:gap-4">
          <a
            className="rounded-md cursor-pointer bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
            href="/signin"
          >
            Sign in
          </a>

          <div className="hidden sm:flex">
            <a
              className="rounded-md cursor-pointer bg-gray-100 px-5 py-2.5 text-sm font-medium text-green-500"
              href="/signup"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="block md:hidden">
          <button
            className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>)}*/}
