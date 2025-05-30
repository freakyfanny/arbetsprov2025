import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const ApplicationSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  activities: z
    .array(z.string())
    .min(3, "Minst 3 aktiviteter krävs")
    .max(3, "Max 3 aktiviteter tillåtna"),
});

router.post("/applications/create", async (req, res) => {
  const parse = ApplicationSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({
      errors: parse.error.flatten().fieldErrors || {},
    });
  }

  try {
    const { name, email, activities } = parse.data;

    const newApp = await prisma.application.create({
      data: {
        name,
        email,
        activities: activities.join(", "),
      },
    });

    res.status(201).json({ message: "Ansökan sparad!", data: newApp });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
});

export default router;
