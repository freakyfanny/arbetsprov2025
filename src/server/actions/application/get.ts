import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/applications/get", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsedApplications = applications.map(app => ({
      ...app,
      activities: app.activities.split(",").map(a => a.trim()),
    }));

    res.json(parsedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Något gick fel vid hämtning av ansökningar" });
  }
});

export default router;
