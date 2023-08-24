export class AppError {
    message: string | undefined;


    construtor(message: string) {
        this.message = message;
    }
}