## ppc

How we will implement the PPC apps on franchise cloud.

### apps

 * knowledgebase - updates / faqs
 * support - chat
 * communication - slack / email triggers
 * search - index documents
 * reporting - display iframes
 * payments - subscribe

#### knowledgebase

tables:

`knowledgebase_article`

 * project
 * type
 * title
 * content
 * meta

roles:

 * knowledgebase:editor
   * knowledgebase:viewer

config:

handlers:

 * list ({project,type})
   * role: knowledgebase:viewer
   * return the list of knowledgebase articles filtered by type
 * search ({project,type,query})
   * role: knowledgebase:viewer
   * trigger->onsearch({meta:{project,type,namespace:'knowledgebase'},query}) then return results
 * create -> ({project,type,title,content,meta})
   * role: knowledgebase:editor
   * create knowledgebase record
   * trigger->onindex(meta:{id,project,type,namespace:'knowledgebase'},data:{title,content}})
 * update -> ({project,id,title,content,meta})
   * role: knowledgebase:editor
   * update knowledgebase record
   * trigger->onindex({meta:{id,project,type,namespace:'knowledgebase'},data:{title,content}})

triggers:

 * onsearch -> search.query
 * onindex -> search.index

#### support

tables:

`support_thread`

 * project
 * user
 * title
 * status (open,archived)

`support_message`

 * support_thread
 * user (this can also be whoever responded)
 * content

roles:

 * support:admin
   * meta {target: 'thread_user'}
   * support:user
    * meta {target: 'parent_org'}

config:

handlers:

 * list_threads ({project,user})
   * role: support:admin
   * role: support:user
   * if support:admin list all threads
   * if support:user list user threads
   * return the list of knowledgebase articles filtered by role
 * search_threads ({project,user,query})
   * role: support:admin
   * role: support:user
   * if support:admin search all threads
     * trigger->onsearch({meta:{project,namespace:'support'},query}) then return results
   * if support:user search user threads
     * trigger->onsearch({meta:{project,user,namespace:'support'},query}) then return results
 * create_thread ({project,user,title})
   * role: support:user
   * create support_thread
 * create_message ({support_thread,user,content})
   * roles:
     * support:admin
     * user == support_thread.user
     * a user can always write to a thread they started or a user needs support:admin (because they are responding)
   * add record to database
   * look at the support:* role and get the 'target' from the meta
   * if target is `thread_user` -> trigger->onmessage({subject,content,type:'support',source:{type'user',id:user},target:{type:'user',id:support_thread.user}})
   * if target is `parent_org` -> trigger->onmessage({subject,content,type:'support',source:{type:'user',id:user},target:{type:'org',id:orgs[parent_org]}})
   * trigger->onindex({id,project,support_thread.user,namespace:'support',data:{support_thread.title,content}})

triggers:

 * onmessage -> communication.message
 * onsearch -> search.query
 * onindex -> search.index

#### communication

tables:

roles:

 * communication:slack
    * meta = {types: ['support', '*']}
 * communication:email
    * meta = {types: ['support', '*']}

config:

 * slack_endpoints
   * [org] ->
     * [type] ->
      * token
      * botname
      * channel

handlers:

 * message({type,source({type,id}),target({type,id}),subject,content})
   Send a message to a given user
   It will look at the communication roles for that user
   If communication:slack + type -> use config.slack_endpoints[org]
   If communication:email + type -> send email to user

triggers:

#### search

tables:

roles:

config:

handlers:

 * index({meta:{},data:{}})
   * insert data to elastic search - find a way to index via the meta so we can filter
 * query({meta:{},query})
   * return results from elastic search with a partial match on the meta
   * return the full meta with each result so the upstream can match it to a record

triggers:

#### reporting

tables:

roles:

 * reporting:viewer
   * meta: {reports:[{title,url}]

config:

handlers:

 * list({user})
   * role: reporting:viewer
   * return the `meta.reports` prop of the role

triggers:

#### payments

tables:

roles:

 * payments:subscribe
   * meta: {payments:{stripe_user_id: XXX, stripe_price_id: XXX}]
   * note: this role is auto-created and does not need to be defined up front

config:

 * stripe
   * default_price_id -> XXX
   * token_id -> points at the token table - this is to avoid tokens appearing in project export data

handlers:

 * status({user})
   * check for payments:subscribe role
     * if not exists create stripe user -> save to payments:subscribe role
   * load the stripe_price_id from either the role or project config
   * load the token from the project config -> token table
   * load the subscription status from stripe
 * subscribe({user})
   * check for payments:subscribe role
     * if not exists create stripe user -> save to payments:subscribe role
   * load the stripe_price_id from either the role or project config
   * load the token from the project config -> token table
   * complete stripe checkout process

triggers: