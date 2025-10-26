export class ApiResponse<T> {
    public success: boolean;
    public message: string;
    public data?: T;

    constructor(success: boolean, message: string, data?: T) {
        this.success = success;
        this.message = message;
        if (data) this.data = data;
    }

    static success<T>(message: string, data?: T) {
        return new ApiResponse<T>(true, message, data);
    }

    static fail(message: string) {
        return new ApiResponse<null>(false, message);
    }
}
