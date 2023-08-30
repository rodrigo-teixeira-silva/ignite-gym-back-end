export class AppError {
    message: string | undefined;


    constructor(message: string) {
        this.message = message;
    }
}
