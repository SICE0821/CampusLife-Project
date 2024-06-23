import React from 'react';

function Header() {
  return <header>
    <h1><a href='/'>WEB</a></h1>
  </header>
}


function App() {

  return (
    <div>
      <Header></Header>
      <h1>Main Page</h1>
      <p>This is the test page.</p>
    </div>
  );
}

export default App;