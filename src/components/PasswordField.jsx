import { useState } from "react";
import "./PasswordField.css";

export default function PasswordField({ className = "", ...inputProps }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className={`input-box password-field ${className}`.trim()}>
      <input {...inputProps} type={visivel ? "text" : "password"} />
      <i className="bx bxs-lock-alt password-lock" aria-hidden="true"></i>
      <button
        className="password-toggle"
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
      >
        <i className={`bx ${visivel ? "bxs-hide" : "bxs-show"}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}
