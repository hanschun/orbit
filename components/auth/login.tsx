import Router from 'next/router'

const Login = () => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-heading">
          Welcome to Orbit
        </div>
        <div className="overlay-message">Please login to continue</div>
        <div className="overlay-action">
          <button
            id="orbitLoginBtn"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded loginBtn"
            onClick={() => {
              Router.push('/api/login');
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;