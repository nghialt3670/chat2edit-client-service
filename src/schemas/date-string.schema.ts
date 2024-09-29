import { z } from "zod";

const dateStringSchema = z.string().transform((dateStr) => new Date(dateStr));

export default dateStringSchema;
