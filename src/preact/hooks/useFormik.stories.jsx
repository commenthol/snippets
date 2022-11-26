import { useFormik } from './useFormik'

const style = `
button,
label {
  display: block;
}
.invalid,
.error {
  font-size: small;
  color: red;
  display: block;
}
`

export const storyUseFormik = {
  title: 'useFormik',
  component: () => {
    const formik = useFormik({
      initialValues: {
        terms: false,
        name: '',
        email: ''
      },
      validate: (data) => {
        const errors = {}
        if (!data.name) {
          errors.name = 'Name is required.'
        }
        if (!data.email) {
          errors.email = 'Email is required.'
        } else if (!/^[^@]+@[^@]+\.[a-z0-9]{2,}$/.test(data.email)) {
          errors.email = 'Not a valid Email.'
        }
        if (!data.terms) {
          errors.terms = 'Agree to terms first.'
        }
        return errors
      },
      onSubmit: (data) => {
        console.log(data)
        formik.resetForm()
      }
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <style>{style}</style>

        <label htmlFor='name'>Name</label>
        <input id='name' value={formik.values.name}
          onInput={formik.handleChange}
          className={formik.getFormFieldClassName('name')} />
        {formik.getFormFieldErrorMessage('name')}

        <label htmlFor='email'>Email</label>
        <input id='email' value={formik.values.email}
          onInput={formik.handleChange}
          className={formik.getFormFieldClassName('email')} />
        {formik.getFormFieldErrorMessage('email')}

        <label htmlFor='terms'>
          <input id='terms' type='checkbox'
            checked={formik.values.terms}
            onChange={formik.handleChange} />
          Agree to terms
        </label>
        {formik.getFormFieldErrorMessage('terms')}

        <button type='submit'>Submit</button>
      </form>
    )
  }
}
