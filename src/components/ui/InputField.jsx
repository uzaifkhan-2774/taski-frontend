// Reusable input component — icon aur placeholder kabhi overlap nahi hoga
export default function InputField({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,        // left icon (lucide component)
  rightEl,     // right element (e.g. eye toggle button)
  required,
  min,
  max,
  className = '',
}) {
  return (
    <div className="input-wrap">
      {icon && (
        <span className="input-icon">{icon}</span>
      )}
      <input
        type={type}
        className={`input-dark ${icon ? 'pl-icon' : ''} ${rightEl ? 'pr-icon' : ''} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
      {rightEl && (
        <span className="input-icon-right">{rightEl}</span>
      )}
    </div>
  )
}
