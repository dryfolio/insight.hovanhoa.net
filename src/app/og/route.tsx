import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = searchParams.get("title");

  // const font = fetch(
  //   new URL("../../public/font/inter.ttf", import.meta.url)
  // ).then((res) => res.arrayBuffer());

  // const fontData = await font;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundImage: "url(https://suhailkakar-com.vercel.app/og-bg.png)",
        }}
      >
        <div
          style={{
            marginLeft: 150,
            marginTop: 170,
            display: "flex",
            fontWeight: "bold",
            fontSize: 50,
            fontFamily: "Inter",
            letterSpacing: "-0.05em",
            color: "#2D3748",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
