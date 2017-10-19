## WIP

[simpla.io](https://simpla.io)

`yarn add simpla-adapter-netlify-identity`

```js
import SimplaNetlifyIdentity from 'simpla-adapter-netlify-identity'

Simpla.init({

  /**
  * Auth adapter
  */
  auth: new SimplaNetlifyIdentity({ site: 'netlify-site-name' }),
  /**
   * Github Repo
   * Repository where content will be stored (in a '_content' folder)
   */
  repo: 'user/repo',

  /**
   * Public content source (optional)
   * Public URL of your content, defaults to fetching directly from GitHub
   * Push your content to a CDN like Netlify in production
   */
  source: window.location.origin,

  /**
   * Commit branch (optional)
   * Git branch Simpla commits new content to, defaults to 'master'
   * Change this in development to make non-production changes
   */
  branch: 'simpla',

  /**
   * Public directory (optional)
   * Base directory to store Simpla's '_content' folder
   * Defaults to the root of the repo
   */
  public: 'public'
})
```
