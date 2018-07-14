const request = require('request-promise');
const constants = require('../config/constants');
const config = constants.searchEngineConfig;
const statusCode = constants.statusCode;

const searchUrl = `${config.url}/?key=${config.apiKey}&cx=${config.engineId}`;

// public functions 
const search = (req, res, query) => {
    queryUrl = `${searchUrl}&q=${query}`;
    let options = {
        method: 'GET',
        uri: queryUrl,
        json: true 
    };

    request(options)
    .then(queryResult => {
        //let listOfParsedSearchResult = parseItems(queryResult); 
        //console.log(listOfParsedSearchResult)
        console.log(queryResult.items);
        //res.status(statusCode.OK).send(queryResult);
    })
    .catch(error => {
        console.error(error);
        //res.status(statusCode.NOT_FOUND).send('error occured');
    });
}

////////////////////// ////////////////////// ////////////////////// ////////////////////// ////////////////////// 
// private functions

const parseItems = (query) => {
    let parsedItems = [];
    let queryResult = search(query);
    let count = 0;
    for (let i = 0; i < 6; i++) {
        let item = queryResult.items[i]
        parsedItems.append(parseOnlyRequiredFieldInItem(item));
    }

    return parsedItems;
}

const parseOnlyRequiredFieldInItem = (item) => {
    /* 
        RequiredField: {
            title,
            link,
            snippet,
            thumbnailSrc: pagemap.cse_thumbnail[0].src
        }
    */
    parsedItem = {
        title: item.title,
        link: item.link,
        snippet: item.snippet,
    };

    if (item.pagemap.cse_thumbnail[0].src) {
        parsedItem.thumbnailSrc = item.pagemap.cse_thumbnail[0].src;
    }

    console.log("parsed Items: ", parsedItem)
    return parsedResult;
}

search('vaccines');

module.exports = {
    search
}