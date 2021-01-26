module.exports = (controlFunction) => {
    return (req, res, next) => {
        controlFunction(req, res, next).catch(err => next(err));
    }
}