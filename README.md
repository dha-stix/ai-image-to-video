## Ghibli Video Generator with [Eachlabs AI](https://docs.eachlabs.ai/flow/getting-started)

### Getting Started
- Clone the GitHub repository
- Run the following code snippet to install the package dependencies:
  ```bash
  npm install
  ```
- Add your Eachlabs credentials to the `.env.local` file:
  ```env
  EACH_API_KEY=
  EACH_WORKFLOW_ID=
  ```
- Set up a Firebase app and set up the [Storage feature](https://firebase.google.com/docs/storage/web/start)
- Paste your Firebase app config into the `firebase.ts` file.
  ```ts
  const firebaseConfig = {
  /** -- your Firebase app config*/
  };
  ```

- Start the development server
  ```bash
  npm run dev
  ```
