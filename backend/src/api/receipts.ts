import { Router } from "express";
import { getRepository } from "typeorm";
import { Receipt } from '../entities/Receipt';
import { Donation } from '../entities/Donation';

const router = Router();


router.get("/", async(_req, res) => {
    const receiptsRepo = getRepository(Receipt);
    const receipts = await receiptsRepo.find();
    return res.json(receipts);
});

router.get("/:id", async (req, res) =>{
    const receiptsRepo = getRepository(Receipt);
    const result = await receiptsRepo.findOne(req.params.id);

    if(!result){
        return res.status(404).json({ msg: "Receipt not found" });
    }

    return res.json(result);
});

router.post("/", async(req, res) =>{
    const receiptsRepo = getRepository(Receipt);
    const receipt = receiptsRepo.create(req.body);
    const result = await receiptsRepo.save(receipt);
    return res.json(result);
});

router.post("/:donationId/:amount", async(req, res) =>{
    const donationsRepo = getRepository(Donation);
    const donation = await donationsRepo.findOne(req.params.donationId);

    if(!donation){
        return res.status(404).json({ msg: "Donation not found" });
    }

    if(donation.availableMl < parseInt(req.params.amount)){
        return res.status(404).json({ msg: "Not available amount" });
    }

    const receiptsRepo = getRepository(Receipt);
    const receipt = receiptsRepo.create(req.body);
    const result = await receiptsRepo.save(receipt);
    return res.json(result);
});

router.delete("/:id", async(req, res) => {
    const receiptsRepo = getRepository(Receipt);
    const result = await receiptsRepo.delete(req.params.id);
    return res.json(result);
});


export default router;