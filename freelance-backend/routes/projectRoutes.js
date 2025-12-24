import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// 1️⃣ GET /projects?status=available|inProgress|completed|proposal
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const projects = await Project.find(filter).sort({ postedTime: -1 });
    console.log(`Projects found for status=${status || "all"}:`, projects.length);

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

// 2️⃣ GET /projects/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project); // returns a single project object
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Error fetching project", error });
  }
});

// 3️⃣ POST /projects/:id/bid
router.post("/:id/bid", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.proposals = (project.proposals || 0) + 1;   // increment proposal count
    project.status = "proposal";                        // change status
    project.proposalStatus = "pending";                // new field

    await project.save();

    res.json({ message: "Bid submitted", project });
  } catch (error) {
    console.error("Error submitting bid:", error);
    res.status(500).json({ message: "Error submitting bid", error });
  }
});

// 4️⃣ GET /projects/freelancer/:userId
router.get("/freelancer/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching freelancer projects" });
  }
});

export default router;
