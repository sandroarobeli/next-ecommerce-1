import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
  res.status(200).json({
    message:
      "This is protected content. You may access this content because you are signed in.",
  });
};

export default handler;
