import { CircleCheckBig, CircleAlert, X } from "lucide-react";

const Alert = ({ type, message, onClose }) => {
  const alertClasses = {
    error: 'alert-error',
    success: 'alert-success',
    warning: 'alert-warning',
    info: 'alert-info',
    default: 'alert'
  };

  const icon = {
    error: <CircleAlert size={20} />,
    success: <CircleCheckBig size={20} />,
    warning: <CircleAlert size={20} />,
    info: <CircleAlert size={20} />,
    default: <CircleAlert size={20} />
  };

  return (
    <div role="alert" className={`alert ${alertClasses[type]} shadow-lg my-2`}>
      {icon[type]}
      <span>{message}</span>
      {onClose && (
        <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;