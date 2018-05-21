export const Attribute = {
    sendsResponse: 'sendsResponseAttribute',
    asyncAttr: 'asyncAttribute',
    controller: 'controllerAttribute',
    observable: 'observableAttribute',
    bindModel: 'bindModelAttribute',
    errorControllerDefaultMethod: 'write',
    httpGet: 'httpGetAttribute',
    httpPost: 'httpPostAttribute',
    httpPatch: 'httpPatchAttribute',
    httpPut: 'httpPutAttribute',
    httpDelete: 'httpDeleteAttribute',
    httpHead: 'httpHeadAttribute',
    httpAll: 'httpAllAttribute'
};

// Currently, we are supporting the basic HTTP verbs
// We can define advanced HTTP verbs later in the development
export const RouteAttribute = {
    // keys should be identical to values of Attribute.httpGet, Attribute.httpPost ...
    httpGetAttribute: 'get',
    httpPostAttribute: 'post',
    httpDeleteAttribute: 'delete',
    httpPutAttribute: 'put',
    httpPatchAttribute: 'patch',
    httpHeadAttribute: 'head',
    httpAllAttribute: 'all'
};