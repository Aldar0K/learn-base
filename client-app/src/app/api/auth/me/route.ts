import { proxyAuthRequest, runtime } from "../_utils";

export { runtime };

export async function GET(req: Request) {
  return proxyAuthRequest(req, "/api/auth/me");
}
