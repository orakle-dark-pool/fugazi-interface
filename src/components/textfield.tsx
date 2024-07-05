import { forwardRef, useState } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftadornment?: React.ReactNode;
  rightadornment?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const { type, leftadornment, rightadornment } = props;

    const [internalType, setInternalType] = useState<string>(type || "text");

    return (
      <div
        className={`flex items-center rounded-4 border-1 border-gray-300 p-4 ${props.className}`}
      >
        {leftadornment && (
          <div className="h-20 w-20">{props.leftadornment}</div>
        )}
        <input
          ref={ref}
          {...props}
          className="m-2 w-full border-0 outline-offset-2 outline-transparent"
          type={internalType}
        />

        {rightadornment && (
          <div className="flex-center flex h-20 w-20">
            {props.rightadornment}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
