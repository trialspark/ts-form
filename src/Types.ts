import React from 'react';
import { DeepRequired } from 'utility-types';

export interface TSFormConfig<FormData extends object> {
  initialValues: DeepRequired<FormData>;
}

export interface BaseHostFieldProvides {
  input: {
    props: {
      name: string;
      onChange: NonNullable<React.InputHTMLAttributes<HTMLInputElement>['onChange']>;
    };
  };
}
