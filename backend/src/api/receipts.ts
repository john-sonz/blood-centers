import { Router } from "express";
import { getRepository, getConnection } from "typeorm";
import { Receipt } from '../entities/Receipt';
import { Donation } from '../entities/Donation';

const router = Router();


router.get("/", async(_req, res, next) => {
    try {
        const receiptsRepo = getRepository(Receipt);
        const receipts = await receiptsRepo.find();
        res.json(receipts);
    } catch(error) {
        next(error);
    }
});

router.get("/:id", async (req, res) =>{
    try {
        const receiptsRepo = getRepository(Receipt);
        const result = await receiptsRepo.findOne(req.params.id);
    
        if(!result){
            return res.status(404).json({ msg: "Receipt not found" });
        }
    
        return res.json(result);
    } catch (error) {
        console.warn(error);
        return res.status(500);
    }
});

router.post("/", async(req, res) =>{
    try {
        const receiptsRepo = getRepository(Receipt);
        const receipt = receiptsRepo.create(req.body);
        const result = await receiptsRepo.save(receipt);
        return res.json(result);
    } catch(error) {
        console.warn(error, req.body);
        return res.status(500);
    }
});

router.post("/:donationId", async(req, res) =>{
    try {
        const donationsRepo = getRepository(Donation);
        const donation = await donationsRepo.findOne(req.params.donationId);
    
        if(!donation){
            return res.status(404).json({ msg: "Donation not found" });
        }
    
        if(donation.availableMl < parseInt(req.body.ammount)){
            return res.status(404).json({ msg: "Not available amount" });
        }

        await getConnection()
        .createQueryBuilder()
        .update(Donation)
        .set({ availableMl: donation.availableMl - req.body.ammount })
        .where("id = :id", { id: donation.id })
        .execute();

        const receiptsRepo = getRepository(Receipt);
        const receipt = receiptsRepo.create(req.body);
        const result = await receiptsRepo.save(receipt);
        return res.json(result);
    } catch(error) {
        console.warn(error, req.body);
        return res.status(500);
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const receiptsRepo = getRepository(Receipt);
        const result = await receiptsRepo.delete(req.params.id);
        return res.json(result);
    } catch(error) {
        console.warn(error, req.params.id);
        return res.status(500);
    }
});


export default router;