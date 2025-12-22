export interface RequestOtpPayload {
    email: string; // or phoneNumber depending on requirements
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    // Add other registration fields as needed
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}
