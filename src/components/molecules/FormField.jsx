import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  id, 
  error, 
  required, 
  type = "text",
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input id={id} type={type} error={error} {...props} />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;