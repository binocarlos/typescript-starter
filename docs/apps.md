## apps

How projects are configured with apps

### app config

The app will have a database entry with a `meta` field that controls the global config that that app.

 * `name`
 * `title`
 * `visibility` (public,system)
   * public apps are things the users can interact with and will display menu options
   * system apps are background apps that help other apps and there will be no menu options

### project config

The project has settings that control the theme of the frontend:

 * `logo`
 * `palette`

The project meta will list an `apps` array that controls which apps are active for the project and the project level config.

It will also have a `menu` array that controls the menu options the frontend will display.

These can require the user to have certain scopes in order to display.

Each menu item has:

 * title
 * link {name,params}
 * icon
 * children
 * scopes
 * scope_mode (all,any)

```js
const project = {
  name: 'My Test Project',
  meta: {
    logo: '/img/logo.png', // we put these in assets for the moment
    palette: {
      primary: {
        main: '#ff0000',
      },
      secondary: {
        main: '#0000ff',
      },
    },
    apps: [{
      name: 'knowledgebase',
      config: {
        // any project <-> app level config goes here
        types: {
          faq: {
            title: 'FAQ',
          },
          update: {
            title: 'Update',
          }
        }
      }
    }, {
      name: 'support',
    }, {
      name: 'reporting',
    }],
    menu: [{
      title: 'FAQs',
      link: {
        name: 'knowledgebase.list',
        params: {
          type: 'faq',
        }
      }
    }, {
      title: 'Updates',
      link: {
        name: 'knowledgebase.list',
        params: {
          type: 'update',
        }
      }
    }, {
      title: 'Support',
      link: {
        name: 'support.list',
      }
    }]
  }
}
```

### frontend

The frontend will always be looking in the context of a project.

The main menu (hamburger) will be driven by the project config.

Once a section is loaded - the app frontend code will look after the sub-menu based on the user scope tree (which the frontend will load and interrogate).