import { NextResponse } from "next/server";
export async function GET(request: Request) {
  console.log("GET request", request);

  return NextResponse.json(
    { message: "GET request received successfully!" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const body = await request.body!;
  const ussdInput: string | null = await readStreamAsText(body)
    .then((text) => {
      console.log("Here is the text:", text);
      return text;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return null;
    });

  const params = new URLSearchParams(ussdInput!);

  // Read the variables sent via POST from africa-is-talking USSD API
  const phoneNumber: string | null = params.get("phoneNumber"); // +256759935533
  const serviceCode: string | null = params.get("serviceCode"); // *384*143143#
  const text: string | null = params.get("text"); // (empty string)
  const sessionId: string | null = params.get("sessionId"); // ATUid_0b3c7019a6ee4a6fa5aa5b6ea5e09afb
  const networkCode = params.get("networkCode"); // 99999

  console.log("Session id: ", sessionId);
  console.log("Service code: ", serviceCode);
  console.log("Phone number: ", phoneNumber);
  console.log("Text: ", text);
  console.log("Network code: ", networkCode);

  // let res = `END Your phone number is ${phoneNumber}`;
  // return new NextResponse(res, { status: 200 });

  let response = "";
  if (text == "") {
    // This is the first request. Note how we start the response with CON
    response = `CON What would you like to check
        1. My account
        2. My phone number`;
  } else if (text == "1") {
    // Business logic for first level response
    response = `CON Choose account information you want to view
        1. Account number`;
  } else if (text == "2") {
    // Business logic for first level response
    // This is a terminal request. Note how we start the response with END
    response = `END Your phone number is ${phoneNumber}`;
  } else if (text == "1*1") {
    // This is a second level response where the user selected 1 in the first instance
    const accountNumber = "ACC100101";
    // This is a terminal request. Note how we start the response with END
    response = `END Your account number is ${accountNumber}`;
  } else {
    response = `END Invalid input`;
  }
  return new NextResponse(response, { status: 200 });
}

async function readStreamAsText(stream: ReadableStream) {
  // Get a reader from the stream
  const reader = stream.getReader();

  // Initialize an empty string to hold the text
  let text = "";

  // Loop to read each chunk
  while (true) {
    // Read a chunk
    const { value, done } = await reader.read();

    // If the stream is done, break out of the loop
    if (done) {
      break;
    }

    // Otherwise, append the chunk (which is a Uint8Array) to the text
    // Assume the text is encoded as UTF-8
    text += new TextDecoder("utf-8").decode(value);
  }

  // Don't forget to release the lock
  reader.releaseLock();

  // Return the accumulated text
  return text;
}
