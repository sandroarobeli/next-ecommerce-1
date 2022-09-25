import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// THIS BLOCK ALLOWS TO LOCK ANY API CONTROLLER WE WANT, BY LIMITING IT TO SIGNED IN USERS.
// CAN AND SHOULD BE USED FOR ANY AND ALL SENSITIVE CONTROLLER FILES
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
