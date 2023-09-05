import { NextResponse } from "next/server";
export async function GET(request: Request) {
  console.log("GET request in events", request.body);
  return NextResponse.json(
    { message: "GET request received successfully!" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  console.log("POST request in events", request.body);
  return NextResponse.json(
    { message: "POST request received successfully!" },
    { status: 200 }
  );
}
