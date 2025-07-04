import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { login, signup } from '../store/user.actions'

import leftHero from '../assets/img/left-loginsignup-hero.svg'
import rightHero from '../assets/img/right-loginsignup-hero.svg'
import logo from '../assets/img/teamspace-logo.png'

export function LoginSignup() {
	const params = useParams()
	const navigate = useNavigate()
	const [status, setStatus] = useState(params.status)
	const [wrongCredentialsDiv, setWrongCredentialsDiv] = useState()

	useEffect(() => {
		setStatus(params.status)
		setWrongCredentialsDiv('not-visible')
	}, [params.status])

	const formik = useFormik({
		initialValues: {
			fullname: '',
			username: '',
			password: '',
		},
		validationSchema: Yup.object({
			fullname: Yup.string().max(15, 'Must be 15 characters or less'),
			username: Yup.string().max(20, 'Must be 20 characters or less'),
			password: Yup.string()
				.required('No password provided.')
				.min(5, 'Password is too short - should be 5 chars minimum.')
				.matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
		}),
		onSubmit: (values) => {
			if (status === 'signup') {
				;(async () => {
					try {
						await signup(values)
						navigate('/workspace')
					} catch (err) {
						console.log(err, 'cannot signup')
					}
				})()
			}
			if (status === 'login') {
				;(async () => {
					try {
						await login(values)
						navigate('/workspace')
					} catch (err) {
						console.log(err, 'cannot login')
						setWrongCredentialsDiv('')
					}
				})()
			}
		},
	})

	const handleFocus = (ev) => {
		ev.target.classList.add('focus')
	}

	const formTxt =
		status === 'login' ? 'Log in to TeamSpace' : 'Sign up for your account'

	return (
		<section className="form-container">
			<div className="form-logo">
				<img height="43px" src={logo} alt="" />
				<p className="logo-txt">TeamSpace</p>
			</div>
			<form className="signup-form" onSubmit={formik.handleSubmit}>
				<h1>{formTxt}</h1>
				<div className={`wrong-credentials ${wrongCredentialsDiv}`}>
					Incorrect Username and / or password.
				</div>
				{status === 'signup' && (
					<>
						<input
							id="fullname"
							name="fullname"
							type="text"
							onChange={formik.handleChange}
							onFocus={handleFocus}
							onBlur={formik.handleBlur}
							value={formik.values.fullname}
							placeholder="Enter full name"
						/>
						{formik.touched.fullname && formik.errors.fullname ? (
							<span className="error">{formik.errors.fullname}</span>
						) : (
							<span className="empty-space">&nbsp;</span>
						)}
					</>
				)}
				<input
					id="username"
					name="username"
					type="text"
					onChange={formik.handleChange}
					onFocus={handleFocus}
					onBlur={formik.handleBlur}
					value={formik.values.username}
					placeholder="Enter username"
				/>
				{formik.touched.username && formik.errors.username ? (
					<span className="error">{formik.errors.username}</span>
				) : (
					<span className="empty-space">&nbsp;</span>
				)}
				<input
					id="password"
					name="password"
					type="password"
					onChange={formik.handleChange}
					onFocus={handleFocus}
					onBlur={formik.handleBlur}
					value={formik.values.password}
					placeholder="Enter password"
				/>
				{formik.touched.password && formik.errors.password ? (
					<span className="error">{formik.errors.password}</span>
				) : (
					<span className="empty-space">&nbsp;</span>
				)}
				<button type="submit">{formTxt}</button>

				<hr className="bottom-form-separator" />
				{status === 'login' && (
					<NavLink className="already-have-account" to={'/signup'}>
						Sign up for an account
					</NavLink>
				)}
				{status === 'signup' && (
					<NavLink className="already-have-account" to={'/login'}>
						Already have an account? Log In
					</NavLink>
				)}
			</form>
			<img src={leftHero} alt="leftHero" className="left-hero" />
			<img src={rightHero} alt="rightHero" className="right-hero" />
		</section>
	)
}
