"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={(className
      )}
    >
      {children}
    </button>
  );
};
