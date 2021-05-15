import { Router } from "express";
import { getRepository } from "typeorm";
import { Donation } from '../entities/Donation';

const router = Router();


router.get("/", async(_req, res) => {
    const donationRepo = getRepository(Donation);
    const donations = await donationRepo.find();
    return res.json(donations);
});

router.get("/:id", async (req, res) =>{
    const donationRepo = getRepository(Donation);
    const result = await donationRepo.findOne(req.params.id);

    if(!result){
        return res.status(404).json({ msg: "Donation not found" });
    }

    return res.json(result);
});

router.post("/", async(req, res) =>{
    const donationRepo = getRepository(Donation);
    const donation = donationRepo.create(req.body);
    const result = await donationRepo.save(donation);
    return res.json(result);
});

router.delete("/:id", async(req, res) => {
    const dontationRepo = getRepository(Donation);
    const result = await dontationRepo.delete(req.params.id);
    return res.json(result);
});


export default router;