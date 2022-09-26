import Product from "../../../../models/Product";
import db from "../../../../utilities/db";

const handler = async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id); // !Remember: id comes from file name [id].js
  await db.disconnect();
  res.status(200).json(product);
};

export default handler;
