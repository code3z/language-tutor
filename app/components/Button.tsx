"use client";
import Link from "next/link";
import * as React from "react";

interface ButtonProps {
  text: string;
  Icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  to?: string
  small?: boolean
  disabled?: boolean;
  customClassName?: string;
  shadow?: boolean;
  type?: "submit" | "reset" | "button"
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Button({
  text,
  Icon,
  onClick,
  to,
  small,
  disabled,
  customClassName,
  shadow,
  type,
  onMouseEnter,
  onMouseLeave
}: ButtonProps) {
  const className = "inline-block group font-sans font-medium transition-all duration-250 px-7 py-3.5 max-w-full tracking-tight text-white whitespace-nowrap bg-primary rounded-md max-md:px-5 disabled:!bg-gray-400 disabled:!shadow-none disabled:transition-none hover:bg-[#f7a884]" + " " + (small ? "hover:!shadow-none !shadow-[0px_0px_10px_rgba(246,140,90,1)] !py-2.5 !px-7" : "") + " " + (shadow !== false ? "hover:shadow-[0px_0px_20px_rgba(246,140,90,1)] " : "!shadow-none ") + (disabled ? "pointer-events-none bg-gray-400 !shadow-none !transition-none " : "") + customClassName;

  return (
    to ? 
    <div 
      className={small ? "my-2.5" : "my-3.5"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ><Link
      href={disabled ? "#" : to}
      className={className}
      onClick={e => disabled && e.preventDefault()}
      ><span className="mr-2">{text}</span>
      {Icon && (
        <Icon className={"icon stroke-2" + (disabled ? "" : " group-hover:translate-x-1 transition-all duration-250")} />
      )}</Link></div>
      :
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="mr-2">{text}</span>
      {Icon && (
        <Icon className={"icon stroke-2" + (disabled ? "" : " group-hover:translate-x-1 transition-all duration-250")} />
      )}
    </button>
  );
};
