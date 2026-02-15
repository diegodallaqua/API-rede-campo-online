import { container } from "tsyringe";
import { IAddressRepository } from "../repositories/IAddressRepository";
import { AddressRepository } from "../repositories/AddressRepository";

container.registerSingleton<IAddressRepository>(
  "AddressRepository",
  AddressRepository
);
