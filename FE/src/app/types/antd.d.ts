import type { FC, ReactNode } from 'react';
import type { TableProps as AntTableProps } from 'antd/es/table';
import type { ButtonProps as AntButtonProps } from 'antd/es/button';
import type { InputProps as AntInputProps } from 'antd/es/input';
import type { SelectProps as AntSelectProps } from 'antd/es/select';
import type { DatePickerProps as AntDatePickerProps } from 'antd/es/date-picker';
import type { TagProps as AntTagProps } from 'antd/es/tag';
import type { CardProps as AntCardProps } from 'antd/es/card';

declare module 'antd' {
  export interface ButtonProps extends AntButtonProps {
    children?: ReactNode;
  }
  
  export interface TagProps extends AntTagProps {
    children?: ReactNode;
  }
  
  export interface InputProps extends AntInputProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
  }
  
  export interface SelectProps<T = any> extends AntSelectProps<T> {
    mode?: 'multiple' | 'tags';
    options?: { value: any; label: ReactNode }[];
  }
  
  export interface DatePickerProps extends AntDatePickerProps {
    placeholder?: string;
  }
  
  export interface TableProps<T> extends AntTableProps<T> {
    columns?: any[];
    scroll?: { x?: number | string; y?: number | string };
  }

  export interface CardProps extends AntCardProps {
    children?: ReactNode;
    className?: string;
    title?: ReactNode;
  }

  export const Button: FC<ButtonProps>;
  export const Tag: FC<TagProps>;
  export const Input: FC<InputProps>;
  export const Select: FC<SelectProps>;
  export const DatePicker: FC<DatePickerProps>;
  export const Table: FC<TableProps<any>>;
  export const Card: FC<CardProps>;
  
  export interface ModalProps {
    open?: boolean;
    title?: ReactNode;
    footer?: ReactNode | null;
    onCancel?: () => void;
    children?: ReactNode;
    destroyOnClose?: boolean;
    width?: number | string;
  }

  export interface ModalStaticFunctions {
    confirm: (config: {
      title: ReactNode;
      content?: ReactNode;
      onOk?: () => void;
      onCancel?: () => void;
      footer?: null | ReactNode;
      width?: number;
    }) => void;
    destroyAll: () => void;
  }

  export const Modal: FC<ModalProps> & ModalStaticFunctions;
}
