import { Router } from "express";
import { statesRoutes } from "../../../../modules/states/http/routes/routes";
import { citiesRoutes } from "../../../../modules/cities/http/routes/routes";
import { addressesRoutes } from "../../../../modules/addresses/http/routes/routes";
import { organizationsRoutes } from "../../../../modules/organizations/http/routes/routes";
import { memberRolesRoutes } from "../../../../modules/memberRoles/http/routes/routes";
import { membersRoutes } from "../../../../modules/members/http/routes/routes";

export const routes = Router();

routes.use("/states", statesRoutes);
routes.use("/cities", citiesRoutes);
routes.use("/addresses", addressesRoutes);
routes.use("/organizations", organizationsRoutes);
routes.use("/member-roles", memberRolesRoutes);
routes.use("/members", membersRoutes);