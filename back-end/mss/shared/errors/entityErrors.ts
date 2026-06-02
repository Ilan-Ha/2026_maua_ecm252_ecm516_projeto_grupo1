class EntityInvalidParameterError extends Error {
    constructor(
        message: string,
        public readonly campo: string
    ) {
        super(message);
        this.name = "EntityInvalidParameterError";
    }
}

export { EntityInvalidParameterError };
