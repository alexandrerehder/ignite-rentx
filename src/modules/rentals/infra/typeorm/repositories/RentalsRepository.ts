import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRenstalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRenstalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const openByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });
    return openByCar;
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openByUser = await this.repository.findOne({
      where: { user_id, end_date: null },
    });
    return openByUser;
  }
  async create({
    user_id,
    expected_return_date,
    car_id,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      user_id,
      expected_return_date,
      car_id,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }
  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);
    return rental;
  }
  async findByUser(user_id: string): Promise<Rental[]> {
    // Objeto car é usado para que além das informações de rental, o response traga as informações de car(Relation rental x car_id)
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ["car"],
    });
    return rentals;
  }
}

export { RentalsRepository };