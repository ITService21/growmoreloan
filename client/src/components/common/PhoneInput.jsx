export default function PhoneInput({ name = 'phone', value, onChange, className = '', required = false, placeholder = 'Phone Number', ...props }) {
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (onChange) {
      onChange({ target: { name, value: digits } });
    }
  };

  return (
    <input
      type="tel"
      inputMode="numeric"
      name={name}
      value={value || ''}
      onChange={handleChange}
      maxLength={10}
      pattern="[0-9]*"
      className={`form-input ${className}`}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  );
}
