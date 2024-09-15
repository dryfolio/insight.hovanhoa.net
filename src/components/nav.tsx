import { GITHUB, TWITTER } from "@/constants";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header>
      <nav className="relative mx-auto max-w-xl">
        <ul className="flex items-center space-x-6 text-base text-slate-400 cursor-pointer">
          <Link
            className="hover:text-slate-900 transition duration-300 ease-in-out"
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-slate-900 transition duration-300 ease-in-out"
            target="_blank"
            href={`https://twitter.com/${TWITTER}`}
          >
            Twitter
          </Link>
          <Link
            className="hover:text-slate-900 transition duration-300 ease-in-out"
            target="_blank"
            href={`https://github.com/${GITHUB}`}
          >
            GitHub
          </Link>
        </ul>
      </nav>
    </header>
  );
}
