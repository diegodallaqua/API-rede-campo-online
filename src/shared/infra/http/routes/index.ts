import { Router } from "express";

import { sessionsRoutes } from "../../../../modules/sessions/http/routes/routes";

import { statesRoutes } from "../../../../modules/states/http/routes/routes";
import { citiesRoutes } from "../../../../modules/cities/http/routes/routes";
import { addressesRoutes } from "../../../../modules/addresses/http/routes/routes";
import { organizationsRoutes } from "../../../../modules/organizations/http/routes/routes";
import { memberRolesRoutes } from "../../../../modules/memberRoles/http/routes/routes";
import { membersRoutes } from "../../../../modules/members/http/routes/routes";
import { projectTypesRoutes } from "../../../../modules/projectTypes/http/routes/routes";
import { projectsRoutes } from "../../../../modules/projects/http/routes/routes";
import { projectMediaRoutes } from "../../../../modules/projectMedias/http/routes/routes";
import { eventsRoutes } from "../../../../modules/events/http/routes/routes";
import { eventMediaRoutes } from "../../../../modules/eventMedias/http/routes/routes";
import { newsRoutes } from "../../../../modules/news/http/routes/routes";


export const routes = Router();

routes.get("/health", (_req, res) => res.json({ status: "ok" }));
routes.use("/sessions", sessionsRoutes);


routes.use("/states", statesRoutes);
routes.use("/cities", citiesRoutes);
routes.use("/addresses", addressesRoutes);
routes.use("/organizations", organizationsRoutes);
routes.use("/member-roles", memberRolesRoutes);
routes.use("/members", membersRoutes);
routes.use("/project-types", projectTypesRoutes);
routes.use("/projects", projectsRoutes);
routes.use("/project-media", projectMediaRoutes);
routes.use("/events", eventsRoutes);
routes.use("/event-media", eventMediaRoutes);
routes.use("/news", newsRoutes);