import { Get, Route } from "tsoa";

@Route("ping")
export default class PingController {

@Get("/")  
public async getMessage(): Promise<any> {
    return {
      message: "pong",
    };
  }
}
