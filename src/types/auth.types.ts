export type OtpPurpose = 'VERIFY_EMAIL' | 'FORGOT_PASSWORD';

export interface RequestOtpPayload {
    email: string; // or phoneNumber depending on requirements
    purpose: OtpPurpose;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
    purpose: OtpPurpose;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    username: string;
    password: string;
    contactNumber: string;
    // Add other registration fields as needed
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    fullName?: string; // Keeping as optional in case it's used elsewhere
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}
