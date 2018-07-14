let searchEngineConfig = {
    engineId: '014952414117785725819:9jk1vqwukju',
    apiKey: 'AIzaSyBnFnB8-coB1aKyJg_xEEHSR1A-ZD8fMlQ',
    url: 'https://www.googleapis.com/customsearch/v1/siterestrict'
};

let apiMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

let statusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
}

module.exports = {
    searchEngineConfig,
    apiMethod,
    statusCode
};