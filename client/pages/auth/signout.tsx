import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const SignOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p className="spinner-text">Signing you out...</p>
    </div>
  );
};

export default SignOut;
