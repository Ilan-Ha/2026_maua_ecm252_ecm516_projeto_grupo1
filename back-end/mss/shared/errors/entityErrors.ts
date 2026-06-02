class EntityInvalidParameterError extends Error {
// TODO: fazer um enum para os codigos de erro na entidade
    constructor(
        message: string,
        public readonly campo: string,
        public readonly codigo: string
    ) {
        super(message);
        this.name = "EntityInvalidParameterError"
    }

}

export { EntityInvalidParameterError }