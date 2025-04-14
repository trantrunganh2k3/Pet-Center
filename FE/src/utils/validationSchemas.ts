import * as yup from 'yup';

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const usernameRegExp = /^[a-zA-Z0-9_]{6,20}$/;

export const customerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username là bắt buộc')
    .min(6, 'Username phải có ít nhất 6 ký tự')
    .matches(usernameRegExp, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
  
  password: yup
    .string()
    .when(['$isEditing'], ([isEditing], schema) => {
      return isEditing ? schema : schema
        .required('Mật khẩu là bắt buộc')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
        );
    }),

  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),

  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ'),

  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),

  address: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),

  dob: yup
    .date()
    .required('Ngày sinh là bắt buộc')
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Khách hàng phải trên 18 tuổi')
    .min(new Date(1900, 0, 1), 'Ngày sinh không hợp lệ'),

  role: yup
    .string()
    .required('Role là bắt buộc')
    .oneOf(['CUSTOMER'], 'Role không hợp lệ'),
});

// Helpers for form validation
export const validateEmail = async (email: string): Promise<boolean> => {
  try {
    await yup.string().email('Email không hợp lệ').validate(email);
    return true;
  } catch (error) {
    return false;
  }
};

export const validatePhone = async (phone: string): Promise<boolean> => {
  try {
    await yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').validate(phone);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateAge = (dob: Date): boolean => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};
