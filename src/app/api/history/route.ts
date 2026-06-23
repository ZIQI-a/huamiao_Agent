import { NextResponse } from "next/server";
import { getArticles, getPoems } from "@/lib/db/operations";

export async function GET() {
    const [articlesList, poemsList] = await Promise.all([
        getArticles(),
        getPoems(),
    ]);

    return NextResponse.json({
        articles: articlesList,
        poems: poemsList,
    });
}
