import ObjectID from "bson-objectid";
import { z } from "zod";

const objectIdSchema = z.string().refine(ObjectID.isValid);

export default objectIdSchema;
