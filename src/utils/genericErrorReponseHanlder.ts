import version from "./version";

function getConfigFormatted(err: any) {
    if(!err.config) return undefined;

    return err.config;
}

function errorHandler(err: any, req: any, res: any, next: any) {
    if (res.headersSent) {
        return next(err)
    }

    const errorFormatted = { 
        statsApiVersion: version.getBuildVersion(),
        stackTrace: (err).stack,
        //config: getConfigFormatted(err)
    }

    res.status(500).send(errorFormatted);
}

export default {
    errorHandler
}