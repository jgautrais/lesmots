import { forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  label: string;
  errorMessage?: string;
};

// eslint-disable-next-line react/display-name
const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, className, label, errorMessage, wrapperClassName, ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        <label
          htmlFor={id}
          className="mb-2 text-sm text-gray-900 dark:text-gray-50"
        >
          {label}
          <input
            ref={ref}
            id={id}
            {...props}
            className={`
							!outline-none
							bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-gray-50 text-sm rounded focus:ring-teal-200
							focus:border-teal-400 w-full p-2.5 ${className}
						`}
          />
        </label>
        <p className="h-6 text-red-600 dark:text-red-400 text-xs mt-1">
          {errorMessage}
        </p>
      </div>
    );
  }
);

Input.defaultProps = {
  wrapperClassName: '',
  errorMessage: undefined,
};

export default Input;
