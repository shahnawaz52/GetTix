import { useState, FormEvent } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="signin-email"
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
              id="signin-password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors}
          <button id="signin-submit" className="btn btn-primary btn-full btn-lg">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
