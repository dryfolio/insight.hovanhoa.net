import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <Link target="_blank" href={"https://www.web3forall.xyz"}>
      <div className="h-14 bg-neutral-900 flex flex-row items-center justify-center text-neutral-200">
        <p>
          introducing web3forall.xyz - where web3 is explained like you’re five.
        </p>
      </div>
    </Link>
  );
}
