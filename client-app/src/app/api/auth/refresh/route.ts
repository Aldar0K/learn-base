import { proxyAuthRequest, runtime } from "../_utils";

export { runtime };

export async function POST(req: Request) {
  return proxyAuthRequest(req, "/api/auth/refresh");
}
