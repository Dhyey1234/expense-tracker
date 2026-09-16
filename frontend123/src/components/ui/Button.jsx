function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <As className={classes} {...props}>
      {children}
    </As>
  );
}

export default Button;
