import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { CardBackgroundsResponse } from "@/types/notion";

export async function GET() {
  const cardsDir = path.join(process.cwd(), "public", "cards");
  const files = await readdir(cardsDir);
  const backgrounds = files
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .map((file) => file.replace(/\.png$/i, ""))
    .sort();

  return NextResponse.json<CardBackgroundsResponse>({ backgrounds });
}
