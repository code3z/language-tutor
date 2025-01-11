import Link from "next/link";
import * as React from "react";

interface ButtonProps {
  text: string;
  Icon?: React.ForwardRefExoticComponent<any>;
  onClick?: () => void;
  to?: string
  small?: boolean
  disabled?: boolean;
  customClassName?: string;
  shadow?: boolean;
  type?: "submit" | "reset" | "button"
}

export default ({
  text,
  Icon,
  onClick,
  to,
  small,
  disabled,
  customClassName,
  shadow,
  type
}: ButtonProps) => {
  const className = "inline-block group font-sans font-medium hover:!shadow-none hover:bg-[#f7a884] transition-all duration-250 px-7 py-3.5 max-w-full tracking-tight text-white whitespace-nowrap bg-primary rounded-md max-md:px-5 disabled:bg-gray-400 disabled:!shadow-none disabled:transition-none" + " " + (small ? "!shadow-[0px_0px_10px_rgba(246,140,90,1)] !py-2.5 !px-7" : "") + " " + (shadow !== false ? "shadow-[0px_0px_20px_rgba(246,140,90,1)] " : " ") + customClassName;


  return (
    to ? 
    <div className={small ? "py-2.5" : "py-3.5"}><Link
      href={to}
      className={className}
      ><span className="mr-2">{text}</span>
      {Icon && (
        <Icon className="icon stroke-2 group-hover:translate-x-1 transition-all duration-250" />
      )}</Link></div>
      :
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      <span className="mr-2">{text}</span>
      {Icon && (
        <Icon className={"icon stroke-2" + (disabled ? "" : " group-hover:translate-x-1 transition-all duration-250")} />
      )}
    </button>
  );
};
