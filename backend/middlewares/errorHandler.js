module.exports = (error, request, response, next) => {

    const statusCode = response.statusCode || 500;
    const stack = process.env.NODE_ENV === 'production' ? null : error.stack

    response.json({
            code: statusCode,
        message: stack
    })
};
