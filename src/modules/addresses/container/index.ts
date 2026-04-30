import { container } from "tsyringe";
import { IAddressRepository } from "../repositories/IAddressRepository";
import { AddressRepository } from "../repositories/AddressesRepository";

container.registerSingleton<IAddressRepository>(
  "AddressRepository",
  AddressRepository
);
