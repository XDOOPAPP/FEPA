import { useState, useCallback } from 'react'

interface UseFormState {
  [key: string]: any
}

export const useForm = <T extends UseFormState>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<T>>({})
  const [touched, setTouched] = useState<Partial<T>>({})

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setValues((prev) => ({ ...prev, [name]: newValue }))
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent<any>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(values)
    }
  }, [values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValues,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  }
}
