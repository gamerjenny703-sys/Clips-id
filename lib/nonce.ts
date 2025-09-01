import { headers } from "next/headers";

export function getNonce(): string {
  const headersList = headers();
  const nonce = headersList.get("x-nonce");
  return nonce || "";
}
