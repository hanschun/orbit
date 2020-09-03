import React from "react";
import Router from 'next/router'

const LogoutBtn = ({ logoutHandler }) => (
  <button
    id="orbitLogoutBtn"
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded logoutBtn"
    onClick={() => Router.push('/api/logout')}
  >
    Log Out
  </button>
);

export default LogoutBtn;