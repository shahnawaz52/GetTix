import { useState, FormEvent } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Start buying and selling tickets today</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="signup-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="signup-password"
              className="form-input"
              type="password"
              placeholder="At least 4 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors}
          <button id="signup-submit" className="btn btn-primary btn-full btn-lg">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link href="/auth/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
