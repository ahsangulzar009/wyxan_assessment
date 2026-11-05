export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type User = {
  id: string;
  name: string;
};
type UsersResponse = {
  users: Array<{ _id: string; name: string }>;
};

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GET /users failed with ${response.status}`);
    }

    const data = (await response.json()) as UsersResponse;

    return data.users.map((user) => ({
      id: user._id,
      name: user.name,
    }));
  } catch (error) {
    throw new Error(`Could not load people from ${API_BASE_URL}/users.`, {
      cause: error,
    });
  }
}

export type Via = "typed" | "link" | "history" | "search";
export type Site = {
  address: string;
  title: string;
  html: string;
};

export async function visitSite(input: {
  userId: string;
  address: string;
  via: Via;
}): Promise<Site | null> {
  const response = await fetch(`${API_BASE_URL}/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Internal server error");
  }

  const data = (await response.json()) as { site: Site };
  return data.site;
}

export type Visit = {
  id: string;
  address: string;
  title: string | null;
  via: Via;
  visitedAt: string;
};
export async function getHistory(userId: string): Promise<Visit[]> {
  const response = await fetch(
    `${API_BASE_URL}/visit?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Internal server error");
  }

  const data = (await response.json()) as { visitors?: Visit[] };
  return data.visitors ?? [];
}

export type SearchResult = {
  address: string;
  title: string;
  snippet: string;
};

export async function searchSites(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `${API_BASE_URL}/sites/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Internal server error");
  }

  const data = (await response.json()) as { sites?: SearchResult[] };
  return data.sites ?? [];
}


export async function publishSite(input: {
  authorId: string;
  address: string;
  title: string;
  html: string;
}): Promise<{ address: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/sites/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json().catch(() => null)) as {
    message: string | string[];
    site: { address: string };
  };

  if (!response.ok) {
    const message = data?.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : (message ?? "Internal server error"),
    );
  }

  return {
    address: data?.site?.address ?? input.address,
    message: typeof data?.message === "string" ? data.message : "Published.",
  };
}
