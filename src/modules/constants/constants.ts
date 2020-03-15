export const Attribute = {
    sendsResponse: 'sendsResponse_ActionAttribute',
    asyncAttr: 'async_ActionAttribute',
    controller: 'controller_ControllerAttribute',
    httpGet: 'httpGet_ActionAttribute',
    httpPost: 'httpPost_ActionAttribute',
    httpPatch: 'httpPatch_ActionAttribute',
    httpPut: 'httpPut_ActionAttribute',
    httpDelete: 'httpDelete_ActionAttribute',
    httpHead: 'httpHead_ActionAttribute',
    httpAll: 'httpAll_ActionAttribute',
    parse: 'parse_ParameterAttribute',
    returns: 'returns_ActionAttribute'
};

// Currently, we are supporting the basic HTTP verbs
// We can define advanced HTTP verbs later in the development
export const RouteAttribute = {
    // keys should be identical to values of Attribute.httpGet, Attribute.httpPost ...
    // values must match express http-verbs, ex: app.get(), app.post()
    httpGet_ActionAttribute: 'get',
    httpPost_ActionAttribute: 'post',
    httpDelete_ActionAttribute: 'delete',
    httpPut_ActionAttribute: 'put',
    httpPatch_ActionAttribute: 'patch',
    httpHead_ActionAttribute: 'head',
    httpAll_ActionAttribute: 'all'
};

export const Constants = {
    errControllerDefaultMethod: 'internalServerError'
};
