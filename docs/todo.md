## todo

### typescript

#### support

 * handle the message triggers based on role config
   * target / slack / email
 * additional rbac checks for ownership of messages when updating
   * first example of "is this object owned by" check


### general

 * reverse roles - a role that removes an org role
 * import child_org roles - enable an org to declare the roles each child org will have for quick setup of roles


 * apps
   * database entry for app with id / config
   * project config lists the active apps

 * platform UI
   * load and enable user to switch between
     * projects
     * orgs
   * know what apps are active for the project
   * display links to apps
   * render apps

 * customization
   * if custom code needs to be written for a custom it can be deployed as an app
   * hooks are triggered by apps that can be picked up by the hooks controller which will dispatch other actions
   * the hooks controller is a monoloth of all our edge cases

 * implement PPC app
 * implement nopress apps

 * in the apps use the RBAC tree to decide on access


## done

 * controller apis
   * org
   * user
   * role
   * apps
   * project
   * link orgs in project
   * assign user roles in project
   
 * hook up janitor to above apis

 * api/frontend code sharing (use github packages)
     * the point of this is an app should not repeat code in other apps
   * app migrations
     * the app role creation should by a migration
     * all tables can use org / user fields just not locally linked
   * app deployment
     * deployed in seperate namespaces - configured to speak to core over service