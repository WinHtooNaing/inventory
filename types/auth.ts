export type User = {
  id: number;
  name: string;
  userId: string;
  role: "ADMIN" | "BRANCH";
  success: boolean;
};
