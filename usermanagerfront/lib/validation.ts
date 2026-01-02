export type UserFormValues = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  isActive?: boolean;
};

export type UserFormErrors = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: string;
};

export type ValidationContext = "register" | "edit" | "login" | "create";

export function validateUserForm(
  values: UserFormValues,
  context: ValidationContext = "register"
): UserFormErrors {
  const errors: UserFormErrors = {};

  if ((context === "register" || context === "login" || context === "edit" || context === "create") && !values.username?.trim()) {
    errors.username = "Username is required";
  }

  if ((context === "register" || context === "edit" || context === "create") && !values.email?.trim()) {
    errors.email = "Email is required";
  } else if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if ((context === "register" || context === "edit" || context === "create") && !values.firstName?.trim()) {
    errors.firstName = "First Name is required";
  }

  if ((context === "register" || context === "edit" || context === "create") && !values.lastName?.trim()) {
    errors.lastName = "Last Name is required";
  }

  if ((context === "edit" || context === "create") && (!values.role || values.role.trim() === ""  )) {
    errors.role = "Role is required";
  }

  if ((context === "edit" || context === "create") && (values.isActive === null || values.isActive === undefined)) {
    errors.isActive = "Status is required";
  }

  if ((context === "register" || context === "login" || context === "create") && !values.password) {
    errors.password = "Password is required";
  } else if (values.password && values.password.length < 6 && (context === "register" || context === "create")) {
    errors.password = "Password must be at least 6 characters";
  }

  if (context === "register" || context === "create") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if( context === "edit") {
    if (values.password && !values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      errors.password = "Passwords do not match";
    } else if (!values.password && values.confirmPassword) {
      errors.password = "Password is required";
    } else if (values.password && values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  }

  return errors;
}