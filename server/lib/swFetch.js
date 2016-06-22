const fetch = require('node-fetch');

module.exports = {
    byUrl: (url) => {
        console.log(url);
        return fetch(url).then(res => res.json());
    },
    byPage: (url, page) =>
        fetch(`${url}/?page=${((page > 0) ? page : 1)}`)
            .then(res => res.json())
            .then(json => json.results)
};