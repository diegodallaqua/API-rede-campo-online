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
import { projectMediaRoutes } from "../../../../modules/projectMedia/http/routes/routes";
import { eventsRoutes } from "../../../../modules/events/http/routes/routes";
import { eventMediaRoutes } from "../../../../modules/eventMedia/http/routes/routes";
import { newsRoutes } from "../../../../modules/news/http/routes/routes";
import { newsMediaRoutes } from "../../../../modules/newsMedia/http/routes/routes";
import { publicationsRoutes } from "../../../../modules/publications/http/routes/routes";
import { externalAuthorsRoutes } from "../../../../modules/externalAuthors/http/routes/routes";
import { contributorRolesRoutes } from "../../../../modules/contributorRoles/http/routes/routes";
import { publicationContributorsRoutes } from "../../../../modules/publicationContributors/http/routes/routes";


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
routes.use("/news-media", newsMediaRoutes);
routes.use("/publications", publicationsRoutes);
routes.use("/external-authors", externalAuthorsRoutes);
routes.use("/contributor-role", contributorRolesRoutes);
routes.use("/publication-contributors", publicationContributorsRoutes);