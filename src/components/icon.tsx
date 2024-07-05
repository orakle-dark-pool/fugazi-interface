import { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color?: string;
}

export const IconDown = ({ color, ...rest }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8205 17.4597C11.4405 18.1801 12.5595 18.1801 13.1795 17.4597L19.123 10.5541C19.9868 9.55045 19.2707 8 17.9435 8H6.05653C4.72927 8 4.01323 9.55045 4.877 10.5541L10.8205 17.4597Z"
      fill={color ?? "#1D1D1B"}
    />
  </svg>
);
