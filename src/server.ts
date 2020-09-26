import { Server } from '@overnightjs/core';
import { json, urlencoded } from 'express';
import { injectable } from 'inversify';

@injectable()
export class MainServer extends Server {
    constructor() {
        super(process.env.NODE_ENV?.trim() === 'development' || false);
        this.app.use(json());
        this.app.use(urlencoded());
        this.setupControllers();
    }

    private setupControllers() {

    }
}