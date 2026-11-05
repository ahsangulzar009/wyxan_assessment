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

    return (data.users ?? []).map((user) => ({
      id: user._id,
      name: user.name,
    }));
  } catch (error) {
    throw new Error(`Could not load people from ${API_BASE_URL}/users.`, {
      cause: error,
    });
  }
}
