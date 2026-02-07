import { NextResponse } from "next/server";

export const runtime = "nodejs";

const getBackendUrl = () => {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URL is not set");
  }

  return backendUrl;
};

const setProxyHeaders = (req: Request) => {
  const headers = new Headers();
  const cookie = req.headers.get("cookie");
  const contentType = req.headers.get("content-type");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  if (contentType) {
    headers.set("content-type", contentType);
  }

  return headers;
};

export const forwardSetCookie = (source: Response, target: NextResponse) => {
  const headersWithCookies = source.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookies = headersWithCookies.getSetCookie?.();

  if (setCookies && setCookies.length > 0) {
    for (const value of setCookies) {
      target.headers.append("set-cookie", value);
    }
    return;
  }

  const setCookie = source.headers.get("set-cookie");
  if (setCookie) {
    target.headers.set("set-cookie", setCookie);
  }
};

export const proxyAuthRequest = async (req: Request, path: string) => {
  const backendUrl = getBackendUrl();
  const method = req.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.text();

  const res = await fetch(`${backendUrl}${path}`, {
    method,
    headers: setProxyHeaders(req),
    body,
    cache: "no-store",
  });

  const responseBody = await res.text();
  const out = new NextResponse(responseBody, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });

  forwardSetCookie(res, out);
  return out;
};
