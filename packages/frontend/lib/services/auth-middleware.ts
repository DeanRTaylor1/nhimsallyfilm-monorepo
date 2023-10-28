import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export const authMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
