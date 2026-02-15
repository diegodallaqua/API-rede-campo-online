import { Router } from "express";
import { statesRoutes } from "../../../../modules/states/http/routes/routes";
import { citiesRoutes } from "../../../../modules/cities/http/routes/routes";
import { addressesRoutes } from "../../../../modules/addresses/http/routes/routes";

export const routes = Router();

routes.use("/states", statesRoutes);
routes.use("/cities", citiesRoutes);
routes.use("/addresses", addressesRoutes);