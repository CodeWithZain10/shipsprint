export const errorHandler = (err, req, res, next) => {
    const isOperational = err.isOperational === true;

    if (isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    if(err.name === "PayloadTooLargeError"){
        return res.status(413).json({
            success: false,
            message: "Payload Too Large"
        })
    }

    console.error('UNEXPECTED ERROR:', err);

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};