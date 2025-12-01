import { Request, Response } from "express";
import {logger} from '../utils/logger';

// Simulate Controller

// simulate database
export const simulateDB = async (req: Request, res: Response) => {
    const myDBRequest = db();

    myDBRequest.then((res) => {
        // DB request resolved
        logger.info('DB result completed');
    }).catch((err) => {
        logger.error('Error occured.');
    });
    
    res.status(201).json({
        status: 'success',
        data: {
            id: '1'
        }
    });
}

// requesting database
export const db = async () => {
    return new Promise((resolve, reject) => {
        const isResolve = true;

        // DB request starts
        logger.info('Simulated DB call started');

        // DB request timeout
        setTimeout(() => {
            logger.info("Timeout log");

            if(isResolve){
                resolve('success');
            } else {
                reject('failed');
            }
        }, 50);
        
    });
    
    
}