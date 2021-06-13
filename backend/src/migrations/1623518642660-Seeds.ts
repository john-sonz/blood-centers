import { BloodType, User } from "../entities/User";
import {
  MigrationInterface,
  QueryRunner,
  getManager,
  getRepository,
} from "typeorm";

import { Donation } from "../entities/Donation";
import { Event } from "../entities/Event";
import { Message } from "../entities/Message";
import { Privilege } from "../entities/Privilege";
import { Receipt } from "../entities/Receipt";
import argon2 from "argon2";
import faker from "faker";

faker.setLocale("pl");
faker.seed(1337);

async function userSeeds(n: number = 20) {
  const repo = getRepository(User);
  const bloodTypes = Object.values(BloodType);
  const password = await argon2.hash("password");
  const admin: User = repo.create({
    bloodType: faker.random.arrayElement(bloodTypes),
    firstName: "Admin",
    lastName: "Admin",
    isAdmin: true,
    passwordHash: await argon2.hash("admin"),
    pesel: "11111111111",
  });

  const users: User[] = new Array(n).fill(0).map(() =>
    repo.create({
      bloodType: faker.random.arrayElement(bloodTypes),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      passwordHash: password,
      pesel: faker.phone.phoneNumber("##0########"),
    })
  );

  return [admin, ...users];
}

async function donationSeeds(users: User[], min: number = 1, max: number = 20) {
  const repo = getRepository(Donation);
  return Promise.all(
    users.map(async (user) => {
      user.donations = new Array(faker.datatype.number({ min, max }))
        .fill(0)
        .map(() => {
          const amountMl = faker.datatype.number({ min: 350, max: 450 });
          return repo.create({
            donator: user,
            amountMl,
            date: faker.date.past(5),
            availableMl: amountMl,
          });
        });

      await repo.save(user.donations);

      return user;
    })
  );
}

async function receiptSeeds(users: User[], min = 0, max = 3) {
  const repo = getRepository(Receipt);
  return await Promise.all(
    users.map(async (user) => {
      user.receipts = new Array(faker.datatype.number({ min, max }))
        .fill(0)
        .map(() => {
          const donator = faker.random.arrayElement(users);
          const donation = faker.random.arrayElement(donator.donations);
          return repo.create({
            amount: faker.datatype.number({ min: 50, max: 150 }),
            recipient: user,
            donation,
            date: faker.date.future(undefined, donation.date),
          });
        });

      await repo.save(user.receipts);
      return user;
    })
  );
}

async function messagesSeeds(receipts: Receipt[]) {
  const repo = getRepository(Message);
  return Promise.all(
    receipts.map(async (receipt) => {
      if (faker.datatype.number() % 4 === 0) return;

      const msg = repo.create({
        senderId: receipt.donation.donatorId,
        recipientId: receipt.recipientId,
        sentAt: faker.date.future(undefined, receipt.donation.date),
        text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 5 })),
      });

      return repo.save(msg);
    })
  );
}

async function privelagesSeeds() {
  const repo = getRepository(Privilege);

  const privileges = [
    repo.create({
      minDonatedAmountMl: 1,
      description: "Tytuł dzielnego dawcy",
    }),
    repo.create({
      minDonatedAmountMl: 600,
      description: "Bonusowa czekolada przy każdej następnej donacji",
    }),
    repo.create({
      minDonatedAmountMl: 2500,
      description: "Priorytet w kolejce przy każdej następnej donacji",
    }),
    repo.create({
      minDonatedAmountMl: 6000,
      description: "Priorytet w kolejce przy korzystaniu z opieki zdrowotnej",
    }),
    repo.create({
      minDonatedAmountMl: 10000,
      description: "Bezpłatna komunikacja miejska",
    }),
  ];

  return repo.save(privileges);
}

async function eventsSeeds(n = 20) {
  const repo = getRepository(Event);
  const events = new Array(n).fill(0).map(() =>
    repo.create({
      address: faker.address.streetAddress(),
      city: faker.address.cityName(),
      description: faker.lorem.sentences(
        faker.datatype.number({ min: 1, max: 5 })
      ),
      date:
        faker.datatype.number() % 2 == 0
          ? faker.date.past(2)
          : faker.date.soon(60),
    })
  );

  return repo.save(events);
}

export class Seeds1623518642660 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const receiptRepo = getRepository(Receipt);
    const userRepo = getRepository(User);
    let users = await userRepo.save(await userSeeds());
    users = await donationSeeds(users);
    users = await receiptSeeds(users);

    const receipts = await receiptRepo.find({ relations: ["donation"] });

    await Promise.all(
      receipts.map((receipt) =>
        getManager().transaction(async (tem) => {
          let donation = await tem.findOne(Donation, {
            where: { id: receipt.donationId },
          });
          if (!donation) return;
          donation = tem.merge(Donation, donation, {
            availableMl: donation.availableMl - receipt.amount,
          });
          tem.save(donation);
        })
      )
    );

    await messagesSeeds(receipts);
    await privelagesSeeds();
    await eventsSeeds();

    let events = await getRepository(Event).find();
    users = await userRepo.find();

    events = events.map((ev) => {
      ev.interestedUsers = faker.random.arrayElements(
        users,
        faker.datatype.number({ min: 3, max: 15 })
      );
      return ev;
    });

    await getRepository(Event).save(events);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    [
      "donations",
      "events",
      "messages",
      "privileges",
      "receipts",
      "session",
      "users",
    ].map(
      async (table) => await queryRunner.query(`TRUNCATE ${table} CASCADE`)
    );
  }
}
