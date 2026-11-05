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
