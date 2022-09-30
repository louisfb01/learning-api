import version from "./version";

function errorHandler(err: any, req: any, res: any, next: any) {
    if (res.headersSent) {
        return next(err)
    }
    console.error(err);
    res.status(500).send({ 
        learningApiVersion: version.getBuildVersion(),
        stackTrace: (err).stack 
    });
}

export default {
    errorHandler
}