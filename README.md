# `@kurier/addon-nextjs-auth0`

Integrates authorization mechanisms provided by `@auth0/nextjs-auth0` into Kurier.

## Requirements

- `kurier@^1.2.0-alpha3`

## Usage

Install it using npm or yarn:

```bash
$ npm i -D @kurier/addon-nextjs-auth0
$ yarn add -D @kurier/addon-nextjs-auth0
```

Add it to your Kurier app in Next.js and expose the protected API via Vercel:

```js
import NextJSAuth0Addon, { withProtectedKurierApi } from '@kurier/addon-nextjs-auth0';
import { jsonApiVercel } from 'kurier';

// ...

app.use(NextJSAuth0Addon, {
  getUserAttributes(user) {
    return {
      /* This will be injected into `user.attributes`.
         Be sure to add `roles` and/or `permissions` to take advantage
         of Kurier's authorization decorators. */
      roles: user.roles,
    }
  }
}

// ...

export default withProtectedKurierApi(jsonApiVercel, app);
```
