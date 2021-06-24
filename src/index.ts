import { getSession } from "@auth0/nextjs-auth0";
import { Addon, Application, ApplicationInstance, JsonApiErrors, OperationProcessor, Resource } from "kurier";

type TransportLayerHandler = (app: Application) => (...args: any[]) => Function;

type GenericResponse = {
  status: (statusCode: number) => GenericResponse;
  json: (data: object) => GenericResponse;
}

export default class NextJSAuth0Addon extends Addon {
  async install(): Promise<void> {
    const getUserAttributes = this.options.getUserAttributes;

    const buildBaseProcessor = (type: typeof OperationProcessor) => class NextJSAuth0KurierBaseProcessor extends type<any> {
      constructor(appInstance: ApplicationInstance) {
        super(appInstance);

        const user = appInstance.app.getAuth0User();

        this.appInstance.user = {
          id: user.sub,
          attributes: getUserAttributes ? getUserAttributes(user) : { ...user },
          relationships: {},
          type: 'user'
        }
      }
    }

    this.app.defaultProcessor = buildBaseProcessor(this.app.defaultProcessor);
    this.app.processors = this.app.processors.map(processor => buildBaseProcessor(processor));
  }
}

export const withProtectedKurierApi = (transport: TransportLayerHandler, app: Application) => {
  return async (req: unknown, res: GenericResponse) => {
    const session = getSession(req, res);

    if (!session) {
      return res.status(401).json({
        errors: [JsonApiErrors.Unauthorized()],
      });
    }

    app.getAuth0User = () => session.user;

    return transport(app)(req, res);
  }
}
