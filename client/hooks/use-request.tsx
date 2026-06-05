import axios from 'axios';
import { useState, ReactNode } from 'react';

interface UseRequestProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  body?: any;
  onSuccess?: (data: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState<ReactNode>(null);

  const doRequest = async (extraBody?: any) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...extraBody });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      setErrors(
        <div className="alert alert-error">
          <ul>
            {err.response?.data?.errors?.map((e: any) => (
              <li key={e.message}>{e.message}</li>
            )) || <li>Something went wrong</li>}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
