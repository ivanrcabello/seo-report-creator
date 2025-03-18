
export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
