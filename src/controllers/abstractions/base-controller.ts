import * as express from "express";

export abstract class BaseController {
  public router: express.Router;

  protected constructor() {
    this.router = express.Router();
  }
  public abstract initializeRoutes(): void;
}
