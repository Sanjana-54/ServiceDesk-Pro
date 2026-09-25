function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`app-button app-button-${variant}`}
    >
      {children}
    </button>
  );
}

export default Button;