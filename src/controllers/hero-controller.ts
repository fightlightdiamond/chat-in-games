import express from "express";
import { BaseController } from "./abstractions/base-controller";

export default class HeroController extends BaseController {
  public path = "/heroes";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllHero);
    this.router.post(this.path, this.addHero);
  }
  getAllHero = async (request: express.Request, response: express.Response) => {
    response.json(request.body);
  };
  addHero = async (request: express.Request, response: express.Response) => {
    response.json(request.body);
  };
}
