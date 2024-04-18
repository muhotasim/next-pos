import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
export const Home = ()=> {
    const [data, setData] = useState('')
    useEffect(() => {
    }, []);
    return (
      <div>
        <h1>Next POS</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
        <pre>{data}</pre>
      </div>
    );
  }
  