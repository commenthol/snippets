import { h } from 'preact'
import { useState } from 'preact/hooks'
import { stopPropagation } from '../utils/stopPropagation'

const classNames = (...args) => args.filter(Boolean).join(' ')

/**
 * form validation made simple
 * @param {{
 *  initialValues: object
 *  validate: (data: object) => object
 *  onSubmit: (data: object) => void
 *  classNameInvalid?: string|'p-invalid'
 *  classNameError?: string|'p-error'
 * }} props
 * @returns {{
 *  values: object
 *  errors: {[key: string]: string}
 *  handleChange: (ev: Event) => void
 *  handleSubmit: (ev: Event) => void
 *  resetForm: () => void
 *  getFormFieldClassName: (name: string, className?: string) => string
 *  getFormFieldErrorMessage: (name: string, className?: string) => Node
 * }}
 */
export function useFormik (props) {
  const {
    initialValues,
    validate,
    onSubmit,
    classNameInvalid = 'invalid',
    classNameError = 'error'
  } = props

  const [values, setValues] = useState({ ...initialValues })
  const [errors, setErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)

  const handleChange = (ev) => {
    const { id, name, value, checked, type } = ev.target
    values[id || name] = type === 'checkbox' ? checked : value
    setValues({ ...values })
    if (isSubmit) {
      const _errors = validate(values)
      setErrors(_errors)
    }
  }

  const handleSubmit = (ev) => {
    stopPropagation(ev, true)
    const _errors = validate(values)
    setErrors(_errors)
    setIsSubmit(true)
    if (!Object.keys(_errors).length) {
      onSubmit && onSubmit(values)
    }
  }

  const resetForm = (ev) => {
    stopPropagation(ev, true)
    setIsSubmit(false)
    setErrors({})
    setValues({ ...initialValues })
  }

  const getFormFieldClassName = (name, className = '') => errors[name]
    ? classNames(classNameInvalid, className)
    : className

  const getFormFieldErrorMessage = (name, className) => errors[name]
    ? h('span', { className: classNames(classNameError, className) }, errors[name])
    : null

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    getFormFieldClassName,
    getFormFieldErrorMessage
  }
}
