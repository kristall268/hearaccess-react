import { useState } from 'react';

export default function useForm(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setError('');
  };

  return {
    values, setValues,
    errors, setErrors,
    submitting, setSubmitting,
    success, setSuccess,
    error, setError,
    handleChange,
    reset,
  };
}
