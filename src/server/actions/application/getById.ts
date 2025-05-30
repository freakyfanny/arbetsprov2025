import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

router.get("/application/:id", async (req, res) => {
  const schema = z.object({
    id: z.string().min(1, "ID krävs"),
  });

  const parse = schema.safeParse(req.params);
  if (!parse.success) {
    return res.status(400).json({ error: "Ogiltigt ID" });
  }

  try {
    const { id } = parse.data;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: "Ansökan hittades inte" });
    }

    const parsedApp = {
      ...application,
      activities: application.activities.split(",").map(a => a.trim()),
    };

    res.json(parsedApp);
  } catch (error) {
    console.error("Error fetching application by ID:", error);
    res.status(500).json({ error: "Fel vid hämtning av ansökan" });
  }
});

export default router;
