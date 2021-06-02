import { Router } from "express";
import { getRepository } from "typeorm";
import { Donation } from '../entities/Donation';

const router = Router();


router.get("/", async(_req, res, next) => {
    try {
        const donationRepo = getRepository(Donation);
        const donations = await donationRepo.find();
        res.json({donations});
    } catch(error) {
        next(error);
    }
});

router.get("/:id", async (req, res) =>{
    try {
        const donationRepo = getRepository(Donation);
        const result = await donationRepo.findOne(req.params.id);
    
        if(!result){
            return res.status(404).json({ msg: "Donation not found" });
        }
    
        return res.json({result});
    } catch(error) {
        console.warn(error);
        return res.status(500);
    }
});

router.post("/", async(req, res) => {
    try {
        const donationRepo = getRepository(Donation);
        const donation = donationRepo.create(req.body);
        const result = await donationRepo.save(donation);
        return res.json(result);
    } catch(error){
        console.warn(error, req.body);
        return res.status(500);
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const dontationRepo = getRepository(Donation);
        const result = await dontationRepo.delete(req.params.id);
        return res.json(result);
    } catch(error) {
        console.warn(error, req.params.id);
        return res.status(500);
    }
});


export default router;