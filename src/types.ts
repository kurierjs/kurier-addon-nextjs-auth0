import { UserProfile } from "@auth0/nextjs-auth0";

declare module "kurier" {
  interface Application {
    getAuth0User: () => UserProfile;
  }
}
