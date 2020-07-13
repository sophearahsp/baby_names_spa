exports.initGet = {
    method: 'GET',
    accept: 'application/json',
    cache: 'default',
    headers: {}
};

exports.initPost = (data) => ({
    method: 'POST',
    accept: 'application/json',
    cache: 'no-cache',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});

exports.initPatch = (data) => ({
    method: 'PATCH',
    accept: 'application/json',
    cache: 'no-cache',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});